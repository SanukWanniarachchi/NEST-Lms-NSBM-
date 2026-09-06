import { mkdir, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { loadEnvConfig } from "@next/env";
import { getDatabaseConfig, openDatabase } from "../db/connection";
import { createManagedContentRepository } from "../lib/data/repositories";
import { AnnouncementSchema } from "../lib/content/validation";
import { CourseFormSchema, parseCoursePayload } from "../lib/content/validation";

loadEnvConfig(join(process.cwd(), "admin"));

function validateCoursePayload(value: Record<string, unknown>) {
  const instructor = value.instructor as Record<string, unknown> | undefined;
  const parsed = CourseFormSchema.safeParse({
    id: "snapshot-validation",
    slug: value.slug,
    title: value.title,
    shortTitle: value.shortTitle,
    category: value.category,
    eyebrow: value.eyebrow,
    description: value.description,
    longDescription: value.longDescription,
    level: value.level,
    duration: value.duration,
    imageKey: value.imageKey,
    imageAlt: value.imageAlt,
    accent: value.accent,
    instructorName: instructor?.name,
    instructorRole: instructor?.role,
    instructorInitials: instructor?.initials,
    instructorBio: instructor?.bio,
    outcomes: Array.isArray(value.outcomes) ? value.outcomes.join("\n") : "",
    modulesJson: JSON.stringify(value.modules),
  });
  if (!parsed.success) throw new Error(`Invalid published course ${String(value.slug)}.`);
  const course = parseCoursePayload(parsed.data);
  if (!course.success) throw new Error(`Invalid published course ${String(value.slug)}: ${course.message}`);
  return course.payload;
}

async function main() {
  const connection = await openDatabase(getDatabaseConfig());
  try {
    const repository = createManagedContentRepository(connection.db);
    const [announcementRecords, courseRecords] = await Promise.all([
      repository.listPublished("announcement"),
      repository.listPublished("course"),
    ]);
    const announcements = announcementRecords.map((record) => {
      const parsed = AnnouncementSchema.parse({
        ...(record.publishedPayload as Record<string, unknown>),
        slug: record.slug,
      });
      return {
        title: parsed.title,
        date: parsed.date,
        category: parsed.category,
        summary: parsed.summary,
        actionLabel: parsed.actionLabel,
        actionHref: parsed.actionHref,
        featured: parsed.featured,
      };
    });
    const order = new Map([["cybersecurity-foundations", 0], ["networking-essentials", 1], ["robotics-fundamentals", 2]]);
    const courses = courseRecords.map((record) => validateCoursePayload(record.publishedPayload as Record<string, unknown>))
      .sort((left, right) => (order.get(left.slug) ?? 99) - (order.get(right.slug) ?? 99));
    announcements.sort((left, right) => right.date.localeCompare(left.date));

    const targetDirectory = join(process.cwd(), "data", "generated");
    const target = join(targetDirectory, "admin-content.json");
    const temporary = `${target}.tmp`;
    await mkdir(targetDirectory, { recursive: true });
    await writeFile(temporary, `${JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), announcements, courses }, null, 2)}\n`, "utf8");
    await rename(temporary, target);
    console.log(`Published ${announcements.length} announcements and ${courses.length} courses to ${target}.`);
  } finally {
    await connection.close();
  }
}

void main();
