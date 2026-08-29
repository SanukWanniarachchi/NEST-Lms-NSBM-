"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/research", label: "Research" },
  { href: "/announcements", label: "Announcements" },
  { href: "/courses", label: "Courses" },
];

export function AdminNav() {
  const pathname = usePathname();
  return <nav className="admin-nav" aria-label="Admin navigation">
    {links.map((link) => {
      const active = pathname === link.href;
      return <Link key={link.href} href={link.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>{link.label}</Link>;
    })}
  </nav>;
}
