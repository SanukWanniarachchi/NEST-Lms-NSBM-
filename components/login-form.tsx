"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, BookIcon, ChartIcon } from "@/components/icons";

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "admin">("student");
  const [loading, setLoading] = useState(false);

  function openWorkspace() {
    setLoading(true);
    window.setTimeout(() => router.push(role === "student" ? "/dashboard" : "/admin"), 350);
  }

  return <><div className="login-heading"><p className="eyebrow">NEST workspace</p><h2>Choose your portal</h2><p>Explore the learner experience or review the structure of the NEST curriculum.</p></div><div className="workspace-options" role="radiogroup" aria-label="Choose a portal"><button type="button" role="radio" aria-checked={role === "student"} className={role === "student" ? "active" : ""} onClick={() => setRole("student")}><span><BookIcon /></span><strong>Learner portal</strong><small>Browse courses, modules, and lessons.</small></button><button type="button" role="radio" aria-checked={role === "admin"} className={role === "admin" ? "active" : ""} onClick={() => setRole("admin")}><span><ChartIcon /></span><strong>Curriculum overview</strong><small>Review published learning content.</small></button></div><button type="button" className="button button--primary button--wide" onClick={openWorkspace} disabled={loading}>{loading ? "Opening portal…" : <>Continue <ArrowRightIcon /></>}</button><p className="login-disclaimer">This GitHub Pages release is read-only. Account sign-in and saved progress will be enabled when platform services are connected.</p></>;
}
