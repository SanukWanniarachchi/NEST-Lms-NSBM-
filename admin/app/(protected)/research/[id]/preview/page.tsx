import Link from "next/link";
import { notFound } from "next/navigation";
import { archiveResearch, publishResearch, restoreResearch } from "@admin/app/actions/research";
import { getAdminDatabase } from "@admin/db/client";
import { createResearchRepository } from "@admin/lib/data/repositories";

const typeLabels = { research_paper: "Research paper", video: "Video", document: "Document" };

export default async function ResearchPreviewPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params;
  const record = await createResearchRepository(await getAdminDatabase()).findById(id);
  if (!record) notFound();
  const saved = Boolean((await searchParams).saved);

  return <div className="admin-page admin-page--preview">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/research">Research</Link><span>/</span><span>Preview</span></nav>
    <header className="page-heading"><div><p className="eyebrow">Publication preview</p><h1>{record.title}</h1><p>This is how the research information will be presented when the public publishing bridge is enabled.</p></div><span className={`status-pill status-pill--${record.status}`}>{record.status}</span></header>
    {saved && <div className="form-message form-message--success" role="status">Draft saved successfully.</div>}
    <div className="preview-layout">
      <article className="public-resource-preview"><div className="record-meta"><span>{typeLabels[record.type]}</span>{record.publishedOn && <span>{record.publishedOn}</span>}</div><h2>{record.title}</h2><p>{record.summary}</p><strong>{record.authors.join(", ")}</strong><div className="record-tags">{record.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a href={record.href} target="_blank" rel="noopener noreferrer">Open resource</a></article>
      <aside className="preview-details"><h2>Record details</h2><dl><div><dt>Status</dt><dd>{record.status}</dd></div><div><dt>Slug</dt><dd>{record.slug}</dd></div><div><dt>Last updated</dt><dd>{record.updatedAt.toLocaleString("en-GB")}</dd></div></dl><div className="record-actions record-actions--stacked">{record.status === "draft" && <><Link href={`/research/${record.id}/edit`}>Edit draft</Link><form action={publishResearch}><input type="hidden" name="id" value={record.id} /><button type="submit" className="action-publish">Publish</button></form></>}{record.status !== "archived" ? <form action={archiveResearch}><input type="hidden" name="id" value={record.id} /><button type="submit">Archive</button></form> : <form action={restoreResearch}><input type="hidden" name="id" value={record.id} /><button type="submit">Restore to drafts</button></form>}</div></aside>
    </div>
  </div>;
}
