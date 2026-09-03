import { expect, test, type Page } from "@playwright/test";

const labUrl = "/prototypes/learning-activity-lab/";

async function openLab(page: Page, width = 1440, height = 900) {
  await page.setViewportSize({ width, height });
  await page.goto(labUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }))).toEqual(
    expect.objectContaining({ width: expect.any(Number), viewport: expect.any(Number) }),
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(true);
}

async function answerQuestionSet(page: Page, answers: Record<string, string>, count: number) {
  for (let index = 0; index < count; index += 1) {
    const prompt = (await page.locator(".question-copy h2").textContent()) ?? "";
    const answer = answers[prompt];
    expect(answer, `Missing answer for: ${prompt}`).toBeTruthy();
    await page.locator(".choice").filter({ hasText: answer }).click();
    await expect(page.locator(".feedback.correct")).toBeVisible();
    await page.getByRole("button", { name: index === count - 1 ? "See results" : "Next question" }).click();
  }
}

test("completes every prototype and persists all six results", async ({ page }) => {
  await openLab(page);

  await page.getByRole("button", { name: /Knowledge Quiz/ }).click();
  await answerQuestionSet(page, {
    "Which part of the CIA triad prevents unauthorized disclosure?": "Confidentiality",
    "What is the safest response to an unexpected account-verification link?": "Visit the service through its official address",
    "What does multi-factor authentication add?": "A second independent proof of identity",
    "Which behaviour best supports password security?": "Unique passwords stored in a password manager",
    "A file is changed without permission. Which security property failed?": "Integrity",
  }, 5);
  await expect(page.locator(".result-panel")).toContainText("5 out of 5");

  await page.getByRole("button", { name: /Scenario Challenge/ }).click();
  await answerQuestionSet(page, {
    "What should you do first?": "Confirm through a separate trusted channel",
    "Choose the strongest response.": "Deny it, change the password, and review sessions",
    "How should it be handled?": "Give it to the responsible staff without connecting it",
    "What action best reduces ongoing harm?": "Report it, revoke sessions, and use remote protection if configured",
  }, 4);
  await expect(page.locator(".result-panel")).toContainText("4 out of 4");

  await page.getByRole("button", { name: /Match and Sort/ }).click();
  const pairs = [
    ["DNS", "Translates names into IP addresses"],
    ["DHCP", "Assigns network configuration automatically"],
    ["HTTPS", "Protects web traffic in transit"],
    ["ICMP", "Carries network diagnostics and error messages"],
    ["TCP", "Provides reliable ordered delivery"],
    ["UDP", "Provides lightweight connectionless delivery"],
  ];
  for (const [protocol, purpose] of pairs) {
    await page.locator(".match-item").filter({ hasText: protocol }).click();
    await page.locator(".match-target").filter({ hasText: purpose }).click();
  }
  await page.getByRole("button", { name: "Continue to layer sorting" }).click();
  const desired = ["Application", "Presentation", "Session", "Transport", "Network", "Data Link", "Physical"];
  for (let targetIndex = 0; targetIndex < desired.length; targetIndex += 1) {
    let current = await page.locator(".sort-item strong").allTextContents();
    while (current.indexOf(desired[targetIndex]) > targetIndex) {
      await page.getByRole("button", { name: `Move ${desired[targetIndex]} up` }).click();
      current = await page.locator(".sort-item strong").allTextContents();
    }
  }
  await page.getByRole("button", { name: "Check order" }).click();
  await expect(page.locator(".result-panel")).toContainText("13 out of 13");

  await page.getByRole("button", { name: /Network Explorer/ }).click();
  for (const node of ["firewall", "router", "server", "laptop"]) {
    await page.locator(`[data-node="${node}"]`).click();
    await expect(page.locator(".feedback.correct")).toBeVisible();
    await page.getByRole("button", { name: node === "laptop" ? "See results" : "Next challenge" }).click();
  }
  await expect(page.locator(".result-panel")).toContainText("4 out of 4");

  await page.getByRole("button", { name: /Phishing Investigator/ }).click();
  await page.locator("#timer-toggle").uncheck();
  await page.getByRole("button", { name: "Start investigation" }).click();
  for (const flag of ["urgent-subject", "sender", "generic", "pressure", "link"]) {
    await page.locator(`[data-flag="${flag}"]`).click();
  }
  await expect(page.locator(".result-panel")).toContainText("5 out of 5");

  await page.getByRole("button", { name: /Incident Commander/ }).click();
  for (let stage = 0; stage < 4; stage += 1) await page.locator(".branch-choice").first().click();
  await expect(page.locator(".result-panel")).toContainText("out of 10");

  await page.getByRole("button", { name: /Open activity overview/ }).click();
  await expect(page.locator(".status-pill.complete")).toHaveCount(6);
  await expect(page.locator("#overall-progress")).toHaveText("6 of 6 completed");
  await page.reload();
  await expect(page.locator(".status-pill.complete")).toHaveCount(6);
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`all activity starts remain responsive on ${viewport.name}`, async ({ page }) => {
    await openLab(page, viewport.width, viewport.height);
    await expectNoOverflow(page);
    for (const activity of ["quiz", "scenario", "matching", "diagram", "phishing", "branching"]) {
      await page.locator(`[data-route="${activity}"]`).first().click();
      await expect(page.locator(".activity-frame")).toBeVisible();
      await expectNoOverflow(page);
    }
  });

  test(`overview visual ${viewport.name}`, async ({ page }) => {
    await openLab(page, viewport.width, viewport.height);
    await expect(page).toHaveScreenshot(`activity-lab-${viewport.name}.png`, { fullPage: true, animations: "disabled" });
  });
}

test("theme preference persists", async ({ page }) => {
  await openLab(page);
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
