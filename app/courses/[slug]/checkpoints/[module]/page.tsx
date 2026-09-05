import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
import { ModuleQuizRunner } from "@/components/module-quiz";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAllModuleParams, getCourseModule } from "@/data/courses";
import { getModuleRecommendations } from "@/data/follow-up-courses";
import { getModuleQuiz } from "@/data/module-quizzes";

export const dynamicParams = false;
export function generateStaticParams() { return getAllModuleParams(); }

type CheckpointPageProps = { params: Promise<{ slug: string; module: string }> };

export async function generateMetadata({ params }: CheckpointPageProps): Promise<Metadata> {
  const { slug, module: moduleId } = await params;
  const found = getCourseModule(slug, moduleId);
  return found ? { title: `${found.module.title} checkpoint · ${found.course.shortTitle}`, description: `Complete the source-backed checkpoint for ${found.module.title}.` } : {};
}

export default async function CheckpointPage({ params }: CheckpointPageProps) {
  const { slug, module: moduleId } = await params;
  const found = getCourseModule(slug, moduleId);
  const quiz = getModuleQuiz(slug, moduleId);
  if (!found || !quiz) notFound();

  const { course, module: courseModule } = found;
  const moduleIndex = course.modules.findIndex((item) => item.id === courseModule.id);
  const nextModule = course.modules[moduleIndex + 1];
  const finalLesson = courseModule.lessons.at(-1);
  if (!finalLesson) notFound();

  const continuationHref = nextModule ? `/courses/${course.slug}/lessons/${nextModule.lessons[0].slug}` : `/courses/${course.slug}`;
  const continuationLabel = nextModule ? `Start ${nextModule.title}` : "Return to course overview";

  return <main className="checkpoint-page"><header className="lesson-topbar"><Link href={`/courses/${course.slug}/lessons/${finalLesson.slug}`}><ArrowLeftIcon /> {course.shortTitle}</Link><div><span>Module {moduleIndex + 1} of {course.modules.length}</span><ThemeToggle /></div></header><div className="checkpoint-shell"><ModuleQuizRunner quiz={quiz} recommendations={getModuleRecommendations(course.slug, courseModule.id)} moduleTitle={courseModule.title} lessonHref={`/courses/${course.slug}/lessons/${finalLesson.slug}`} continuationHref={continuationHref} continuationLabel={continuationLabel} /></div></main>;
}
