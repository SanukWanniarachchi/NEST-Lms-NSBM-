import "server-only";
import { getAdminDatabase } from "../../db/client";
import { createAdminRepository, createManagedContentRepository, getContentMetrics } from "./repositories";
import type { ManagedContentKind } from "@admin/db/schema";

export async function isAdminSubjectAllowed(subject: string) {
  return createAdminRepository(await getAdminDatabase()).isAllowed(subject);
}

export async function getAuthorizedAdminIdentity(subject: string) {
  return createAdminRepository(await getAdminDatabase()).findAuthorizedBySubject(subject);
}

export async function getManagedAccounts() {
  return createAdminRepository(await getAdminDatabase()).list();
}

export async function getManagedContent(kind: ManagedContentKind) {
  return createManagedContentRepository(await getAdminDatabase()).list(kind);
}

export async function getManagedContentRecord(id: string) {
  return createManagedContentRepository(await getAdminDatabase()).findById(id);
}

export async function getAdminDashboardMetrics() {
  return getContentMetrics(await getAdminDatabase());
}
