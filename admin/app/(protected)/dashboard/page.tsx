import { getAdminDashboardMetrics } from "@admin/lib/data/admin-data";

export const metadata = { title: "Overview" };

export default async function DashboardPage() {
  const metrics = await getAdminDashboardMetrics();

  return <div className="admin-page">
    <header className="page-heading"><div><p className="eyebrow">Workspace overview</p><h1>Content operations</h1><p>Review the current publishing areas and continue into a managed collection.</p></div><span className="status-badge">Local environment</span></header>
    <section className="metric-grid" aria-label="Content summary">
      <article><small>Research records</small><strong>{metrics.researchResources}</strong><p>Draft, published, and archived resources.</p></article>
      <article><small>Learning paths</small><strong>3</strong><p>Cybersecurity, networking, and robotics.</p></article>
      <article><small>Active administrators</small><strong>{metrics.activeAdmins}</strong><p>Identities currently authorised by the allowlist.</p></article>
    </section>
    <section className="admin-section">
      <div className="section-heading"><div><p className="eyebrow">Phase 2 status</p><h2>Protected data foundation is active</h2></div></div>
      <div className="status-list">
        <div><span className="status-dot complete" /><div><strong>Session boundary</strong><p>Protected pages verify the signed admin session on the server.</p></div><small>Complete</small></div>
        <div><span className="status-dot complete" /><div><strong>Local identity adapter</strong><p>Development access is isolated from production SSO configuration.</p></div><small>Complete</small></div>
        <div><span className="status-dot complete" /><div><strong>Persistent content</strong><p>PostgreSQL migrations, repositories, and audit logging are active.</p></div><small>Complete</small></div>
        <div><span className="status-dot pending" /><div><strong>Research workflow</strong><p>Create, preview, publish, archive, and restore screens begin in Phase 3.</p></div><small>Next phase</small></div>
      </div>
    </section>
  </div>;
}
