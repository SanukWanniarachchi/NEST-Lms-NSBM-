import Link from "next/link";
import { ResearchForm } from "@admin/components/research-form";

export const metadata = { title: "New research" };

export default function NewResearchPage() {
  return <div className="admin-page admin-page--form">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/research">Research</Link><span>/</span><span>New draft</span></nav>
    <header className="page-heading"><div><p className="eyebrow">New research</p><h1>Create a research draft</h1><p>Record the approved source details now, then preview the card before publishing it.</p></div></header>
    <ResearchForm />
  </div>;
}
