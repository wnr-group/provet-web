const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");
const { bannerSchema } = require("../../../../lib/bannerSchema");

// GET /api/admin/banners - all banners, including inactive
export async function GET() {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });
  return Response.json(banners);
}

// POST /api/admin/banners
export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = bannerSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const banner = await prisma.banner.create({ data: parsed.data });
  return Response.json(banner, { status: 201 });
}
