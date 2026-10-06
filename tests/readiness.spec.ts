import { expect, test } from "@playwright/test";
import { getModuleQuiz } from "../data/module-quizzes";

const checkpoint = "/courses/cybersecurity-foundations/checkpoints/introduction-to-cybersecurity/";

for (const exception of ["SecurityError", "QuotaExceededError"]) {
  test(`checkpoint completes when saving throws ${exception}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(checkpoint);
    await page.evaluate(name => {
      Storage.prototype.setItem = () => { throw new DOMException("Saving unavailable", name); };
    }, exception);
    await page.getByRole("button", { name: "Start checkpoint" }).click();
    const quiz = getModuleQuiz("cybersecurity-foundations", "introduction-to-cybersecurity")!;
    for (let index = 0; index < quiz.questions.length; index++) {
      const prompt = await page.locator("#question-title").textContent();
      const answer = quiz.questions.find(question => question.prompt === prompt)!.correctAnswer;
      await expect(page.locator("#question-title")).toBeFocused();
      await page.locator(".quiz-choice").filter({ hasText: answer }).click();
      await page.getByRole("button", { name: index === quiz.questions.length - 1 ? "View results" : "Next question" }).click();
    }
    await expect(page.locator(".quiz-result-mark")).toContainText("3/3");
    await expect(page.locator("#results-title")).toBeFocused();
    await expect(page.getByRole("status")).toContainText("could not save");
    await expect(page.locator(".course-recommendation")).toHaveCount(3);
    expect(errors).toEqual([]);
    await page.getByRole("button", { name: "Retry checkpoint" }).click();
    await expect(page.locator("#question-title")).toBeVisible();
  });
}

test("malformed saved quiz results do not break a new attempt", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("nest-module-quiz-results-v1", JSON.stringify({
    "cybersecurity-foundations/introduction-to-cybersecurity": { bestScore: {}, attempts: "many", passed: true },
  })));
  await page.goto(checkpoint);
  await expect(page.locator(".quiz-previous")).toHaveCount(0);
  await page.getByRole("button", { name: "Start checkpoint" }).click();
  for (let index = 0; index < 3; index++) {
    await page.locator(".quiz-choice").first().click();
    await page.getByRole("button", { name: index === 2 ? "View results" : "Next question" }).click();
  }
  await expect(page.locator(".quiz-results")).toBeVisible();
  const result = await page.evaluate(() => JSON.parse(localStorage.getItem("nest-module-quiz-results-v1")!)["cybersecurity-foundations/introduction-to-cybersecurity"]);
  expect(result.attempts).toBe(1);
  expect(Number.isInteger(result.bestScore)).toBe(true);
});

test("keyboard pause control stops both scrolling strips and resumes them", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const pause = page.getByRole("button", { name: "Pause scrolling text" });
  await pause.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Resume scrolling text" })).toHaveAttribute("aria-pressed", "true");
  for (const track of await page.locator(".marquee-track").all()) await expect(track).toHaveCSS("animation-play-state", "paused");
  await page.keyboard.press("Enter");
  for (const track of await page.locator(".marquee-track").all()) await expect(track).toHaveCSS("animation-play-state", "running");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(pause).toBeHidden();
});
