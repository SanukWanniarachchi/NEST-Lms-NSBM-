import cybersecurityImage from "@/public/images/courses/cybersecurity-foundations.webp";
import networkingImage from "@/public/images/courses/networking-essentials.webp";
import roboticsImage from "@/public/images/courses/robotics-fundamentals.webp";
import snapshot from "@/data/generated/admin-content.json";
import type { Course, CourseContent } from "@/types/lms";

const images = {
  cybersecurity: cybersecurityImage,
  networking: networkingImage,
  robotics: roboticsImage,
};

const publishedContent = snapshot.courses as CourseContent[];

export const courses: Course[] = publishedContent.map(({ imageKey, ...course }) => ({
  ...course,
  image: images[imageKey],
  lessonCount: course.modules.reduce((total, module) => total + module.lessons.length, 0),
}));

export const totalLessons = courses.reduce((sum, course) => sum + course.lessonCount, 0);

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}

export function getCourseModule(courseSlug: string, moduleId: string) {
  const course = getCourse(courseSlug);
  const courseModule = course?.modules.find((item) => item.id === moduleId);
  return course && courseModule ? { course, module: courseModule } : undefined;
}

export function getAllModuleParams() {
  return courses.flatMap((course) => course.modules.map((module) => ({ slug: course.slug, module: module.id })));
}

export function getLesson(courseSlug: string, lessonSlug: string) {
  const course = getCourse(courseSlug);
  if (!course) return undefined;

  for (const courseModule of course.modules) {
    const lesson = courseModule.lessons.find((item) => item.slug === lessonSlug);
    if (lesson) return { course, module: courseModule, lesson };
  }

  return undefined;
}

export function getAllLessonParams() {
  return courses.flatMap((course) =>
    course.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        slug: course.slug,
        lesson: lesson.slug,
      })),
    ),
  );
}
