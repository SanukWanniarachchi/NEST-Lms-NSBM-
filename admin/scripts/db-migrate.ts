import { join } from "node:path";
import { loadEnvConfig } from "@next/env";
import { getDatabaseConfig, openDatabase } from "../db/connection";
import { applyPendingMigrations, pgliteMigrationAdapter, postgresMigrationAdapter } from "../db/migrator";

loadEnvConfig(join(process.cwd(), "admin"));

async function main() {
  const connection = await openDatabase(getDatabaseConfig());
  try {
    const adapter = connection.driver === "pglite"
      ? pgliteMigrationAdapter(connection.client)
      : postgresMigrationAdapter(connection.client);
    const applied = await applyPendingMigrations(adapter);
    console.log(applied.length ? `Applied migrations: ${applied.join(", ")}` : "Database is already current.");
  } finally {
    await connection.close();
  }
}

void main();
