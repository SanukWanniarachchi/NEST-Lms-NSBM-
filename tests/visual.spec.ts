import { expect, test, type Page } from "@playwright/test";
import { getYouTubeVideoId } from "../lib/youtube";

type Viewport = {
  name: string;
  width: number;
  height: number;
};

const visualPages = [
  { name: "home", path: "/" },
  { name: "courses", path: "/courses/" },
  { name: "research", path: "/research/" },
  { name: "announcements", path: "/announcements/" },
  { name: "community", path: "/community/" },
  { name: "about", path: "/about/" },
  { name: "contact", path: "/contact/" },
  { name: "course-cybersecurity", path: "/courses/cybersecurity-foundations/" },
  { name: "lesson-cybersecurity", path: "/courses/cybersecurity-foundations/lessons/what-is-cybersecurity/" },
];

const layoutPages = [
  ...visualPages,
  { name: "course-networking", path: "/courses/networking-essentials/" },
  { name: "course-robotics", path: "/courses/robotics-fundamentals/" },
];

const screenshotViewports: Viewport[] = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const layoutViewports: Viewport[] = [
  ...screenshotViewports,
  { name: "tablet", width: 820, height: 1180 },
];

async function openPage(page: Page, path: string, theme: "light" | "dark", viewport: Viewport) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.addInitScript((selectedTheme) => {
    window.localStorage.setItem("nest-theme", selectedTheme);
  }, theme);
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

function watchRuntimeProblems(page: Page) {
  const problems: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`Console error: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`Page error: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() >= 400) problems.push(`HTTP ${response.status()}: ${response.url()}`);
  });

  return problems;
}

async function loadPageImages(page: Page) {
  await page.evaluate(async () => {
    for (const image of Array.from(document.images)) {
      image.loading = "eager";
    }

    const step = Math.max(320, Math.floor(window.innerHeight * 0.72));
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    for (let y = 0; y <= maxScroll; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 50));
    }

    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(120);
}

async function collectLayoutProblems(page: Page) {
  return page.evaluate(() => {
    const problems: string[] = [];
    const viewportWidth = window.innerWidth;
    const html = document.documentElement;

    if (html.scrollWidth > viewportWidth + 2) {
      problems.push(`Horizontal overflow: scrollWidth ${html.scrollWidth}, viewport ${viewportWidth}`);
    }

    for (const image of Array.from(document.images)) {
      const rect = image.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && (!image.complete || image.naturalWidth === 0)) {
        problems.push(`Broken image: ${image.currentSrc || image.src || image.alt}`);
      }
    }

    const selectors = [
      ".button",
      "button",
      ".text-link",
      ".desktop-nav a",
      ".more-menu > button",
      ".marquee-set span",
      ".category-pill",
    ];

    for (const element of Array.from(document.querySelectorAll<HTMLElement>(selectors.join(",")))) {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (style.visibility === "hidden" || style.display === "none" || rect.width < 1 || rect.height < 1) {
        continue;
      }

      if (element.scrollWidth > element.clientWidth + 2) {
        problems.push(`Text/content clipped horizontally in ${element.className || element.tagName}`);
      }

      if (element.scrollHeight > element.clientHeight + 2 && style.overflowY === "hidden") {
        problems.push(`Text/content clipped vertically in ${element.className || element.tagName}`);
      }
    }

    for (const button of Array.from(document.querySelectorAll<HTMLElement>(".button, button"))) {
      const rect = button.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && (rect.width < 30 || rect.height < 30)) {
        problems.push(`Touch target too small: ${button.textContent?.trim() || button.className}`);
      }
    }

    return problems;
  });
}

test.describe("visual snapshots", () => {
  for (const viewport of screenshotViewports) {
    for (const theme of ["light", "dark"] as const) {
      for (const item of visualPages) {
        test(`${item.name} ${theme} ${viewport.name}`, async ({ page }) => {
          await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
          await openPage(page, item.path, theme, viewport);
          await loadPageImages(page);
          await expect(page).toHaveScreenshot(`${item.name}-${theme}-${viewport.name}.png`, {
            animations: "disabled",
            fullPage: true,
          });
        });
      }
    }
  }
});

