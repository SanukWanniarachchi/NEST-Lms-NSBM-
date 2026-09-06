import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  date,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const publicationStatus = pgEnum("publication_status", ["draft", "published", "archived"]);
export const researchResourceType = pgEnum("research_resource_type", ["research_paper", "video", "document"]);
export const adminRole = pgEnum("admin_role", ["super_admin", "admin", "user"]);

export const adminAllowlist = pgTable("admin_allowlist", {
  subject: text("subject").primaryKey(),
  email: text("email"),
  displayName: text("display_name").notNull(),
  role: adminRole("role").notNull().default("user"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("admin_allowlist_email_unique").on(table.email),
  index("admin_allowlist_active_idx").on(table.active),
  index("admin_allowlist_role_idx").on(table.role),
]);

export const researchResources = pgTable("research_resources", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  type: researchResourceType("resource_type").notNull(),
  authors: text("authors").array().notNull().default(sql`ARRAY[]::text[]`),
  href: text("href").notNull(),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  status: publicationStatus("status").notNull().default("draft"),
  publishedOn: date("published_on"),
  createdBy: text("created_by").notNull(),
  updatedBy: text("updated_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("research_resources_slug_unique").on(table.slug),
  index("research_resources_status_idx").on(table.status),
  index("research_resources_updated_at_idx").on(table.updatedAt),
]);

export const auditEvents = pgTable("audit_events", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  actorSubject: text("actor_subject").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  previousState: jsonb("previous_state"),
  nextState: jsonb("next_state"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("audit_events_entity_idx").on(table.entityType, table.entityId),
  index("audit_events_created_at_idx").on(table.createdAt),
]);

export type AdminAllowlistRecord = typeof adminAllowlist.$inferSelect;
export type AdminRole = AdminAllowlistRecord["role"];
export type ResearchRecord = typeof researchResources.$inferSelect;
export type AuditEventRecord = typeof auditEvents.$inferSelect;
