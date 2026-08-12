import Image from "next/image";
import Link from "next/link";
import heroImage from "@/public/images/illustrations/campus-hero.webp";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CourseCard } from "@/components/course-card";
import { SectionHeading } from "@/components/section-heading";
import { ArrowRightIcon, BookIcon, CheckIcon, NetworkIcon, RobotIcon, ShieldIcon, UsersIcon } from "@/components/icons";
import { courses, totalLessons } from "@/data/courses";
import { clubContent, learnerBenefits } from "@/data/site";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">Student-led technology learning</p>
              <h1>Learn together.<br /><span>Build what&apos;s next.</span></h1>
              <p className="hero-lead">Focused, visual courses created for curious university students ready to explore cybersecurity, networking, and robotics.</p>
              <div className="hero-actions">
                <Link href="/courses" className="button button--primary">Explore courses <ArrowRightIcon /></Link>
                <Link href="/login" className="button button--secondary">Open learning portal</Link>
              </div>
              <div className="hero-proof" aria-label="NEST LMS highlights">
                <span><CheckIcon /> Bite-sized lessons</span>
                <span><CheckIcon /> Learn from peers</span>
                <span><CheckIcon /> Build practical confidence</span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-wrap">
                <Image src={heroImage} alt="Bright learning cards illustrating cybersecurity, networking, and robotics" priority sizes="(max-width: 900px) 100vw, 52vw" />
              </div>
              <div className="floating-card floating-card--top"><span className="floating-icon"><UsersIcon /></span><span><strong>Peer-powered</strong><small>Learn by sharing</small></span></div>
              <div className="floating-card floating-card--bottom"><span className="floating-icon floating-icon--warm"><BookIcon /></span><span><strong>{totalLessons} lessons</strong><small>Across 3 learning paths</small></span></div>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <div className="shell trust-grid">
            <p>Three paths. One curious community.</p>
            <div><ShieldIcon /><span>Cybersecurity</span></div>
            <div><NetworkIcon /><span>Networking</span></div>
            <div><RobotIcon /><span>Robotics</span></div>
          </div>
        </section>

        <section className="section courses-section">
          <div className="shell">
            <SectionHeading eyebrow="Start exploring" title="Skills for the technology shaping tomorrow" copy="Each course follows a clear path from first principles to practical understanding through concise, visual micro-lessons." action={<Link href="/courses" className="text-link">View all courses <ArrowRightIcon /></Link>} />
            <div className="course-grid">{courses.map((course) => <CourseCard key={course.slug} course={course} />)}</div>
          </div>
        </section>

        <section className="section learning-model">
          <div className="shell learning-grid">
            <div className="learning-copy">
              <p className="eyebrow">Built for how students learn</p>
              <h2>Small lessons.<br />Meaningful momentum.</h2>
              <p>NEST turns complex technology into approachable learning journeys—designed to be watched, discussed, practised, and shared.</p>
              <Link href="/about" className="button button--secondary">Meet NEST Club <ArrowRightIcon /></Link>
            </div>
            <div className="steps-list">
              <article><span>01</span><div><h3>Discover visually</h3><p>Clear illustrations and focused explanations make unfamiliar ideas easier to enter.</p></div></article>
              <article><span>02</span><div><h3>Learn with peers</h3><p>Student-led knowledge sharing turns learning into a community experience.</p></div></article>
              <article><span>03</span><div><h3>Apply the idea</h3><p>Short challenges connect concepts to the situations students recognise.</p></div></article>
            </div>
          </div>
        </section>

        <section className="section mission-section">
          <div className="shell mission-grid">
            <div className="mission-card mission-card--vision">
              <p className="eyebrow">Our vision</p><h2>A shared journey, powered by curiosity.</h2><p>{clubContent.vision}</p>
            </div>
            <div className="mission-card mission-card--mission">
              <p className="eyebrow">Our mission</p><h2>Create, share, and discover together.</h2><p>{clubContent.mission}</p>
            </div>
          </div>
        </section>

        <section className="section testimonial-section">
          <div className="shell">
            <SectionHeading eyebrow="Designed for students" title="A learning experience built for momentum" copy="NEST combines clear explanations, practical context, and focused activities so every lesson has a useful next step." align="center" />
            <div className="testimonial-grid benefit-grid">
              {learnerBenefits.map((item) => <article key={item.title}><span className="avatar">{item.initials}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="shell cta-card">
            <div><p className="eyebrow">Ready to explore?</p><h2>Your next skill starts with one small lesson.</h2><p>Choose a learning path and begin with a focused concept you can understand, discuss, and apply.</p></div>
            <div className="cta-actions"><Link href="/courses" className="button button--light">Browse courses <ArrowRightIcon /></Link><Link href="/dashboard" className="button button--ghost-light">Open learning portal</Link></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
