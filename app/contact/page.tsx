import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import { MailIcon, LocationIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Contact", description: "Connect with NEST Club and learn more about the NEST LMS demonstration." };

export default function ContactPage() { return <><SiteHeader /><main><section className="page-hero page-hero--contact"><div className="shell centered-intro"><p className="eyebrow">Contact NEST</p><h1>Questions, ideas, or a skill to share?</h1><p>This demonstration is designed around community. Official contact channels can be connected here when approved.</p></div></section><section className="section"><div className="shell contact-grid"><div className="contact-details"><p className="eyebrow">Find the club</p><h2>Let&apos;s build a learning community together.</h2><p>Whether you want to learn, teach, contribute a course, or support a NEST activity, this page is ready for the club&apos;s final contact information.</p><div className="contact-item"><span><LocationIcon /></span><div><strong>NSBM Green University</strong><p>Homagama, Sri Lanka</p></div></div><div className="contact-item"><span><MailIcon /></span><div><strong>Official email coming soon</strong><p>Contact data has not yet been supplied.</p></div></div><div className="demo-notice"><strong>Demonstration notice</strong><p>This form validates locally but does not send or store messages.</p></div></div><ContactForm /></div></section></main><SiteFooter /></> }
