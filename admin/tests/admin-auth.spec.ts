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

test("an authorised local super admin can navigate and sign out", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Local access code").fill(e2eAccessCode);
  await page.getByRole("button", { name: "Continue to workspace" }).click();

  await expect(page).toHaveURL("http://127.0.0.1:3001/dashboard");
  await expect(page.getByRole("heading", { name: "Content operations" })).toBeVisible();
  await expect(page.getByText("NEST Local Administrator")).toBeVisible();
  await expect(page.getByText("Super admin", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Research" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3001/research");
  await expect(page.getByRole("heading", { name: "Research", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3001/");
  await page.goto("/dashboard");
  await expect(page).toHaveURL("http://127.0.0.1:3001/");
});

test("health endpoints report liveness and readiness", async ({ request }) => {
  const live = await request.get("/health/live");
  expect(live.ok()).toBeTruthy();
  await expect(live.json()).resolves.toMatchObject({ status: "ok", service: "nest-lms-admin" });

  const ready = await request.get("/health/ready");
  expect(ready.ok()).toBeTruthy();
  await expect(ready.json()).resolves.toMatchObject({ status: "ready", service: "nest-lms-admin" });
});

test("a super admin can create and maintain role-based accounts", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Local access code").fill(e2eAccessCode);
  await page.getByRole("button", { name: "Continue to workspace" }).click();
  await page.getByRole("link", { name: "Users" }).click();

  await expect(page).toHaveURL("http://127.0.0.1:3001/users");
  await expect(page.getByRole("heading", { name: "Users", exact: true })).toBeVisible();
  const createForm = page.locator(".account-create form");
  await createForm.getByLabel("Identity subject").fill("admin:phase-two");
  await createForm.getByLabel("Display name").fill("Phase Two Administrator");
  await createForm.getByLabel("Email address").fill("phase-two@example.edu");
  await createForm.getByLabel("Role").selectOption("admin");
  await createForm.getByRole("button", { name: "Add account" }).click();

  await expect(page).toHaveURL(/\/users\?changed=created$/);
  const record = page.locator(".account-record").filter({ hasText: "Phase Two Administrator" });
  await expect(record).toBeVisible();
  await record.locator("summary").click();
  await record.getByLabel("Display name").fill("Phase Two Admin");
  await record.getByLabel("Active account").uncheck();
  await record.getByRole("button", { name: "Save account" }).click();

  await expect(page).toHaveURL(/\/users\?changed=updated$/);
  await expect(page.locator(".account-record").filter({ hasText: "Phase Two Admin" }).getByText("Inactive", { exact: true })).toBeVisible();
  const ownRecord = page.locator(".account-record").filter({ hasText: "NEST Local Administrator" });
  await expect(ownRecord.getByLabel("Role")).toBeDisabled();
  await expect(ownRecord.getByLabel("Active account")).toBeDisabled();
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

test("an authorised admin can create and manage an announcement", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Local access code").fill(e2eAccessCode);
  await page.getByRole("button", { name: "Continue to workspace" }).click();
  await page.getByRole("link", { name: "Announcements" }).click();
  await page.getByRole("link", { name: "Add announcement" }).click();

  const suffix = Date.now().toString(36);
  await page.getByLabel("Title").fill("Student security workshop");
  await page.getByLabel("URL slug").fill(`student-security-workshop-${suffix}`);
  await page.getByLabel("Summary").fill("Join the NEST team for a practical workshop on safer student accounts and devices.");
  await page.getByLabel("Action label").fill("Browse courses");
  await page.getByLabel("Action destination").fill("/courses/");
  await page.getByRole("button", { name: "Save draft" }).click();

  await expect(page).toHaveURL(/\/announcements\?changed=saved$/);
  const record = page.locator(".research-row").filter({ hasText: "Student security workshop" });
  await expect(record).toBeVisible();
  await record.getByRole("button", { name: "Publish" }).click();
  await expect(page).toHaveURL(/\/announcements\?changed=publish$/);
  const published = page.locator(".research-row").filter({ hasText: "Student security workshop" });
  await published.getByRole("button", { name: "Archive" }).click();
  await expect(page).toHaveURL(/\/announcements\?changed=archive$/);
  await page.locator(".research-row").filter({ hasText: "Student security workshop" }).getByRole("button", { name: "Restore" }).click();
  await expect(page).toHaveURL(/\/announcements\?changed=restore$/);
});

test("an authorised admin can revise a course without replacing its live version", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Local access code").fill(e2eAccessCode);
  await page.getByRole("button", { name: "Continue to workspace" }).click();
  await page.getByRole("link", { name: "Courses" }).click();

  const record = page.locator(".research-row").filter({ hasText: "Cybersecurity Foundations" });
  await record.getByRole("link", { name: "Edit" }).click();
  await page.getByLabel("Course title").fill("Cybersecurity Foundations Updated");
  await page.getByRole("button", { name: "Save working draft" }).click();

  await expect(page).toHaveURL(/\/courses\?changed=saved$/);
  const draft = page.locator(".research-row").filter({ hasText: "Cybersecurity Foundations Updated" });
  await expect(draft.getByText("Previous version remains live")).toBeVisible();
  await draft.getByRole("button", { name: "Publish" }).click();
  await expect(page).toHaveURL(/\/courses\?changed=publish$/);
});
