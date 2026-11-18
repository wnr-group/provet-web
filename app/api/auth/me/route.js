const { requireAdmin } = require("../../../../lib/requireAdmin");

export async function GET() {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  return Response.json({ id: session.sub, name: session.name, email: session.email, role: session.role });
}
