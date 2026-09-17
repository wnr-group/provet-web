const { z } = require("zod");
const prisma = require("../../../../../lib/prisma");
const { requireAdmin } = require("../../../../../lib/requireAdmin");

// PATCH /api/admin/enquiries/:id
export async function PATCH(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const schema = z.object({ status: z.enum(["new", "read", "resolved"]) });
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.enquiry.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Enquiry not found" }, { status: 404 });

  const enquiry = await prisma.enquiry.update({ where: { id }, data: { status: parsed.data.status } });
  return Response.json(enquiry);
}
