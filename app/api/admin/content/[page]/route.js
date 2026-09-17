const { z } = require("zod");
const prisma = require("../../../../../lib/prisma");
const { requireAdmin } = require("../../../../../lib/requireAdmin");

const sectionSchema = z.object({
  key: z.string().trim().min(1, "key is required"),
  title: z.string().trim().optional().nullable(),
  body: z.string().trim().optional().nullable(),
  image: z.string().trim().optional().nullable(),
  order: z.number().int().optional(),
});

const putSchema = z.object({ sections: z.array(sectionSchema) });

// GET /api/admin/content/:page - all sections incl. structure
export async function GET(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { page } = await params;
  const blocks = await prisma.contentBlock.findMany({ where: { page }, orderBy: { order: "asc" } });

  return Response.json({
    page,
    sections: blocks.map((b) => ({ key: b.key, title: b.title, body: b.body, image: b.image, order: b.order })),
  });
}

// PUT /api/admin/content/:page - upserts all sections for that page
export async function PUT(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { page } = await params;
  const body = await request.json().catch(() => null);
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { sections } = parsed.data;

  await prisma.$transaction(
    sections.map((section, index) =>
      prisma.contentBlock.upsert({
        where: { page_key: { page, key: section.key } },
        create: {
          page,
          key: section.key,
          title: section.title ?? null,
          body: section.body ?? null,
          image: section.image ?? null,
          order: section.order ?? index,
        },
        update: {
          title: section.title ?? null,
          body: section.body ?? null,
          image: section.image ?? null,
          order: section.order ?? index,
        },
      })
    )
  );

  const blocks = await prisma.contentBlock.findMany({ where: { page }, orderBy: { order: "asc" } });

  return Response.json({
    page,
    sections: blocks.map((b) => ({ key: b.key, title: b.title, body: b.body, image: b.image, order: b.order })),
  });
}
