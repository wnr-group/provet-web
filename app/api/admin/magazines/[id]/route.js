const prisma = require("../../../../../lib/prisma");
const { requireAdmin } = require("../../../../../lib/requireAdmin");
const { magazinePatchSchema, serializeAdminMagazine } = require("../../../../../lib/magazines");

// PUT /api/admin/magazines/:id - partial update. The publish switch sends only
// isPublished; changing the year or month sends both.
export async function PUT(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = magazinePatchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.magazine.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Magazine not found" }, { status: 404 });

  const next = { ...existing, ...parsed.data };
  if (next.isPublished && !next.coverImage) {
    return Response.json({ error: "Add a cover image before publishing" }, { status: 400 });
  }

  if (parsed.data.publishedAt) {
    const year = parsed.data.publishedAt.getUTCFullYear();
    await prisma.magazineYear.upsert({ where: { year }, create: { year }, update: {} });
  }
  const row = await prisma.magazine.update({ where: { id }, data: parsed.data });
  return Response.json(serializeAdminMagazine(row));
}

// DELETE /api/admin/magazines/:id
export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.magazine.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Magazine not found" }, { status: 404 });

  await prisma.magazine.delete({ where: { id } });
  return Response.json({ success: true });
}
