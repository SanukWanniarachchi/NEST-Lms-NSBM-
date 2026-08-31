import Link from "next/link";
import { notFound } from "next/navigation";
import { ResearchForm } from "@admin/components/research-form";
import { getAdminDatabase } from "@admin/db/client";
import { createResearchRepository } from "@admin/lib/data/repositories";

export const metadata = { title: "Edit research" };

export default async function EditResearchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await createResearchRepository(await getAdminDatabase()).findById(id);
  if (!record) notFound();

  return <div className="admin-page admin-page--form">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/research">Research</Link><span>/</span><Link href={`/research/${record.id}/preview`}>{record.title}</Link><span>/</span><span>Edit</span></nav>
    <header className="page-heading"><div><p className="eyebrow">Edit draft</p><h1>{record.title}</h1><p>Changes remain private until this draft is published.</p></div></header>
    {record.status === "draft" ? <ResearchForm initialValues={{ id: record.id, title: record.title, slug: record.slug, summary: record.summary, type: record.type, authors: record.authors.join("\n"), href: record.href, tags: record.tags.join(", ") }} /> : <div className="form-message form-message--error">Only draft records can be edited. Restore an archived record before editing it.</div>}
  </div>;
}
