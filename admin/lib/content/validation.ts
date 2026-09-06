import { z } from "zod";
import { getYouTubeVideoId } from "@/lib/youtube";

const slug = z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens.");

const LessonSchema = z.object({
  slug,
  title: z.string().trim().min(2).max(140),
  duration: z.string().trim().min(2).max(30),
  description: z.string().trim().min(10).max(500),
  learningObjective: z.string().trim().min(10).max(500),
  keyPoints: z.array(z.string().trim().min(2).max(180)).min(1).max(12),
  activity: z.string().trim().min(5).max(600),
  recap: z.string().trim().min(5).max(600),
  youtubeUrl: z.url().refine((value) => Boolean(getYouTubeVideoId(value)), "Use a valid YouTube video URL.").optional(),
  videoDuration: z.string().trim().max(30).optional(),
  videoOrientation: z.enum(["landscape", "portrait"]).optional(),
  completed: z.boolean().optional(),
}).superRefine((value, context) => {
  if (!value.youtubeUrl && (value.videoDuration || value.videoOrientation)) {
    context.addIssue({ code: "custom", path: ["youtubeUrl"], message: "Add a YouTube URL before setting video details." });
  }
});

const ModuleSchema = z.object({
  id: slug,
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().min(10).max(500),
  lessons: z.array(LessonSchema).min(1).max(100),
});

export const AnnouncementSchema = z.object({
  id: z.string().optional(),
  slug,
  title: z.string().trim().min(3).max(140),
  date: z.iso.date(),
  category: z.enum(["Event", "Research", "Workshop", "Community", "Notice"]),
  summary: z.string().trim().min(20).max(700),
  actionLabel: z.string().trim().max(80).optional(),
  actionHref: z.string().trim().max(500).optional(),
  featured: z.boolean().default(false),
}).superRefine((value, context) => {
  if (Boolean(value.actionLabel) !== Boolean(value.actionHref)) {
    context.addIssue({ code: "custom", path: ["actionHref"], message: "Provide both an action label and destination, or leave both empty." });
  }
  if (value.actionHref) {
    const isInternal = /^\/(?!\/)/.test(value.actionHref);
    let isWebUrl = false;
    try { isWebUrl = ["http:", "https:"].includes(new URL(value.actionHref).protocol); } catch { /* handled below */ }
    if (!isInternal && !isWebUrl) {
      context.addIssue({ code: "custom", path: ["actionHref"], message: "Use a site-relative path or an HTTP(S) URL." });
    }
  }
});

export const CourseFormSchema = z.object({
  id: z.string().min(1),
  slug,
  title: z.string().trim().min(3).max(160),
  shortTitle: z.string().trim().min(3).max(100),
  category: z.enum(["Cybersecurity", "Networking", "Robotics"]),
  eyebrow: z.string().trim().min(2).max(80),
  description: z.string().trim().min(20).max(500),
  longDescription: z.string().trim().min(20).max(900),
  level: z.enum(["Beginner", "Beginner to intermediate"]),
  duration: z.string().trim().min(2).max(40),
  imageKey: z.enum(["cybersecurity", "networking", "robotics"]),
  imageAlt: z.string().trim().min(10).max(240),
  accent: z.enum(["violet", "cyan", "amber"]),
  instructorName: z.string().trim().min(2).max(120),
  instructorRole: z.string().trim().min(2).max(120),
  instructorInitials: z.string().trim().min(1).max(6),
  instructorBio: z.string().trim().min(10).max(700),
  outcomes: z.string().trim().min(3),
  modulesJson: z.string().trim().min(2),
});

export type ContentFormState = { status: "idle" | "error"; message?: string; errors?: Record<string, string[]> };

export function parseCoursePayload(input: z.infer<typeof CourseFormSchema>) {
  let rawModules: unknown;
  try {
    rawModules = JSON.parse(input.modulesJson);
  } catch {
    return { success: false as const, message: "Curriculum JSON is not valid JSON." };
  }

  const modules = z.array(ModuleSchema).min(1).max(30).safeParse(rawModules);
  if (!modules.success) {
    return { success: false as const, message: modules.error.issues[0]?.message || "Review the curriculum modules." };
  }

  const moduleIds = modules.data.map((module) => module.id);
  const lessonSlugs = modules.data.flatMap((module) => module.lessons.map((lesson) => lesson.slug));
  if (new Set(moduleIds).size !== moduleIds.length) return { success: false as const, message: "Module IDs must be unique." };
  if (new Set(lessonSlugs).size !== lessonSlugs.length) return { success: false as const, message: "Lesson slugs must be unique within a course." };

  const outcomes = input.outcomes.split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
  if (outcomes.length === 0 || outcomes.length > 12) return { success: false as const, message: "Add between 1 and 12 learning outcomes." };

  return {
    success: true as const,
    payload: {
      slug: input.slug,
      title: input.title,
      shortTitle: input.shortTitle,
      category: input.category,
      eyebrow: input.eyebrow,
      description: input.description,
      longDescription: input.longDescription,
      level: input.level,
      duration: input.duration,
      lessonCount: modules.data.reduce((total, module) => total + module.lessons.length, 0),
      imageKey: input.imageKey,
      imageAlt: input.imageAlt,
      accent: input.accent,
      instructor: { name: input.instructorName, role: input.instructorRole, initials: input.instructorInitials, bio: input.instructorBio },
      outcomes,
      modules: modules.data,
      progress: 0,
    },
  };
}
