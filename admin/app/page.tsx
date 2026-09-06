import Image from "next/image";
import { redirect } from "next/navigation";
import mark from "../../public/images/brand/nest-mark-160.webp";
import { login } from "@admin/app/actions/auth";
import { getAuthMode } from "@admin/lib/auth/config";
import { getAdminSession } from "@admin/lib/auth/session";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (await getAdminSession()) redirect("/dashboard");

  const { error } = await searchParams;
  const authMode = getAuthMode();

  return <main className="login-page">
    <section className="login-panel" aria-labelledby="login-title">
      <div className="login-brand"><Image src={mark} alt="" width={52} height={52} priority /><span><strong>NEST LMS</strong><small>Admin workspace</small></span></div>
      <p className="eyebrow">Protected access</p>
      <h1 id="login-title">Manage NEST content.</h1>
      <p className="login-copy">Authorised board members can prepare, review, and publish learning resources through this workspace.</p>
      {authMode === "local" ? <form action={login} className="login-form">
        <label htmlFor="access-code">Local access code</label>
        <input id="access-code" name="accessCode" type="password" autoComplete="current-password" required minLength={8} maxLength={128} />
        {error === "invalid" ? <p className="form-error" role="alert">The access code is incorrect.</p> : null}
        {error === "forbidden" ? <p className="form-error" role="alert">This identity is not on the active admin allowlist.</p> : null}
        <button type="submit">Continue to workspace</button>
      </form> : authMode === "oidc" ? <div className="login-form">
        {error ? <p className="form-error" role="alert">Sign-in could not be completed. Try again or contact the system administrator.</p> : null}
        <a className="button-link" href="/auth/login">Continue with NSBM SSO</a>
      </div> : <div className="auth-unavailable"><strong>NSBM SSO required</strong><p>The production workspace opens only after the NSBM identity provider is connected.</p></div>}
      <small className="login-note">Access is limited to active administrator accounts.</small>
    </section>
    <aside className="login-context">
      <span>Admin platform</span>
      <h2>A clear, accountable publishing workflow.</h2>
      <ul><li>Protected server-side sessions</li><li>Database-backed admin allowlist</li><li>Audited content persistence</li></ul>
    </aside>
  </main>;
}
