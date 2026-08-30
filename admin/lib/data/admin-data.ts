import "server-only";
import { getAdminDatabase } from "../../db/client";
import { createAdminRepository, getContentMetrics } from "./repositories";

export async function isAdminSubjectAllowed(subject: string) {
  return createAdminRepository(await getAdminDatabase()).isAllowed(subject);
}

export async function getAdminDashboardMetrics() {
  return getContentMetrics(await getAdminDatabase());
}
