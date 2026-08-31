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
  await expect(page.getByRole("heading", { name: "Research", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3001/");
  await page.goto("/dashboard");
  await expect(page).toHaveURL("http://127.0.0.1:3001/");
});

test("an authorised admin can create, edit, publish, archive, and restore research", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Local access code").fill(e2eAccessCode);
  await page.getByRole("button", { name: "Continue to workspace" }).click();
  await page.getByRole("link", { name: "Research" }).click();
  await page.getByRole("link", { name: "Add research" }).click();

  const suffix = Date.now().toString(36);
  await page.getByLabel("Title").fill("Secure student networks");
  await page.getByLabel("URL slug").fill(`secure-student-networks-${suffix}`);
  await page.getByLabel("Summary").fill("A practical study of safer network habits for university learning environments.");
  await page.getByLabel("Authors").fill("NEST Research Team");
  await page.getByLabel("Topic tags").fill("Cybersecurity, Networking");
  await page.getByLabel("Resource URL").fill("https://example.edu/research/secure-student-networks");
  await page.getByRole("button", { name: "Create draft" }).click();

  await expect(page).toHaveURL(/\/research\/.+\/preview\?saved=1$/);
  await expect(page.locator("h1")).toHaveText("Secure student networks");
  await page.getByRole("link", { name: "Edit draft" }).click();
  await page.getByLabel("Title").fill("Secure student networks: practical guidance");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.locator("h1")).toHaveText("Secure student networks: practical guidance");

  await page.getByRole("button", { name: "Publish" }).click();
  await expect(page).toHaveURL(/\/research\?changed=publish$/);
  await expect(page.getByText("Research was published.")).toBeVisible();
  await page.getByRole("link", { name: "Preview" }).first().click();
  await page.getByRole("button", { name: "Archive" }).click();
  await expect(page.getByText("Research was archived.")).toBeVisible();
  await page.getByRole("button", { name: "Restore" }).first().click();
  await expect(page.getByText("Research was restored to drafts.")).toBeVisible();
});
