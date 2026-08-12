import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";
import { ArrowRightIcon, BookIcon, CheckIcon, ClockIcon } from "@/components/icons";
import { courses, totalLessons } from "@/data/courses";

export const metadata: Metadata = { title: "Learner Portal" };

export default function DashboardPage() {
  const firstCourse = courses[0];
  const firstLesson = firstCourse.modules[0].lessons[0];

  return <PortalShell role="student"><section className="portal-welcome"><div><p className="eyebrow">Learner portal</p><h1>Choose a path and begin.</h1><p>Explore focused technology lessons at your own pace.</p></div><Link href={`/courses/${firstCourse.slug}/lessons/${firstLesson.slug}`} className="button button--primary">Start with cybersecurity <ArrowRightIcon /></Link></section><section className="metric-grid"><article><span className="metric-icon metric-icon--blue"><BookIcon /></span><div><small>Learning paths</small><strong>{courses.length}</strong><p>Cybersecurity, networking, and robotics</p></div></article><article><span className="metric-icon metric-icon--violet"><ClockIcon /></span><div><small>Short lessons</small><strong>{totalLessons}</strong><p>Designed for focused study sessions</p></div></article><article><span className="metric-icon metric-icon--amber"><CheckIcon /></span><div><small>Guided modules</small><strong>15</strong><p>From foundations to practical skills</p></div></article></section><section className="portal-section"><div className="portal-section__heading"><div><p className="eyebrow">Learning catalogue</p><h2>Explore every path</h2></div><Link href="/courses" className="text-link">Full catalogue <ArrowRightIcon /></Link></div><div className="learning-row learning-row--three">{courses.map((course) => <article key={course.slug}><Image src={course.image} alt={course.imageAlt} sizes="(max-width: 800px) 100vw, 30vw"/><div><span className="category-pill">{course.category}</span><h3>{course.shortTitle}</h3><p>{course.modules.length} modules · {course.lessonCount} lessons</p><Link href={`/courses/${course.slug}`} className="button button--secondary button--wide">Open course <ArrowRightIcon /></Link></div></article>)}</div></section><section className="portal-card learning-guide"><div><p className="eyebrow">How to use NEST LMS</p><h2>One focused idea at a time</h2></div><ol><li><span>1</span><div><strong>Choose a path</strong><p>Start with the subject that matches your curiosity.</p></div></li><li><span>2</span><div><strong>Follow the modules</strong><p>Build understanding in a clear, deliberate sequence.</p></div></li><li><span>3</span><div><strong>Try the activity</strong><p>Use each lesson prompt to make the concept practical.</p></div></li></ol></section></PortalShell>;
}
