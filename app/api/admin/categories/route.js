const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");
const { toSlug } = require("../../../../lib/slug");
const { serializeCategory } = require("../../../../lib/serializers");
const { categorySchema, normalizeParentId } = require("../../../../lib/categorySchema");
const { parentChangeError } = require("../../../../lib/categoryTree");

// GET /api/admin/categories - every category at both levels, flat, in
// catalogue order. Each carries its parentId, the count of products filed
// directly under it (active and inactive) and how many subcategories it has;
// the admin screens build the tree from that.
export async function GET() {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true, children: true } } },
  });

  return Response.json(
    categories.map((c) => ({ ...serializeCategory(c, c._count.products), childCount: c._count.children }))
  );
}

// POST /api/admin/categories - { name, description?, image?, parentId? }
// A parentId makes it a subcategory; it goes to the end of its siblings.
export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { name, description, image, parentId } = normalizeParentId(parsed.data);
  const slug = parsed.data.slug ? toSlug(parsed.data.slug) : toSlug(name);

  let parent = null;
  if (parentId) {
    parent = await prisma.category.findUnique({ where: { id: parentId } });
    if (!parent) return Response.json({ error: "The chosen parent category no longer exists" }, { status: 400 });
    const placementError = parentChangeError({ parent });
    if (placementError) return Response.json({ error: placementError }, { status: 400 });
  }

  if (await prisma.category.findUnique({ where: { slug } })) {
    return Response.json({ error: `A category with the URL name "${slug}" already exists` }, { status: 409 });
  }

  const last = await prisma.category.findFirst({
    where: { parentId: parentId || null },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description: description || null,
      image: image || null,
      parentId: parentId || null,
      sortOrder: last ? last.sortOrder + 1 : 0,
    },
  });

  return Response.json({ ...serializeCategory(category, 0), childCount: 0 }, { status: 201 });
}
