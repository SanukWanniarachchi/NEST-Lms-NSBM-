import { expect, test, type Page } from "@playwright/test";
import { e2eAccessCode } from "./test-env";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

function watchRuntimeProblems(page: Page) {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`Console: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`Page: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() >= 400) problems.push(`HTTP ${response.status()}: ${response.url()}`);
  });
  return problems;
}

async function signIn(page: Page) {
  await page.goto("/");
  await page.getByLabel("Local access code").fill(e2eAccessCode);
  await page.getByRole("button", { name: "Continue to workspace" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

async function expectStableLayout(page: Page) {
  const result = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    clipped: Array.from(document.querySelectorAll<HTMLElement>("button, a")).filter((element) => {
      const style = getComputedStyle(element);
      return style.display !== "none" && element.scrollWidth > element.clientWidth + 2;
    }).map((element) => element.textContent?.trim() || element.tagName),
  }));
  expect(result.scrollWidth).toBeLessThanOrEqual(result.viewportWidth + 2);
  expect(result.clipped).toEqual([]);
}

for (const viewport of viewports) {
  for (const theme of ["light", "dark"] as const) {
    test(`login ${theme} ${viewport.name}`, async ({ page }) => {
      const problems = watchRuntimeProblems(page);
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await page.goto("/");
      await expectStableLayout(page);
      await expect(page).toHaveScreenshot(`admin-login-${theme}-${viewport.name}.png`, { animations: "disabled", fullPage: true });
      expect(problems).toEqual([]);
    });

    test(`dashboard ${theme} ${viewport.name}`, async ({ page }) => {
      const problems = watchRuntimeProblems(page);
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await signIn(page);
      await expectStableLayout(page);
      await expect(page).toHaveScreenshot(`admin-dashboard-${theme}-${viewport.name}.png`, { animations: "disabled", fullPage: true });
      expect(problems).toEqual([]);
    });

    test(`research form ${theme} ${viewport.name}`, async ({ page }) => {
      const problems = watchRuntimeProblems(page);
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await signIn(page);
      await page.goto("/research/new");
      await expect(page.getByLabel("Admin navigation").getByRole("link", { name: "Research" })).toHaveAttribute("aria-current", "page");
      await expectStableLayout(page);
      await expect(page).toHaveScreenshot(`admin-research-form-${theme}-${viewport.name}.png`, { animations: "disabled", fullPage: true });
      expect(problems).toEqual([]);
    });
  }
}
