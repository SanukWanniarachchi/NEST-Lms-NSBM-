import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  for (const theme of ["light", "dark"]) {
    test(`silk cascade finishes before the continuous colour sweep at ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.addInitScript(value => localStorage.setItem("nest-theme", value), theme);
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Learn together. Build what's next.", exact: true })).toBeVisible();
      const motion = await page.locator(".hero-heading").evaluate(heading => {
        const animations = heading.getAnimations({ subtree: true });
        const entrances = animations.filter(animation => (animation as CSSAnimation).animationName === "hero-silk-cascade");
        const sweeps = animations.filter(animation => (animation as CSSAnimation).animationName === "hero-colour-sweep");
        const accent = heading.querySelector(".hero-heading__letter--accent")!;
        const lastFinish = Math.max(...entrances.map(animation => Number(animation.effect!.getTiming().delay) + Number(animation.effect!.getTiming().duration)));
        const firstSweep = sweeps[0].effect!.getTiming();
        animations.forEach(animation => { animation.pause(); animation.currentTime = 0; });
        const before = getComputedStyle(accent).backgroundPosition;
        const firstWord = heading.querySelector(".hero-heading__word")!;
        const initialOpacity = getComputedStyle(firstWord).opacity;
        const initialTransform = getComputedStyle(firstWord).transform;
        animations.forEach(animation => { animation.currentTime = Number(firstSweep.delay) + 4000; });
        const halfway = getComputedStyle(accent).backgroundPosition;
        const settled = Array.from(heading.querySelectorAll(".hero-heading__word")).every(word => getComputedStyle(word).transform === "none" && getComputedStyle(word).opacity === "1");
        animations.forEach(animation => { animation.currentTime = Number(firstSweep.delay) + 12000; });
        const nextCycle = getComputedStyle(accent).backgroundPosition;
        return { initialOpacity, initialTransform, entrances: entrances.length, sweeps: sweeps.length, accentLetters: heading.querySelectorAll(".hero-heading__letter--accent").length, words: heading.querySelectorAll(".hero-heading__word").length, entranceDuration: entrances[0].effect!.getTiming().duration, lastFinish, sweepDelay: Number(firstSweep.delay), iterations: firstSweep.iterations === Infinity, duration: firstSweep.duration, before, halfway, nextCycle, settled, firstLineSweeps: Array.from(heading.querySelectorAll(".hero-heading__phrase"))[0].getAnimations({ subtree: true }).filter(animation => (animation as CSSAnimation).animationName === "hero-colour-sweep").length };
      });
      expect(motion.entrances).toBe(motion.words);
      expect(motion.entranceDuration).toBe(1800);
      expect(motion.initialOpacity).toBe("0");
      expect(motion.initialTransform).not.toBe("none");
      expect(motion.sweeps).toBe(motion.accentLetters);
      expect(motion.sweepDelay - motion.lastFinish).toBe(350);
      expect(motion.duration).toBe(8000);
      expect(motion.iterations).toBe(true);
      expect(motion.halfway).not.toBe(motion.before);
      expect(motion.nextCycle).toBe(motion.halfway);
      expect(motion.settled).toBe(true);
      expect(motion.firstLineSweeps).toBe(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 2);

      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect.poll(() => page.locator(".hero-heading").evaluate(heading => heading.getAnimations({ subtree: true }).length)).toBe(0);
      await expect(page.locator(".hero-heading__letter").first()).toHaveCSS("opacity", "1");
      await expect(page.locator(".hero-heading__word").first()).toHaveCSS("opacity", "1");
      await expect(page.locator(".hero-heading__word").first()).toHaveCSS("transform", "none");
    });
  }
}
