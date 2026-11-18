import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/requireAdmin";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: { default: "Admin", template: "%s - Provet Admin" },
  robots: { index: false, follow: false },
};

// proxy.js already redirects visitors with no session to /admin/login before
// this renders. This is the real check: the session must be verified with
// Supabase AND belong to an active admin (requireAdmin), so a signed-in person
// who is not an administrator gets nowhere either.
export default async function AdminLayout({ children }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <AdminShell admin={{ id: admin.sub, name: admin.name, email: admin.email, role: admin.role }}>
      {children}
    </AdminShell>
  );
}
