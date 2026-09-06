import Link from "next/link";
import { archiveContent, publishContent, restoreContent } from "@admin/app/actions/content";
import { getManagedContent } from "@admin/lib/data/admin-data";
import type { Announcement } from "@/data/announcements";

export const metadata = { title: "Announcements" };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function valueOf(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] ?? "" : value ?? ""; }

export default async function AnnouncementsAdminPage({ searchParams }: { searchParams: SearchParams }) {
  const records = await getManagedContent("announcement");
  const params = await searchParams;
  const changed = valueOf(params.changed);

  return <div className="admin-page">
    <header className="page-heading"><div><p className="eyebrow">Managed collection</p><h1>Announcements</h1><p>Prepare club notices as drafts and publish reviewed updates into the public snapshot.</p></div><Link href="/announcements/new" className="admin-button">Add announcement</Link></header>
    {changed && <div className="form-message form-message--success" role="status">Announcement was {changed}.</div>}
    {params.error && <div className="form-message form-message--error" role="alert">That announcement action could not be completed.</div>}
    {records.length ? <section className="research-collection" aria-label="Managed announcements">{records.map((record) => {
      const announcement = record.workingPayload as Announcement;
      const hasLiveVersion = Boolean(record.publishedPayload) && record.status !== "archived";
      return <article className="research-row" key={record.id}><div><div className="record-meta"><span className={`status-pill status-pill--${record.status}`}>{record.status}</span>{hasLiveVersion && record.status === "draft" ? <span>Previous version remains live</span> : null}<span>{announcement.date}</span><span>{announcement.category}</span></div><h2>{record.title}</h2><p>{announcement.summary}</p></div><div className="record-actions"><Link href={`/announcements/${record.id}/edit`}>Edit</Link>{record.status !== "archived" && <form action={publishContent}><input type="hidden" name="id" value={record.id} /><input type="hidden" name="kind" value="announcement" /><button className="action-publish" type="submit">Publish</button></form>}{record.status !== "archived" ? <form action={archiveContent}><input type="hidden" name="id" value={record.id} /><input type="hidden" name="kind" value="announcement" /><button type="submit">Archive</button></form> : <form action={restoreContent}><input type="hidden" name="id" value={record.id} /><input type="hidden" name="kind" value="announcement" /><button type="submit">Restore</button></form>}</div></article>;
    })}</section> : <section className="empty-collection"><span>0</span><h2>No managed announcements</h2><p>Run the local seed or create the first announcement draft.</p></section>}
  </div>;
}
