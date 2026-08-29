import { expect, test } from "@playwright/test";
import { e2eAccessCode } from "./test-env";

test("protected routes redirect unauthenticated visitors", async ({ page }) => {
  await page.goto("/research");
  await expect(page).toHaveURL("http://127.0.0.1:3001/");
  await expect(page.getByRole("heading", { name: "Manage NEST content." })).toBeVisible();
});

test("invalid local credentials are rejected", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Local access code").fill("incorrect-code");
  await page.getByRole("button", { name: "Continue to workspace" }).click();
  await expect(page.locator(".form-error")).toHaveText("The access code is incorrect.");
  await expect(page).toHaveURL(/error=invalid/);
});

test("an authorised local admin can navigate and sign out", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Local access code").fill(e2eAccessCode);
  await page.getByRole("button", { name: "Continue to workspace" }).click();

  await expect(page).toHaveURL("http://127.0.0.1:3001/dashboard");
  await expect(page.getByRole("heading", { name: "Content operations" })).toBeVisible();
  await expect(page.getByText("NEST Local Administrator")).toBeVisible();

  await page.getByRole("link", { name: "Research" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3001/research");
  await expect(page.getByRole("heading", { name: "No research records" })).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3001/");
  await page.goto("/dashboard");
  await expect(page).toHaveURL("http://127.0.0.1:3001/");
});
