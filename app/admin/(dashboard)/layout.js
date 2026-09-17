import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: { default: "Admin", template: "%s — Provet Admin" },
  robots: { index: false, follow: false },
};

// proxy.js already redirects unauthenticated visits to /admin/login before
// this ever renders; this check is defense-in-depth (same reasoning as
// requireAdmin() inside every /api/admin/* route), not the primary gate.
export default async function AdminLayout({ children }) {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  const admin = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!admin) redirect("/admin/login");

  return (
    <AdminShell admin={{ id: admin.id, name: admin.name, email: admin.email, role: admin.role }}>
      {children}
    </AdminShell>
  );
}
