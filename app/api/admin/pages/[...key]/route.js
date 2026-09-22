const prisma = require("../../../../../lib/prisma");
const { requireAdmin } = require("../../../../../lib/requireAdmin");
const { getPageForAdmin } = require("../../../../../lib/data");
const { isManagedPageKey } = require("../../../../../lib/navigation");
const { pagePutSchema, checkSectionKeys, checkSectionConfigs, toSectionRows } = require("../../../../../lib/pageSchema");

// A catch-all because page keys contain slashes ("about/who-we-are"), which
// is also what makes the key usable directly as the public route.
function joinKey(parts) {
  return (Array.isArray(parts) ? parts : [parts]).join("/");
}

// Only pages the code actually routes to can be edited. Without this the
// endpoint would happily create content for a key nothing renders.
function rejectUnknown(key) {
  if (isManagedPageKey(key)) return null;
  return Response.json({ error: `"${key}" is not a managed page` }, { status: 404 });
}

// GET /api/admin/pages/:key - settings plus every section, hidden included
export async function GET(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { key: parts } = await params;
  const key = joinKey(parts);
  const unknown = rejectUnknown(key);
  if (unknown) return unknown;

  const { page, sections } = await getPageForAdmin(key);
  return Response.json({ key, page, sections });
}

// PUT /api/admin/pages/:key - replaces the page's settings and its sections
export async function PUT(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { key: parts } = await params;
  const key = joinKey(parts);
  const unknown = rejectUnknown(key);
  if (unknown) return unknown;

  const body = await request.json().catch(() => null);
  const parsed = pagePutSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const keyError = checkSectionKeys(parsed.data.sections);
  if (keyError) return Response.json({ error: keyError }, { status: 400 });

  const configError = checkSectionConfigs(parsed.data.sections);
  if (configError) return Response.json({ error: configError }, { status: 400 });

  const rows = toSectionRows(parsed.data.sections);
  const settings = parsed.data.page;

  // One transaction so a page can never end up half-saved: the settings
  // upsert, the removal of sections the admin deleted, and the upsert of the
  // ones that remain all land together.
  await prisma.$transaction([
    prisma.page.upsert({
      where: { key },
      create: {
        key,
        title: settings.title,
        description: settings.description ?? null,
        heroImage: settings.heroImage ?? null,
        seoTitle: settings.seoTitle ?? null,
        seoDescription: settings.seoDescription ?? null,
      },
      update: {
        title: settings.title,
        description: settings.description ?? null,
        heroImage: settings.heroImage ?? null,
        seoTitle: settings.seoTitle ?? null,
        seoDescription: settings.seoDescription ?? null,
      },
    }),
    prisma.contentBlock.deleteMany({
      where: { page: key, NOT: { key: { in: rows.map((r) => r.key) } } },
    }),
    ...rows.map((row) =>
      prisma.contentBlock.upsert({
        where: { page_key: { page: key, key: row.key } },
        create: { page: key, ...row },
        update: row,
      })
    ),
  ]);

  const { page, sections } = await getPageForAdmin(key);
  return Response.json({ key, page, sections });
}
