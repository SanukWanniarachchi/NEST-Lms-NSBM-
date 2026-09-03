import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ClockIcon, PlayIcon } from "@/components/icons";
import { LessonVideo } from "@/components/lesson-video";
import { ModuleCompletionPrompt } from "@/components/module-completion-prompt";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAllLessonParams, getLesson } from "@/data/courses";
import { getModuleRecommendations } from "@/data/follow-up-courses";
import { getYouTubeVideoId, getYouTubeWatchUrl } from "@/lib/youtube";

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
  const isModuleFinalLesson = module.lessons.at(-1)?.slug === lesson.slug;
  const recommendations = isModuleFinalLesson ? getModuleRecommendations(course.slug, module.id) : [];
  const validYoutubeId = getYouTubeVideoId(lesson.youtubeUrl);
  const videoFrameClassName = [
    "video-frame",
    validYoutubeId ? "video-frame--media" : "",
    lesson.videoOrientation === "portrait" ? "video-frame--portrait" : "",
  ].filter(Boolean).join(" ");

  return <main className="lesson-page"><header className="lesson-topbar"><Link href={`/courses/${course.slug}`}><ArrowLeftIcon /> {course.shortTitle}</Link><div><span>{index + 1} of {allLessons.length}</span><ThemeToggle /></div></header><div className="lesson-progress" aria-hidden="true"><span style={{ width: `${((index + 1) / allLessons.length) * 100}%` }} /></div><div className="lesson-layout"><aside className="lesson-sidebar"><p className="eyebrow">Current module</p><h2>{module.title}</h2><nav aria-label="Lessons in this module">{module.lessons.map((item, lessonIndex) => <Link className={item.slug === lesson.slug ? "active" : ""} href={`/courses/${course.slug}/lessons/${item.slug}`} key={item.slug}><span>{lessonIndex + 1}</span>{item.title}</Link>)}</nav><Link href={`/courses/${course.slug}#curriculum`} className="lesson-course-link">View complete curriculum <ArrowRightIcon /></Link></aside><article className="lesson-content"><div className="lesson-heading"><p className="eyebrow">{course.category} · {module.title}</p><h1>{lesson.title}</h1><p>{lesson.description}</p><span><ClockIcon /> {lesson.duration} micro-lesson</span></div><div className={videoFrameClassName}>{validYoutubeId && lesson.youtubeUrl ? <LessonVideo title={lesson.title} youtubeUrl={lesson.youtubeUrl} duration={lesson.videoDuration} /> : <div className="lesson-focus"><span><PlayIcon /></span><p className="eyebrow">Lesson focus</p><strong>{lesson.title}</strong><p>{lesson.learningObjective}</p><small>Video resources will be added as each NEST lesson is published.</small></div>}</div>{validYoutubeId ? <a className="lesson-video-external lesson-video-external--page" href={getYouTubeWatchUrl(validYoutubeId)} target="_blank" rel="noreferrer">Open on YouTube <ArrowRightIcon /></a> : null}<section className="lesson-notes" aria-labelledby="lesson-objective"><div><p className="eyebrow">Learning objective</p><h2 id="lesson-objective">What you will understand</h2><p>{lesson.learningObjective}</p></div><div className="lesson-detail-grid"><article><h3>Key ideas</h3><ul>{lesson.keyPoints.map((point) => <li key={point}><CheckIcon /> {point}</li>)}</ul></article><article><h3>Try it</h3><p>{lesson.activity}</p></article><article><h3>Quick recap</h3><p>{lesson.recap}</p></article></div></section>{isModuleFinalLesson && recommendations.length > 0 ? <ModuleCompletionPrompt courseSlug={course.slug} moduleId={module.id} moduleTitle={module.title} recommendations={recommendations} /> : null}<nav className="lesson-pagination" aria-label="Lesson navigation"><span>{previous ? <Link href={`/courses/${course.slug}/lessons/${previous.slug}`}><ArrowLeftIcon /><span><small>Previous</small><strong>{previous.title}</strong></span></Link> : null}</span><span>{next ? <Link href={`/courses/${course.slug}/lessons/${next.slug}`}><span><small>Next lesson</small><strong>{next.title}</strong></span><ArrowRightIcon /></Link> : <Link href={`/courses/${course.slug}`}><span><small>Course complete</small><strong>Return to overview</strong></span><ArrowRightIcon /></Link>}</span></nav></article></div><nav className="mobile-lesson-nav" aria-label="Mobile lesson navigation">{previous ? <Link href={`/courses/${course.slug}/lessons/${previous.slug}`} aria-label={`Previous lesson: ${previous.title}`}><ArrowLeftIcon /><span>Previous</span></Link> : <span />}{next ? <Link href={`/courses/${course.slug}/lessons/${next.slug}`} aria-label={`Next lesson: ${next.title}`}><span>Next</span><ArrowRightIcon /></Link> : <Link href={`/courses/${course.slug}`}><span>Overview</span><ArrowRightIcon /></Link>}</nav></main>;
}
