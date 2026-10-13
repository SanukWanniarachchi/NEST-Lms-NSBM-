import type { Metadata } from "next";
import Link from "next/link";
import { publicPageUrl } from "@/lib/public-site";
import { AnnouncementsRedirect } from "./redirect";

export const metadata: Metadata = {
  title: "Announcements have moved to News", robots: { index: false, follow: true },
  description: "NEST notices, upcoming projects, and workshop photos are now together in News.",
  alternates: { canonical: publicPageUrl("news/") },
};

export default function AnnouncementsPage() {
  return <main id="main-content" tabIndex={-1} className="shell section"><AnnouncementsRedirect /><h1>Announcements have moved to News.</h1><p>Find upcoming projects, workshop photos, and club updates in one place.</p><Link href="/news" className="button button--primary">Visit News</Link></main>;
}
