import { NextRequest, NextResponse } from "next/server";
import { isOidcAuthEnabled } from "@admin/lib/auth/config";
import { createAdminSession } from "@admin/lib/auth/session";
import { completeOidcAuthorization, OIDC_FLOW_COOKIE, openOidcFlow } from "@admin/lib/auth/oidc";
import { getAuthorizedAdminIdentity } from "@admin/lib/data/admin-data";

function redirectWithClearedFlow(request: NextRequest, destination: string) {
  const response = NextResponse.redirect(new URL(destination, request.url));
  response.cookies.delete({ name: OIDC_FLOW_COOKIE, path: "/auth" });
  return response;
}

export async function GET(request: NextRequest) {
  if (!isOidcAuthEnabled()) return redirectWithClearedFlow(request, "/?error=unavailable");
  const transaction = request.cookies.get(OIDC_FLOW_COOKIE)?.value;
  if (!transaction) return redirectWithClearedFlow(request, "/?error=expired");

  try {
    const flow = await openOidcFlow(transaction);
    const subject = await completeOidcAuthorization(request.nextUrl, flow);
    const identity = await getAuthorizedAdminIdentity(subject);
    if (!identity || identity.role === "user") return redirectWithClearedFlow(request, "/?error=forbidden");
    await createAdminSession({ subject: identity.subject, role: identity.role, name: identity.displayName });
    return redirectWithClearedFlow(request, "/dashboard");
  } catch {
    return redirectWithClearedFlow(request, "/?error=signin");
  }
}
