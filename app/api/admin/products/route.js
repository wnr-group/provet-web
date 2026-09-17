const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");
const { toSlug } = require("../../../../lib/slug");
const { serializeProductDetail } = require("../../../../lib/serializers");
const { productSchema, toDbData } = require("../../../../lib/productSchema");

// GET /api/admin/products?page=&limit=&search= - all products, active + inactive
export async function GET(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(parseInt(searchParams.get("page"), 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit"), 10) || 20, 1), 100);
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  const where = {};
  if (search) {
    where.OR = [{ name: { contains: search } }, { sku: { contains: search } }];
  }
  if (category) {
    where.categoryId = category;
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return Response.json({ items: items.map(serializeProductDetail), total, page, limit });
}

// POST /api/admin/products
export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) {
    return Response.json({ error: "categoryId does not reference an existing category" }, { status: 400 });
  }

  const slug = parsed.data.slug ? toSlug(parsed.data.slug) : toSlug(parsed.data.name);
  const data = toDbData({ ...parsed.data, slug });

  const product = await prisma.product.create({ data, include: { category: true } });
  return Response.json(serializeProductDetail(product), { status: 201 });
}
