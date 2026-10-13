import { publicPageUrl } from "@/lib/public-site";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { eventHighlights } from "@/data/event-highlights";
import { newsUpdates } from "@/data/news-updates";
import workshopPoster from "@/public/images/events/game-development-workshop/coming-soon.webp";

export const metadata: Metadata = {
  alternates: { canonical: publicPageUrl("news/") }, title: "News",
  description: "Upcoming NEST projects, workshop highlights, club notices, and learning updates in one place.",
};

export default function NewsPage() {
  return <><SiteHeader /><main id="main-content" tabIndex={-1}>
    <section className="page-hero page-hero--news"><div className="shell centered-intro">
      <p className="eyebrow">NEST News</p><h1>Club updates in one clear place.</h1>
      <p>Discover what is coming next, revisit our workshops, and follow the latest from the NEST community.</p>
      <nav className="news-section-links" aria-label="News sections">
        <a href="#upcoming-projects">Upcoming projects <span aria-hidden="true">↓</span></a><a href="#nest-in-action">NEST in action <span aria-hidden="true">↓</span></a><a href="#latest-updates">Latest updates <span aria-hidden="true">↓</span></a>
      </nav>
    </div></section>
    <section className="section upcoming-projects-section" id="upcoming-projects"><div className="shell">
      <SectionHeading eyebrow="On the horizon" title="Upcoming Projects" copy="A first look at the activities we are preparing for the NEST community." />
      <article className="upcoming-project" id="game-development-workshop">
        <div className="upcoming-project__poster"><Image src={workshopPoster} alt="Coming Soon poster for the NEST Game Development Workshop. Build · Code · Play. Stay Tuned!" priority sizes="(max-width: 800px) 100vw, 420px" /></div>
        <div className="upcoming-project__details"><span className="category-pill">Coming soon</span><p className="eyebrow">Build · Code · Play</p>
          <h2>Game Development Workshop</h2><p>Something new is taking shape at NEST. Stay tuned for our upcoming game development workshop.</p>
          <div className="upcoming-project__notice"><strong>Details to be announced</strong><p>The date, venue, workshop tools, and registration information will be shared here once confirmed.</p></div>
          <Link href="/community" className="text-link">Follow community updates <ArrowRightIcon /></Link>
        </div>
      </article>
    </div></section>
    <section className="section event-highlights-section" id="nest-in-action"><div className="shell">
      <SectionHeading eyebrow="NEST in action" title="Learning beyond the classroom" copy="Moments from our school workshops and NSBM Open Day." />
      <div className="event-highlights-grid">{eventHighlights.map(event => <article className="event-highlight" key={event.id} id={event.id}>
        <div className="event-highlight__cover"><Image src={event.photos[0].image} alt={event.photos[0].alt} sizes="(max-width: 800px) 100vw, 50vw" /></div>
        <div className="event-highlight__body"><span className="category-pill">{event.category}</span><h2>{event.title}</h2><p>{event.summary}</p>
          <details className="event-gallery"><summary>View {event.photos.length} photos <span aria-hidden="true">+</span></summary>
            <div className="event-gallery__grid">{event.photos.map(photo => <figure key={photo.alt}><Image src={photo.image} alt={photo.alt} sizes="(max-width: 800px) 50vw, 25vw" /></figure>)}</div>
          </details>
        </div>
      </article>)}</div>
    </div></section>
    <section className="section announcements-section" id="latest-updates"><div className="shell">
      <SectionHeading eyebrow="Latest updates" title="News and club notices" copy="Learning releases, community stories, and notices, listed with the newest updates first." />
      <div className="announcement-list">
        {newsUpdates.length === 0 && <p>No updates have been published yet. Check back for club news.</p>}
        {newsUpdates.map(update => <article key={`${update.date}-${update.title}`} data-published-notice={update.publishedNotice || undefined} className={update.featured ? "announcement-card announcement-card--featured" : "announcement-card"}>
          <div className="announcement-date"><ClockIcon /><time dateTime={update.date}>{new Date(`${update.date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</time></div>
          <div><span className="category-pill">{update.category}</span><h2>{update.title}</h2><p>{update.summary}</p>
            <div className="news-update-actions">
              {update.storyHref && <Link href={update.storyHref} className="text-link">Read story <ArrowRightIcon /></Link>}
              {update.actionHref && update.actionLabel && <Link href={update.actionHref} className="text-link">{update.actionLabel} <ArrowRightIcon /></Link>}
            </div>
          </div>
        </article>)}
      </div>
    </div></section>
  </main><SiteFooter /></>;
}
