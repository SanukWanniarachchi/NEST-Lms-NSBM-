import { ContactForm } from "@/components/contact-form";
import { MailIcon, LocationIcon } from "@/components/icons";
import { community } from "@/data/community";

export function ContactSection() {
  return <section id="contact" className="section about-contact" aria-labelledby="contact-title"><div className="shell contact-grid">
    <div className="contact-details">
      <p className="eyebrow">Find the club</p><h2 id="contact-title">Let&apos;s build a learning community together.</h2>
      <p>Whether you want to explore a course, contribute a lesson, or support a NEST activity, your idea can help the community grow.</p>
      <div className="contact-item"><span><LocationIcon /></span><div><strong>NSBM Green University</strong><p>Homagama, Sri Lanka</p></div></div>
      <div className="contact-item"><span><MailIcon /></span><div><strong>Email NEST Club</strong><p><a href={`mailto:${community.emailAddress}`} className="text-link">{community.emailAddress}</a></p></div></div>
      <div className="hero-actions">
        <a href={community.whatsappInviteUrl} className="button button--secondary" target="_blank" rel="noopener noreferrer">Join on WhatsApp</a>
        <a href={community.instagramUrl} className="button button--secondary" target="_blank" rel="noopener noreferrer">Follow on Instagram</a>
      </div>
      <div className="service-note"><strong>Prepare, review, then send</strong><p>Prepare your enquiry below, then open an email draft or copy the message. You send it through your own email app.</p></div>
    </div>
    <ContactForm />
  </div></section>;
}
