const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");
const {
  SINGLETON_KEY,
  brochureSettingsSchema,
  serializeBrochureSettings,
  getBrochureSettings,
} = require("../../../../lib/brochureSettings");

// GET /api/admin/brochure - the brochure settings (defaults until saved)
export async function GET() {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  return Response.json(await getBrochureSettings(prisma));
}

// PUT /api/admin/brochure - upserts the singleton row
export async function PUT(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = brochureSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const data = {
    ...parsed.data,
    fileUrl: parsed.data.fileUrl || null,
    fileName: parsed.data.fileName || null,
  };
  if (data.isEnabled && !data.fileUrl) {
    return Response.json({ error: "Upload the brochure PDF before turning the button on" }, { status: 400 });
  }

  const row = await prisma.brochureSetting.upsert({
    where: { key: SINGLETON_KEY },
    create: { key: SINGLETON_KEY, ...data },
    update: data,
  });

  return Response.json(serializeBrochureSettings(row));
}
