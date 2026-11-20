const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");
const { magazineYearSchema, serializeAdminYear } = require("../../../../lib/magazines");

// How many issues each year holds (published or not), for the admin's list.
async function countsByYear() {
  const rows = await prisma.magazine.findMany({ select: { publishedAt: true } });
  const counts = new Map();
  for (const r of rows) {
    const y = r.publishedAt.getUTCFullYear();
    counts.set(y, (counts.get(y) || 0) + 1);
  }
  return counts;
}

// GET /api/admin/magazine-years - every year, newest first, with its issue count
export async function GET() {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const [years, counts] = await Promise.all([prisma.magazineYear.findMany({ orderBy: { year: "desc" } }), countsByYear()]);
  return Response.json(years.map((y) => serializeAdminYear(y, counts.get(y.year) || 0)));
}

// POST /api/admin/magazine-years { year, isRecent? }
export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = magazineYearSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.magazineYear.findUnique({ where: { year: parsed.data.year } });
  if (existing) return Response.json({ error: `${parsed.data.year} is already in the list` }, { status: 409 });

  const row = await prisma.magazineYear.create({ data: { year: parsed.data.year, isRecent: parsed.data.isRecent === true } });
  return Response.json(serializeAdminYear(row, 0), { status: 201 });
}
