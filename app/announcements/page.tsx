import { publicPageUrl } from "@/lib/public-site";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SectionHeading } from "@/components/section-heading";
import { ArrowRightIcon, ClockIcon } from "@/components/icons";
import { announcements } from "@/data/announcements";
import { eventHighlights } from "@/data/event-highlights";

export const metadata: Metadata = { alternates: { canonical: publicPageUrl("announcements/") },
  title: "Announcements",
  description: "Read the latest NEST Club announcements, updates, research notices, and community news.",
};

export default function AnnouncementsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero page-hero--announcements">
          <div className="shell centered-intro">
            <p className="eyebrow">Announcement board</p>
            <h1>Club updates in one clear place.</h1>
            <p>Follow NEST notices, learning updates, and moments from our workshops and community events.</p>
          </div>
        </section>

        <section className="section event-highlights-section">
          <div className="shell">
            <SectionHeading eyebrow="NEST in action" title="Learning beyond the classroom" copy="Moments from our school workshops and NSBM Open Day." />
            <div className="event-highlights-grid">
              {eventHighlights.map((event) => <article className="event-highlight" key={event.id} id={event.id}>
                <div className="event-highlight__cover"><Image src={event.photos[0].image} alt={event.photos[0].alt} sizes="(max-width: 800px) 100vw, 50vw" /></div>
                <div className="event-highlight__body">
                  <span className="category-pill">{event.category}</span>
                  <h2>{event.title}</h2>
                  <p>{event.summary}</p>
                  <details className="event-gallery">
                    <summary>View {event.photos.length} photos <span aria-hidden="true">+</span></summary>
                    <div className="event-gallery__grid">{event.photos.map((photo) => <figure key={photo.alt}>
                      <Image src={photo.image} alt={photo.alt} sizes="(max-width: 800px) 50vw, 25vw" />
                    </figure>)}</div>
                  </details>
                </div>
              </article>)}
            </div>
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
