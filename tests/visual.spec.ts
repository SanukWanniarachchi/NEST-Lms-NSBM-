import { expect, test, type Page } from "@playwright/test";
import { getModuleRecommendations, getRecommendationMappings } from "../data/follow-up-courses";
import { getModuleQuiz, moduleQuizzes } from "../data/module-quizzes";
import { getYouTubeVideoId } from "../lib/youtube";

type Viewport = {
  name: string;
  width: number;
  height: number;
};

const visualPages = [
  { name: "home", path: "/" },
  { name: "courses", path: "/courses/" },
  { name: "news", path: "/news/" },
  { name: "community", path: "/community/" },
  { name: "about", path: "/about/" },
  { name: "contact", path: "/contact/" },
  { name: "course-cybersecurity", path: "/courses/cybersecurity-foundations/" },
  { name: "lesson-cybersecurity", path: "/courses/cybersecurity-foundations/lessons/what-is-cybersecurity/" },
  { name: "module-end-cybersecurity", path: "/courses/cybersecurity-foundations/lessons/cia-triad/" },
  { name: "checkpoint-cybersecurity", path: "/courses/cybersecurity-foundations/checkpoints/introduction-to-cybersecurity/" },
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

  test("course text stays readable during a mobile theme switch", async ({ page }) => {
    await openPage(page, "/courses/cybersecurity-foundations/", "dark", { name: "mobile", width: 390, height: 844 });
    await page.getByRole("button", { name: "Toggle light and dark theme" }).click();

    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("light");
    expect(await page.locator(".course-hero h1").evaluate((element) => getComputedStyle(element).color)).toBe("rgb(23, 32, 51)");
    expect(await page.locator(".course-hero .button--secondary").evaluate((element) => getComputedStyle(element).color)).toBe("rgb(23, 32, 51)");
  });
});

