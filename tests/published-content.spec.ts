import { expect, test } from "@playwright/test";
import snapshot from "../data/generated/admin-content.json";

test("the announcement board renders the reviewed snapshot in export order", async ({ page }) => {
  await page.goto("/announcements/");
  await expect(page.locator(".announcement-card h2")).toHaveText(snapshot.announcements.map(item => item.title));
  if (!snapshot.announcements.length) await expect(page.getByText("No announcements have been published yet. Check back for club updates.")).toBeVisible();
});

test("published course and lesson routes use the snapshot curriculum", async ({ page }) => {
  for (const course of snapshot.courses) {
    await page.goto(`/courses/${course.slug}/`);
    await expect(page.getByRole("heading", { name: course.title, exact: true })).toBeVisible();
    const firstLesson = course.modules[0].lessons[0];
    await expect(page.getByRole("link", { name: "Start learning", exact: true })).toHaveAttribute("href", `/courses/${course.slug}/lessons/${firstLesson.slug}/`);
    await page.goto(`/courses/${course.slug}/lessons/${firstLesson.slug}/`);
    await expect(page.getByRole("heading", { name: firstLesson.title, exact: true })).toBeVisible();
  }
});

test("the approved lesson text corrections survive the publishing bridge", async ({ page }) => {
  for (const slug of ["mac-address", "dns-explained", "pwm-basics"]) {
    const course = snapshot.courses.find(item => item.modules.some(module => module.lessons.some(lesson => lesson.slug === slug)))!;
    const lesson = course.modules.flatMap(module => module.lessons).find(item => item.slug === slug)!;
    await page.goto(`/courses/${course.slug}/lessons/${slug}/`);
    await expect(page.getByText(lesson.description, { exact: true }).first()).toBeVisible();
  }
});
