import type { Metadata } from "next";
import Link from "next/link";
import { ContactRedirect } from "./redirect";
export const metadata: Metadata = { title: "Contact NEST", description: "Get in touch with NEST Club on our About page.", alternates: { canonical: "/about/" } };
export default function ContactPage() {
  return <main className="shell section"><ContactRedirect /><h1>Contact NEST</h1><p>Our contact details and enquiry form are now part of the About page.</p><Link href="/about/#contact" className="button button--primary">Go to contact section</Link></main>;
}
