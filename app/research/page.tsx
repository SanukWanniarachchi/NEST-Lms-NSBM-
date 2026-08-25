import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SectionHeading } from "@/components/section-heading";
import { ArrowRightIcon, BookIcon, CheckIcon, ChartIcon } from "@/components/icons";
import { publications, researchProjects } from "@/data/research";

export const metadata: Metadata = {
  title: "Research",
  description: "Explore NEST Club research projects, publication plans, and student-led academic collaboration.",
};

export default function ResearchPage() {
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
            <SectionHeading eyebrow="Ongoing work" title="Research projects" copy="Current and planned research tracks are kept lightweight, student-friendly, and open to future collaboration." />
            <div className="research-grid">
              {researchProjects.map((project) => (
                <article className="research-card" key={project.title}>
                  <span className="metric-icon metric-icon--blue"><ChartIcon /></span>
                  <p className="eyebrow">{project.area}</p>
                  <h2>{project.title}</h2>
                  <p>{project.summary}</p>
                  <strong>{project.status}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section publications-section">
          <div className="shell">
            <SectionHeading eyebrow="Publications" title="Publication pipeline" copy="This area is reserved for future papers, reports, posters, and student-led publications from NEST contributors." />
            <div className="publication-list">
              {publications.map((publication) => (
                <article key={publication.title}>
                  <span><BookIcon /></span>
                  <div>
                    <p className="eyebrow">{publication.status} · {publication.year}</p>
                    <h2>{publication.title}</h2>
                    <strong>{publication.authors}</strong>
                    <p>{publication.summary}</p>
                    {publication.href ? <Link href={publication.href} className="text-link">Open publication <ArrowRightIcon /></Link> : <small>Publication link will be added when available.</small>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section research-note-section">
          <div className="shell service-note">
            <strong><CheckIcon /> Research content is static for this release</strong>
            <p>Projects and publications can be updated through the research data file without adding a backend or increasing the site runtime requirements.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
