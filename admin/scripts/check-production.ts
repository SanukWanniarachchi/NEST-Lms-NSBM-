import { join } from "node:path";
import { loadEnvConfig } from "@next/env";
import { productionConfigurationErrors } from "../lib/production-config";

Object.assign(process.env, { NODE_ENV: "production" });
loadEnvConfig(join(process.cwd(), "admin"));
const errors = productionConfigurationErrors(process.env);
if (errors.length) {
  console.error(`Production configuration is incomplete:\n${errors.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log("Production configuration passed. Database connectivity and real SSO still require deployment checks.");
}
