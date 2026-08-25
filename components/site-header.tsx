"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import nestMark from "@/public/images/brand/nest-mark.webp";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/research", label: "Research" },
  { href: "/announcements", label: "Announcements" },
];

const moreLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const mobileLinks = [...primaryLinks, ...moreLinks];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const currentPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  function isActive(href: string) {
    if (href === "/") return currentPath === "/";
    return currentPath === href || currentPath.startsWith(`${href}/`);
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="NEST LMS home">
          <span className="brand-mark">
            <Image src={nestMark} alt="" width={44} height={42} priority />
          </span>
          <span>
            <strong>NEST <em>LMS</em></strong>
            <small>Learn · Create · Share</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {primaryLinks.map((link) => {
            const active = isActive(link.href);
            return <Link key={link.href} href={link.href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
              {link.label}
            </Link>;
          })}
          <div className="more-menu">
            <button type="button" className={moreLinks.some((link) => isActive(link.href)) ? "active" : undefined} aria-haspopup="true">
              More
            </button>
            <div className="more-menu__panel">
              {moreLinks.map((link) => {
                const active = isActive(link.href);
                return <Link key={link.href} href={link.href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>{link.label}</Link>;
              })}
            </div>
          </div>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <Link href="/community" className="button button--small button--secondary desktop-login desktop-community">
            Join community
          </Link>
          <Link href="/login" className="button button--small button--primary desktop-login">
            Student login
          </Link>
          <button type="button" className="menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${open ? "mobile-menu--open" : ""}`}>
        <nav className="shell" aria-label="Mobile navigation">
          {mobileLinks.map((link) => {
            const active = isActive(link.href);
            return <Link key={link.href} href={link.href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}</Link>;
          })}
          <Link href="/community" className="button button--secondary" onClick={() => setOpen(false)}>Join community</Link>
          <Link href="/login" className="button button--primary" onClick={() => setOpen(false)}>Student login</Link>
        </nav>
      </div>
    </header>
  );
}
