export const metadata = { title: "Research" };

export default function ResearchAdminPage() {
  return <div className="admin-page">
    <header className="page-heading"><div><p className="eyebrow">Managed collection</p><h1>Research</h1><p>Papers, videos, and document links will be reviewed here before publication.</p></div><button type="button" disabled title="Available after database integration">Add research</button></header>
    <section className="empty-collection"><span>0</span><h2>No research records</h2><p>The Phase 2 database will provide draft storage. Phase 3 adds creation, preview, publishing, and archive actions.</p></section>
  </div>;
}
