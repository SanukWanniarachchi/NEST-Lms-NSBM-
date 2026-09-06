import Link from "next/link";
import { archiveContent, publishContent, restoreContent } from "@admin/app/actions/content";
import { getManagedContent } from "@admin/lib/data/admin-data";
import type { CourseContent } from "@/types/lms";

export const metadata = { title: "Courses" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function valueOf(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] ?? "" : value ?? ""; }

export default async function CoursesAdminPage({ searchParams }: { searchParams: SearchParams }) {
  const records = await getManagedContent("course");
  const params = await searchParams;
  const changed = valueOf(params.changed);
  return <div className="admin-page">
    <header className="page-heading"><div><p className="eyebrow">Managed collection</p><h1>Courses</h1><p>Maintain course metadata, modules, lessons, activities, and portrait or landscape video settings.</p></div></header>
    {changed && <div className="form-message form-message--success" role="status">Course was {changed}.</div>}
    {params.error && <div className="form-message form-message--error" role="alert">That course action could not be completed.</div>}
    {records.length ? <section className="research-collection" aria-label="Managed courses">{records.map((record) => {
      const course = record.workingPayload as unknown as CourseContent;
      const lessonCount = course.modules.reduce((total, module) => total + module.lessons.length, 0);
      return <article className="research-row" key={record.id}><div><div className="record-meta"><span className={`status-pill status-pill--${record.status}`}>{record.status}</span>{record.publishedPayload && record.status === "draft" ? <span>Previous version remains live</span> : null}<span>{course.modules.length} modules</span><span>{lessonCount} lessons</span></div><h2>{record.title}</h2><p>{course.description}</p></div><div className="record-actions"><Link href={`/courses/${record.id}/edit`}>Edit</Link>{record.status !== "archived" && <form action={publishContent}><input type="hidden" name="id" value={record.id} /><input type="hidden" name="kind" value="course" /><button className="action-publish" type="submit">Publish</button></form>}{record.status !== "archived" ? <form action={archiveContent}><input type="hidden" name="id" value={record.id} /><input type="hidden" name="kind" value="course" /><button type="submit">Archive</button></form> : <form action={restoreContent}><input type="hidden" name="id" value={record.id} /><input type="hidden" name="kind" value="course" /><button type="submit">Restore</button></form>}</div></article>;
    })}</section> : <section className="empty-collection"><span>0</span><h2>No managed courses</h2><p>Run the local seed to import the current three public learning paths.</p></section>}
  </div>;
}
