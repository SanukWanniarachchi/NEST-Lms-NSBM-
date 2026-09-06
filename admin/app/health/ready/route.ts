import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthMode, getOidcConfig } from "@admin/lib/auth/config";
import { getAdminDatabase } from "@admin/db/client";
import { getDatabaseConfig } from "@admin/db/connection";

export async function GET() {
  try {
    getDatabaseConfig();
    const authMode = getAuthMode();
    if (authMode === "unconfigured") throw new Error("Authentication is not configured.");
    if (authMode === "oidc") getOidcConfig();
    await (await getAdminDatabase()).execute(sql`select 1`);
    return NextResponse.json({ status: "ready", service: "nest-lms-admin" });
  } catch {
    return NextResponse.json({ status: "not-ready", service: "nest-lms-admin" }, { status: 503 });
  }
}