test.describe("layout and integration checks", () => {
  for (const viewport of layoutViewports) {
    for (const theme of ["light", "dark"] as const) {
      for (const item of layoutPages) {
        test(`${item.name} layout ${theme} ${viewport.name}`, async ({ page }) => {
          const runtimeProblems = watchRuntimeProblems(page);
          await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: theme });
          await openPage(page, item.path, theme, viewport);
          await loadPageImages(page);
          await expect.soft(page.locator("body")).toBeVisible();
          expect(await collectLayoutProblems(page)).toEqual([]);
          expect(runtimeProblems).toEqual([]);
        });
      }
    }
  }

  test("homepage marquees animate without layout or scroll instability", async ({ page }) => {
    const viewport = { name: "desktop", width: 1440, height: 900 };
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    await openPage(page, "/", "light", viewport);
    await loadPageImages(page);

    const before = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      pathHeight: document.querySelector(".marquee-track--paths")?.getBoundingClientRect().height ?? 0,
      technologyHeight: document.querySelector(".marquee-track--technologies")?.getBoundingClientRect().height ?? 0,
      pathTransform: getComputedStyle(document.querySelector(".marquee-track--paths") as Element).transform,
      technologyTransform: getComputedStyle(document.querySelector(".marquee-track--technologies") as Element).transform,
    }));

    await page.waitForTimeout(1400);

    const after = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      pathHeight: document.querySelector(".marquee-track--paths")?.getBoundingClientRect().height ?? 0,
      technologyHeight: document.querySelector(".marquee-track--technologies")?.getBoundingClientRect().height ?? 0,
      pathTransform: getComputedStyle(document.querySelector(".marquee-track--paths") as Element).transform,
      technologyTransform: getComputedStyle(document.querySelector(".marquee-track--technologies") as Element).transform,
    }));

    expect(before.scrollWidth).toBeLessThanOrEqual(before.viewport + 2);
    expect(after.scrollWidth).toBeLessThanOrEqual(after.viewport + 2);
    expect(after.pathHeight).toBeCloseTo(before.pathHeight, 0);
    expect(after.technologyHeight).toBeCloseTo(before.technologyHeight, 0);
    expect(after.pathTransform).not.toBe(before.pathTransform);
    expect(after.technologyTransform).not.toBe(before.technologyTransform);

    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(250);
    const scrolled = await page.evaluate(() => window.scrollY);
    await page.waitForTimeout(500);
    const settled = await page.evaluate(() => window.scrollY);
    expect(scrolled).toBeGreaterThan(300);
    expect(Math.abs(settled - scrolled)).toBeLessThan(2);
  });

  test("header buttons and theme toggle remain stable during hover and theme switch", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    await openPage(page, "/", "light", { name: "desktop", width: 1440, height: 900 });
    await loadPageImages(page);

    const community = page.getByRole("link", { name: "Join community" }).first();
    const before = await community.boundingBox();
    await community.hover();
    await page.waitForTimeout(850);
    const mid = await community.boundingBox();
    await page.waitForTimeout(950);
    const after = await community.boundingBox();

    expect(mid?.width).toBeCloseTo(before?.width ?? 0, 0);
    expect(mid?.height).toBeCloseTo(before?.height ?? 0, 0);
    expect(after?.width).toBeCloseTo(before?.width ?? 0, 0);
    expect(after?.height).toBeCloseTo(before?.height ?? 0, 0);

    await page.getByRole("button", { name: "Toggle light and dark theme" }).click();
    await page.waitForTimeout(650);
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("dark");
    expect(await collectLayoutProblems(page)).toEqual([]);
  });
});

