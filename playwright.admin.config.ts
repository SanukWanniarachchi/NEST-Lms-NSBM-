import { defineConfig, devices } from "@playwright/test";
import { e2eAccessCode, e2eSessionSecret } from "./admin/tests/test-env";

export default defineConfig({
  testDir: "./admin/tests",
  fullyParallel: false,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report/admin" }]],
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      threshold: 0.18,
    },
  },
  use: {
    baseURL: "http://127.0.0.1:3001",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run admin:dev",
    url: "http://127.0.0.1:3001",
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      NEST_AUTH_MODE: "local",
      NEST_DEV_ADMIN_CODE: e2eAccessCode,
      NEST_DEV_ADMIN_NAME: "NEST Local Administrator",
      AUTH_SECRET: e2eSessionSecret,
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
