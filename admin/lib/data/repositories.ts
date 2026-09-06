import { randomUUID } from "node:crypto";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import type { AdminDatabase } from "../../db/connection";
import { adminAllowlist, auditEvents, researchResources, type AdminRole } from "../../db/schema";

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
