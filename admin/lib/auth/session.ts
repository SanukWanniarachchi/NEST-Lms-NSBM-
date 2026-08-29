import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "nest-admin-session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;
const ISSUER = "nest-lms-admin";
const AUDIENCE = "nest-lms-admin-workspace";

export type AdminSession = {
  subject: string;
  role: "admin";
  name: string;
};

function getEncodedSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(session: AdminSession) {
  const token = await new SignJWT({ role: session.role, name: session.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.subject)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getEncodedSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getEncodedSecret(), {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });

    if (payload.role !== "admin" || typeof payload.sub !== "string" || typeof payload.name !== "string") {
      return null;
    }

    return { subject: payload.sub, role: "admin", name: payload.name };
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect("/");
  return session;
}

export async function deleteAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}
