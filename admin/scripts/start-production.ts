import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { join } from "node:path";
import { loadEnvConfig } from "@next/env";
import { assertProductionConfiguration } from "../lib/production-config";

Object.assign(process.env, { NODE_ENV: "production" });
loadEnvConfig(join(process.cwd(), "admin"));
assertProductionConfiguration(process.env);
const require = createRequire(import.meta.url);
const server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "admin", "--hostname", "0.0.0.0", "--port", process.env.PORT || "3001"], { stdio: "inherit", env: process.env });
for (const signal of ["SIGINT", "SIGTERM"] as const) process.on(signal, () => server.kill(signal));
server.on("error", () => { console.error("The admin server could not start."); process.exitCode = 1; });
server.on("exit", (code, signal) => { process.exitCode = code ?? (signal === "SIGINT" || signal === "SIGTERM" ? 0 : 1); });
