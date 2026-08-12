import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import type { Course } from "@/types/lms";

export function CurriculumAccordion({ course }: { course: Course }) {
  return <div className="module-list">
    {course.modules.map((module, moduleIndex) => <details className="module-card" key={module.id} open={moduleIndex === 0}>
      <summary className="module-card__header">
        <span>{String(moduleIndex + 1).padStart(2, "0")}</span>
        <div><h3>{module.title}</h3><p>{module.description}</p></div>
        <small>{module.lessons.length} lessons</small>
        <i aria-hidden="true" />
      </summary>
      <div className="module-card__panel"><div className="lesson-list">
        {module.lessons.map((lesson, lessonIndex) => <Link href={`/courses/${course.slug}/lessons/${lesson.slug}`} key={lesson.slug}><span className="lesson-status">{lessonIndex + 1}</span><span><strong>{lesson.title}</strong><small>{lesson.description}</small></span><span className="lesson-duration">{lesson.duration}<ArrowRightIcon /></span></Link>)}
      </div></div>
    </details>)}
  </div>;
}
