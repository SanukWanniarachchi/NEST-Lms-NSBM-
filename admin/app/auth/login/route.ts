import { NextResponse } from "next/server";
import { isOidcAuthEnabled } from "@admin/lib/auth/config";
import { createOidcAuthorization, OIDC_FLOW_COOKIE, oidcFlowCookieOptions, sealOidcFlow } from "@admin/lib/auth/oidc";

export async function GET(request: Request) {
  if (!isOidcAuthEnabled()) return NextResponse.redirect(new URL("/?error=unavailable", request.url));

  try {
    const { flow, url } = await createOidcAuthorization();
    const response = NextResponse.redirect(url);
    response.cookies.set(OIDC_FLOW_COOKIE, await sealOidcFlow(flow), oidcFlowCookieOptions);
    return response;
  } catch {
    return NextResponse.redirect(new URL("/?error=configuration", request.url));
  }
}
