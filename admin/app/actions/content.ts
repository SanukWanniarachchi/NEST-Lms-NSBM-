"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminDatabase } from "@admin/db/client";
import { requireAdminSession } from "@admin/lib/auth/session";
import { AnnouncementSchema, CourseFormSchema, parseCoursePayload, type ContentFormState } from "@admin/lib/content/validation";
import { createManagedContentRepository, ManagedContentStateError } from "@admin/lib/data/repositories";

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "");
}

export async function saveAnnouncement(_previous: ContentFormState, formData: FormData): Promise<ContentFormState> {
  const session = await requireAdminSession();
  const parsed = AnnouncementSchema.safeParse({
    id: text(formData, "id") || undefined,
    slug: text(formData, "slug"),
    title: text(formData, "title"),
    date: text(formData, "date"),
    category: text(formData, "category"),
    summary: text(formData, "summary"),
    actionLabel: text(formData, "actionLabel") || undefined,
    actionHref: text(formData, "actionHref") || undefined,
    featured: formData.get("featured") === "on",
  });
  if (!parsed.success) return { status: "error", message: "Review the announcement details.", errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };

  try {
    const { id, slug, title, ...payload } = parsed.data;
    const saved = await createManagedContentRepository(await getAdminDatabase()).saveDraft(session.subject, {
      id,
      kind: "announcement",
      slug,
      title,
      payload: { slug, title, ...payload },
    });
    if (!saved) throw new ManagedContentStateError("The announcement no longer exists.");
  } catch (error) {
    if (error instanceof Error && /unique|duplicate/i.test(error.message)) return { status: "error", message: "That announcement slug is already in use." };
    return { status: "error", message: "The announcement could not be saved." };
  }

  revalidatePath("/announcements");
  redirect("/announcements?changed=saved");
}

export async function saveCourse(_previous: ContentFormState, formData: FormData): Promise<ContentFormState> {
  const session = await requireAdminSession();
  const parsed = CourseFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "Review the course details.", errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  const course = parseCoursePayload(parsed.data);
  if (!course.success) return { status: "error", message: course.message };

  try {
    const saved = await createManagedContentRepository(await getAdminDatabase()).saveDraft(session.subject, {
      id: parsed.data.id,
      kind: "course",
      slug: parsed.data.slug,
      title: parsed.data.title,
      payload: course.payload,
    });
    if (!saved) throw new ManagedContentStateError("The course no longer exists.");
  } catch (error) {
    if (error instanceof Error && /unique|duplicate/i.test(error.message)) return { status: "error", message: "That course slug is already in use." };
    return { status: "error", message: "The course could not be saved." };
  }

  revalidatePath("/courses");
  redirect("/courses?changed=saved");
}

async function changeContent(formData: FormData, action: "publish" | "archive" | "restore") {
  const session = await requireAdminSession();
  const id = text(formData, "id");
  const kind = text(formData, "kind") === "course" ? "course" : "announcement";
  if (!id) redirect(`/${kind === "course" ? "courses" : "announcements"}?error=missing`);

  const repository = createManagedContentRepository(await getAdminDatabase());
  try {
    const changed = action === "publish"
      ? await repository.publish(session.subject, id, new Date().toISOString().slice(0, 10))
      : action === "archive"
        ? await repository.archive(session.subject, id)
        : await repository.restore(session.subject, id);
    if (!changed) throw new ManagedContentStateError("The content no longer exists.");
  } catch (error) {
    const reason = error instanceof ManagedContentStateError ? "state" : "failed";
    redirect(`/${kind === "course" ? "courses" : "announcements"}?error=${reason}`);
  }

  const path = kind === "course" ? "/courses" : "/announcements";
  revalidatePath(path);
  redirect(`${path}?changed=${action}`);
}

export async function publishContent(formData: FormData) { return changeContent(formData, "publish"); }
export async function archiveContent(formData: FormData) { return changeContent(formData, "archive"); }
export async function restoreContent(formData: FormData) { return changeContent(formData, "restore"); }
