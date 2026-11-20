import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/requireAdmin";
import AuthShell from "@/components/admin/AuthShell";
import ResetPasswordForm from "@/components/admin/ResetPasswordForm";

export const metadata = { title: "Choose a new password - Provet Admin", robots: { index: false, follow: false } };

// Only reachable from a reset link (/auth/confirm gave the person a session),
// and only for an administrator.
export default async function ResetPassword() {
  if (!(await requireAdmin())) redirect("/admin/forgot-password?expired=1");
  return (
    <AuthShell title="Choose a new password" subtitle="Pick something you do not use anywhere else">
      <ResetPasswordForm />
    </AuthShell>
  );
}
