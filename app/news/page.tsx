import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { newsArticles } from "@/data/news";

export const metadata: Metadata = {
  title: "News",
  description: "Read NEST Club stories, learning releases, community updates, and technology news.",
};

export default function NewsPage() {
  const [featured, ...recent] = newsArticles;

  return <><SiteHeader /><main>
    <section className="page-hero page-hero--news"><div className="shell centered-intro"><p className="eyebrow">NEST News</p><h1>What the community is learning and building.</h1><p>Follow course releases, club stories, achievements, partnerships, and thoughtful updates from the NEST learning community.</p></div></section>
    <section className="section news-section"><div className="shell">
      <SectionHeading eyebrow="Latest story" title="News from NEST" copy="Longer stories live here. Deadlines and time-sensitive notices remain on the Announcements page." />
      <article className="news-featured">
        <Image src={featured.image} alt={featured.imageAlt} priority sizes="(max-width: 900px) 100vw, 54vw" />
        <div><span className="category-pill">{featured.category}</span><p className="news-date"><ClockIcon /><time dateTime={featured.publishedOn}>{featured.publishedOn}</time></p><h2>{featured.title}</h2><p>{featured.summary}</p><Link href={`/news/${featured.slug}`} className="text-link">Read story <ArrowRightIcon /></Link></div>
      </article>
      <div className="news-grid">{recent.map((article) => <article className="news-card" key={article.slug}>
        <Image src={article.image} alt={article.imageAlt} sizes="(max-width: 720px) 100vw, 50vw" />
        <div><span className="category-pill">{article.category}</span><p className="news-date"><ClockIcon /><time dateTime={article.publishedOn}>{article.publishedOn}</time></p><h2>{article.title}</h2><p>{article.summary}</p><Link href={`/news/${article.slug}`} className="text-link">Read story <ArrowRightIcon /></Link></div>
      </article>)}</div>
    </div></section>
  </main><SiteFooter /></>;
}
