"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import nestMark from "@/public/images/brand/nest-mark-160.webp";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
];

const mobileLinks = primaryLinks;

// Page-level headers remount during navigation; retain the last underline position.
type IndicatorPosition = { left: number; width: number };
let previousIndicator: (IndicatorPosition & { path: string; from: IndicatorPosition | null }) | null = null;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;
    let animation: Animation | undefined;
    let disposed = false;

    function position(animate = false) {
      if (!nav || !indicator || disposed) return;
      const active = nav.querySelector<HTMLElement>('a[aria-current="page"]');
      if (!active || !nav.getClientRects().length) {
        indicator.style.opacity = "0";
        previousIndicator = null;
        return;
      }
      const next = { left: active.offsetLeft, width: active.offsetWidth };
      const previous = previousIndicator?.path === pathname
        ? previousIndicator.from
        : previousIndicator && { left: previousIndicator.left, width: previousIndicator.width };
      animation?.cancel();
      nav.classList.add("desktop-nav--animated");
      indicator.style.opacity = "1";
      indicator.style.width = `${next.width}px`;
      indicator.style.transform = `translateX(${next.left}px)`;
      previousIndicator = { ...next, path: pathname, from: previous };
      if (animate && previous && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        animation = indicator.animate([
          { transform: `translateX(${previous.left}px)`, width: `${previous.width}px` },
          { transform: `translateX(${next.left}px)`, width: `${next.width}px` },
        ], { duration: 380, easing: "cubic-bezier(.22, 1, .36, 1)" });
      }
    }

    position(true);
    // The first ResizeObserver callback must not cancel the entrance animation.
    let initialObservation = true;
    const observer = new ResizeObserver(() => {
      if (initialObservation) { initialObservation = false; return; }
      position();
    });
    observer.observe(nav);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stopMotion = () => { if (reducedMotion.matches) animation?.cancel(); };
    reducedMotion.addEventListener("change", stopMotion);
    void document.fonts.ready.then(() => {
      if (!disposed && animation?.playState !== "running") position();
    });
    return () => { disposed = true; observer.disconnect(); animation?.cancel(); reducedMotion.removeEventListener("change", stopMotion); };
  }, [pathname]);

  const currentPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  function isActive(href: string) {
    if (href === "/") return currentPath === "/";
    return currentPath === href || currentPath.startsWith(`${href}/`);
  }

  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }}>
      <span className="site-header-glass" aria-hidden="true"><span /></span>
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

        <nav ref={navRef} className="desktop-nav" aria-label="Main navigation">
          {primaryLinks.map((link) => {
            const active = isActive(link.href);
            return <Link key={link.href} href={link.href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
              {link.label}
            </Link>;
          })}
          <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <Link href="/community" className="button button--small button--secondary desktop-action desktop-community">
            Join community
          </Link>
          <button ref={menuButtonRef} type="button" className="menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${open ? "mobile-menu--open" : ""}`} inert={!open} aria-hidden={!open}>
        <nav className="shell" aria-label="Mobile navigation">
          {mobileLinks.map((link) => {
            const active = isActive(link.href);
            return <Link key={link.href} href={link.href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}</Link>;
          })}
          <Link href="/community" className="button button--secondary" onClick={() => setOpen(false)}>Join community</Link>
        </nav>
      </div>
    </header>
  );
}
