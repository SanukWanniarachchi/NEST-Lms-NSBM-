import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { courses, totalLessons } from "@/data/courses";

export const metadata: Metadata = { title: "Course Catalogue", description: "Explore NEST learning paths in cybersecurity, networking, and robotics." };

export default function CoursesPage() {
  return <><SiteHeader /><main><section className="page-hero page-hero--courses"><div className="shell centered-intro"><p className="eyebrow">Course catalogue</p><h1>Choose a path. Follow your curiosity.</h1><p>Three visual, beginner-friendly learning journeys designed to turn emerging technology into practical understanding.</p><div className="filter-pills" aria-label="Course categories"><span className="active">All courses</span><span>Cybersecurity</span><span>Networking</span><span>Robotics</span></div></div></section><section className="section"><div className="shell"><div className="catalogue-summary"><p><strong>{courses.length}</strong> learning paths</p><p><strong>{totalLessons}</strong> focused lessons</p><p><strong>15</strong> guided modules</p></div><div className="course-grid">{courses.map((course) => <CourseCard key={course.slug} course={course} />)}</div><div className="catalogue-note"><strong>Designed for focused learning</strong><p>Every lesson follows a short microlearning rhythm: a clear hook, one core concept, a practical example, and a concise recap.</p></div></div></section></main><SiteFooter /></>;
}
