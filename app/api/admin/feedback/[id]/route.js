const prisma = require("../../../../../lib/prisma");
const { requireAdmin } = require("../../../../../lib/requireAdmin");
const { serializeFeedback } = require("../../../../../lib/serializers");

// GET /api/admin/feedback/:id - single feedback detail
export async function GET(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const feedback = await prisma.feedback.findUnique({ where: { id } });
  if (!feedback) return Response.json({ error: "Feedback not found" }, { status: 404 });

  return Response.json(serializeFeedback(feedback));
}

// DELETE /api/admin/feedback/:id
export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.feedback.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Feedback not found" }, { status: 404 });

  await prisma.feedback.delete({ where: { id } });
  return Response.json({ success: true });
}
