import { sql } from "drizzle-orm";
import type { AdminDatabase } from "../../db/connection";
import { managedContent } from "../../db/schema";
import { createManagedContentRepository } from "./repositories";
import type { CourseContent } from "../../../types/lms";
import type { Announcement } from "../../../data/announcements";

export async function initializePublishedContent(db: AdminDatabase, snapshot: { courses: CourseContent[]; announcements: Announcement[] }) {
  await db.transaction(async (transaction) => {
    await transaction.execute(sql`LOCK TABLE managed_content IN EXCLUSIVE MODE`);
    if ((await transaction.select({ id: managedContent.id }).from(managedContent).limit(1)).length) throw new Error("Initial curriculum import requires an empty managed-content directory.");
    const repository = createManagedContentRepository(transaction);
    for (const course of snapshot.courses) {
      await repository.seedPublished({ kind: "course", slug: course.slug, title: course.title, payload: course }, "system:production-content-import");
    }
    for (const announcement of snapshot.announcements) {
      const slug = `${announcement.date}-${announcement.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      await repository.seedPublished({ kind: "announcement", slug, title: announcement.title, payload: announcement }, "system:production-content-import");
    }
  });
}
