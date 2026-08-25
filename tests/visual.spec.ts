import { expect, test, type Page } from "@playwright/test";

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
  { name: "login", path: "/login/" },
  { name: "course-cybersecurity", path: "/courses/cybersecurity-foundations/" },
  { name: "lesson-cybersecurity", path: "/courses/cybersecurity-foundations/lessons/what-is-cybersecurity/" },
];

const layoutPages = [
  ...visualPages,
  { name: "dashboard", path: "/dashboard/" },
  { name: "admin", path: "/admin/" },
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
    document.documentElement.dataset.theme = selectedTheme;
    document.documentElement.style.colorScheme = selectedTheme;
  }, theme);
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
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
    for (const item of visualPages) {
      test(`${item.name} light ${viewport.name}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
        await openPage(page, item.path, "light", viewport);
        await loadPageImages(page);
        await expect(page).toHaveScreenshot(`${item.name}-light-${viewport.name}.png`, {
          animations: "disabled",
          fullPage: true,
        });
      });
    }
  }

  for (const item of [
    { name: "home", path: "/" },
    { name: "community", path: "/community/" },
    { name: "login", path: "/login/" },
  ]) {
    test(`${item.name} dark desktop`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
      await openPage(page, item.path, "dark", screenshotViewports[0]);
      await loadPageImages(page);
      await expect(page).toHaveScreenshot(`${item.name}-dark-desktop.png`, {
        animations: "disabled",
        fullPage: true,
      });
    });
  }
});

test.describe("layout and integration checks", () => {
  for (const viewport of layoutViewports) {
    for (const theme of ["light", "dark"] as const) {
      for (const item of layoutPages) {
        test(`${item.name} layout ${theme} ${viewport.name}`, async ({ page }) => {
          await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: theme });
          await openPage(page, item.path, theme, viewport);
          await loadPageImages(page);
          await expect.soft(page.locator("body")).toBeVisible();
          expect(await collectLayoutProblems(page)).toEqual([]);
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
      valueHeight: document.querySelector(".marquee-track--values")?.getBoundingClientRect().height ?? 0,
      pathTransform: getComputedStyle(document.querySelector(".marquee-track--paths") as Element).transform,
      valueTransform: getComputedStyle(document.querySelector(".marquee-track--values") as Element).transform,
    }));

    await page.waitForTimeout(1400);

    const after = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      pathHeight: document.querySelector(".marquee-track--paths")?.getBoundingClientRect().height ?? 0,
      valueHeight: document.querySelector(".marquee-track--values")?.getBoundingClientRect().height ?? 0,
      pathTransform: getComputedStyle(document.querySelector(".marquee-track--paths") as Element).transform,
      valueTransform: getComputedStyle(document.querySelector(".marquee-track--values") as Element).transform,
    }));

    expect(before.scrollWidth).toBeLessThanOrEqual(before.viewport + 2);
    expect(after.scrollWidth).toBeLessThanOrEqual(after.viewport + 2);
    expect(after.pathHeight).toBeCloseTo(before.pathHeight, 0);
    expect(after.valueHeight).toBeCloseTo(before.valueHeight, 0);
    expect(after.pathTransform).not.toBe(before.pathTransform);
    expect(after.valueTransform).not.toBe(before.valueTransform);

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

    const login = page.getByRole("link", { name: "Student login" }).first();
    const before = await login.boundingBox();
    await login.hover();
    await page.waitForTimeout(850);
    const mid = await login.boundingBox();
    await page.waitForTimeout(950);
    const after = await login.boundingBox();

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
