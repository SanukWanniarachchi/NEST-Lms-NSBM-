"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveAccount } from "@admin/app/actions/accounts";
import type { AdminAllowlistRecord } from "@admin/db/schema";
import type { AccountFormState, AccountFormValues } from "@admin/lib/accounts/validation";

const initialState: AccountFormState = { status: "idle" };

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Saving..." : editing ? "Save account" : "Add account"}</button>;
}

function FieldError({ state, name }: { state: AccountFormState; name: keyof AccountFormValues }) {
  const message = state.errors?.[name]?.[0];
  return message ? <span className="field-error">{message}</span> : null;
}

export function AccountForm({ account, currentSubject }: { account?: AdminAllowlistRecord; currentSubject: string }) {
  const [state, action] = useActionState(saveAccount, initialState);
  const editing = Boolean(account);
  const isCurrentAccount = account?.subject === currentSubject;

  return <form action={action} className={`account-form${editing ? " account-form--existing" : ""}`}>
    <input type="hidden" name="editing" value={editing ? "true" : "false"} />
    {state.status === "error" && <div className="form-message form-message--error" role="alert">{state.message}</div>}
    <div className="account-form__grid">
      <label className="form-field"><span>Identity subject</span><input name="subject" defaultValue={account?.subject} readOnly={editing} required maxLength={200} placeholder="nsbm:staff-id" /><FieldError state={state} name="subject" /></label>
      <label className="form-field"><span>Display name</span><input name="displayName" defaultValue={account?.displayName} required maxLength={120} /><FieldError state={state} name="displayName" /></label>
      <label className="form-field"><span>Email address</span><input name="email" type="email" defaultValue={account?.email ?? ""} maxLength={254} /><FieldError state={state} name="email" /></label>
      <label className="form-field"><span>Role</span><select name={isCurrentAccount ? undefined : "role"} defaultValue={account?.role ?? "user"} disabled={isCurrentAccount}><option value="user">User</option><option value="admin">Admin</option><option value="super_admin">Super admin</option></select>{isCurrentAccount && <input type="hidden" name="role" value={account.role} />}<FieldError state={state} name="role" /></label>
      <label className="account-active"><input type="checkbox" name={isCurrentAccount ? undefined : "active"} defaultChecked={account?.active ?? true} disabled={isCurrentAccount} /><span>Active account</span>{isCurrentAccount && <input type="hidden" name="active" value="on" />}</label>
    </div>
    <div className="form-actions"><SubmitButton editing={editing} />{isCurrentAccount && <small>Your own role and access cannot be disabled here.</small>}</div>
  </form>;
}
