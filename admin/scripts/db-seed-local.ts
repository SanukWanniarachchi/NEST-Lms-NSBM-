import { join } from "node:path";
import { loadEnvConfig } from "@next/env";
import { getDatabaseConfig, openDatabase } from "../db/connection";
import { createAdminRepository, createManagedContentRepository } from "../lib/data/repositories";
import { announcements } from "../../data/announcements";
import { courseContent } from "../../data/course-content";

loadEnvConfig(join(process.cwd(), "admin"));

if (process.env.NODE_ENV === "production" || process.env.NEST_AUTH_MODE !== "local") {
  throw new Error("The local admin seed is available only when NEST_AUTH_MODE=local outside production.");
}

async function main() {
  const subject = process.env.NEST_DEV_ADMIN_SUBJECT?.trim() || "local-admin";
  const displayName = process.env.NEST_DEV_ADMIN_NAME?.trim() || "NEST Local Administrator";
  const email = process.env.NEST_DEV_ADMIN_EMAIL?.trim() || null;
  const configuredRole = process.env.NEST_DEV_ADMIN_ROLE?.trim() || "super_admin";
  if (configuredRole !== "super_admin" && configuredRole !== "admin") {
    throw new Error("NEST_DEV_ADMIN_ROLE must be either super_admin or admin.");
  }
  const connection = await openDatabase(getDatabaseConfig());

  try {
    await createAdminRepository(connection.db).bootstrap({
      subject,
      displayName,
      email,
      role: configuredRole,
      active: true,
    });
    const content = createManagedContentRepository(connection.db);
    for (const announcement of announcements) {
      const slug = `${announcement.date}-${announcement.title}`.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      await content.seedPublished({ kind: "announcement", slug, title: announcement.title, payload: announcement });
    }
    for (const course of courseContent) {
      await content.seedPublished({ kind: "course", slug: course.slug, title: course.title, payload: course });
    }
    console.log(`Local admin allowlist entry is ready for ${subject}.`);
  } finally {
    await connection.close();
  }
}

void main();
