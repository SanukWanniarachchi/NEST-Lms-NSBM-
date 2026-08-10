import type { StaticImageData } from "next/image";

export type CourseCategory = "Cybersecurity" | "Networking" | "Robotics";

export interface Instructor {
  name: string;
  role: string;
  initials: string;
  bio: string;
}

export interface Lesson {
  slug: string;
  title: string;
  duration: string;
  description: string;
  youtubeUrl: string;
  completed?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  slug: string;
  title: string;
  shortTitle: string;
  category: CourseCategory;
  eyebrow: string;
  description: string;
  longDescription: string;
  level: "Beginner" | "Beginner to intermediate";
  duration: string;
  lessonCount: number;
  image: StaticImageData;
  imageAlt: string;
  accent: "violet" | "cyan" | "amber";
  instructor: Instructor;
  outcomes: string[];
  modules: CourseModule[];
  progress: number;
}

export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
  initials: string;
}
