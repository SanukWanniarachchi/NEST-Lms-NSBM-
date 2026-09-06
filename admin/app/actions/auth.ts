"use server";

import { timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getLocalAdminName, getLocalAdminSubject, isLocalAuthEnabled } from "@admin/lib/auth/config";
import { createAdminSession, deleteAdminSession } from "@admin/lib/auth/session";
import { getAuthorizedAdminIdentity } from "@admin/lib/data/admin-data";

const LoginSchema = z.object({
  accessCode: z.string().trim().min(8).max(128),
});

function codesMatch(value: string, expected: string) {
  const supplied = Buffer.from(value);
  const configured = Buffer.from(expected);
  return supplied.length === configured.length && timingSafeEqual(supplied, configured);
}

export async function login(formData: FormData) {
  if (!isLocalAuthEnabled()) redirect("/?error=unavailable");

  const parsed = LoginSchema.safeParse({ accessCode: formData.get("accessCode") });
  const expected = process.env.NEST_DEV_ADMIN_CODE;
  if (!parsed.success || !expected || !codesMatch(parsed.data.accessCode, expected)) {
    redirect("/?error=invalid");
  }

  const subject = getLocalAdminSubject();
  const identity = await getAuthorizedAdminIdentity(subject);
  if (!identity || identity.role === "user") redirect("/?error=forbidden");

  await createAdminSession({
    subject: identity.subject,
    role: identity.role,
    name: identity.displayName || getLocalAdminName(),
  });
  redirect("/dashboard");
}

export async function logout() {
  await deleteAdminSession();
  redirect("/");
}
