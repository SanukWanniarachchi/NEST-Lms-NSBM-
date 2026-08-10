import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBadge } from "@/components/demo-badge";
import { ProgressBar } from "@/components/progress-bar";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ClockIcon, PlayIcon } from "@/components/icons";
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
  const youtubeParam = new URL(lesson.youtubeUrl).searchParams.get("v");
  const validYoutubeId = youtubeParam && /^[\w-]{11}$/.test(youtubeParam) ? youtubeParam : null;

  return <main className="lesson-page"><header className="lesson-topbar"><Link href={`/courses/${course.slug}`}><ArrowLeftIcon /> {course.shortTitle}</Link><DemoBadge compact /><span>{index + 1} of {allLessons.length}</span></header><div className="lesson-layout"><aside className="lesson-sidebar"><p className="eyebrow">Course contents</p><h2>{module.title}</h2><nav aria-label="Lessons in this module">{module.lessons.map((item, lessonIndex) => <Link className={item.slug === lesson.slug ? "active" : ""} href={`/courses/${course.slug}/lessons/${item.slug}`} key={item.slug}><span>{item.completed ? <CheckIcon /> : lessonIndex + 1}</span>{item.title}</Link>)}</nav><ProgressBar value={Math.round(((index + 1) / allLessons.length) * 100)} label="Demo journey" /></aside><article className="lesson-content"><div className="lesson-heading"><p className="eyebrow">{course.category} · {module.title}</p><h1>{lesson.title}</h1><p>{lesson.description}</p><span><ClockIcon /> {lesson.duration}</span></div><div className="video-frame">{validYoutubeId ? <iframe src={`https://www.youtube-nocookie.com/embed/${validYoutubeId}`} title={`${lesson.title} video lesson`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <div className="video-placeholder"><span><PlayIcon /></span><strong>Demo video placeholder</strong><p>The approved YouTube lesson will appear here. This mock URL is intentionally not loaded.</p><small>{lesson.youtubeUrl}</small></div>}</div><div className="lesson-notes"><h2>In this lesson</h2><p>This demonstration lesson area is ready for the final video, transcript, learning notes, and downloadable resources. Progress controls below are visual only and do not save data.</p><button type="button" className="button button--primary"><CheckIcon /> Mark as complete</button></div><nav className="lesson-pagination" aria-label="Lesson navigation"><span>{previous ? <Link href={`/courses/${course.slug}/lessons/${previous.slug}`}><ArrowLeftIcon /><span><small>Previous</small><strong>{previous.title}</strong></span></Link> : null}</span><span>{next ? <Link href={`/courses/${course.slug}/lessons/${next.slug}`}><span><small>Next lesson</small><strong>{next.title}</strong></span><ArrowRightIcon /></Link> : <Link href={`/courses/${course.slug}`}><span><small>Course complete</small><strong>Return to overview</strong></span><ArrowRightIcon /></Link>}</span></nav></article></div></main>;
}
