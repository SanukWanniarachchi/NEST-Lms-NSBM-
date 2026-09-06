import { AccountForm } from "@admin/components/account-form";
import { getManagedAccounts } from "@admin/lib/data/admin-data";
import { requireSuperAdminSession } from "@admin/lib/auth/session";

export const metadata = { title: "Users" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const roleLabels = { super_admin: "Super admin", admin: "Admin", user: "User" };

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function UsersPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requireSuperAdminSession();
  const accounts = await getManagedAccounts();
  const changed = valueOf((await searchParams).changed);
  const active = accounts.filter((account) => account.active);
  const counts = {
    superAdmins: active.filter((account) => account.role === "super_admin").length,
    admins: active.filter((account) => account.role === "admin").length,
    users: active.filter((account) => account.role === "user").length,
  };

  return <div className="admin-page">
    <header className="page-heading"><div><p className="eyebrow">Access governance</p><h1>Users</h1><p>Maintain NEST identities and control who can enter the protected content workspace.</p></div><span className="status-badge">Super admin only</span></header>
    {changed && <div className="form-message form-message--success" role="status">Account {changed === "created" ? "created" : "updated"} successfully.</div>}

    <section className="account-summary" aria-label="Active account summary">
      <div><strong>{counts.superAdmins}</strong><span>Super admins</span></div>
      <div><strong>{counts.admins}</strong><span>Admins</span></div>
      <div><strong>{counts.users}</strong><span>Users</span></div>
    </section>

    <section className="admin-section account-create">
      <div className="section-heading"><p className="eyebrow">New identity</p><h2>Add an account</h2><p>User records prepare identities for later learner sign-in; only admins and super admins can enter this workspace.</p></div>
      <AccountForm currentSubject={session.subject} />
    </section>

    <section className="account-directory" aria-label="Account directory">
      <div className="section-heading"><p className="eyebrow">Directory</p><h2>Managed accounts</h2></div>
      {accounts.map((account) => <details className="account-record" key={account.subject} open={account.subject === session.subject}>
        <summary>
          <span><strong>{account.displayName}</strong><small>{account.email || account.subject}</small></span>
          <span className={`status-pill ${account.active ? "status-pill--published" : "status-pill--archived"}`}>{account.active ? "Active" : "Inactive"}</span>
          <span className="admin-role">{roleLabels[account.role]}</span>
        </summary>
        <AccountForm account={account} currentSubject={session.subject} />
      </details>)}
    </section>
  </div>;
}
