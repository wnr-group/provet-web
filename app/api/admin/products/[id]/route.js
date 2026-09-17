const prisma = require("../../../../../lib/prisma");
const { requireAdmin } = require("../../../../../lib/requireAdmin");
const { toSlug } = require("../../../../../lib/slug");
const { serializeProductDetail } = require("../../../../../lib/serializers");
const { productSchema, toDbData } = require("../../../../../lib/productSchema");

// GET /api/admin/products/:id
export async function GET(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
  if (!product) return Response.json({ error: "Product not found" }, { status: 404 });

  return Response.json(serializeProductDetail(product));
}

// PUT /api/admin/products/:id
export async function PUT(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Product not found" }, { status: 404 });

  if (parsed.data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
    if (!category) {
      return Response.json({ error: "categoryId does not reference an existing category" }, { status: 400 });
    }
  }

  const input = { ...parsed.data };
  if (input.slug) input.slug = toSlug(input.slug);

  const data = toDbData(input);
  const product = await prisma.product.update({ where: { id }, data, include: { category: true } });
  return Response.json(serializeProductDetail(product));
}

// DELETE /api/admin/products/:id
export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Product not found" }, { status: 404 });

  await prisma.product.delete({ where: { id } });
  return Response.json({ success: true });
}
