import Link from "next/link";
import { archiveResearch, restoreResearch } from "@admin/app/actions/research";
import { getAdminDatabase } from "@admin/db/client";
import { createResearchRepository } from "@admin/lib/data/repositories";

export const metadata = { title: "Research" };

type Status = "draft" | "published" | "archived";
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const statusLabels: Record<Status, string> = { draft: "Draft", published: "Published", archived: "Archived" };
const typeLabels = { research_paper: "Research paper", video: "Video", document: "Document" };

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function ResearchAdminPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = valueOf(params.q).trim().toLowerCase();
  const requestedStatus = valueOf(params.status);
  const status = (["draft", "published", "archived"] as const).includes(requestedStatus as Status)
    ? requestedStatus as Status
    : "all";
  const allRecords = await createResearchRepository(await getAdminDatabase()).list();
  const records = allRecords.filter((record) => {
    const matchesStatus = status === "all" || record.status === status;
    const searchable = [record.title, record.summary, record.slug, ...record.authors, ...record.tags].join(" ").toLowerCase();
    return matchesStatus && (!query || searchable.includes(query));
  });
  const counts = allRecords.reduce((result, record) => ({ ...result, [record.status]: result[record.status] + 1 }), {
    draft: 0,
    published: 0,
    archived: 0,
  });
  const changed = valueOf(params.changed);

  return <div className="admin-page">
    <header className="page-heading"><div><p className="eyebrow">Managed collection</p><h1>Research</h1><p>Create, review, and publish papers, videos, and document links from one audited workflow.</p></div><Link href="/research/new" className="admin-button">Add research</Link></header>

    {changed && <div className="form-message form-message--success" role="status">Research was {changed === "publish" ? "published" : changed === "archive" ? "archived" : "restored to drafts"}.</div>}
    {params.error && <div className="form-message form-message--error" role="alert">That research action could not be completed. Refresh the page and try again.</div>}

    <section className="research-summary" aria-label="Research status summary">
      <div><strong>{allRecords.length}</strong><span>All records</span></div>
      <div><strong>{counts.draft}</strong><span>Drafts</span></div>
      <div><strong>{counts.published}</strong><span>Published</span></div>
      <div><strong>{counts.archived}</strong><span>Archived</span></div>
    </section>

    <form className="collection-toolbar" method="get">
      <label><span className="sr-only">Search research</span><input type="search" name="q" defaultValue={valueOf(params.q)} placeholder="Search titles, authors, or tags" /></label>
      <label><span className="sr-only">Filter by status</span><select name="status" defaultValue={status}><option value="all">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
      <button type="submit">Filter</button>
      {(query || status !== "all") && <Link href="/research" className="button-link">Clear</Link>}
    </form>

    {records.length > 0 ? <section className="research-collection" aria-label="Research records">
      {records.map((record) => <article className="research-row" key={record.id}>
        <div className="research-row__main"><div className="record-meta"><span className={`status-pill status-pill--${record.status}`}>{statusLabels[record.status]}</span><span>{typeLabels[record.type]}</span><span>Updated {record.updatedAt.toLocaleDateString("en-GB")}</span></div><h2>{record.title}</h2><p>{record.summary}</p><div className="record-tags">{record.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
        <div className="record-actions"><Link href={`/research/${record.id}/preview`}>Preview</Link>{record.status === "draft" && <Link href={`/research/${record.id}/edit`}>Edit</Link>}{record.status !== "archived" ? <form action={archiveResearch}><input type="hidden" name="id" value={record.id} /><button type="submit">Archive</button></form> : <form action={restoreResearch}><input type="hidden" name="id" value={record.id} /><button type="submit">Restore</button></form>}</div>
      </article>)}
    </section> : <section className="empty-collection"><span>0</span><h2>{allRecords.length === 0 ? "No research records" : "No matching research"}</h2><p>{allRecords.length === 0 ? "Create the first draft to begin the reviewed publishing workflow." : "Adjust the search or status filter to find another record."}</p>{allRecords.length === 0 && <Link href="/research/new" className="admin-button">Create first draft</Link>}</section>}
  </div>;
}
