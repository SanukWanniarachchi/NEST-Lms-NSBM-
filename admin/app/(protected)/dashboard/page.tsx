import { getAdminDashboardMetrics } from "@admin/lib/data/admin-data";

export const metadata = { title: "Overview" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const metrics = await getAdminDashboardMetrics();
  const forbidden = Boolean((await searchParams).error);

  return <div className="admin-page">
    <header className="page-heading"><div><p className="eyebrow">Workspace overview</p><h1>Content operations</h1><p>Review the current publishing areas and continue into a managed collection.</p></div><span className="status-badge">Local environment</span></header>
    {forbidden && <div className="form-message form-message--error" role="alert">Only a super admin can manage user accounts.</div>}
    <section className="metric-grid" aria-label="Content summary">
      <article><small>Research records</small><strong>{metrics.researchResources}</strong><p>Draft, published, and archived resources.</p></article>
      <article><small>Learning paths</small><strong>3</strong><p>Cybersecurity, networking, and robotics.</p></article>
      <article><small>Active administrators</small><strong>{metrics.activeAdmins}</strong><p>Identities currently authorised by the allowlist.</p></article>
      <article><small>Active users</small><strong>{metrics.activeUsers}</strong><p>Learner identities prepared for future account access.</p></article>
    </section>
    <section className="admin-section">
      <div className="section-heading"><div><p className="eyebrow">Platform status</p><h2>Protected operations are active</h2></div></div>
      <div className="status-list">
        <div><span className="status-dot complete" /><div><strong>Session boundary</strong><p>Protected pages verify the signed admin session on the server.</p></div><small>Complete</small></div>
        <div><span className="status-dot complete" /><div><strong>Local identity adapter</strong><p>Development access is isolated from production SSO configuration.</p></div><small>Complete</small></div>
        <div><span className="status-dot complete" /><div><strong>Persistent content</strong><p>PostgreSQL migrations, repositories, and audit logging are active.</p></div><small>Complete</small></div>
        <div><span className="status-dot complete" /><div><strong>Research workflow</strong><p>Create, edit, preview, publish, archive, and restore actions are audited and available.</p></div><small>Complete</small></div>
        <div><span className="status-dot complete" /><div><strong>Role governance</strong><p>Super admins maintain users and administrators with audited access changes.</p></div><small>Complete</small></div>
        <div><span className="status-dot pending" /><div><strong>Course and announcement workflows</strong><p>Managed learning content and club updates begin in Phase 4.</p></div><small>Next phase</small></div>
      </div>
    </section>
  </div>;
}
