const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");
const { toSlug } = require("../../../../lib/slug");
const { serializeCategory } = require("../../../../lib/serializers");
const { categorySchema } = require("../../../../lib/categorySchema");

// GET /api/admin/categories
export async function GET() {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return Response.json(categories.map((c) => serializeCategory(c, c._count.products)));
}

// POST /api/admin/categories
export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { name, description, image } = parsed.data;
  const slug = parsed.data.slug ? toSlug(parsed.data.slug) : toSlug(name);

  const category = await prisma.category.create({
    data: { name, slug, description: description || null, image: image || null },
  });

  return Response.json(serializeCategory(category, 0), { status: 201 });
}