test.describe("about leadership", () => {
  test("centres the Master-in-Charge above four board profiles per desktop row", async ({ page }) => {
    await openPage(page, "/about/", "light", { name: "desktop", width: 1440, height: 900 });
    await loadPageImages(page);

    const cards = page.locator(".board-profile");
    await expect(cards).toHaveCount(6);
    const boxes = await Promise.all(Array.from({ length: 6 }, (_, index) => cards.nth(index).boundingBox()));
    const firstRowTop = boxes[0]?.y ?? 0;

    for (const box of boxes.slice(0, 4)) expect(Math.abs((box?.y ?? 0) - firstRowTop)).toBeLessThanOrEqual(2);
    expect(boxes[4]?.y ?? 0).toBeGreaterThan(firstRowTop);

    const mentor = await page.locator(".mentor-profile").boundingBox();
    const container = await page.locator(".leadership-section .shell").boundingBox();
    expect(mentor).not.toBeNull();
    expect(container).not.toBeNull();
    expect(Math.abs(
      ((mentor?.x ?? 0) + (mentor?.width ?? 0) / 2) -
      ((container?.x ?? 0) + (container?.width ?? 0) / 2),
    )).toBeLessThanOrEqual(2);
    expect(await collectLayoutProblems(page)).toEqual([]);
  });
});

test.describe("lesson videos", () => {
  test("accepts common YouTube URL formats and rejects unrelated URLs", () => {
    const id = "keeqnciDVOo";

    expect(getYouTubeVideoId(`https://www.youtube.com/watch?v=${id}`)).toBe(id);
    expect(getYouTubeVideoId(`https://youtu.be/${id}`)).toBe(id);
    expect(getYouTubeVideoId(`https://www.youtube.com/shorts/${id}`)).toBe(id);
    expect(getYouTubeVideoId(`https://www.youtube-nocookie.com/embed/${id}`)).toBe(id);
    expect(getYouTubeVideoId("https://example.com/watch?v=keeqnciDVOo")).toBeNull();
    expect(getYouTubeVideoId("not-a-valid-video-id")).toBeNull();
  });

  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    test(`expands a stable responsive player on ${viewport.name}`, async ({ page }) => {
      await page.route("https://www.youtube-nocookie.com/**", (route) => route.fulfill({
        contentType: "text/html",
        body: "<!doctype html><title>YouTube test player</title>",
      }));
      await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
      await openPage(page, "/courses/networking-essentials/", "light", viewport);

      const trigger = page.getByRole("button", { name: /Watch What is Networking\? video/ });
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");

      const shell = page.locator(".lesson-video-shell");
      await expect(shell).toBeVisible();
      const box = await shell.boundingBox();
      expect(box).not.toBeNull();
      expect((box?.width ?? 0) / (box?.height ?? 1)).toBeCloseTo(16 / 9, 1);
      expect(await collectLayoutProblems(page)).toEqual([]);

      const iframe = shell.locator("iframe");
      await expect(iframe).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/keeqnciDVOo/);
      await expect(iframe).toHaveCount(1);
      await expect(page.getByRole("link", { name: "Open on YouTube" })).toHaveAttribute("href", "https://www.youtube.com/watch?v=keeqnciDVOo");
    });
  }

  test("lesson page defers the iframe until the learner requests it", async ({ page }) => {
    await page.route("https://www.youtube-nocookie.com/**", (route) => route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><title>YouTube test player</title>",
    }));
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
    await openPage(
      page,
      "/courses/networking-essentials/lessons/what-is-networking/",
      "dark",
      { name: "desktop", width: 1440, height: 900 },
    );

    const frame = page.locator(".video-frame");
    await expect(frame.locator("iframe")).toHaveCount(0);
    await page.getByRole("button", { name: "Load video player for What is Networking?" }).click();
    await expect(frame.locator("iframe")).toHaveCount(1);
    expect(await collectLayoutProblems(page)).toEqual([]);
  });
});
