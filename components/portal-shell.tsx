"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import nestMark from "@/public/images/brand/nest-mark.webp";
import { BookIcon, ChartIcon, UsersIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

export function PortalShell({ role, children }: { role: "student" | "admin"; children: ReactNode }) {
  const pathname = usePathname();
  const links = role === "student"
    ? [{ href: "/dashboard", label: "Overview", icon: <ChartIcon /> }, { href: "/courses", label: "My learning", icon: <BookIcon /> }]
    : [{ href: "/admin", label: "Overview", icon: <ChartIcon /> }, { href: "/courses", label: "Courses", icon: <BookIcon /> }, { href: "/admin#students", label: "Students", icon: <UsersIcon /> }];

  return (
    <div className="portal-layout">
      <aside className="portal-sidebar">
        <Link href="/" className="portal-brand">
          <Image src={nestMark} alt="" width={42} height={40} />
          <span><strong>NEST</strong><small>{role === "student" ? "Student" : "Admin"} demo</small></span>
        </Link>
        <nav aria-label={`${role} dashboard navigation`}>
          {links.map((link) => <Link key={link.href} className={pathname === link.href ? "active" : undefined} href={link.href}>{link.icon}{link.label}</Link>)}
        </nav>
        <div className="portal-sidebar__note">
          <strong>Frontend demo</strong>
          <p>Changes are simulated and are not saved.</p>
        </div>
        <Link href="/" className="portal-back">← Public website</Link>
      </aside>
      <div className="portal-main">
        <header className="portal-topbar">
          <div><span className="status-dot" /> Demo data is active</div>
          <ThemeToggle />
        </header>
        <main className="portal-content">{children}</main>
      </div>
    </div>
  );
}
