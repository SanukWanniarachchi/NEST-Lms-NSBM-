import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { DemoBadge } from "@/components/demo-badge";
import { courses } from "@/data/courses";

export const metadata: Metadata = { title: "Course Catalogue", description: "Explore NEST LMS demonstration courses in cybersecurity, networking, and robotics." };

export default function CoursesPage() {
  return <><SiteHeader /><main><section className="page-hero page-hero--courses"><div className="shell centered-intro"><DemoBadge /><p className="eyebrow">Course catalogue</p><h1>Choose a path. Follow your curiosity.</h1><p>Three visual, beginner-friendly learning journeys designed to turn emerging technology into practical understanding.</p><div className="filter-pills" aria-label="Course categories"><span className="active">All courses</span><span>Cybersecurity</span><span>Networking</span><span>Robotics</span></div></div></section><section className="section"><div className="shell"><div className="catalogue-summary"><p><strong>3</strong> demonstration courses</p><p><strong>36</strong> focused lessons</p><p><strong>3</strong> practical challenges</p></div><div className="course-grid">{courses.map((course) => <CourseCard key={course.slug} course={course} />)}</div><div className="demo-notice"><strong>About this catalogue</strong><p>Course content, instructors, progress, and lesson videos are representative mock data for the NEST LMS frontend demonstration.</p></div></div></section></main><SiteFooter /></>;
}
