import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/requireAdmin";
import AuthShell from "@/components/admin/AuthShell";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Sign in - Provet Admin", robots: { index: false, follow: false } };

// An administrator who is already signed in goes straight to the dashboard. A
// person signed in to Supabase who is *not* an administrator does not - they
// see the form like anyone else, so there is no redirect loop.
export default async function Login() {
  if (await requireAdmin()) redirect("/admin");
  return (
    <AuthShell title="Provet Admin" subtitle="Sign in to manage your website">
      <LoginForm />
    </AuthShell>
  );
}
