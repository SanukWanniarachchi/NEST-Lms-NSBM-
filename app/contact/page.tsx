import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";
import { MailIcon, LocationIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Contact", description: "Connect with NEST Club, join a learning path, or contribute knowledge to the community." };

export default function ContactPage() { return <><SiteHeader /><main><section className="page-hero page-hero--contact"><div className="shell centered-intro"><p className="eyebrow">Contact NEST</p><h1>Questions, ideas, or a skill to share?</h1><p>NEST grows through students who are ready to learn, teach, create, and collaborate.</p></div></section><section className="section"><div className="shell contact-grid"><div className="contact-details"><p className="eyebrow">Find the club</p><h2>Let&apos;s build a learning community together.</h2><p>Whether you want to explore a course, contribute a lesson, or support a NEST activity, your idea can help the community grow.</p><div className="contact-item"><span><LocationIcon /></span><div><strong>NSBM Green University</strong><p>Homagama, Sri Lanka</p></div></div><div className="contact-item"><span><MailIcon /></span><div><strong>Official NEST Club channels</strong><p>Use the club&apos;s verified NSBM communication channels for direct enquiries.</p></div></div><div className="service-note"><strong>Message preparation</strong><p>The form prepares your enquiry locally. Direct delivery will be enabled when the official club mailbox is connected.</p></div></div><ContactForm /></div></section></main><SiteFooter /></> }
