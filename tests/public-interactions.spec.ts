import { expect, test, type Page } from "@playwright/test";

const enquiry = {
  name: "Website Test",
  email: "test@example.com",
  topic: "Club collaboration",
  message: "Could we arrange a learning session?\nPlease share the next available date.",
};
const preparedMessage = `Name: ${enquiry.name}\nEmail: ${enquiry.email}\nTopic: ${enquiry.topic}\n\n${enquiry.message}`;

test("club destinations and prepared email match the supplied contact details", async ({ page }) => {
  const whatsapp = "https://chat.whatsapp.com/IGyFVvdwHQDF0TrTnYL5V0";
  const instagram = "https://www.instagram.com/nsbmnest/";
  await page.goto("/community/");
  await expect(page.locator("main").getByRole("link", { name: "Join on WhatsApp", exact: true })).toHaveAttribute("href", whatsapp);
  await expect(page.locator("main").getByRole("link", { name: "Follow on Instagram", exact: true })).toHaveAttribute("href", instagram);
  await prepareEnquiry(page);
  const draft = page.getByRole("link", { name: "Open email draft", exact: true });
  const draftUrl = new URL((await draft.getAttribute("href"))!);
  expect(draftUrl.protocol).toBe("mailto:");
  expect(draftUrl.pathname).toBe("nsbmnest@gmail.com");
  expect(draftUrl.searchParams.get("subject")).toBe(`NEST enquiry: ${enquiry.topic}`);
  expect(draftUrl.searchParams.get("body")).toBe(preparedMessage);
  await expect(page.locator("#contact").getByRole("link", { name: "Join on WhatsApp", exact: true })).toHaveAttribute("href", whatsapp);
  await expect(page.locator("footer").getByRole("link", { name: "nsbmnest@gmail.com", exact: true })).toHaveAttribute("href", "mailto:nsbmnest@gmail.com");
  await expect(page.locator("footer").getByRole("link", { name: "Join on WhatsApp", exact: true })).toHaveAttribute("href", whatsapp);
});

test("News section buttons move to their intended sections on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/news/");
  for (const [label, id] of [["Upcoming projects", "upcoming-projects"], ["NEST in action", "nest-in-action"], ["Latest updates", "latest-updates"]]) {
    const link = page.getByRole("navigation", { name: "News sections" }).getByRole("link", { name: label, exact: true });
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    const bounds = await link.boundingBox();
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(392);
});

for (const theme of ["light", "dark"]) {
  for (const width of [390, 1440]) {
    test(`site credits trap focus and close with Escape in ${theme} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(value => localStorage.setItem("nest-theme", value), theme);
      await page.goto("/news/");
      const trigger = page.getByRole("button", { name: "Site credits", exact: true });
      await trigger.focus();
      await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog", { name: "The people behind NEST LMS" });
      await expect(dialog).toBeVisible();
      await expect(dialog.locator("li")).toHaveText(["Sanuk Wanniarachchi", "Vidumini Gamage", "Dulen Dayarathna"]);
      await expect(dialog.getByRole("button", { name: "Close site credits" })).toBeFocused();
      await page.keyboard.press("Tab");
      // A native dialog with one control cycles through the browser's focus
      // boundary before returning; it must not focus the underlying page.
      expect(await page.evaluate(() => document.activeElement === document.body || Boolean(document.activeElement?.closest("dialog")))).toBe(true);
      await page.keyboard.press("Tab");
      await expect(dialog.getByRole("button", { name: "Close site credits" })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 2);
    });
  }
}

test("legacy announcements lead to the News hub with full poster and preserved galleries", async ({ page }) => {
  await page.goto("/announcements/");
  await expect(page).toHaveURL("/news/");
  await expect(page.getByRole("heading", { name: "Upcoming Projects", exact: true })).toBeVisible();
  const project = page.locator("#game-development-workshop");
  await expect(project).toContainText("Details to be announced");
  const poster = project.locator("img");
  await expect(poster).toBeVisible();
  await expect.poll(() => poster.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(await poster.evaluate(image => getComputedStyle(image).objectFit)).not.toBe("cover");
  const school = page.locator("#school-iot-workshop");
  await expect(school).toContainText("D.S. Senanayake College");
  for (const [id, count] of [["school-iot-workshop", 6], ["nsbm-open-day", 8]] as const) {
    const gallery = page.locator(`#${id}`);
    await gallery.locator("summary").click();
    await expect(gallery.locator(".event-gallery__grid img")).toHaveCount(count);
    await expect(gallery.locator("details")).toHaveAttribute("open", "");
  }
  await expect(page.locator('nav[aria-label="Main navigation"]')).not.toContainText("Announcements");
  await expect(page.locator('#latest-updates a[href^="/news/"]')).toHaveCount(3);
  await page.goto("/about/");
  await expect(page.locator(".profile-photo--mentor img")).toHaveAttribute("alt", "Mr. Supun Gajendrasinghe, Master-in-Charge of NEST Club");
});

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
