import { expect, test, type Page } from "@playwright/test";

const enquiry = {
  name: "Website Test",
  email: "test@example.com",
  topic: "Club collaboration",
  message: "Could we arrange a learning session?\nPlease share the next available date.",
};
const preparedMessage = `Name: ${enquiry.name}\nEmail: ${enquiry.email}\nTopic: ${enquiry.topic}\n\n${enquiry.message}`;

async function prepareEnquiry(page: Page) {
  await page.goto("/about/#contact");
  await page.getByRole("textbox", { name: "Full name", exact: true }).fill(enquiry.name);
  await page.getByRole("textbox", { name: "Email address", exact: true }).fill(enquiry.email);
  await page.getByRole("combobox", { name: "Topic", exact: true }).selectOption(enquiry.topic);
  await page.getByRole("textbox", { name: "Message", exact: true }).fill(enquiry.message);
  await page.getByRole("button", { name: "Prepare enquiry", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Prepared enquiry", exact: true })).toHaveValue(preparedMessage);
}

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`enquiry retains every field and copies the edited message on ${viewport.name}`, async ({ page, context }) => {
    await page.setViewportSize(viewport);
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await prepareEnquiry(page);
    await page.getByRole("button", { name: "Edit your message", exact: true }).click();
    await expect(page.getByRole("textbox", { name: "Full name", exact: true })).toHaveValue(enquiry.name);
    await expect(page.getByRole("textbox", { name: "Email address", exact: true })).toHaveValue(enquiry.email);
    await expect(page.getByRole("combobox", { name: "Topic", exact: true })).toHaveValue(enquiry.topic);
    await expect(page.getByRole("textbox", { name: "Message", exact: true })).toHaveValue(enquiry.message);

    const updatedMessage = `${enquiry.message}\nThank you.`;
    await page.getByRole("textbox", { name: "Message", exact: true }).fill(updatedMessage);
    await page.getByRole("button", { name: "Prepare enquiry", exact: true }).click();
    await page.getByRole("button", { name: "Copy message", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("Message copied.");
    const copiedMessage = await page.evaluate(() => navigator.clipboard.readText());
    expect(copiedMessage.replace(/\r\n/g, "\n")).toBe(`${preparedMessage}\nThank you.`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width + 2);
  });

  test(`enquiry stays available for manual copying when clipboard access fails on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async () => { throw new DOMException("Clipboard denied", "NotAllowedError"); } },
      });
    });
    await prepareEnquiry(page);
    await page.getByRole("button", { name: "Copy message", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("copy it manually");
    const preview = page.getByRole("textbox", { name: "Prepared enquiry", exact: true });
    await expect(preview).toHaveValue(preparedMessage);
    await preview.focus();
    expect(await preview.evaluate((element: HTMLTextAreaElement) => element.selectionEnd - element.selectionStart)).toBe(preparedMessage.length);
    await page.getByRole("button", { name: "Edit your message", exact: true }).click();
    await expect(page.getByRole("textbox", { name: "Message", exact: true })).toHaveValue(enquiry.message);
  });
}

for (const width of [390, 820]) {
  test(`mobile navigation links, closing, and keyboard access work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Mobile navigation", exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Open navigation", exact: true }).click();
    await page.getByRole("navigation", { name: "Mobile navigation", exact: true }).getByRole("link", { name: "Courses", exact: true }).focus();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest("#mobile-menu")))).toBe(false);

    for (const [label, path] of [
      ["Courses", "/courses/"],
      ["News", "/news/"],
      ["Announcements", "/announcements/"],
      ["About", "/about/"],
      ["Join community", "/community/"],
      ["Home", "/"],
    ]) {
      await page.getByRole("button", { name: "Open navigation", exact: true }).click();
      await page.getByRole("navigation", { name: "Mobile navigation", exact: true }).getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(path);
      await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toHaveAttribute("aria-expanded", "false");
      await expect(page.getByRole("navigation", { name: "Mobile navigation", exact: true })).toHaveCount(0);
    }

    await page.getByRole("button", { name: "Open navigation", exact: true }).click();
    await page.getByRole("navigation", { name: "Mobile navigation", exact: true }).getByRole("link", { name: "Home", exact: true }).click();
    await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toHaveAttribute("aria-expanded", "false");
  });
}
