"use client";

import { MoonIcon, SunIcon } from "@/components/icons";

export function ThemeToggle() {
  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    window.localStorage.setItem("nest-theme", next);
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
