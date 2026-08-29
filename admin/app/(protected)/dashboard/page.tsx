export const metadata = { title: "Overview" };

export default function DashboardPage() {
  return <div className="admin-page">
    <header className="page-heading"><div><p className="eyebrow">Workspace overview</p><h1>Content operations</h1><p>Review the current publishing areas and continue into a managed collection.</p></div><span className="status-badge">Local environment</span></header>
    <section className="metric-grid" aria-label="Content summary">
      <article><small>Published research</small><strong>0</strong><p>The public library is currently empty.</p></article>
      <article><small>Learning paths</small><strong>3</strong><p>Cybersecurity, networking, and robotics.</p></article>
      <article><small>Announcements</small><strong>3</strong><p>Currently supplied by the public release data.</p></article>
    </section>
    <section className="admin-section">
      <div className="section-heading"><div><p className="eyebrow">Phase 1 status</p><h2>Protected shell is active</h2></div></div>
      <div className="status-list">
        <div><span className="status-dot complete" /><div><strong>Session boundary</strong><p>Protected pages verify the signed admin session on the server.</p></div><small>Complete</small></div>
        <div><span className="status-dot complete" /><div><strong>Local identity adapter</strong><p>Development access is isolated from production SSO configuration.</p></div><small>Complete</small></div>
        <div><span className="status-dot pending" /><div><strong>Persistent content</strong><p>Database repositories begin in Phase 2.</p></div><small>Next phase</small></div>
      </div>
    </section>
  </div>;
}
