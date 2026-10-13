import { useState } from "react";
import type { FormEvent } from "react";
import type { RealtorSession } from "../services/realtorApi";

const base = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");

export default function AccountSecurityPanel({ session }: { session: RealtorSession }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (working) return;
    setMessage(""); setError("");
    if (newPassword !== confirmPassword) { setError("New passwords do not match."); return; }
    if (!base) { setError("API is not configured."); return; }
    setWorking(true);
    try {
      const res = await fetch(`${base}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result=await res.json() as {success?:boolean;message?:string;data?:{message?:string}};
      if (!res.ok || !result.success) throw new Error(result.message || "Unable to change password.");
      setCurrentPassword("");setNewPassword("");setConfirmPassword("");
      setMessage(result.data?.message || "Password changed.");
    } catch(e) { setError(e instanceof Error?e.message:"Unable to change password."); }
    finally { setWorking(false); }
  }

  return <details className="listing-dashboard-card listing-password-panel">
    <summary>Account security — change password</summary>
    <form onSubmit={save} className="listing-password-form">
      <p>For better security, change your temporary password after your first sign-in.</p>
      <label htmlFor="current-pass">Current password</label>
      <input id="current-pass" type="password" autoComplete="current-password" required
        value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)}/>
      <label htmlFor="new-pass">New password (at least 12 characters)</label>
      <input id="new-pass" type="password" autoComplete="new-password" required minLength={12} maxLength={128}
        value={newPassword} onChange={e=>setNewPassword(e.target.value)}/>
      <label htmlFor="confirm-pass">Confirm new password</label>
      <input id="confirm-pass" type="password" autoComplete="new-password" required minLength={12} maxLength={128}
        value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}/>
      <button type="submit" className="primary-button" disabled={working}>{working?"Updating...":"Change password"}</button>
      {message && <p role="status" className="listing-dashboard-success">{message}</p>}
      {error && <p role="alert" className="listing-dashboard-error">{error}</p>}
    </form>
  </details>;
}
