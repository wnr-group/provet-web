const prisma = require("../../../../../lib/prisma");
const { requireAdmin } = require("../../../../../lib/requireAdmin");
const { serializeFeedbackField } = require("../../../../../lib/serializers");
const { reorderSchema } = require("../../../../../lib/feedbackSchema");

// PUT /api/admin/feedback-fields/reorder - { order: [fieldId, ...] }
//
// A static segment, so it never collides with /feedback-fields/[id].
export async function PUT(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const ids = parsed.data.order;
  const existing = await prisma.feedbackField.findMany({ select: { id: true } });
  const known = new Set(existing.map((f) => f.id));

  // Reject a partial list outright rather than half-applying it - leaving
  // some fields with stale order values would scramble the form.
  if (ids.length !== existing.length || ids.some((id) => !known.has(id))) {
    return Response.json({ error: "The reorder list must name every field exactly once" }, { status: 400 });
  }
  if (new Set(ids).size !== ids.length) {
    return Response.json({ error: "The reorder list contains duplicates" }, { status: 400 });
  }

  await prisma.$transaction(
    ids.map((id, index) => prisma.feedbackField.update({ where: { id }, data: { order: index } }))
  );

  const fields = await prisma.feedbackField.findMany({ orderBy: { order: "asc" } });
  return Response.json({ fields: fields.map(serializeFeedbackField) });
}
