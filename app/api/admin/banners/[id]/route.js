const prisma = require("../../../../../lib/prisma");
const { requireAdmin } = require("../../../../../lib/requireAdmin");
const { bannerSchema } = require("../../../../../lib/bannerSchema");

// PUT /api/admin/banners/:id
export async function PUT(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = bannerSchema.partial().safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Banner not found" }, { status: 404 });

  const banner = await prisma.banner.update({ where: { id }, data: parsed.data });
  return Response.json(banner);
}

// DELETE /api/admin/banners/:id
export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Banner not found" }, { status: 404 });

  await prisma.banner.delete({ where: { id } });
  return Response.json({ success: true });
}
