import Image from "next/image";
import Link from "next/link";
import nestLogo from "@/public/images/brand/nest-logo-footer.webp";
import { MailIcon, LocationIcon, PlayIcon } from "@/components/icons";
import { community } from "@/data/community";
import { SiteCredits } from "@/components/site-credits";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src={nestLogo} alt="NEST — NSBM Educators and Scholars Together" width={180} height={166} />
          <p>A student-led learning community turning curiosity into shared knowledge and practical skills.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <div className="footer-links">
            <Link href="/about">About NEST</Link>
            <Link href="/courses">Course catalogue</Link>
            <Link href="/news">News</Link>
            <Link href="/privacy">Privacy and browser storage</Link>
          </div>
        </div>
        <div>
          <h2>Learning areas</h2>
          <div className="footer-links">
            <Link href="/courses/cybersecurity-foundations">Cybersecurity</Link>
            <Link href="/courses/networking-essentials">Networking</Link>
            <Link href="/courses/robotics-fundamentals">Robotics</Link>
          </div>
        </div>
        <div>
          <h2>Connect</h2>
          <div className="footer-contact">
            <p><LocationIcon /> NSBM Green University, Sri Lanka</p>
            <p><a href={`mailto:${community.emailAddress}`} className="text-link"><MailIcon /> {community.emailAddress}</a></p>
            <p><Link href="/about/#contact" className="text-link">Contact us</Link></p>
            <p><a href={community.whatsappInviteUrl} target="_blank" rel="noopener noreferrer" className="text-link">Join on WhatsApp</a></p>
            <p><a href={community.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-link">Instagram · @nsbmnest</a></p>
            <p><a href={community.youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className="text-link"><PlayIcon /> Official YouTube channel</a></p>
          </div>
        </div>
      </div>
      <div className="shell footer-bottom">
        <div className="credits-copyright"><p>© 2026 NEST Club. All rights reserved.</p><span aria-hidden="true">·</span><SiteCredits /></div>
        <p>NSBM Educators and Scholars Together</p>
      </div>
    </footer>
  );
}
