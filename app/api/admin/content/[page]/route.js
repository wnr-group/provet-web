const { z } = require("zod");
const prisma = require("../../../../../lib/prisma");
const { requireAdmin } = require("../../../../../lib/requireAdmin");
const { serializeSection } = require("../../../../../lib/serializers");
const { sectionSchema, checkSectionConfigs, checkSectionKeys } = require("../../../../../lib/pageSchema");
const { isFixedContentPage, builtInSectionKeys } = require("../../../../../lib/fixedPages");

// Content for the pages that are laid out in code (home, about, contact) rather than
// assembled from admin-built sections - see FIXED_CONTENT_PAGES in
// lib/navigation.js. Sections are upserted. The page's built-in blocks
// (lib/fixedPages.js) are never deleted: their keys belong to the component
// that renders the page. Sections the admin *added* can be: when the editor
// sends its complete list with `replaceAdded: true`, any added section
// missing from it is removed. Without that flag nothing is deleted, so a
// caller sending only some sections can't wipe the rest.
//
// The section shape is the same one the managed pages use (lib/pageSchema.js)
// on purpose. It used to be a separate, narrower schema here that accepted
// only title/body/image/order, which silently dropped `config` on the way in -
// so the homepage testimonials carousel looked editable in the admin and
// saved nothing.
const putSchema = z.object({ sections: z.array(sectionSchema), replaceAdded: z.boolean().optional() });

// GET /api/admin/content/:page - every section, hidden ones included
export async function GET(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { page } = await params;
  const blocks = await prisma.contentBlock.findMany({ where: { page }, orderBy: { order: "asc" } });

  return Response.json({ page, sections: blocks.map(serializeSection) });
}

// PUT /api/admin/content/:page - upserts the sections it is given
export async function PUT(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { page } = await params;
  const body = await request.json().catch(() => null);
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { sections, replaceAdded } = parsed.data;

  const keyError = checkSectionKeys(sections);
  if (keyError) return Response.json({ error: keyError }, { status: 400 });
  const configError = checkSectionConfigs(sections);
  if (configError) return Response.json({ error: configError }, { status: 400 });

  // Added sections the admin removed. Built-in keys are always kept.
  const removals =
    replaceAdded && isFixedContentPage(page)
      ? [
          prisma.contentBlock.deleteMany({
            where: {
              page,
              key: { notIn: [...sections.map((s) => s.key), ...builtInSectionKeys(page)] },
            },
          }),
        ]
      : [];

  await prisma.$transaction([
    ...removals,
    ...sections.map((section, index) => {
      // `type` and `isVisible` are only written when supplied, so a caller
      // that sends just the copy can't reset a section's type to the default
      // or un-hide one the admin had hidden.
      const data = {
        title: section.title ?? null,
        body: section.body ?? null,
        image: section.image ?? null,
        config: section.config ? JSON.stringify(section.config) : null,
        order: section.order ?? index,
        ...(section.type ? { type: section.type } : {}),
        ...(section.isVisible === undefined ? {} : { isVisible: section.isVisible }),
      };

      return prisma.contentBlock.upsert({
        where: { page_key: { page, key: section.key } },
        create: { page, key: section.key, ...data },
        update: data,
      });
    }),
  ]);

  const blocks = await prisma.contentBlock.findMany({ where: { page }, orderBy: { order: "asc" } });

  return Response.json({ page, sections: blocks.map(serializeSection) });
}
