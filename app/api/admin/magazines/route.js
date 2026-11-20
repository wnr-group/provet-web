const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");
const { magazineSchema, serializeAdminMagazine } = require("../../../../lib/magazines");

// GET /api/admin/magazines - every issue, published or not, newest first
export async function GET() {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const rows = await prisma.magazine.findMany({ orderBy: [{ publishedAt: "desc" }, { id: "desc" }] });
  return Response.json(rows.map(serializeAdminMagazine));
}

// POST /api/admin/magazines { title, year, month, ... }
// The issue goes into its year; a year that is not in the list yet is added
// (as an Archive year - the admin chooses which years are recent).
export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = magazineSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }
  if (parsed.data.isPublished && !parsed.data.coverImage) {
    return Response.json({ error: "Add a cover image before publishing" }, { status: 400 });
  }

  const year = parsed.data.publishedAt.getUTCFullYear();
  await prisma.magazineYear.upsert({ where: { year }, create: { year }, update: {} });
  const row = await prisma.magazine.create({ data: parsed.data });
  return Response.json(serializeAdminMagazine(row), { status: 201 });
}
