"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const sync = () => setDark(document.documentElement.dataset.theme === "dark");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    setDark(next === "dark");
    try { window.localStorage.setItem("nest-theme", next); } catch { /* Theme still works when storage is unavailable. */ }
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle light and dark theme" aria-pressed={dark} title={dark ? "Switch to light theme" : "Switch to dark theme"}>
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__sky" />
        <span className="theme-toggle__atmosphere" />
        <span className="theme-toggle__clouds">
          <svg viewBox="0 0 72 30" fill="none" focusable="false">
            <path fill="#a5d2fa" d="M15 30c0-4 5-7 9-4 1-7 9-8 13-3 2-6 10-8 15-3-2-7 2-12 7-12-2-6 4-12 13-10v32Z" />
            <path fill="#f5fcff" d="M22 30c1-4 5-5 8-2 1-5 8-7 12-2 2-6 10-5 13-1-1-6 3-11 9-11-1-7 2-12 8-14v30Z" />
          </svg>
        </span>
        <span className="theme-toggle__stars">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className="theme-toggle__thumb">
          <span className="theme-toggle__moon-mark" />
        </span>
      </span>
    </button>
  );
}
