const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");

export async function GET() {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const admin = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!admin) return Response.json({ error: "Admin account no longer exists" }, { status: 401 });

  return Response.json({ id: admin.id, name: admin.name, email: admin.email, role: admin.role });
}
