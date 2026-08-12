"use client";

import type { MouseEvent } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";

export function ThemeToggle() {
  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    window.localStorage.setItem("nest-theme", next);

    if (
      typeof event.currentTarget.animate === "function"
      && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      event.currentTarget.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(.94) rotate(-2deg)" },
          { transform: "scale(1) rotate(0deg)" },
        ],
        { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
    }
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle light and dark theme">
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__sun"><SunIcon /></span>
        <span className="theme-toggle__moon"><MoonIcon /></span>
        <span className="theme-toggle__thumb" />
      </span>
    </button>
  );
}
