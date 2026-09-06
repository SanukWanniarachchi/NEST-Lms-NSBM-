import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import mark from "../../public/images/brand/nest-mark-160.webp";
import { logout } from "@admin/app/actions/auth";
import { AdminNav } from "@admin/components/admin-nav";
import type { AdminSession } from "@admin/lib/auth/session";

export function AdminShell({ children, session }: { children: ReactNode; session: AdminSession }) {
  const publicSite = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4173";

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/dashboard" aria-label="NEST admin overview">
        <Image src={mark} alt="" width={42} height={42} priority />
        <span><strong>NEST LMS</strong><small>Admin workspace</small></span>
      </Link>
      <AdminNav role={session.role} />
      <div className="admin-sidebar__footer">
        <Link href={publicSite} target="_blank" rel="noopener noreferrer">View public site</Link>
        <form action={logout}><button type="submit">Sign out</button></form>
      </div>
    </aside>
    <div className="admin-workspace">
      <header className="admin-topbar">
        <div><small>Signed in as</small><strong>{session.name}</strong></div>
        <span className="admin-role">{session.role === "super_admin" ? "Super admin" : "Admin"}</span>
      </header>
      <main>{children}</main>
    </div>
  </div>;
}
