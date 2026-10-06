import { publicPageUrl } from "@/lib/public-site";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactRedirect } from "./redirect";
export const metadata: Metadata = { robots: { index: false, follow: true }, title: "Contact NEST", description: "Get in touch with NEST Club on our About page.", alternates: { canonical: publicPageUrl("about/") } };
export default function ContactPage() {
  return <main id="main-content" tabIndex={-1} className="shell section"><ContactRedirect /><h1>Contact NEST</h1><p>Our contact details and enquiry form are now part of the About page.</p><Link href="/about/#contact" className="button button--primary">Go to contact section</Link></main>;
}
