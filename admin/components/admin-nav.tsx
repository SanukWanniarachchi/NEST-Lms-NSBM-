"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminSessionRole } from "@admin/lib/auth/session";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/research", label: "Research" },
  { href: "/announcements", label: "Announcements", mobileLabel: "Updates" },
  { href: "/courses", label: "Courses" },
  { href: "/users", label: "Users", superAdminOnly: true },
];

export function AdminNav({ role }: { role: AdminSessionRole }) {
  const pathname = usePathname();
  return <nav className="admin-nav" aria-label="Admin navigation">
    {links.filter((link) => !link.superAdminOnly || role === "super_admin").map((link) => {
      const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
      return <Link key={link.href} href={link.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}><span className="admin-nav__desktop-label">{link.label}</span><span className="admin-nav__mobile-label">{link.mobileLabel ?? link.label}</span></Link>;
    })}
  </nav>;
}
