import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRightIcon, BookIcon, CheckIcon, ClockIcon, PlayIcon } from "@/components/icons";
import { courses, getCourse } from "@/data/courses";

export const dynamicParams = false;
export function generateStaticParams() { return courses.map((course) => ({ slug: course.slug })); }

type CoursePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  return course ? { title: course.shortTitle, description: course.description } : {};
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  const firstLesson = course.modules[0].lessons[0];

  return <><SiteHeader /><main>
    <section className={`course-hero accent-${course.accent}`}><div className="shell course-hero__grid"><div><div className="crumbs"><Link href="/courses">Courses</Link><span>/</span><span>{course.category}</span></div><p className="eyebrow">{course.eyebrow}</p><h1>{course.title}</h1><p className="course-hero__lead">{course.longDescription}</p><div className="course-hero__meta"><span><BookIcon /> {course.lessonCount} lessons</span><span><ClockIcon /> {course.duration}</span><span>{course.level}</span></div><div className="hero-actions"><Link href={`/courses/${course.slug}/lessons/${firstLesson.slug}`} className="button button--primary"><PlayIcon /> Start learning</Link><Link href="#curriculum" className="button button--secondary">View curriculum</Link></div></div><div className="course-hero__visual"><Image src={course.image} alt={course.imageAlt} priority sizes="(max-width: 900px) 100vw, 45vw"/><div className="course-structure-card"><strong>{course.modules.length} modules</strong><span>{course.lessonCount} concise lessons</span><small>Begin with the first concept and move at your own pace.</small></div></div></div></section>
    <section className="section"><div className="shell course-overview-grid"><div><p className="eyebrow">What you&apos;ll learn</p><h2>Build a foundation you can use.</h2><div className="outcomes-list">{course.outcomes.map((outcome) => <div key={outcome}><span><CheckIcon /></span><p>{outcome}</p></div>)}</div></div><aside className="instructor-card"><div className="avatar avatar--large">{course.instructor.initials}</div><p className="eyebrow">Course contributors</p><h2>{course.instructor.name}</h2><strong>{course.instructor.role}</strong><p>{course.instructor.bio}</p><small>Prepared for the NEST student learning community</small></aside></div></section>
    <section id="curriculum" className="section curriculum-section"><div className="shell"><div className="curriculum-heading"><div><p className="eyebrow">Course curriculum</p><h2>{course.modules.length} focused modules. One clear journey.</h2></div><p>{course.lessonCount} short lessons</p></div><div className="module-list">{course.modules.map((module, moduleIndex) => <article className="module-card" key={module.id}><div className="module-card__header"><span>{String(moduleIndex + 1).padStart(2, "0")}</span><div><h3>{module.title}</h3><p>{module.description}</p></div><small>{module.lessons.length} lessons</small></div><div className="lesson-list">{module.lessons.map((lesson, lessonIndex) => <Link href={`/courses/${course.slug}/lessons/${lesson.slug}`} key={lesson.slug}><span className="lesson-status">{lessonIndex + 1}</span><span><strong>{lesson.title}</strong><small>{lesson.description}</small></span><span className="lesson-duration">{lesson.duration}<ArrowRightIcon /></span></Link>)}</div></article>)}</div></div></section>
  </main><SiteFooter /></>;
}
