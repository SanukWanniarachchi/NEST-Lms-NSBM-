import assert from "node:assert/strict";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { productionConfigurationErrors } from "../lib/production-config";
import { applyPendingMigrations, pgliteMigrationAdapter } from "../db/migrator";
import { createAdminRepository, createAuditRepository } from "../lib/data/repositories";
import * as schema from "../db/schema";
import { initializePublishedContent } from "../lib/data/initialize-content";
import snapshot from "../../data/generated/admin-content.json";
import type { CourseContent } from "../../types/lms";
import type { Announcement } from "../../data/announcements";

const environment = {
  NEST_AUTH_MODE: "oidc", AUTH_SECRET: "fixture-only-secret-with-more-than-32-characters",
  NEST_DATABASE_DRIVER: "postgres", DATABASE_URL: "postgres://fixture:fixture@database.example/nest",
  OIDC_ISSUER: "https://identity.example", OIDC_CLIENT_ID: "fixture", OIDC_CLIENT_SECRET: "fixture-secret",
  OIDC_REDIRECT_URI: "https://admin.example/auth/callback", NEXT_PUBLIC_SITE_URL: "https://public.example/", PORT: "10000",
};

test("production settings support managed PostgreSQL and a hosting-assigned port", () => {
  assert.deepEqual(productionConfigurationErrors(environment), []);
  assert.deepEqual(productionConfigurationErrors({ ...environment, DATABASE_URL: "postgresql://fixture@database.example/nest", PORT: undefined }), []);
});

test("local authentication, weak secrets, file databases and missing identity credentials block startup", () => {
  for (const update of [
    { NEST_AUTH_MODE: "local" }, { AUTH_SECRET: " short " }, { NEST_DATABASE_DRIVER: "pglite" },
    { DATABASE_URL: "admin/.data/local" }, { OIDC_CLIENT_ID: "" }, { OIDC_CLIENT_SECRET: "" },
    { NEST_DEV_ADMIN_CODE: "development-only" }, { OIDC_CLIENT_AUTH_METHOD: "unsupported" },
  ]) assert.ok(productionConfigurationErrors({ ...environment, ...update }).length);
});

test("production rejects insecure or misrouted URLs and invalid ports without revealing values", () => {
  for (const update of [
    { OIDC_ISSUER: "http://identity.example" }, { OIDC_REDIRECT_URI: "https://admin.example/wrong" },
    { OIDC_REDIRECT_URI: "https://admin.example/auth/callback?unexpected=true" },
    { NEXT_PUBLIC_SITE_URL: "http://localhost:4173" }, { NEXT_PUBLIC_SITE_URL: "https://secret-user:secret-password@example.com" },
    { DATABASE_URL: "https://secret-user:secret-password@example.com" }, { PORT: "0" }, { PORT: "65536" }, { PORT: "3001;echo" },
  ]) {
    const errors = productionConfigurationErrors({ ...environment, ...update });
    assert.ok(errors.length);
    assert.doesNotMatch(errors.join("\n"), /secret-user|secret-password/);
  }
});

test("first production account is audited and bootstrap cannot overwrite or add further accounts", async () => {
  const client = new PGlite();
  await client.waitReady;
  try {
    await applyPendingMigrations(pgliteMigrationAdapter(client));
    const db = drizzle({ client, schema });
    const accounts = createAdminRepository(db);
    const identity = { subject: "verified:subject", displayName: "Verified Administrator", email: "verified@example.com" };
    const first = await accounts.bootstrapProduction(identity);
    assert.equal(first.role, "super_admin");
    assert.equal(first.active, true);
    await assert.rejects(accounts.bootstrapProduction({ ...identity, displayName: "Changed identity" }), /empty account directory/);
    await assert.rejects(accounts.bootstrapProduction({ ...identity, subject: "second:subject" }), /empty account directory/);
    assert.equal((await accounts.list()).length, 1);
    assert.equal((await accounts.findBySubject(identity.subject))?.displayName, identity.displayName);
    const events = await createAuditRepository(db).listRecent();
    assert.equal(events.length, 1);
    assert.equal(events[0].actorSubject, "system:production-bootstrap");
  } finally {
    await client.close();
  }
});

test("initial production curriculum is audited and repeated imports preserve existing content", async () => {
  const client = new PGlite();
  await client.waitReady;
  try {
    await applyPendingMigrations(pgliteMigrationAdapter(client));
    const db = drizzle({ client, schema });
    const content = { courses: snapshot.courses as CourseContent[], announcements: snapshot.announcements as Announcement[] };
    await initializePublishedContent(db, content);
    await assert.rejects(initializePublishedContent(db, content), /empty managed-content directory/);
    const events = await createAuditRepository(db).listRecent(100);
    assert.equal(events.length, content.courses.length + content.announcements.length);
    assert.ok(events.every(event => event.actorSubject === "system:production-content-import"));
    const courses = await db.select().from(schema.managedContent);
    assert.equal(courses.length, events.length);
    assert.equal(courses.find(course => course.slug === content.courses[0].slug)?.title, content.courses[0].title);
  } finally {
    await client.close();
  }
});
