import { randomUUID } from "node:crypto";
import { and, count, desc, eq, inArray, isNotNull, ne } from "drizzle-orm";
import type { AdminDatabase } from "../../db/connection";
import {
  adminAllowlist,
  auditEvents,
  managedContent,
  researchResources,
  type AdminRole,
  type ManagedContentKind,
} from "../../db/schema";

type AuditState = Record<string, unknown> | null;

function auditState(value: unknown): AuditState {
  if (value === null || value === undefined) return null;
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

export type AdminIdentityInput = {
  subject: string;
  email?: string | null;
  displayName: string;
  role: AdminRole;
  active?: boolean;
};

export type ResearchDraftInput = {
  slug: string;
  title: string;
  summary: string;
  type: "research_paper" | "video" | "document";
  authors: string[];
  href: string;
  tags: string[];
};

export type ManagedContentInput = {
  id?: string;
  kind: ManagedContentKind;
  slug: string;
  title: string;
  payload: Record<string, unknown>;
};

export class ResearchStateError extends Error {}
export class AdminAuthorizationError extends Error {}
export class AdminAccountStateError extends Error {}

async function saveAdminIdentity(
  db: AdminDatabase,
  actorSubject: string,
  input: AdminIdentityInput,
) {
  return db.transaction(async (transaction) => {
    const [previous] = await transaction.select().from(adminAllowlist)
      .where(eq(adminAllowlist.subject, input.subject)).limit(1);
    const nextActive = input.active ?? true;
    const nextEmail = input.email ?? null;
    if (
      previous
      && previous.displayName === input.displayName
      && previous.email === nextEmail
      && previous.role === input.role
      && previous.active === nextActive
    ) {
      return previous;
    }

    const [next] = await transaction.insert(adminAllowlist).values({
      subject: input.subject,
      email: nextEmail,
      displayName: input.displayName,
      role: input.role,
      active: nextActive,
    }).onConflictDoUpdate({
      target: adminAllowlist.subject,
      set: {
        email: nextEmail,
        displayName: input.displayName,
        role: input.role,
        active: nextActive,
        updatedAt: new Date(),
      },
    }).returning();

    await transaction.insert(auditEvents).values({
      actorSubject,
      action: previous ? "account.updated" : "account.created",
      entityType: "admin_allowlist",
      entityId: input.subject,
      previousState: auditState(previous),
      nextState: auditState(next),
    });
    return next;
  });
}

export function createAdminRepository(db: AdminDatabase) {
  return {
    list() {
      return db.select().from(adminAllowlist).orderBy(desc(adminAllowlist.updatedAt));
    },

    async findBySubject(subject: string) {
      const [record] = await db.select().from(adminAllowlist).where(eq(adminAllowlist.subject, subject)).limit(1);
      return record ?? null;
    },

    async findAuthorizedBySubject(subject: string) {
      const [record] = await db.select()
        .from(adminAllowlist)
        .where(and(
          eq(adminAllowlist.subject, subject),
          eq(adminAllowlist.active, true),
          inArray(adminAllowlist.role, ["super_admin", "admin"]),
        ))
        .limit(1);
      return record ?? null;
    },

    async isAllowed(subject: string) {
      return Boolean(await this.findAuthorizedBySubject(subject));
    },

    bootstrap(input: AdminIdentityInput) {
      return saveAdminIdentity(db, "system:local-bootstrap", input);
    },

    async save(actorSubject: string, input: AdminIdentityInput) {
      return db.transaction(async (transaction) => {
        const [actor] = await transaction.select().from(adminAllowlist)
          .where(and(
            eq(adminAllowlist.subject, actorSubject),
            eq(adminAllowlist.active, true),
            eq(adminAllowlist.role, "super_admin"),
          )).limit(1);
        if (!actor) {
          throw new AdminAuthorizationError("Only an active super admin can manage accounts.");
        }

        const [previous] = await transaction.select().from(adminAllowlist)
          .where(eq(adminAllowlist.subject, input.subject)).limit(1);
        const nextActive = input.active ?? true;

        if (previous?.subject === actorSubject && (!nextActive || input.role !== "super_admin")) {
          throw new AdminAccountStateError("You cannot deactivate or demote your own super-admin account.");
        }

        if (previous?.active && previous.role === "super_admin" && (!nextActive || input.role !== "super_admin")) {
          const activeSuperAdmins = await transaction.select({ subject: adminAllowlist.subject }).from(adminAllowlist)
            .where(and(
              eq(adminAllowlist.active, true),
              eq(adminAllowlist.role, "super_admin"),
            ))
            .for("update");
          if (activeSuperAdmins.length <= 1) {
            throw new AdminAccountStateError("At least one active super admin must remain.");
          }
        }

        const nextEmail = input.email ?? null;
        if (
          previous
          && previous.displayName === input.displayName
          && previous.email === nextEmail
          && previous.role === input.role
          && previous.active === nextActive
        ) {
          return previous;
        }

        const [next] = await transaction.insert(adminAllowlist).values({
          subject: input.subject,
          email: nextEmail,
          displayName: input.displayName,
          role: input.role,
          active: nextActive,
        }).onConflictDoUpdate({
          target: adminAllowlist.subject,
          set: {
            email: nextEmail,
            displayName: input.displayName,
            role: input.role,
            active: nextActive,
            updatedAt: new Date(),
          },
        }).returning();
        await transaction.insert(auditEvents).values({
          actorSubject,
          action: previous ? "account.updated" : "account.created",
          entityType: "admin_allowlist",
          entityId: input.subject,
          previousState: auditState(previous),
          nextState: auditState(next),
        });
        return next;
      });
    },
  };
}

export function createManagedContentRepository(db: AdminDatabase) {
  return {
    list(kind: ManagedContentKind) {
      return db.select().from(managedContent)
        .where(eq(managedContent.kind, kind))
        .orderBy(desc(managedContent.updatedAt));
    },

    listPublished(kind: ManagedContentKind) {
      return db.select().from(managedContent)
        .where(and(
          eq(managedContent.kind, kind),
          ne(managedContent.status, "archived"),
          isNotNull(managedContent.publishedPayload),
        ))
        .orderBy(desc(managedContent.publishedOn));
    },

    async findById(id: string) {
      const [record] = await db.select().from(managedContent).where(eq(managedContent.id, id)).limit(1);
      return record ?? null;
    },

    async seedPublished(input: ManagedContentInput) {
      const [existing] = await db.select().from(managedContent)
        .where(and(eq(managedContent.kind, input.kind), eq(managedContent.slug, input.slug)))
        .limit(1);
      if (existing) return existing;

      return db.transaction(async (transaction) => {
        const today = new Date().toISOString().slice(0, 10);
        const [record] = await transaction.insert(managedContent).values({
          id: input.id ?? randomUUID(),
          kind: input.kind,
          slug: input.slug,
          title: input.title,
          workingPayload: input.payload,
          publishedPayload: input.payload,
          status: "published",
          publishedOn: today,
          createdBy: "system:local-bootstrap",
          updatedBy: "system:local-bootstrap",
        }).returning();
        await transaction.insert(auditEvents).values({
          actorSubject: "system:local-bootstrap",
          action: `${input.kind}.seeded`,
          entityType: "managed_content",
          entityId: record.id,
          nextState: auditState(record),
        });
        return record;
      });
    },

    async saveDraft(actorSubject: string, input: ManagedContentInput) {
      return db.transaction(async (transaction) => {
        const [previous] = input.id
          ? await transaction.select().from(managedContent).where(eq(managedContent.id, input.id)).limit(1)
          : [];
        if (input.id && !previous) return null;
        if (previous && previous.kind !== input.kind) {
          throw new ManagedContentStateError("The content type cannot be changed.");
        }

        const [next] = previous
          ? await transaction.update(managedContent).set({
            slug: input.slug,
            title: input.title,
            workingPayload: input.payload,
            status: "draft",
            updatedBy: actorSubject,
            updatedAt: new Date(),
          }).where(eq(managedContent.id, previous.id)).returning()
          : await transaction.insert(managedContent).values({
            id: randomUUID(),
            kind: input.kind,
            slug: input.slug,
            title: input.title,
            workingPayload: input.payload,
            status: "draft",
            createdBy: actorSubject,
            updatedBy: actorSubject,
          }).returning();

        await transaction.insert(auditEvents).values({
          actorSubject,
          action: previous ? `${input.kind}.updated` : `${input.kind}.created`,
          entityType: "managed_content",
          entityId: next.id,
          previousState: auditState(previous),
          nextState: auditState(next),
        });
        return next;
      });
    },

    async publish(actorSubject: string, id: string, publishedOn: string) {
      return db.transaction(async (transaction) => {
        const [previous] = await transaction.select().from(managedContent).where(eq(managedContent.id, id)).limit(1);
        if (!previous) return null;
        if (previous.status === "archived") throw new ManagedContentStateError("Restore archived content before publishing it.");

        const [next] = await transaction.update(managedContent).set({
          publishedPayload: previous.workingPayload,
          status: "published",
          publishedOn,
          updatedBy: actorSubject,
          updatedAt: new Date(),
        }).where(eq(managedContent.id, id)).returning();
        await transaction.insert(auditEvents).values({
          actorSubject,
          action: `${previous.kind}.published`,
          entityType: "managed_content",
          entityId: id,
          previousState: auditState(previous),
          nextState: auditState(next),
        });
        return next;
      });
    },

    archive(actorSubject: string, id: string) {
      return changeManagedContentStatus(db, actorSubject, id, "archived", "archived");
    },

    restore(actorSubject: string, id: string) {
      return changeManagedContentStatus(db, actorSubject, id, "draft", "restored");
    },
  };
}

export class ManagedContentStateError extends Error {}

async function changeManagedContentStatus(
  db: AdminDatabase,
  actorSubject: string,
  id: string,
  status: "draft" | "archived",
  action: string,
) {
  return db.transaction(async (transaction) => {
    const [previous] = await transaction.select().from(managedContent).where(eq(managedContent.id, id)).limit(1);
    if (!previous) return null;
    if (status === "draft" && previous.status !== "archived") {
      throw new ManagedContentStateError("Only archived content can be restored.");
    }

    const [next] = await transaction.update(managedContent).set({
      status,
      updatedBy: actorSubject,
      updatedAt: new Date(),
    }).where(eq(managedContent.id, id)).returning();
    await transaction.insert(auditEvents).values({
      actorSubject,
      action: `${previous.kind}.${action}`,
      entityType: "managed_content",
      entityId: id,
      previousState: auditState(previous),
      nextState: auditState(next),
    });
    return next;
  });
}

export function createResearchRepository(db: AdminDatabase) {
  return {
    async list(status?: "draft" | "published" | "archived") {
      const query = db.select().from(researchResources);
      return status
        ? query.where(eq(researchResources.status, status)).orderBy(desc(researchResources.updatedAt))
        : query.orderBy(desc(researchResources.updatedAt));
    },

    async findById(id: string) {
      const [record] = await db.select().from(researchResources)
        .where(eq(researchResources.id, id)).limit(1);
      return record ?? null;
    },

    async createDraft(actorSubject: string, input: ResearchDraftInput) {
      return db.transaction(async (transaction) => {
        const [record] = await transaction.insert(researchResources).values({
          id: randomUUID(),
          ...input,
          status: "draft",
          publishedOn: null,
          createdBy: actorSubject,
          updatedBy: actorSubject,
        }).returning();
        await transaction.insert(auditEvents).values({
          actorSubject,
          action: "research.created",
          entityType: "research_resource",
          entityId: record.id,
          nextState: auditState(record),
        });
        return record;
      });
    },

    async updateDraft(actorSubject: string, id: string, input: ResearchDraftInput) {
      return db.transaction(async (transaction) => {
        const [previous] = await transaction.select().from(researchResources)
          .where(eq(researchResources.id, id)).limit(1);
        if (!previous) return null;
        if (previous.status !== "draft") {
          throw new ResearchStateError("Only draft research can be edited.");
        }

        const [next] = await transaction.update(researchResources).set({
          ...input,
          updatedBy: actorSubject,
          updatedAt: new Date(),
        }).where(eq(researchResources.id, id)).returning();
        await transaction.insert(auditEvents).values({
          actorSubject,
          action: "research.updated",
          entityType: "research_resource",
          entityId: id,
          previousState: auditState(previous),
          nextState: auditState(next),
        });
        return next;
      });
    },

    async publish(actorSubject: string, id: string, publishedOn: string) {
      return changeResearchStatus(db, actorSubject, id, "draft", "published", publishedOn, "research.published");
    },

    async archive(actorSubject: string, id: string) {
      return changeResearchStatus(db, actorSubject, id, ["draft", "published"], "archived", null, "research.archived");
    },

    async restore(actorSubject: string, id: string) {
      return changeResearchStatus(db, actorSubject, id, "archived", "draft", null, "research.restored");
    },
  };
}

async function changeResearchStatus(
  db: AdminDatabase,
  actorSubject: string,
  id: string,
  expectedStatus: "draft" | "published" | "archived" | Array<"draft" | "published" | "archived">,
  status: "draft" | "published" | "archived",
  publishedOn: string | null,
  action: string,
) {
  return db.transaction(async (transaction) => {
    const [previous] = await transaction.select().from(researchResources)
      .where(eq(researchResources.id, id)).limit(1);
    if (!previous) return null;

    const allowed = Array.isArray(expectedStatus)
      ? expectedStatus.includes(previous.status)
      : previous.status === expectedStatus;
    if (!allowed) {
      throw new ResearchStateError(`Research cannot move from ${previous.status} to ${status}.`);
    }

    const [next] = await transaction.update(researchResources).set({
      status,
      publishedOn,
      updatedBy: actorSubject,
      updatedAt: new Date(),
    }).where(eq(researchResources.id, id)).returning();
    await transaction.insert(auditEvents).values({
      actorSubject,
      action,
      entityType: "research_resource",
      entityId: id,
      previousState: auditState(previous),
      nextState: auditState(next),
    });
    return next;
  });
}

export function createAuditRepository(db: AdminDatabase) {
  return {
    listRecent(limit = 50) {
      const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 200);
      return db.select().from(auditEvents).orderBy(desc(auditEvents.createdAt)).limit(safeLimit);
    },
  };
}

export async function getContentMetrics(db: AdminDatabase) {
  const [[admins], [users], [research], [audits]] = await Promise.all([
    db.select({ value: count() }).from(adminAllowlist).where(and(
      eq(adminAllowlist.active, true),
      inArray(adminAllowlist.role, ["super_admin", "admin"]),
    )),
    db.select({ value: count() }).from(adminAllowlist).where(and(
      eq(adminAllowlist.active, true),
      eq(adminAllowlist.role, "user"),
    )),
    db.select({ value: count() }).from(researchResources),
    db.select({ value: count() }).from(auditEvents),
  ]);

  return {
    activeAdmins: admins.value,
    activeUsers: users.value,
    researchResources: research.value,
    auditEvents: audits.value,
  };
}
