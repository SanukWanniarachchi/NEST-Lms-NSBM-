import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ClockIcon, PlayIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAllLessonParams, getLesson } from "@/data/courses";

export const dynamicParams = false;
export function generateStaticParams() { return getAllLessonParams(); }

type LessonPageProps = { params: Promise<{ slug: string; lesson: string }> };

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lesson } = await params;
  const found = getLesson(slug, lesson);
  return found ? { title: `${found.lesson.title} · ${found.course.shortTitle}`, description: found.lesson.description } : {};
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lesson: lessonSlug } = await params;
  const found = getLesson(slug, lessonSlug);
  if (!found) notFound();
  const { course, module, lesson } = found;
  const allLessons = course.modules.flatMap((item) => item.lessons);
  const index = allLessons.findIndex((item) => item.slug === lesson.slug);
  const previous = allLessons[index - 1];
  const next = allLessons[index + 1];
  const youtubeParam = lesson.youtubeUrl ? new URL(lesson.youtubeUrl).searchParams.get("v") : null;
  const validYoutubeId = youtubeParam && /^[\w-]{11}$/.test(youtubeParam) ? youtubeParam : null;

  return <main className="lesson-page"><header className="lesson-topbar"><Link href={`/courses/${course.slug}`}><ArrowLeftIcon /> {course.shortTitle}</Link><div><span>{index + 1} of {allLessons.length}</span><ThemeToggle /></div></header><div className="lesson-layout"><aside className="lesson-sidebar"><p className="eyebrow">Current module</p><h2>{module.title}</h2><nav aria-label="Lessons in this module">{module.lessons.map((item, lessonIndex) => <Link className={item.slug === lesson.slug ? "active" : ""} href={`/courses/${course.slug}/lessons/${item.slug}`} key={item.slug}><span>{lessonIndex + 1}</span>{item.title}</Link>)}</nav><Link href={`/courses/${course.slug}#curriculum`} className="lesson-course-link">View complete curriculum <ArrowRightIcon /></Link></aside><article className="lesson-content"><div className="lesson-heading"><p className="eyebrow">{course.category} · {module.title}</p><h1>{lesson.title}</h1><p>{lesson.description}</p><span><ClockIcon /> {lesson.duration} micro-lesson</span></div><div className="video-frame">{validYoutubeId ? <iframe src={`https://www.youtube-nocookie.com/embed/${validYoutubeId}`} title={`${lesson.title} video lesson`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <div className="lesson-focus"><span><PlayIcon /></span><p className="eyebrow">Lesson focus</p><strong>{lesson.title}</strong><p>{lesson.learningObjective}</p><small>Video resources will be added as each NEST lesson is published.</small></div>}</div><section className="lesson-notes" aria-labelledby="lesson-objective"><div><p className="eyebrow">Learning objective</p><h2 id="lesson-objective">What you will understand</h2><p>{lesson.learningObjective}</p></div><div className="lesson-detail-grid"><article><h3>Key ideas</h3><ul>{lesson.keyPoints.map((point) => <li key={point}><CheckIcon /> {point}</li>)}</ul></article><article><h3>Try it</h3><p>{lesson.activity}</p></article><article><h3>Quick recap</h3><p>{lesson.recap}</p></article></div></section><nav className="lesson-pagination" aria-label="Lesson navigation"><span>{previous ? <Link href={`/courses/${course.slug}/lessons/${previous.slug}`}><ArrowLeftIcon /><span><small>Previous</small><strong>{previous.title}</strong></span></Link> : null}</span><span>{next ? <Link href={`/courses/${course.slug}/lessons/${next.slug}`}><span><small>Next lesson</small><strong>{next.title}</strong></span><ArrowRightIcon /></Link> : <Link href={`/courses/${course.slug}`}><span><small>Course complete</small><strong>Return to overview</strong></span><ArrowRightIcon /></Link>}</span></nav></article></div></main>;
}
