"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@admin/lib/auth/session";
import { getAdminDatabase } from "@admin/db/client";
import { createResearchRepository, ResearchStateError } from "@admin/lib/data/repositories";
import {
  researchFormSchema,
  researchValuesFromFormData,
  type ResearchFormState,
} from "@admin/lib/research/validation";

function researchRoute(id?: string) {
  return id ? `/research/${encodeURIComponent(id)}/preview` : "/research";
}

export async function saveResearch(
  _previousState: ResearchFormState,
  formData: FormData,
): Promise<ResearchFormState> {
  const session = await requireAdminSession();
  const values = researchValuesFromFormData(formData);
  const parsed = researchFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { id, authors, tags, ...fields } = parsed.data;
  const repository = createResearchRepository(await getAdminDatabase());
  let record;
  try {
    record = id
      ? await repository.updateDraft(session.subject, id, { ...fields, authors, tags })
      : await repository.createDraft(session.subject, { ...fields, authors, tags });
  } catch (error) {
    if (error instanceof ResearchStateError) {
      return { status: "error", message: error.message };
    }
    return {
      status: "error",
      message: "The record could not be saved. Check that the URL slug is unique.",
      errors: { slug: ["This slug may already be in use."] },
    };
  }

  if (!record) return { status: "error", message: "The research record was not found." };
  revalidatePath("/research");
  redirect(`${researchRoute(record.id)}?saved=1`);
}

async function transitionResearch(formData: FormData, transition: "publish" | "archive" | "restore") {
  const session = await requireAdminSession();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/research?error=missing-record");

  const repository = createResearchRepository(await getAdminDatabase());
  try {
    const record = transition === "publish"
      ? await repository.publish(session.subject, id, new Date().toISOString().slice(0, 10))
      : transition === "archive"
        ? await repository.archive(session.subject, id)
        : await repository.restore(session.subject, id);
    if (!record) redirect("/research?error=missing-record");
  } catch (error) {
    if (error instanceof ResearchStateError) redirect("/research?error=invalid-transition");
    throw error;
  }

  revalidatePath("/research");
  revalidatePath(researchRoute(id));
  redirect(`/research?changed=${transition}`);
}

export async function publishResearch(formData: FormData) {
  return transitionResearch(formData, "publish");
}

export async function archiveResearch(formData: FormData) {
  return transitionResearch(formData, "archive");
}

export async function restoreResearch(formData: FormData) {
  return transitionResearch(formData, "restore");
}
