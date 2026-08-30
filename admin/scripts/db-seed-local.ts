import { join } from "node:path";
import { loadEnvConfig } from "@next/env";
import { getDatabaseConfig, openDatabase } from "../db/connection";
import { createAdminRepository } from "../lib/data/repositories";

loadEnvConfig(join(process.cwd(), "admin"));

if (process.env.NODE_ENV === "production" || process.env.NEST_AUTH_MODE !== "local") {
  throw new Error("The local admin seed is available only when NEST_AUTH_MODE=local outside production.");
}

async function main() {
  const subject = process.env.NEST_DEV_ADMIN_SUBJECT?.trim() || "local-admin";
  const displayName = process.env.NEST_DEV_ADMIN_NAME?.trim() || "NEST Local Administrator";
  const email = process.env.NEST_DEV_ADMIN_EMAIL?.trim() || null;
  const connection = await openDatabase(getDatabaseConfig());

  try {
    await createAdminRepository(connection.db).upsert("system:local-bootstrap", {
      subject,
      displayName,
      email,
      active: true,
    });
    console.log(`Local admin allowlist entry is ready for ${subject}.`);
  } finally {
    await connection.close();
  }
}

void main();
