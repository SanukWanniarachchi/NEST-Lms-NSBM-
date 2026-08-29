import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SectionHeading } from "@/components/section-heading";
import { ArrowRightIcon, BookIcon, DocumentIcon, PlayIcon } from "@/components/icons";
import { researchResources } from "@/data/research";
import { isPublishedResearchResource, type ResearchResource } from "@/types/content";

export const metadata: Metadata = {
  title: "Research",
  description: "Explore approved NEST Club research papers, videos, documents, and student-led academic work.",
};

function ResourceIcon({ type }: { type: ResearchResource["type"] }) {
  if (type === "Video") return <PlayIcon />;
  if (type === "Document") return <DocumentIcon />;
  return <BookIcon />;
}

export default function ResearchPage() {
  const publishedResources = researchResources.filter(isPublishedResearchResource);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero page-hero--research">
          <div className="shell centered-intro">
            <p className="eyebrow">Research at NEST</p>
            <h1>Student curiosity, shaped into shared research.</h1>
            <p>NEST supports small, practical research efforts around technology learning, cybersecurity awareness, networking, robotics, and peer-led education.</p>
          </div>
        </section>

        <section className="section research-section">
          <div className="shell">
            <SectionHeading eyebrow="Research library" title="Published research and resources" copy="Approved papers, project reports, videos, and supporting documents from NEST contributors are collected here." />
            {publishedResources.length > 0 ? (
              <div className="research-resource-grid">
                {publishedResources.map((resource) => (
                  <article className="research-resource-card" key={resource.id}>
                    <span className="research-resource-card__icon"><ResourceIcon type={resource.type} /></span>
                    <p className="eyebrow">{resource.type} · {resource.publishedOn}</p>
                    <h2>{resource.title}</h2>
                    <p>{resource.summary}</p>
                    <strong>{resource.authors.join(", ")}</strong>
                    <div className="research-resource-card__tags">{resource.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <Link href={resource.href} target="_blank" rel="noopener noreferrer" className="text-link">Open resource <ArrowRightIcon /></Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="research-empty">
                <span><BookIcon /></span>
                <p className="eyebrow">No published research</p>
                <h2>Research resources will appear here once approved.</h2>
                <p>NEST will use this library for reviewed research papers, project reports, videos, and supporting documents. New entries will be published with clear authorship, dates, topics, and source links.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
