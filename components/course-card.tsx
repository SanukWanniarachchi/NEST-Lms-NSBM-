import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/types/lms";
import { ArrowRightIcon, BookIcon, ClockIcon } from "@/components/icons";

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className={`course-card accent-${course.accent}`}>
      <Link href={`/courses/${course.slug}`} className="course-card__image" aria-label={`View ${course.title}`}>
        <Image src={course.image} alt={course.imageAlt} sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" />
        <span className="category-pill">{course.category}</span>
      </Link>
      <div className="course-card__body">
        <p className="eyebrow">{course.eyebrow}</p>
        <h3><Link href={`/courses/${course.slug}`}>{course.shortTitle}</Link></h3>
        <p>{course.description}</p>
        <div className="course-meta">
          <span><BookIcon /> {course.lessonCount} lessons</span>
          <span><ClockIcon /> {course.duration}</span>
        </div>
        <div className="course-card__footer">
          <div className="avatar" aria-hidden="true">{course.instructor.initials}</div>
          <span>{course.instructor.name}</span>
          <Link href={`/courses/${course.slug}`} aria-label={`Explore ${course.shortTitle}`}><ArrowRightIcon /></Link>
        </div>
      </div>
    </article>
  );
}
