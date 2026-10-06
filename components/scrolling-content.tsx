"use client";

import { useState, type ReactNode } from "react";

export function ScrollingContent({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  return <div className="scrolling-content" data-paused={paused}>
    <button type="button" className="scrolling-content__control" aria-pressed={paused} aria-controls="scrolling-strips" onClick={() => setPaused(value => !value)}>
      {paused ? "Resume scrolling text" : "Pause scrolling text"}
    </button>
    <div id="scrolling-strips">{children}</div>
  </div>;
}
