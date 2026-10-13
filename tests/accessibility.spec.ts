import { expect, test } from "@playwright/test";
import axe from "axe-core";

const routes = ["/", "/about/", "/courses/", "/news/", "/community/", "/privacy/", "/courses/cybersecurity-foundations/", "/courses/cybersecurity-foundations/lessons/what-is-cybersecurity/", "/courses/cybersecurity-foundations/checkpoints/introduction-to-cybersecurity/"];

for (const theme of ["light", "dark"]) {
  test(`public routes pass automated accessibility checks in ${theme} theme`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(value => localStorage.setItem("nest-theme", value), theme);
    for (const route of routes) {
      await page.goto(route);
      await page.addScriptTag({ content: axe.source });
      const violations = await page.evaluate(async () => {
        const engine = (window as unknown as { axe: typeof axe }).axe;
        const result = await engine.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } });
        return result.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => ({ target: node.target, reason: node.failureSummary })) }));
      });
      expect(violations, `${route} (${theme})`).toEqual([]);
    }
  });
}

test("skip link moves keyboard focus into the page content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("privacy control clears learning progress without removing unrelated storage", async ({ page }) => {
  await page.goto("/privacy/");
  await page.evaluate(() => {
    localStorage.setItem("nest-module-quiz-results-v1", "{}");
    localStorage.setItem("nest-module-completions-v1", "[]");
    localStorage.setItem("nest-theme", "dark");
    localStorage.setItem("unrelated-data", "keep");
  });
  await page.getByRole("button", { name: "Clear saved learning progress" }).click();
  await expect(page.getByRole("status")).toContainText("have been cleared");
  expect(await page.evaluate(() => [localStorage.getItem("nest-module-quiz-results-v1"), localStorage.getItem("nest-module-completions-v1"), localStorage.getItem("nest-theme"), localStorage.getItem("unrelated-data")])).toEqual([null, null, "dark", "keep"]);
});
