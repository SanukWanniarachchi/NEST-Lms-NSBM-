"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CourseCard } from "@/components/course-card";
import { ArrowRightIcon } from "@/components/icons";
import { courses, totalLessons } from "@/data/courses";
import type { CourseCategory } from "@/types/lms";

type CategoryFilter = "All courses" | CourseCategory;

const categories: CategoryFilter[] = ["All courses", "Cybersecurity", "Networking", "Robotics"];

export function CatalogueExplorer() {
  const [category, setCategory] = useState<CategoryFilter>("All courses");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => courses.map((course) => {
    const lessonMatches = course.modules.flatMap((module) => module.lessons.map((lesson) => ({ lesson, module }))).filter(({ lesson, module }) =>
      `${lesson.title} ${lesson.description} ${module.title}`.toLowerCase().includes(normalizedQuery),
    );
    const courseMatches = `${course.title} ${course.description} ${course.category} ${course.outcomes.join(" ")}`.toLowerCase().includes(normalizedQuery);
    const categoryMatches = category === "All courses" || course.category === category;
    return { course, lessonMatches, visible: categoryMatches && (!normalizedQuery || courseMatches || lessonMatches.length > 0) };
  }).filter((result) => result.visible), [category, normalizedQuery]);

  return <>
    <div className="catalogue-controls">
      <div className="filter-pills" aria-label="Filter courses by subject">
        {categories.map((item) => <button type="button" key={item} className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <label className="catalogue-search">
        <span>Search all {totalLessons} lessons</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Try “phishing”, “DNS”, or “PWM”" />
      </label>
    </div>

    <p className="results-count" aria-live="polite">{results.length === 1 ? "1 learning path" : `${results.length} learning paths`} shown</p>
    {results.length ? <div className="course-grid">
      {results.map(({ course, lessonMatches }) => <div className="catalogue-result" key={course.slug}>
        <CourseCard course={course} />
        {normalizedQuery && lessonMatches.length > 0 ? <div className="lesson-matches">
          <strong>{lessonMatches.length} matching {lessonMatches.length === 1 ? "lesson" : "lessons"}</strong>
          {lessonMatches.slice(0, 4).map(({ lesson, module }) => <Link href={`/courses/${course.slug}/lessons/${lesson.slug}`} key={lesson.slug}><span><small>{module.title}</small>{lesson.title}</span><ArrowRightIcon /></Link>)}
        </div> : null}
      </div>)}
    </div> : <div className="catalogue-empty"><strong>No matching lessons yet.</strong><p>Try a broader topic or choose another learning path.</p><button type="button" className="text-link" onClick={() => { setCategory("All courses"); setQuery(""); }}>Clear filters</button></div>}
  </>;
}
