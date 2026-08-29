import Image from "next/image";
import { redirect } from "next/navigation";
import mark from "../../public/images/brand/nest-mark-160.webp";
import { login } from "@admin/app/actions/auth";
import { isLocalAuthEnabled } from "@admin/lib/auth/config";
import { getAdminSession } from "@admin/lib/auth/session";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (await getAdminSession()) redirect("/dashboard");

  const { error } = await searchParams;
  const localAuth = isLocalAuthEnabled();

  return <main className="login-page">
    <section className="login-panel" aria-labelledby="login-title">
      <div className="login-brand"><Image src={mark} alt="" width={52} height={52} priority /><span><strong>NEST LMS</strong><small>Admin workspace</small></span></div>
      <p className="eyebrow">Protected access</p>
      <h1 id="login-title">Manage NEST content.</h1>
      <p className="login-copy">Authorised board members can prepare, review, and publish learning resources through this workspace.</p>
      {localAuth ? <form action={login} className="login-form">
        <label htmlFor="access-code">Local access code</label>
        <input id="access-code" name="accessCode" type="password" autoComplete="current-password" required minLength={8} maxLength={128} />
        {error === "invalid" ? <p className="form-error" role="alert">The access code is incorrect.</p> : null}
        <button type="submit">Continue to workspace</button>
      </form> : <div className="auth-unavailable"><strong>NSBM SSO required</strong><p>The production workspace opens only after the NSBM identity provider is connected.</p></div>}
      <small className="login-note">Local access is available only in the development environment.</small>
    </section>
    <aside className="login-context">
      <span>Phase 1</span>
      <h2>A clear, accountable publishing workflow.</h2>
      <ul><li>Protected server-side sessions</li><li>One authorised admin role</li><li>Draft-to-publish content lifecycle</li></ul>
    </aside>
  </main>;
}
