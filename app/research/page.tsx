import { publicPageUrl } from "@/lib/public-site";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { robots: { index: false, follow: true }, alternates: { canonical: publicPageUrl("news/") },
  title: "Research has moved to News",
  description: "Research updates and other NEST Club stories are now published in News.",
};

export default function ResearchPage() {
  return <><SiteHeader /><main id="main-content" tabIndex={-1}><section className="page-hero page-hero--news"><div className="shell centered-intro research-moved"><p className="eyebrow">A clearer home for NEST stories</p><h1>Research updates have moved to News.</h1><p>News now brings together research stories, learning releases, community progress, achievements, and partnerships.</p><Link href="/news" className="button button--primary">Visit News <ArrowRightIcon /></Link></div></section></main><SiteFooter /></>;
}
