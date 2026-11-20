"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { login } from "@/components/admin/adminApi";

export default function LoginForm() {
  const router = useRouter();
  // No address is pre-filled: the form must not hint at who the admin is.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Invalid email or password.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="admin-email">Email</label>
        <input id="admin-email" type="email" required autoComplete="username" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="label" htmlFor="admin-password">Password</label>
        <input id="admin-password" type="password" required autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
        <LogIn size={16} /> {submitting ? "Signing in..." : "Sign In"}
      </button>
      <p className="text-center text-sm">
        <Link href="/admin/forgot-password" className="text-brand-700 hover:underline">Forgot your password?</Link>
      </p>
    </form>
  );
}
