import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthMode, getOidcConfig } from "@admin/lib/auth/config";
import { getAdminDatabase } from "@admin/db/client";
import { getDatabaseConfig } from "@admin/db/connection";
import { assertProductionConfiguration } from "@admin/lib/production-config";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") assertProductionConfiguration(process.env);
    getDatabaseConfig();
    const authMode = getAuthMode();
    if (authMode === "unconfigured") throw new Error("Authentication is not configured.");
    if (authMode === "oidc") getOidcConfig();
    await (await getAdminDatabase()).execute(sql`select subject, role, active from admin_allowlist limit 1`);
    await (await getAdminDatabase()).execute(sql`select published_payload from managed_content limit 1`);
    await (await getAdminDatabase()).execute(sql`select id from research_resources limit 1`);
    await (await getAdminDatabase()).execute(sql`select id from audit_events limit 1`);
    return NextResponse.json({ status: "ready", service: "nest-lms-admin" });
  } catch {
    return NextResponse.json({ status: "not-ready", service: "nest-lms-admin" }, { status: 503 });
  }
}
