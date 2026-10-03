import { join } from "node:path";
import { loadEnvConfig } from "@next/env";
import { getDatabaseConfig, openDatabase } from "../db/connection";
import { AccountSchema } from "../lib/accounts/validation";
import { createAdminRepository } from "../lib/data/repositories";
import { assertProductionConfiguration } from "../lib/production-config";

Object.assign(process.env, { NODE_ENV: "production" });
loadEnvConfig(join(process.cwd(), "admin"));

async function main() {
  assertProductionConfiguration(process.env);
  const parsed = AccountSchema.safeParse({
    subject: process.env.NEST_BOOTSTRAP_SUBJECT,
    displayName: process.env.NEST_BOOTSTRAP_NAME,
    email: process.env.NEST_BOOTSTRAP_EMAIL,
    role: "super_admin", active: true,
  });
  if (!parsed.success) throw new Error("Provide valid NEST_BOOTSTRAP_SUBJECT, NEST_BOOTSTRAP_NAME, and NEST_BOOTSTRAP_EMAIL from the verified administrator identity.");
  const connection = await openDatabase(getDatabaseConfig());
  try {
    await createAdminRepository(connection.db).bootstrapProduction(parsed.data);
    console.log("The first production super administrator was created. Remove the bootstrap environment values now.");
  } finally {
    await connection.close();
  }
}

void main().catch(() => {
  console.error("Production bootstrap failed. Check configuration, identity fields, migrations, connectivity, and that the account directory is empty. No existing account is replaced.");
  process.exitCode = 1;
});
