const prisma = require("../../../../../lib/prisma");
const { requireAdmin } = require("../../../../../lib/requireAdmin");
const { magazineYearPatchSchema, serializeAdminYear } = require("../../../../../lib/magazines");

const issuesIn = (year) =>
  prisma.magazine.count({ where: { publishedAt: { gte: new Date(Date.UTC(year, 0, 1)), lt: new Date(Date.UTC(year + 1, 0, 1)) } } });

// PUT /api/admin/magazine-years/:id { isRecent } - shown under Recent Editions, or an Archive year
export async function PUT(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = magazineYearPatchSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.magazineYear.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Year not found" }, { status: 404 });

  const row = await prisma.magazineYear.update({ where: { id }, data: { isRecent: parsed.data.isRecent } });
  return Response.json(serializeAdminYear(row, await issuesIn(row.year)));
}

// DELETE /api/admin/magazine-years/:id - only an empty year, so a magazine can
// never be lost by removing its year
export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.magazineYear.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Year not found" }, { status: 404 });

  const count = await issuesIn(existing.year);
  if (count > 0) {
    return Response.json(
      { error: `${existing.year} still has ${count} ${count === 1 ? "magazine" : "magazines"}. Delete or move them first.` },
      { status: 409 }
    );
  }
  await prisma.magazineYear.delete({ where: { id } });
  return Response.json({ success: true });
}
