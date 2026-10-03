import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { setTimeout } from "node:timers/promises";

const require = createRequire(import.meta.url);
const server = spawn(process.execPath, [require.resolve("tsx/cli"), "admin/scripts/start-production.ts"], { stdio: "inherit", env: process.env });
const base = `http://127.0.0.1:${process.env.PORT || "3001"}`;
try {
  let live;
  for (let attempt = 0; attempt < 40; attempt++) {
    if (server.exitCode !== null) throw new Error("Production server exited before the smoke check.");
    try {
      live = await fetch(`${base}/health/live`, { signal: AbortSignal.timeout(1000) });
      if (live.ok) break;
    } catch { /* Server may still be starting. */ }
    await setTimeout(250);
  }
  assert.equal(live?.status, 200);
  const ready = await fetch(`${base}/health/ready`, { signal: AbortSignal.timeout(10000) });
  assert.equal(ready.status, 200, "Production database and required tables must be ready.");
  assert.equal((await ready.json()).status, "ready");
  const protectedPage = await fetch(`${base}/dashboard`, { redirect: "manual" });
  assert.ok([302, 303, 307, 308].includes(protectedPage.status));
  assert.equal(new URL(protectedPage.headers.get("location"), base).pathname, "/");
  const login = await fetch(base);
  assert.equal(login.status, 200);
  assert.doesNotMatch(await login.text(), /Local access code/);
  console.log("Production smoke passed: hosting port, liveness, PostgreSQL readiness, protected redirect, and no local login.");
} finally {
  server.kill("SIGTERM");
}
