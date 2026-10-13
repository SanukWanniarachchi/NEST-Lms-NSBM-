import { publicPageUrl } from "@/lib/public-site";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRightIcon, CheckIcon, PlayIcon, UsersIcon } from "@/components/icons";
import { community } from "@/data/community";
import whatsappQr from "@/public/images/community/nest-whatsapp-qr.svg";

export const metadata: Metadata = { alternates: { canonical: publicPageUrl("community/") },
  title: "Join Community",
  description: "Join the NEST Community WhatsApp group and follow official NEST Club learning updates.",
};

export default function CommunityPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero page-hero--community">
          <div className="shell community-hero">
            <div>
              <p className="eyebrow">Join the community</p>
              <h1>Stay close to the learning happening inside NEST.</h1>
              <p>{community.description}</p>
              <div className="hero-actions">
                {community.whatsappInviteUrl ? <a href={community.whatsappInviteUrl} className="button button--primary" target="_blank" rel="noopener noreferrer">Join on WhatsApp <ArrowRightIcon /></a> : null}
                <a href={community.instagramUrl} className="button button--secondary" target="_blank" rel="noopener noreferrer">Follow on Instagram <ArrowRightIcon /></a>
                <a href={community.youtubeChannelUrl} className="button button--secondary" target="_blank" rel="noopener noreferrer"><PlayIcon /> Visit YouTube channel</a>
                <Link href="/news" className="button button--secondary">View news</Link>
              </div>
            </div>
            <div className="qr-card">
              <Image src={whatsappQr} alt={community.qrAlt} priority />
              <div>
                <span><UsersIcon /></span>
                <strong>{community.title}</strong>
                <p>Scan the QR code with WhatsApp to join the official community group.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section community-guidelines">
          <div className="shell">
            <article><CheckIcon /><h2>Follow club notices</h2><p>Get updates about learning sessions, community posts, and student-led activities.</p></article>
            <article><CheckIcon /><h2>Learn with peers</h2><p>Use the group to stay connected with students interested in cybersecurity, networking, robotics, and emerging technology.</p></article>
            <article><CheckIcon /><h2>Respect the space</h2><p>Keep discussions useful, student-friendly, and aligned with the official NEST Club community purpose.</p></article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
