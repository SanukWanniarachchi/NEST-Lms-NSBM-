"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveResearch } from "@admin/app/actions/research";
import type { ResearchFormState, ResearchFormValues } from "@admin/lib/research/validation";

const initialState: ResearchFormState = { status: "idle" };

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Saving..." : editing ? "Save changes" : "Create draft"}</button>;
}

function FieldError({ state, name }: { state: ResearchFormState; name: keyof ResearchFormValues }) {
  const message = state.errors?.[name]?.[0];
  return message ? <span className="field-error">{message}</span> : null;
}

export function ResearchForm({ initialValues }: { initialValues?: ResearchFormValues }) {
  const [state, action] = useActionState(saveResearch, initialState);
  const editing = Boolean(initialValues?.id);

  return <form action={action} className="research-form">
    <input type="hidden" name="id" value={initialValues?.id ?? ""} />
    {state.status === "error" && <div className="form-message form-message--error" role="alert">{state.message}</div>}

    <div className="form-grid">
      <label className="form-field form-field--wide"><span>Title</span><input name="title" defaultValue={initialValues?.title} required minLength={3} maxLength={120} /><FieldError state={state} name="title" /></label>
      <label className="form-field"><span>URL slug</span><input name="slug" defaultValue={initialValues?.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={100} placeholder="secure-campus-networks" /><FieldError state={state} name="slug" /></label>
      <label className="form-field"><span>Resource type</span><select name="type" defaultValue={initialValues?.type ?? "research_paper"}><option value="research_paper">Research paper</option><option value="video">Video</option><option value="document">Document</option></select><FieldError state={state} name="type" /></label>
      <label className="form-field form-field--wide"><span>Summary</span><textarea name="summary" defaultValue={initialValues?.summary} required minLength={20} maxLength={600} rows={5} /><small>20-600 characters. Explain what readers will learn or find.</small><FieldError state={state} name="summary" /></label>
      <label className="form-field"><span>Authors</span><textarea name="authors" defaultValue={initialValues?.authors} required rows={4} placeholder="One author per line" /><small>Separate authors with new lines or commas.</small><FieldError state={state} name="authors" /></label>
      <label className="form-field"><span>Topic tags</span><textarea name="tags" defaultValue={initialValues?.tags} required rows={4} placeholder="Cybersecurity, Networking" /><small>Add up to 10 comma-separated topics.</small><FieldError state={state} name="tags" /></label>
      <label className="form-field form-field--wide"><span>Resource URL</span><input name="href" type="url" defaultValue={initialValues?.href} required placeholder="https://" /><small>Use an approved HTTP or HTTPS source.</small><FieldError state={state} name="href" /></label>
    </div>

    <div className="form-actions"><SubmitButton editing={editing} /><Link href={editing ? `/research/${initialValues?.id}/preview` : "/research"} className="button-link">Cancel</Link></div>
  </form>;
}
