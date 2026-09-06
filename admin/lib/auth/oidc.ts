import "server-only";
import { SignJWT, jwtVerify } from "jose";
import * as oidc from "openid-client";
import { getOidcConfig } from "./config";

const FLOW_ISSUER = "nest-lms-admin";
const FLOW_AUDIENCE = "nest-lms-admin-oidc-flow";
const FLOW_DURATION_SECONDS = 10 * 60;

export const OIDC_FLOW_COOKIE = "nest-admin-oidc-flow";

export type OidcFlow = {
  codeVerifier: string;
  state: string;
  nonce: string;
};

function getSecret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must contain at least 32 characters.");
  return new TextEncoder().encode(value);
}

export async function getOidcClient() {
  const settings = getOidcConfig();
  const clientAuthentication = settings.clientAuthMethod === "client_secret_post"
    ? oidc.ClientSecretPost(settings.clientSecret)
    : oidc.ClientSecretBasic(settings.clientSecret);
  return oidc.discovery(
    settings.issuer,
    settings.clientId,
    undefined,
    clientAuthentication,
  );
}

export async function createOidcAuthorization() {
  const settings = getOidcConfig();
  const client = await getOidcClient();
  const flow: OidcFlow = {
    codeVerifier: oidc.randomPKCECodeVerifier(),
    state: oidc.randomState(),
    nonce: oidc.randomNonce(),
  };
  const codeChallenge = await oidc.calculatePKCECodeChallenge(flow.codeVerifier);
  const url = oidc.buildAuthorizationUrl(client, {
    redirect_uri: settings.redirectUri,
    scope: settings.scopes,
    response_type: "code",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state: flow.state,
    nonce: flow.nonce,
  });
  return { flow, url };
}

export async function sealOidcFlow(flow: OidcFlow) {
  return new SignJWT(flow)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(FLOW_ISSUER)
    .setAudience(FLOW_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${FLOW_DURATION_SECONDS}s`)
    .sign(getSecret());
}

export async function openOidcFlow(token: string): Promise<OidcFlow> {
  const { payload } = await jwtVerify(token, getSecret(), {
    algorithms: ["HS256"],
    issuer: FLOW_ISSUER,
    audience: FLOW_AUDIENCE,
  });
  if (typeof payload.codeVerifier !== "string" || typeof payload.state !== "string" || typeof payload.nonce !== "string") {
    throw new Error("The OIDC login transaction is invalid.");
  }
  return { codeVerifier: payload.codeVerifier, state: payload.state, nonce: payload.nonce };
}

export const oidcFlowCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: FLOW_DURATION_SECONDS,
  path: "/auth",
};

export async function completeOidcAuthorization(currentUrl: URL, flow: OidcFlow) {
  const settings = getOidcConfig();
  const expectedCallback = new URL(settings.redirectUri);
  if (currentUrl.origin !== expectedCallback.origin || currentUrl.pathname !== expectedCallback.pathname) {
    throw new Error("The OIDC callback URL is invalid.");
  }
  const client = await getOidcClient();
  const tokens = await oidc.authorizationCodeGrant(client, currentUrl, {
    pkceCodeVerifier: flow.codeVerifier,
    expectedState: flow.state,
    expectedNonce: flow.nonce,
    idTokenExpected: true,
  });
  const claims = tokens.claims();
  if (!claims || typeof claims.sub !== "string") throw new Error("The identity provider did not return a stable subject.");
  return claims.sub;
}
