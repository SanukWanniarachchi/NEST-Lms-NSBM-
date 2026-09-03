import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ClockIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getNewsArticle, newsArticles } from "@/data/news";

export const dynamicParams = false;
export function generateStaticParams() { return newsArticles.map((article) => ({ slug: article.slug })); }

type NewsArticlePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const article = getNewsArticle((await params).slug);
  return article ? { title: article.title, description: article.summary } : {};
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const article = getNewsArticle((await params).slug);
  if (!article) notFound();

  return <><SiteHeader /><main>
    <article className="news-article">
      <header className="shell news-article__header"><Link href="/news" className="text-link"><ArrowLeftIcon /> All news</Link><span className="category-pill">{article.category}</span><h1>{article.title}</h1><p>{article.summary}</p><div className="news-article__byline"><span>{article.author}</span><span><ClockIcon /><time dateTime={article.publishedOn}>{article.publishedOn}</time></span></div></header>
      <div className="shell news-article__image"><Image src={article.image} alt={article.imageAlt} priority sizes="(max-width: 1180px) 100vw, 1180px" /></div>
      <div className="shell news-article__body">{article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </article>
  </main><SiteFooter /></>;
}
