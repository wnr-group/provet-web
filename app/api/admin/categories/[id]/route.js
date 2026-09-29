const prisma = require("../../../../../lib/prisma");
const { requireAdmin } = require("../../../../../lib/requireAdmin");
const { toSlug } = require("../../../../../lib/slug");
const { serializeCategory } = require("../../../../../lib/serializers");
const { categorySchema, normalizeParentId } = require("../../../../../lib/categorySchema");
const { parentChangeError, deleteCategoryError } = require("../../../../../lib/categoryTree");

const COUNTS = { _count: { select: { products: true, children: true } } };

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

  const existing = await prisma.category.findUnique({ where: { id }, include: COUNTS });
  if (!existing) return Response.json({ error: "Category not found" }, { status: 404 });

  const data = normalizeParentId({ ...parsed.data });
  if (data.slug) data.slug = toSlug(data.slug);
  else if (data.name) data.slug = toSlug(data.name);

  if (data.slug && data.slug !== existing.slug) {
    const clash = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (clash && clash.id !== id) {
      return Response.json({ error: `A category with the URL name "${data.slug}" already exists` }, { status: 409 });
    }
  }

  // Moving between levels or parents.
  const moving = "parentId" in data && data.parentId !== existing.parentId;
  if (moving) {
    const parent = data.parentId ? await prisma.category.findUnique({ where: { id: data.parentId } }) : null;
    if (data.parentId && !parent) {
      return Response.json({ error: "The chosen parent category no longer exists" }, { status: 400 });
    }
    const placementError = parentChangeError({
      id,
      parent,
      childCount: existing._count.children,
      productCount: existing._count.products,
      becomingTopLevel: !data.parentId,
    });
    if (placementError) return Response.json({ error: placementError }, { status: 400 });

    // Join the end of the new sibling list.
    const last = await prisma.category.findFirst({
      where: { parentId: data.parentId, NOT: { id } },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    data.sortOrder = last ? last.sortOrder + 1 : 0;
  } else {
    delete data.parentId;
  }

  const category = await prisma.category.update({ where: { id }, data, include: COUNTS });
  return Response.json({ ...serializeCategory(category, category._count.products), childCount: category._count.children });
}

// DELETE /api/admin/categories/:id - refused while it still holds
// subcategories or products, so nothing is ever orphaned or lost.
export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.category.findUnique({ where: { id }, include: COUNTS });
  if (!existing) return Response.json({ error: "Category not found" }, { status: 404 });

  const blocked = deleteCategoryError({
    childCount: existing._count.children,
    productCount: existing._count.products,
  });
  if (blocked) return Response.json({ error: blocked }, { status: 409 });

  await prisma.category.delete({ where: { id } });
  return Response.json({ success: true });
}
