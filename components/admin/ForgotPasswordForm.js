"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { forgotPassword } from "@/components/admin/adminApi";

export default function ForgotPasswordForm({ expired = false }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(expired ? "That reset link has expired or was already used. Request a new one." : "");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.data?.error || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="card space-y-3 p-6 text-center">
        <p className="text-sm text-ink">
          If that address belongs to an administrator, a reset link is on its way. It expires soon, so use it promptly.
        </p>
        <Link href="/admin/login" className="text-sm text-brand-700 hover:underline">Back to sign in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="reset-email">Email</label>
        <input id="reset-email" type="email" required autoComplete="username" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
        <Mail size={16} /> {submitting ? "Sending..." : "Send reset link"}
      </button>
      <p className="text-center text-sm">
        <Link href="/admin/login" className="text-brand-700 hover:underline">Back to sign in</Link>
      </p>
    </form>
  );
}
