import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import heroImage from "@/public/images/illustrations/campus-hero.webp";
import nestMark from "@/public/images/brand/nest-mark.webp";
import { LoginForm } from "@/components/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeftIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Demo Login", description: "Explore the NEST LMS mock student and administrator login states." };

export default function LoginPage() { return <main className="login-page"><div className="login-brand-panel"><Image className="login-panel-image" src={heroImage} alt="University students collaborating in a technology lab" fill priority sizes="(max-width: 900px) 0vw, 52vw"/><div className="login-panel-overlay"/><div className="login-panel-copy"><p className="eyebrow">NEST learning community</p><h1>Curiosity grows better together.</h1><p>Explore a polished demonstration of the student learning journey.</p></div></div><section className="login-form-panel"><div className="login-top"><Link href="/"><ArrowLeftIcon /> Back to website</Link><ThemeToggle /></div><div className="login-box"><Link href="/" className="login-logo"><Image src={nestMark} alt="" width={58} height={55}/><span><strong>NEST LMS</strong><small>Frontend demonstration</small></span></Link><LoginForm /></div></section></main> }