test.describe("about leadership", () => {
  test("centres the Master-in-Charge above four board profiles per desktop row", async ({ page }) => {
    await openPage(page, "/about/", "light", { name: "desktop", width: 1440, height: 900 });
    await loadPageImages(page);

    const cards = page.locator(".board-profile");
    await expect(cards).toHaveCount(11);
    await expect(cards.locator("img")).toHaveCount(11);
    // Measure every card in one frame; smooth scrolling can move the viewport
    // between separate boundingBox calls even when the rows are aligned.
    const boxes = await cards.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
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

test.describe("event photo galleries", () => {
  for (const viewport of screenshotViewports) {
    test(`opens the school and Open Day galleries on ${viewport.name}`, async ({ page }) => {
      const runtimeProblems = watchRuntimeProblems(page);
      await openPage(page, "/news/", "light", viewport);
      const school = page.locator("#school-iot-workshop");
      const openDay = page.locator("#nsbm-open-day");
      await expect(school).toContainText("Grade 6");
      await expect(school.locator("time")).toHaveCount(0);
      await expect(openDay.locator("time")).toHaveCount(0);
      for (const event of [school, openDay]) {
        await event.locator("summary").focus();
        await page.keyboard.press("Enter");
        await expect(event.locator("details")).toHaveAttribute("open", "");
      }
      await expect(school.locator(".event-gallery__grid img")).toHaveCount(6);
      await expect(openDay.locator(".event-gallery__grid img")).toHaveCount(8);
      await loadPageImages(page);
      expect(await collectLayoutProblems(page)).toEqual([]);
      expect(runtimeProblems).toEqual([]);
    });
  }
});

test.describe("lesson videos", () => {
  test("accepts common YouTube URL formats and rejects unrelated URLs", () => {
    const id = "4j9becKu17g";

    expect(getYouTubeVideoId(`https://www.youtube.com/watch?v=${id}`)).toBe(id);
    expect(getYouTubeVideoId(`https://youtu.be/${id}`)).toBe(id);
    expect(getYouTubeVideoId(`https://www.youtube.com/shorts/${id}`)).toBe(id);
    expect(getYouTubeVideoId(`https://www.youtube-nocookie.com/embed/${id}`)).toBe(id);
    expect(getYouTubeVideoId("https://example.com/watch?v=4j9becKu17g")).toBeNull();
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
      await openPage(page, "/courses/cybersecurity-foundations/", "light", viewport);

      const trigger = page.getByRole("button", { name: /Watch What is Cybersecurity\? video/ });
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");

      const shell = page.locator(".lesson-video-shell");
      await expect(shell).toBeVisible();
      const box = await shell.boundingBox();
      expect(box).not.toBeNull();
      expect((box?.width ?? 0) / (box?.height ?? 1)).toBeCloseTo(9 / 16, 1);
      expect(await collectLayoutProblems(page)).toEqual([]);

      const iframe = shell.locator("iframe");
      await expect(iframe).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/9KznFRU5B5g/);
      await expect(iframe).toHaveCount(1);
      await expect(page.getByRole("link", { name: "Open on YouTube" })).toHaveAttribute("href", "https://www.youtube.com/watch?v=9KznFRU5B5g");
    });
  }

  for (const lesson of [
    { slug: "what-is-cybersecurity", title: "What is Cybersecurity?", videoId: "9KznFRU5B5g" },
    { slug: "password-attacks", title: "Password Attacks", videoId: "ZCgnDYWSn9o" },
    { slug: "man-in-the-middle", title: "Man-in-the-Middle Attacks", videoId: "WF25kx-DyHo" },
  ]) {
    test(`${lesson.slug} defers and loads its matching video`, async ({ page }) => {
      await page.route("https://www.youtube-nocookie.com/**", (route) => route.fulfill({
        contentType: "text/html",
        body: "<!doctype html><title>YouTube test player</title>",
      }));
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
      await openPage(
        page,
        `/courses/cybersecurity-foundations/lessons/${lesson.slug}/`,
        "dark",
        { name: "desktop", width: 1440, height: 900 },
      );

      const frame = page.locator(".video-frame");
      await expect(frame.locator("iframe")).toHaveCount(0);
      const box = await frame.boundingBox();
      expect(box).not.toBeNull();
      expect((box?.width ?? 0) / (box?.height ?? 1)).toBeCloseTo(9 / 16, 1);
      await page.getByRole("button", { name: `Load video player for ${lesson.title}` }).click();
      await expect(frame.locator("iframe")).toHaveCount(1);
      await expect(frame.locator("iframe")).toHaveAttribute("src", `https://www.youtube-nocookie.com/embed/${lesson.videoId}?rel=0`);
      expect(await collectLayoutProblems(page)).toEqual([]);
    });
  }
});

test.describe("module checkpoints and recommendations", () => {
  const expectedModules = [
    "cybersecurity-foundations/introduction-to-cybersecurity",
    "cybersecurity-foundations/common-attacks",
    "cybersecurity-foundations/authentication-password-security",
    "cybersecurity-foundations/network-security-basics",
    "cybersecurity-foundations/safe-practices",
    "networking-essentials/introduction-to-networking",
    "networking-essentials/network-fundamentals",
    "networking-essentials/network-security-basics",
    "networking-essentials/internet-communication",
    "networking-essentials/practical-networking",
    "robotics-fundamentals/introduction-to-robotics",
    "robotics-fundamentals/electronics-basics",
    "robotics-fundamentals/microcontrollers",
    "robotics-fundamentals/motion-control",
    "robotics-fundamentals/smart-robotics-iot",
  ];

  test("covers every module with accountable questions and three current course links", () => {
    const mappings = getRecommendationMappings();
    expect(Object.keys(mappings).sort()).toEqual(expectedModules.sort());
    expect(moduleQuizzes.map((quiz) => quiz.id).sort()).toEqual(expectedModules.sort());

    for (const moduleKey of expectedModules) {
      const [courseSlug, moduleId] = moduleKey.split("/");
      const recommendations = getModuleRecommendations(courseSlug, moduleId);
      const quiz = getModuleQuiz(courseSlug, moduleId);
      expect(quiz, moduleKey).toBeDefined();
      expect(quiz?.questions).toHaveLength(3);
      expect(quiz?.passingScore).toBe(2);
      expect(new Set(quiz?.questions.map((question) => question.id)).size).toBe(3);
      for (const question of quiz?.questions ?? []) {
        expect(question.choices).toContain(question.correctAnswer);
        expect(new Set(question.choices).size).toBe(question.choices.length);
        expect(question.explanation.length).toBeGreaterThan(30);
        expect(question.source.href).toMatch(/^https:\/\//);
        expect(question.source.publisher.length).toBeGreaterThan(3);
        expect(question.source.section.length).toBeGreaterThan(8);
        expect(question.source.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
      expect(recommendations, moduleKey).toHaveLength(3);
      expect(new Set(recommendations.map((item) => item.id)).size).toBe(3);
      for (const recommendation of recommendations) {
        expect(recommendation.href).toMatch(/^https:\/\//);
        expect(recommendation.registration.length).toBeGreaterThan(30);
        expect(recommendation.credential.length).toBeGreaterThan(20);
        expect(recommendation.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  for (const viewport of [
    { name: "desktop-16-10", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    test(`passes, explains, and remembers a checkpoint on ${viewport.name}`, async ({ page }) => {
      await openPage(page, "/courses/cybersecurity-foundations/checkpoints/introduction-to-cybersecurity/", "light", viewport);
      await page.getByRole("button", { name: "Start checkpoint" }).click();

      const answers: Record<string, string> = {
        "Which security objective is affected when authorised users cannot access a university system when needed?": "Availability",
        "Which security objective protects information from unauthorised disclosure?": "Confidentiality",
        "Which security objective is affected when records are changed without authorisation?": "Integrity",
      };
      for (let index = 0; index < 3; index += 1) {
        const prompt = (await page.locator(".quiz-question h1").textContent()) ?? "";
        await page.locator(".quiz-choice").filter({ hasText: answers[prompt] }).click();
        await expect(page.locator(".quiz-feedback.correct")).toBeVisible();
        await expect(page.locator(".quiz-feedback a")).toHaveAttribute("href", /^https:\/\//);
        await page.getByRole("button", { name: index === 2 ? "View results" : "Next question" }).click();
      }

      await expect(page.locator(".quiz-result-mark")).toContainText("3/3");
      await expect(page.locator(".course-recommendation")).toHaveCount(3);
      await expect(page.getByRole("link", { name: /View official course/ })).toHaveCount(3);
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, 0);
      });
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      expect(await collectLayoutProblems(page)).toEqual([]);
      await expect(page.locator(".checkpoint-shell")).toHaveScreenshot(`checkpoint-result-light-${viewport.name}.png`, { animations: "disabled" });
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem("nest-module-completions-v1") ?? "[]"))).toContain("cybersecurity-foundations/introduction-to-cybersecurity");
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem("nest-module-quiz-results-v1") ?? "{}")["cybersecurity-foundations/introduction-to-cybersecurity"].passed)).toBe(true);
      await page.reload();
      await expect(page.locator(".quiz-previous")).toContainText("3/3");
    });
  }

  test("links only the final lesson to its module checkpoint", async ({ page }) => {
    await openPage(page, "/courses/cybersecurity-foundations/lessons/cia-triad/", "light", { name: "desktop", width: 1440, height: 900 });
    await expect(page.getByRole("link", { name: "Start checkpoint" })).toHaveAttribute("href", "/courses/cybersecurity-foundations/checkpoints/introduction-to-cybersecurity/");
    await openPage(page, "/courses/cybersecurity-foundations/lessons/what-is-cybersecurity/", "light", { name: "desktop", width: 1440, height: 900 });
    await expect(page.getByRole("link", { name: "Start checkpoint" })).toHaveCount(0);
  });

  test("keeps recommendations hidden when the learner does not pass", async ({ page }) => {
    await openPage(page, "/courses/networking-essentials/checkpoints/network-fundamentals/", "light", { name: "desktop", width: 1440, height: 900 });
    await page.getByRole("button", { name: "Start checkpoint" }).click();
    for (let index = 0; index < 3; index += 1) {
      const prompt = await page.locator(".quiz-question h1").textContent();
      const correct = getModuleQuiz("networking-essentials", "network-fundamentals")?.questions.find((question) => question.prompt === prompt)?.correctAnswer;
      const wrongChoice = page.locator(".quiz-choice").filter({ hasNotText: correct ?? "" }).first();
      await wrongChoice.click();
      await page.getByRole("button", { name: index === 2 ? "View results" : "Next question" }).click();
    }
    await expect(page.locator(".quiz-result-mark")).toContainText("0/3");
    await expect(page.locator(".checkpoint-recommendations")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Retry checkpoint" })).toBeVisible();
  });

  test("does not show checkpoint controls before the final lesson", async ({ page }) => {
    await openPage(page, "/courses/cybersecurity-foundations/lessons/what-is-cybersecurity/", "light", { name: "desktop", width: 1440, height: 900 });
    await expect(page.getByRole("link", { name: "Start checkpoint" })).toHaveCount(0);
  });
});
