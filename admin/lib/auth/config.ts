import "server-only";

export type AuthMode = "local" | "oidc" | "unconfigured";

export type OidcConfig = {
  issuer: URL;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string;
  clientAuthMethod: "client_secret_basic" | "client_secret_post";
};

export function getAuthMode(): AuthMode {
  if (process.env.NEST_AUTH_MODE === "local" && process.env.NODE_ENV !== "production") return "local";
  if (process.env.NEST_AUTH_MODE === "oidc") return "oidc";
  return "unconfigured";
}

export function isLocalAuthEnabled() {
  return getAuthMode() === "local";
}

export function isOidcAuthEnabled() {
  return getAuthMode() === "oidc";
}

export function getOidcConfig(environment = process.env): OidcConfig {
  const issuerValue = environment.OIDC_ISSUER?.trim();
  const clientId = environment.OIDC_CLIENT_ID?.trim();
  const clientSecret = environment.OIDC_CLIENT_SECRET?.trim();
  const redirectUri = environment.OIDC_REDIRECT_URI?.trim();
  if (!issuerValue || !clientId || !clientSecret || !redirectUri) {
    throw new Error("OIDC_ISSUER, OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, and OIDC_REDIRECT_URI are required in OIDC mode.");
  }

  const issuer = new URL(issuerValue);
  const redirect = new URL(redirectUri);
  if (environment.NODE_ENV === "production" && (issuer.protocol !== "https:" || redirect.protocol !== "https:")) {
    throw new Error("Production OIDC issuer and redirect URLs must use HTTPS.");
  }

  const configuredScopes = environment.OIDC_SCOPES?.trim() || "openid profile email";
  const scopes = new Set(configuredScopes.split(/\s+/).filter(Boolean));
  scopes.add("openid");
  const configuredMethod = environment.OIDC_CLIENT_AUTH_METHOD?.trim() || "client_secret_basic";
  if (configuredMethod !== "client_secret_basic" && configuredMethod !== "client_secret_post") {
    throw new Error("OIDC_CLIENT_AUTH_METHOD must be client_secret_basic or client_secret_post.");
  }
  return {
    issuer,
    clientId,
    clientSecret,
    redirectUri: redirect.href,
    scopes: [...scopes].join(" "),
    clientAuthMethod: configuredMethod,
  };
}

export function getLocalAdminName() {
  return process.env.NEST_DEV_ADMIN_NAME?.trim() || "NEST Administrator";
}

export function getLocalAdminSubject() {
  return process.env.NEST_DEV_ADMIN_SUBJECT?.trim() || "local-admin";
}
