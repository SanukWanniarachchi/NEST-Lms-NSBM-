import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ClearLearningData } from "@/components/clear-learning-data";
import { publicPageUrl } from "@/lib/public-site";

export const metadata: Metadata = { title: "Privacy and browser storage", description: "How NEST handles local learning progress, enquiries, embedded videos and public photos.", alternates: { canonical: publicPageUrl("privacy/") } };

export default function PrivacyPage() {
  return <><SiteHeader /><main id="main-content" tabIndex={-1} className="shell section privacy-page">
    <p className="eyebrow">Using this website</p><h1>Privacy and browser storage</h1>
    <p>NEST’s public learning website does not require an account. Here is what happens when you learn, watch videos or prepare an enquiry.</p>
    <section><h2>Your learning progress</h2><p>Your selected theme and checkpoint results are saved in this browser’s local storage when available. Results include scores, attempt counts and completion dates. They are not sent to a NEST account or database and do not provide a verified certificate. People using the same browser profile may see this progress. It does not automatically transfer to another device.</p><p>Clearing browser site data removes these records. You can also clear checkpoint progress below. This does not affect external services.</p><ClearLearningData /></section>
    <section><h2>Enquiries and the clipboard</h2><p>The enquiry form holds your name, email, topic and message in page memory to prepare text. It does not submit those details to NEST or save them in local storage. Refreshing the page clears the form. Selecting “Copy message” places your text on your device’s clipboard. You choose whether and where to share it afterward.</p></section>
    <section><h2>YouTube and external links</h2><p>Video preview images are requested from YouTube’s image service before the player is loaded. These requests share network information such as your IP address and may share the website origin. Selecting a video loads a YouTube privacy-enhanced player, which makes further requests to Google/YouTube. Their service rules and privacy practices apply.</p><p>Following a WhatsApp, YouTube or external course link takes you to a service operated separately from this site. Information you provide there is handled by that service.</p><a className="text-link" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google privacy policy</a></section>
    <section><h2>Website delivery</h2><p>The hosting provider receives the requests needed to deliver the website, including network and browser information. Provider logs and retention depend on the hosting configuration. The application does not send enquiry details or local checkpoint records to an analytics service.</p></section>
    <section><h2>Public photos and corrections</h2><p>Club portraits and event photos are public website content. Contact NEST through an official club channel if you need a correction or want a photo reviewed or removed. Do not include unnecessary sensitive information in your request.</p><Link href="/about/#contact" className="text-link">Contact information</Link></section>
  </main><SiteFooter /></>;
}
