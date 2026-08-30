import { mkdir } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type AdminDatabase = PgliteDatabase<typeof schema>;
export type DatabaseDriver = "pglite" | "postgres";

export type DatabaseConfig = {
  driver: DatabaseDriver;
  url: string;
};

export function getDatabaseConfig(environment = process.env): DatabaseConfig {
  const configuredDriver = environment.NEST_DATABASE_DRIVER;
  if (configuredDriver && configuredDriver !== "pglite" && configuredDriver !== "postgres") {
    throw new Error("NEST_DATABASE_DRIVER must be either pglite or postgres.");
  }

  const driver: DatabaseDriver = configuredDriver === "postgres" ? "postgres" : "pglite";
  if (environment.NODE_ENV === "production" && driver !== "postgres") {
    throw new Error("Production admin deployments require NEST_DATABASE_DRIVER=postgres.");
  }
  const url = driver === "postgres"
    ? environment.DATABASE_URL
    : environment.NEST_DATABASE_URL || "admin/.data/local";

  if (!url) throw new Error("DATABASE_URL is required when NEST_DATABASE_DRIVER=postgres.");
  return { driver, url };
}

export async function openDatabase(config = getDatabaseConfig()) {
  if (config.driver === "postgres") {
    const client = postgres(config.url, { max: 5, prepare: false });
    const db = drizzlePostgres(client, { schema }) as unknown as AdminDatabase;
    return { driver: "postgres" as const, db, client, close: () => client.end() };
  }

  if (config.url !== ":memory:") {
    await mkdir(path.dirname(path.resolve(config.url)), { recursive: true });
  }
  const client = config.url === ":memory:" ? new PGlite() : new PGlite(config.url);
  await client.waitReady;
  const db = drizzlePglite({ client, schema });
  return { driver: "pglite" as const, db, client, close: () => client.close() };
}
