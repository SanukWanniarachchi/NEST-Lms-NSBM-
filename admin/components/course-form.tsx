"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveCourse } from "@admin/app/actions/content";
import type { CourseContent } from "@/types/lms";
import type { ContentFormState } from "@admin/lib/content/validation";

const initialState: ContentFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Saving..." : "Save working draft"}</button>;
}

function ErrorText({ state, name }: { state: ContentFormState; name: string }) {
  return state.errors?.[name]?.[0] ? <span className="field-error">{state.errors[name][0]}</span> : null;
}

export function CourseForm({ id, course }: { id: string; course: CourseContent }) {
  const [state, action] = useActionState(saveCourse, initialState);
  return <form action={action} className="research-form course-admin-form">
    <input type="hidden" name="id" value={id} />
    {state.status === "error" && <div className="form-message form-message--error" role="alert">{state.message}</div>}
    <div className="form-grid">
      <label className="form-field form-field--wide"><span>Course title</span><input name="title" defaultValue={course.title} required /><ErrorText state={state} name="title" /></label>
      <label className="form-field"><span>URL slug</span><input name="slug" defaultValue={course.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label>
      <label className="form-field"><span>Short title</span><input name="shortTitle" defaultValue={course.shortTitle} required /></label>
      <label className="form-field"><span>Category</span><select name="category" defaultValue={course.category}><option>Cybersecurity</option><option>Networking</option><option>Robotics</option></select></label>
      <label className="form-field"><span>Level</span><select name="level" defaultValue={course.level}><option>Beginner</option><option>Beginner to intermediate</option></select></label>
      <label className="form-field"><span>Eyebrow</span><input name="eyebrow" defaultValue={course.eyebrow} required /></label>
      <label className="form-field"><span>Duration</span><input name="duration" defaultValue={course.duration} required /></label>
      <label className="form-field form-field--wide"><span>Catalogue description</span><textarea name="description" defaultValue={course.description} required rows={3} /></label>
      <label className="form-field form-field--wide"><span>Course introduction</span><textarea name="longDescription" defaultValue={course.longDescription} required rows={4} /></label>
      <label className="form-field"><span>Image</span><select name="imageKey" defaultValue={course.imageKey}><option value="cybersecurity">Cybersecurity artwork</option><option value="networking">Networking artwork</option><option value="robotics">Robotics artwork</option></select></label>
      <label className="form-field"><span>Accent</span><select name="accent" defaultValue={course.accent}><option value="violet">Violet</option><option value="cyan">Cyan</option><option value="amber">Amber</option></select></label>
      <label className="form-field form-field--wide"><span>Image description</span><input name="imageAlt" defaultValue={course.imageAlt} required /></label>
      <label className="form-field"><span>Instructor name</span><input name="instructorName" defaultValue={course.instructor.name} required /></label>
      <label className="form-field"><span>Instructor role</span><input name="instructorRole" defaultValue={course.instructor.role} required /></label>
      <label className="form-field"><span>Instructor initials</span><input name="instructorInitials" defaultValue={course.instructor.initials} required maxLength={6} /></label>
      <label className="form-field"><span>Instructor biography</span><textarea name="instructorBio" defaultValue={course.instructor.bio} required rows={4} /></label>
      <label className="form-field form-field--wide"><span>Learning outcomes</span><textarea name="outcomes" defaultValue={course.outcomes.join("\n")} required rows={6} /><small>One outcome per line.</small></label>
      <label className="form-field form-field--wide"><span>Curriculum modules</span><textarea className="code-field" name="modulesJson" defaultValue={JSON.stringify(course.modules, null, 2)} required rows={28} spellCheck={false} /><small>Validated module and lesson data. Video URL, duration, and orientation are stored with each lesson.</small></label>
    </div>
    <div className="form-actions"><SubmitButton /><Link className="button-link" href="/courses">Cancel</Link></div>
  </form>;
}
