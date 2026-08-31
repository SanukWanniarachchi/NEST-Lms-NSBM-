import assert from "node:assert/strict";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { getDatabaseConfig } from "../db/connection";
import * as schema from "../db/schema";
import { applyPendingMigrations, pgliteMigrationAdapter } from "../db/migrator";
import {
  createAdminRepository,
  createAuditRepository,
  createResearchRepository,
  getContentMetrics,
} from "../lib/data/repositories";

test("production configuration requires the PostgreSQL adapter", () => {
  assert.throws(
    () => getDatabaseConfig({ NODE_ENV: "production", NEST_DATABASE_DRIVER: "pglite" }),
    /require NEST_DATABASE_DRIVER=postgres/,
  );
  assert.deepEqual(
    getDatabaseConfig({
      NODE_ENV: "production",
      NEST_DATABASE_DRIVER: "postgres",
      DATABASE_URL: "postgres://database.example/nest",
    }),
    { driver: "postgres", url: "postgres://database.example/nest" },
  );
});

test("migrations and repositories preserve allowlist, content, and audit history", async () => {
  const client = new PGlite();
  await client.waitReady;

  try {
    const adapter = pgliteMigrationAdapter(client);
    assert.deepEqual(await applyPendingMigrations(adapter), ["0001_admin_platform"]);
    assert.deepEqual(await applyPendingMigrations(adapter), []);

    const db = drizzle({ client, schema });
    const admins = createAdminRepository(db);
    const research = createResearchRepository(db);
    const audit = createAuditRepository(db);

    await admins.upsert("system:test", {
      subject: "admin:test-editor",
      email: "editor@example.edu",
      displayName: "Test Editor",
    });
    await admins.upsert("system:test", {
      subject: "admin:test-editor",
      email: "editor@example.edu",
      displayName: "Test Editor",
    });
    assert.equal(await admins.isAllowed("admin:test-editor"), true);

    const draft = await research.createDraft("admin:test-editor", {
      slug: "secure-campus-networks",
      title: "Secure Campus Networks",
      summary: "A test record that verifies durable research persistence.",
      type: "research_paper",
      authors: ["NEST Research Team"],
      href: "https://example.edu/research/secure-campus-networks",
      tags: ["Cybersecurity", "Networking"],
    });
    assert.equal(draft.status, "draft");
    assert.equal((await research.list("draft")).length, 1);

    const updated = await research.updateDraft("admin:test-editor", draft.id, {
      slug: "secure-campus-networking",
      title: "Secure Campus Networking",
      summary: "An updated record that verifies durable research editing and publication.",
      type: "research_paper",
      authors: ["NEST Research Team", "Test Editor"],
      href: "https://example.edu/research/secure-campus-networking",
      tags: ["Cybersecurity", "Networking"],
    });
    assert.equal(updated?.title, "Secure Campus Networking");

    const published = await research.publish("admin:test-editor", draft.id, "2026-08-31");
    assert.equal(published?.status, "published");
    assert.equal(published?.publishedOn, "2026-08-31");
    await assert.rejects(
      research.updateDraft("admin:test-editor", draft.id, {
        slug: "should-not-save",
        title: "Should Not Save",
        summary: "Published records must not be edited without a new workflow transition.",
        type: "document",
        authors: ["Test Editor"],
        href: "https://example.edu/research/should-not-save",
        tags: ["Testing"],
      }),
      /Only draft research can be edited/,
    );

    const archived = await research.archive("admin:test-editor", draft.id);
    assert.equal(archived?.status, "archived");
    assert.equal(archived?.publishedOn, null);
    const restored = await research.restore("admin:test-editor", draft.id);
    assert.equal(restored?.status, "draft");

    await admins.setActive("system:test", "admin:test-editor", false);
    assert.equal(await admins.isAllowed("admin:test-editor"), false);

    const metrics = await getContentMetrics(db);
    assert.deepEqual(metrics, { activeAdmins: 0, researchResources: 1, auditEvents: 7 });
    assert.deepEqual((await audit.listRecent()).map((event) => event.action), [
      "admin.deactivated",
      "research.restored",
      "research.archived",
      "research.published",
      "research.updated",
      "research.created",
      "admin.created",
    ]);
  } finally {
    await client.close();
  }
});
