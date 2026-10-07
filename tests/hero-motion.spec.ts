import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  for (const theme of ["light", "dark"]) {
    test(`soft focus settles into readable static text at ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.addInitScript(value => localStorage.setItem("nest-theme", value), theme);
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Learn together. Build what's next.", exact: true })).toBeVisible();
      const motion = await page.locator(".hero-heading").evaluate(heading => {
        const animations = heading.getAnimations({ subtree: true });
        const entrances = animations.filter(animation => (animation as CSSAnimation).animationName === "hero-soft-focus");
        const firstWord = heading.querySelector(".hero-heading__word")!;
        const words = Array.from(heading.querySelectorAll(".hero-heading__word"));
        const lastFinish = Math.max(...entrances.map(animation => Number(animation.effect!.getTiming().delay) + Number(animation.effect!.getTiming().duration)));
        const timing = entrances.map(animation => animation.effect!.getTiming());
        animations.forEach(animation => { animation.pause(); animation.currentTime = 0; });
        const initial = { opacity: getComputedStyle(firstWord).opacity, filter: getComputedStyle(firstWord).filter, transform: getComputedStyle(firstWord).transform };
        animations.forEach(animation => { animation.currentTime = lastFinish + 1; });
        const settled = words.every(word => {
          const style = getComputedStyle(word);
          return style.transform === "none" && style.opacity === "1" && style.filter === "none";
        });
        return { animations: animations.length, entrances: entrances.length, words: words.length, initial, settled, finite: timing.every(value => value.iterations === 1), lastFinish };
      });
      expect(motion.entrances).toBe(motion.words);
      expect(motion.animations).toBe(motion.entrances);
      expect(motion.finite).toBe(true);
      expect(motion.initial.opacity).toBe("0");
      expect(motion.initial.filter).toBe("blur(12px)");
      expect(motion.initial.transform).not.toBe("none");
      expect(motion.settled).toBe(true);
      expect(motion.lastFinish).toBeLessThan(1500);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 2);

      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect.poll(() => page.locator(".hero-heading").evaluate(heading => heading.getAnimations({ subtree: true }).length)).toBe(0);
      await expect(page.locator(".hero-heading__word").first()).toHaveCSS("opacity", "1");
      await expect(page.locator(".hero-heading__word").first()).toHaveCSS("transform", "none");
      await expect(page.locator(".hero-heading__word").first()).toHaveCSS("filter", "none");
    });
  }
}
