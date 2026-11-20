"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { resetPassword } from "@/components/admin/adminApi";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await resetPassword(password);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.data?.error || "Could not set the password.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="new-password">New password</label>
        <input id="new-password" type="password" required minLength={12} autoComplete="new-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        <p className="mt-1 text-xs text-ink-soft">At least 12 characters, with upper and lower case letters and a number.</p>
      </div>
      <div>
        <label className="label" htmlFor="confirm-password">Confirm password</label>
        <input id="confirm-password" type="password" required autoComplete="new-password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
        <KeyRound size={16} /> {submitting ? "Saving..." : "Set new password"}
      </button>
    </form>
  );
}
