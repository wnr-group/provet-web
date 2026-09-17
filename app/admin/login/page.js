"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogIn } from "lucide-react";
import { login } from "@/components/admin/adminApi";

// No client-side "already authenticated?" check needed here: proxy.js
// redirects an authenticated visit to /admin/login over to /admin
// server-side, before this page ever renders.
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@provet.in");
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
    <div className="flex min-h-screen items-center justify-center bg-brand-700 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-white">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2">
            <Image src="/logo-mark.png" alt="" width={56} height={56} className="h-full w-full object-contain" />
          </span>
          <h1 className="mt-3 font-display text-xl font-extrabold">Provet Admin</h1>
          <p className="text-sm text-brand-200">Sign in to manage your website</p>
        </div>

        <form onSubmit={onSubmit} className="card space-y-4 p-6">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@provet.in"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
            <LogIn size={16} /> {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
