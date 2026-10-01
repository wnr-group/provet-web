const prisma = require("../../../../../lib/prisma");
const { requireAdmin } = require("../../../../../lib/requireAdmin");
const { categoryReorderSchema } = require("../../../../../lib/categorySchema");
const { reorderError } = require("../../../../../lib/categoryTree");

// PUT /api/admin/categories/reorder - { parentId: null | id, order: [id, ...] }
//
// Reorders one level: the top-level categories (parentId null) or one
// category's subcategories. A static segment, so it never collides with
// /categories/[id].
export async function PUT(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = categoryReorderSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { parentId, order } = parsed.data;
  const siblings = await prisma.category.findMany({ where: { parentId }, select: { id: true } });
  const invalid = reorderError(
    order,
    siblings.map((s) => s.id)
  );
  if (invalid) return Response.json({ error: invalid }, { status: 400 });

  await prisma.$transaction(
    order.map((id, index) => prisma.category.update({ where: { id }, data: { sortOrder: index } }))
  );

  return Response.json({ success: true });
}
