import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SectionHeading } from "@/components/section-heading";
import { ArrowRightIcon, ClockIcon } from "@/components/icons";
import { announcements } from "@/data/announcements";

export const metadata: Metadata = {
  title: "Announcements",
  description: "Read the latest NEST Club announcements, updates, research notices, and community news.",
};

export default function AnnouncementsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero page-hero--announcements">
          <div className="shell centered-intro">
            <p className="eyebrow">Announcement board</p>
            <h1>Club updates in one clear place.</h1>
            <p>Follow important NEST notices, learning updates, community opportunities, and research progress without needing a heavy backend.</p>
          </div>
        </section>

        <section className="section announcements-section">
          <div className="shell">
            <SectionHeading eyebrow="Latest updates" title="Announcements" copy="Updates are listed by date so students can quickly scan what changed and what needs attention." />
            <div className="announcement-list">
              {announcements.length === 0 && <p>No announcements have been published yet. Check back for club updates.</p>}
              {announcements.map((announcement) => (
                <article key={`${announcement.date}-${announcement.title}`} className={announcement.featured ? "announcement-card announcement-card--featured" : "announcement-card"}>
                  <div className="announcement-date">
                    <ClockIcon />
                    <time dateTime={announcement.date}>{announcement.date}</time>
                  </div>
                  <div>
                    <span className="category-pill">{announcement.category}</span>
                    <h2>{announcement.title}</h2>
                    <p>{announcement.summary}</p>
                    {announcement.actionHref && announcement.actionLabel ? <Link href={announcement.actionHref} className="text-link">{announcement.actionLabel} <ArrowRightIcon /></Link> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
