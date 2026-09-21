const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");
const { PLATFORMS, mergeWithPlatformDefaults, socialLinksSchema } = require("../../../../lib/socialSchema");

// GET /api/admin/social-links - every platform, enabled or not. The response
// is padded from the PLATFORMS list so the admin form is stable and never
// needs an "add platform" step; padding happens on read rather than by
// writing placeholder rows, because a GET shouldn't have side effects.
export async function GET() {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const rows = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  return Response.json({ links: mergeWithPlatformDefaults(rows) });
}

// PUT /api/admin/social-links - upserts the whole set in one transaction
export async function PUT(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = socialLinksSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { links } = parsed.data;
  const orderOf = new Map(PLATFORMS.map((p, i) => [p.key, i]));

  await prisma.$transaction(
    links.map((link) => {
      // A blank URL is stored as NULL so "not configured" is one value, not
      // two ("" and null) that every reader would have to handle.
      const url = link.url?.trim() || null;
      const isActive = Boolean(link.isActive) && Boolean(url);
      const order = link.order ?? orderOf.get(link.platform) ?? 0;
      return prisma.socialLink.upsert({
        where: { platform: link.platform },
        create: { platform: link.platform, url, isActive, order },
        update: { url, isActive, order },
      });
    })
  );

  const rows = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  return Response.json({ links: mergeWithPlatformDefaults(rows) });
}
