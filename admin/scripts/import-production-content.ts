import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { loadEnvConfig } from "@next/env";
import { validatePublishedContent } from "../../scripts/published-content-schema.mjs";
import { getDatabaseConfig, openDatabase } from "../db/connection";
import { initializePublishedContent } from "../lib/data/initialize-content";
import { assertProductionConfiguration } from "../lib/production-config";

Object.assign(process.env, { NODE_ENV: "production" });
loadEnvConfig(join(process.cwd(), "admin"));

async function main() {
  assertProductionConfiguration(process.env);
  if (!process.argv[2]) throw new Error("Provide the reviewed public snapshot path.");
  const snapshot = validatePublishedContent(JSON.parse(await readFile(resolve(process.argv[2]), "utf8")));
  const connection = await openDatabase(getDatabaseConfig());
  try {
    await initializePublishedContent(connection.db, snapshot);
    console.log("Initial reviewed courses and announcements imported with audit records.");
  } finally {
    await connection.close();
  }
}

void main().catch(() => {
  console.error("Initial content import failed. Check the reviewed snapshot, production settings, migrations, and that managed content is empty. No existing content is replaced.");
  process.exitCode = 1;
});
