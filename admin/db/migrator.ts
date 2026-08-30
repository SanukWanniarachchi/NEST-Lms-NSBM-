import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { PGlite } from "@electric-sql/pglite";
import type postgres from "postgres";

type MigrationAdapter = {
  listApplied(): Promise<Set<string>>;
  apply(version: string, statement: string): Promise<void>;
};

const migrationName = /^\d{4}_[a-z0-9_]+\.sql$/;

export function pgliteMigrationAdapter(client: PGlite): MigrationAdapter {
  return {
    async listApplied() {
      await client.exec("CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
      const result = await client.query<{ version: string }>("SELECT version FROM schema_migrations");
      return new Set(result.rows.map((row) => row.version));
    },
    async apply(version, statement) {
      await client.transaction(async (transaction) => {
        await transaction.exec(statement);
        await transaction.query("INSERT INTO schema_migrations (version) VALUES ($1)", [version]);
      });
    },
  };
}

export function postgresMigrationAdapter(client: postgres.Sql): MigrationAdapter {
  return {
    async listApplied() {
      await client`CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
      const rows = await client<{ version: string }[]>`SELECT version FROM schema_migrations`;
      return new Set(rows.map((row) => row.version));
    },
    async apply(version, statement) {
      await client.begin(async (transaction) => {
        await transaction.unsafe(statement);
        await transaction`INSERT INTO schema_migrations (version) VALUES (${version})`;
      });
    },
  };
}

export async function applyPendingMigrations(
  adapter: MigrationAdapter,
  directory = path.join(process.cwd(), "admin", "db", "migrations"),
) {
  const files = (await readdir(directory)).filter((file) => migrationName.test(file)).sort();
  const applied = await adapter.listApplied();
  const completed: string[] = [];

  for (const file of files) {
    const version = file.slice(0, -4);
    if (applied.has(version)) continue;
    await adapter.apply(version, await readFile(path.join(directory, file), "utf8"));
    completed.push(version);
  }

  return completed;
}
