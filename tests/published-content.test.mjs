import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { validatePublishedContent } from "../scripts/published-content-schema.mjs";

const published = JSON.parse(readFileSync("data/generated/admin-content.json", "utf8"));

test("valid admin exports retain their approved public content", () => {
  const snapshot = validatePublishedContent(structuredClone(published));
  assert.deepEqual(snapshot, published);
});

test("private fields and draft payloads are rejected at every level", () => {
  for (const addPrivateField of [
    snapshot => { snapshot.accounts = []; },
    snapshot => { snapshot.courses[0].draftPayload = {}; },
    snapshot => { snapshot.courses[0].instructor.email = "private@example.com"; },
    snapshot => { snapshot.courses[0].modules[0].lessons[0].audit = []; },
    snapshot => { snapshot.toString = "unexpected"; },
  ]) {
    const snapshot = structuredClone(published);
    addPrivateField(snapshot);
    assert.throws(() => validatePublishedContent(snapshot), /not approved for public export/);
  }
});

test("empty announcements stay empty after all notices are archived", () => {
  const snapshot = structuredClone(published);
  snapshot.announcements = [];
  assert.deepEqual(validatePublishedContent(snapshot).announcements, []);
});

test("invalid curriculum routes, counts, progress, and link protocols stop publication", () => {
  for (const mutate of [
    snapshot => { snapshot.courses[1].slug = snapshot.courses[0].slug; },
    snapshot => { snapshot.courses[0].lessonCount = 1; },
    snapshot => { snapshot.courses[0].progress = 10; },
    snapshot => { snapshot.courses[0].modules[0].lessons[0].completed = true; },
    snapshot => { snapshot.courses[0].modules[0].lessons[0].youtubeUrl = "https://example.com/video"; },
    snapshot => { snapshot.announcements[0].actionHref = "javascript:alert(1)"; },
    snapshot => { snapshot.announcements[0].actionHref = "//example.com/"; },
    snapshot => { snapshot.announcements[0].date = "2026-02-30"; },
    snapshot => { snapshot.version = 2; },
  ]) {
    const snapshot = structuredClone(published);
    mutate(snapshot);
    assert.throws(() => validatePublishedContent(snapshot));
  }
});

test("the importer leaves the existing public snapshot untouched when validation fails", () => {
  const directory = mkdtempSync(join(tmpdir(), "nest-content-import-"));
  const targetDirectory = join(directory, "data", "generated");
  mkdirSync(targetDirectory, { recursive: true });
  const target = join(targetDirectory, "admin-content.json");
  writeFileSync(target, JSON.stringify(published));
  const invalid = { ...published, accounts: [{ email: "private@example.com" }] };
  const input = join(directory, "input.json");
  writeFileSync(input, JSON.stringify(invalid));
  const before = readFileSync(target, "utf8");
  const result = spawnSync(process.execPath, [resolve("scripts/import-published-content.mjs"), input], { cwd: directory, encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.equal(readFileSync(target, "utf8"), before);

  const updated = structuredClone(published);
  updated.announcements[0].title = "Reviewed publication test notice";
  writeFileSync(input, JSON.stringify(updated));
  const validResult = spawnSync(process.execPath, [resolve("scripts/import-published-content.mjs"), input], { cwd: directory, encoding: "utf8" });
  assert.equal(validResult.status, 0, validResult.stderr);
  assert.equal(JSON.parse(readFileSync(target, "utf8")).announcements[0].title, updated.announcements[0].title);
});
