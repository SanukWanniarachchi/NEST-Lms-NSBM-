"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSuperAdminSession } from "@admin/lib/auth/session";
import { getAdminDatabase } from "@admin/db/client";
import {
  AdminAccountStateError,
  AdminAuthorizationError,
  createAdminRepository,
} from "@admin/lib/data/repositories";
import { AccountSchema, type AccountFormState } from "@admin/lib/accounts/validation";

export async function saveAccount(_previous: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const session = await requireSuperAdminSession();
  const parsed = AccountSchema.safeParse({
    subject: formData.get("subject"),
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    role: formData.get("role"),
    active: formData.get("active") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted account details.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const editing = formData.get("editing") === "true";
  try {
    await createAdminRepository(await getAdminDatabase()).save(session.subject, {
      ...parsed.data,
      email: parsed.data.email || null,
    });
  } catch (error) {
    if (error instanceof AdminAccountStateError || error instanceof AdminAuthorizationError) {
      return { status: "error", message: error.message };
    }
    if (error instanceof Error && /unique|duplicate/i.test(error.message)) {
      return { status: "error", message: "That email address is already assigned to another account." };
    }
    return { status: "error", message: "The account could not be saved. Try again." };
  }

  revalidatePath("/users");
  revalidatePath("/dashboard");
  redirect(`/users?changed=${editing ? "updated" : "created"}`);
}
