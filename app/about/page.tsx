import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import nestLogo from "@/public/images/brand/nest-logo-transparent.webp";
import heroImage from "@/public/images/illustrations/campus-hero.webp";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SectionHeading } from "@/components/section-heading";
import { ArrowRightIcon, CheckIcon, PlayIcon, UsersIcon } from "@/components/icons";
import { community } from "@/data/community";
import { clubContent, objectives } from "@/data/site";

export const metadata: Metadata = { title: "About NEST Club", description: "Meet NEST Club, its mission, vision, objectives, and student-led learning philosophy." };

const boardPlaceholders = [
  { id: "president", role: "President" },
  { id: "vice-president", role: "Vice President" },
  { id: "secretary", role: "Secretary" },
  { id: "treasurer", role: "Treasurer" },
  { id: "committee-member-1", role: "Committee Member" },
  { id: "committee-member-2", role: "Committee Member" },
];

export default function AboutPage() {
  return <><SiteHeader /><main>
    <section className="page-hero page-hero--about"><div className="shell page-hero__grid"><div><p className="eyebrow">About NEST Club</p><h1>Learning becomes more powerful when it is shared.</h1><p>{clubContent.introduction}</p></div><div className="about-logo-card"><Image src={nestLogo} alt="NEST — NSBM Educators and Scholars Together" priority /></div></div></section>
    <section className="section"><div className="shell mission-grid"><article className="mission-card mission-card--vision"><p className="eyebrow">Vision</p><h2>Students inspiring students.</h2><p>{clubContent.vision}</p></article><article className="mission-card mission-card--mission"><p className="eyebrow">Mission</p><h2>Confidence through creation.</h2><p>{clubContent.mission}</p></article></div></section>
    <section className="section objectives-section"><div className="shell"><SectionHeading eyebrow="What guides us" title="Six objectives, one learning community" copy="The club formation document places collaboration, confidence, creativity, accessibility, and meaningful impact at the centre of NEST." /><div className="objectives-grid">{objectives.map((objective, index) => <article key={objective}><span>{String(index + 1).padStart(2, "0")}</span><p>{objective}</p></article>)}</div></div></section>
    <section className="section leadership-section"><div className="shell"><SectionHeading eyebrow="Club leadership" title="Meet the people guiding NEST" copy="The Master-in-Charge and student board provide academic guidance, coordinate activities, and support the NEST learning community." /><div className="mentor-profile"><div className="profile-photo profile-photo--mentor" aria-label="Master-in-Charge photo placeholder"><UsersIcon /></div><div className="mentor-profile__details"><small>Master-in-Charge</small><h3>Lecturer name</h3><p>Lecturer overseeing NEST Club</p></div></div><div className="board-heading"><div><p className="eyebrow">Student leadership</p><h3>Club board members</h3></div><span>Profiles to be added</span></div><div className="board-grid">{boardPlaceholders.map((member) => <article className="board-profile" key={member.id}><div className="profile-photo" aria-label={`${member.role} photo placeholder`}><UsersIcon /></div><div><strong>Member name</strong><span>{member.role}</span></div></article>)}</div></div></section>
    <section className="section future-section"><div className="shell future-grid"><div className="future-image"><Image src={heroImage} alt="Bright learning cards illustrating cybersecurity, networking, and robotics" sizes="(max-width: 800px) 100vw, 50vw" /></div><div><p className="eyebrow">The future of NEST</p><h2>A home for ideas, projects, and confident new leaders.</h2><p>{clubContent.future}</p><ul className="check-list"><li><CheckIcon /> Student-driven digital content</li><li><CheckIcon /> Interactive learning experiences</li><li><CheckIcon /> A culture of fearless knowledge sharing</li></ul><Link href="/courses" className="button button--primary">Explore the learning paths <ArrowRightIcon /></Link></div></div></section>
    <section className="section club-details"><div className="shell"><div><small>Full club name</small><strong>{clubContent.fullName}</strong></div><div><small>Master-in-Charge</small><strong>{clubContent.masterInCharge}</strong></div><div><small>Proposed future domain</small><strong>{clubContent.proposedDomain}</strong></div><div><small>Official YouTube channel</small><a href={community.youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className="button button--small button--secondary"><PlayIcon /> Watch NEST videos</a></div></div></section>
  </main><SiteFooter /></>;
}
