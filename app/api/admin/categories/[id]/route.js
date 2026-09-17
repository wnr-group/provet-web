const prisma = require("../../../../../lib/prisma");
const { requireAdmin } = require("../../../../../lib/requireAdmin");
const { toSlug } = require("../../../../../lib/slug");
const { serializeCategory } = require("../../../../../lib/serializers");
const { categorySchema } = require("../../../../../lib/categorySchema");

// PUT /api/admin/categories/:id
export async function PUT(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Category not found" }, { status: 404 });

  const data = { ...parsed.data };
  if (data.slug) data.slug = toSlug(data.slug);
  else if (data.name) data.slug = toSlug(data.name);

  const category = await prisma.category.update({
    where: { id },
    data,
    include: { _count: { select: { products: true } } },
  });

  return Response.json(serializeCategory(category, category._count.products));
}

// DELETE /api/admin/categories/:id
export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Category not found" }, { status: 404 });

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return Response.json(
      { error: "Cannot delete a category that still has products assigned to it" },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return Response.json({ success: true });
}
