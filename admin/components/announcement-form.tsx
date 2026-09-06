"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveAnnouncement } from "@admin/app/actions/content";
import type { Announcement } from "@/data/announcements";
import type { ContentFormState } from "@admin/lib/content/validation";

const initialState: ContentFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Saving..." : "Save draft"}</button>;
}

function ErrorText({ state, name }: { state: ContentFormState; name: string }) {
  return state.errors?.[name]?.[0] ? <span className="field-error">{state.errors[name][0]}</span> : null;
}

export function AnnouncementForm({ id, announcement, defaultDate = "" }: { id?: string; announcement?: Announcement & { slug: string }; defaultDate?: string }) {
  const [state, action] = useActionState(saveAnnouncement, initialState);
  return <form action={action} className="research-form">
    <input type="hidden" name="id" value={id ?? ""} />
    {state.status === "error" && <div className="form-message form-message--error" role="alert">{state.message}</div>}
    <div className="form-grid">
      <label className="form-field form-field--wide"><span>Title</span><input name="title" defaultValue={announcement?.title} required maxLength={140} /><ErrorText state={state} name="title" /></label>
      <label className="form-field"><span>URL slug</span><input name="slug" defaultValue={announcement?.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={120} /><ErrorText state={state} name="slug" /></label>
      <label className="form-field"><span>Date</span><input name="date" type="date" defaultValue={announcement?.date ?? defaultDate} required /><ErrorText state={state} name="date" /></label>
      <label className="form-field"><span>Category</span><select name="category" defaultValue={announcement?.category ?? "Notice"}><option>Event</option><option>Research</option><option>Workshop</option><option>Community</option><option>Notice</option></select></label>
      <label className="form-field account-active"><input name="featured" type="checkbox" defaultChecked={announcement?.featured} /><span>Featured announcement</span></label>
      <label className="form-field form-field--wide"><span>Summary</span><textarea name="summary" defaultValue={announcement?.summary} required minLength={20} maxLength={700} rows={5} /><ErrorText state={state} name="summary" /></label>
      <label className="form-field"><span>Action label</span><input name="actionLabel" defaultValue={announcement?.actionLabel} maxLength={80} /></label>
      <label className="form-field"><span>Action destination</span><input name="actionHref" defaultValue={announcement?.actionHref} maxLength={500} placeholder="/courses or https://" /><ErrorText state={state} name="actionHref" /></label>
    </div>
    <div className="form-actions"><SubmitButton /><Link className="button-link" href="/announcements">Cancel</Link></div>
  </form>;
}
