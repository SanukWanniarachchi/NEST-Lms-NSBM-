"use client";

import { useState } from "react";

export function ClearLearningData() {
  const [message, setMessage] = useState("");
  function clearProgress() {
    try {
      localStorage.removeItem("nest-module-quiz-results-v1");
      localStorage.removeItem("nest-module-completions-v1");
      setMessage("Saved checkpoint results and completions have been cleared from this browser. Your theme preference is unchanged.");
    } catch {
      setMessage("Your browser did not allow us to clear all saved progress. You can clear this website’s site data in your browser settings.");
    }
  }
  return <div><button type="button" className="button button--secondary" onClick={clearProgress}>Clear saved learning progress</button><p role="status">{message}</p></div>;
}
