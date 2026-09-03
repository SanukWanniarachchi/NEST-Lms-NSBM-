"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRightIcon, CheckIcon, CloseIcon } from "@/components/icons";
import type { FollowUpCourse } from "@/data/follow-up-courses";

type ModuleCompletionPromptProps = {
  courseSlug: string;
  moduleId: string;
  moduleTitle: string;
  recommendations: FollowUpCourse[];
};

const progressKey = "nest-module-completions-v1";

function readCompletions() {
  try {
    const value = JSON.parse(window.localStorage.getItem(progressKey) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function ModuleCompletionPrompt({ courseSlug, moduleId, moduleTitle, recommendations }: ModuleCompletionPromptProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const completionId = `${courseSlug}/${moduleId}`;
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCompleted(readCompletions().includes(completionId));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [completionId]);

  function showRecommendations() {
    const completions = readCompletions();
    if (!completions.includes(completionId)) {
      window.localStorage.setItem(progressKey, JSON.stringify([...completions, completionId]));
      setCompleted(true);
    }
    dialogRef.current?.showModal();
  }

  return <section className="module-completion" aria-labelledby={`${titleId}-section`}>
    <div><p className="eyebrow">End of module</p><h2 id={`${titleId}-section`}>{completed ? `${moduleTitle} completed` : `Finished ${moduleTitle}?`}</h2><p>NEST does not issue a certificate for this module. Complete it when you are ready, then explore university courses with their own credential options.</p></div>
    <button type="button" className="button button--primary" onClick={showRecommendations}>{completed ? "View certificate courses" : "Complete module"}<ArrowRightIcon /></button>

    <dialog className="course-recommendations" ref={dialogRef} aria-labelledby={titleId}>
      <div className="course-recommendations__header"><div><p className="eyebrow">Continue your learning</p><h2 id={titleId}>{moduleTitle} complete</h2><p>These independent university courses offer free or paid credential routes.</p></div><form method="dialog"><button type="submit" className="icon-button" aria-label="Close course suggestions"><CloseIcon /></button></form></div>
      <div className="course-recommendations__list">{recommendations.map((course) => <article className="course-recommendation" key={course.id}>
        <div className="course-recommendation__top"><span className={`course-access course-access--${course.access === "Free certificate" ? "free" : course.access === "Free access, paid certificate" ? "mixed" : "paid"}`}>{course.access}</span><small>Verified {course.verifiedOn}</small></div>
        <p className="eyebrow">{course.university} · {course.platform}</p>
        <h3>{course.title}</h3>
        <p>{course.fit}</p>
        <dl><div><dt>Level</dt><dd>{course.level}</dd></div><div><dt>Study time</dt><dd>{course.duration}</dd></div><div><dt>Credential</dt><dd>{course.credential}</dd></div></dl>
        <div className="course-registration"><strong>How to register</strong><p>{course.registration}</p>{course.financialAid ? <span><CheckIcon /> Financial aid may be available</span> : null}</div>
        <a href={course.href} target="_blank" rel="noopener noreferrer" className="button button--secondary">View course and registration <ArrowRightIcon /></a>
      </article>)}</div>
      <div className="course-recommendations__note"><strong>Independent certificates</strong><p>NEST does not issue or validate these certificates. Availability, fees, eligibility, and certificate terms are controlled by each university or learning platform and may change.</p></div>
      <form method="dialog" className="course-recommendations__footer"><button type="submit" className="button button--primary">Done</button></form>
    </dialog>
  </section>;
}
