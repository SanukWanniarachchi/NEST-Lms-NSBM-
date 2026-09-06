import assert from "node:assert/strict";
import test from "node:test";
import { AnnouncementSchema, CourseFormSchema, parseCoursePayload } from "../lib/content/validation";

test("announcement destinations accept internal and web links only", () => {
  const base = {
    slug: "security-workshop",
    title: "Student security workshop",
    date: "2026-09-06",
    category: "Workshop" as const,
    summary: "A practical workshop covering safer accounts, devices, and student learning environments.",
    actionLabel: "View details",
  };
  assert.equal(AnnouncementSchema.safeParse({ ...base, actionHref: "/courses/" }).success, true);
  assert.equal(AnnouncementSchema.safeParse({ ...base, actionHref: "https://example.edu/course" }).success, true);
  assert.equal(AnnouncementSchema.safeParse({ ...base, actionHref: "javascript:alert(1)" }).success, false);
  assert.equal(AnnouncementSchema.safeParse({ ...base, actionHref: "//untrusted.example" }).success, false);
});

test("course curriculum accepts supported YouTube URLs and rejects unrelated video hosts", () => {
  const course = {
    id: "course-1",
    slug: "course-one",
    title: "Course One",
    shortTitle: "Course One",
    category: "Cybersecurity" as const,
    eyebrow: "Learning path",
    description: "A sufficiently detailed catalogue description for this validation test.",
    longDescription: "A sufficiently detailed course introduction for this validation test and its learner audience.",
    level: "Beginner" as const,
    duration: "2 hours",
    imageKey: "cybersecurity" as const,
    imageAlt: "A descriptive cybersecurity course illustration for learners",
    accent: "violet" as const,
    instructorName: "NEST Team",
    instructorRole: "Course team",
    instructorInitials: "NT",
    instructorBio: "The NEST course team supports student technology learning.",
    outcomes: "Recognise common digital risks",
    modulesJson: JSON.stringify([{ id: "module-one", title: "Module One", description: "A detailed module description for learners.", lessons: [{ slug: "lesson-one", title: "Lesson One", duration: "5 min", description: "A detailed lesson description for student learners.", learningObjective: "Recognise one practical security concept after this lesson.", keyPoints: ["Use secure account practices"], activity: "Review one account security setting.", recap: "Secure settings reduce avoidable account risk.", youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", videoDuration: "1 min", videoOrientation: "portrait" }] }]),
  };
  const parsed = CourseFormSchema.parse(course);
  assert.equal(parseCoursePayload(parsed).success, true);

  const modules = JSON.parse(course.modulesJson);
  modules[0].lessons[0].youtubeUrl = "https://example.com/video";
  const invalid = CourseFormSchema.parse({ ...course, modulesJson: JSON.stringify(modules) });
  assert.equal(parseCoursePayload(invalid).success, false);
});
