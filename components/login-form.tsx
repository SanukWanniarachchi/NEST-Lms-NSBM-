"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "admin">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    if (!data.get("email") || !data.get("password")) { setError("Enter both demo fields to continue."); return; }
    setLoading(true);
    window.setTimeout(() => router.push(role === "student" ? "/dashboard" : "/admin"), 650);
  }

  return <><div className="login-heading"><p className="eyebrow">Welcome back</p><h2>Open the {role} demo</h2><p>No real account is required. Any valid-looking details will open the selected interface.</p></div><div className="role-switch" aria-label="Demo role"><button type="button" className={role === "student" ? "active" : ""} onClick={() => setRole("student")}>Student</button><button type="button" className={role === "admin" ? "active" : ""} onClick={() => setRole("admin")}>Administrator</button></div><div className="sample-credentials"><CheckIcon /><span><strong>Try the demo</strong><small>demo@nest.edu · password: demo123</small></span></div><form className="login-form" onSubmit={submit}><label>Email address<input name="email" type="email" defaultValue="demo@nest.edu" autoComplete="email" /></label><label>Password<div className="password-row"><input name="password" type="password" defaultValue="demo123" autoComplete="current-password" /><button type="button" onClick={() => setError("Password recovery is not connected in this demo.")}>Forgot?</button></div></label>{error ? <p className="form-error" role="alert">{error}</p> : null}<button type="submit" className="button button--primary button--wide" disabled={loading}>{loading ? "Opening demo…" : <>Continue as {role} <ArrowRightIcon /></>}</button></form><p className="login-disclaimer">This interface does not authenticate, create a session, or store personal information.</p></>;
}
