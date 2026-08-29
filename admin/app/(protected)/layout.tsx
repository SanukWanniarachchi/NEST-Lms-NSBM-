import type { ReactNode } from "react";
import { AdminShell } from "@admin/components/admin-shell";
import { requireAdminSession } from "@admin/lib/auth/session";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();
  return <AdminShell session={session}>{children}</AdminShell>;
}
