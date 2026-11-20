const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");
const { magazineSettingsSchema, serializeAdminSettings, settingsToRow, SINGLETON_KEY } = require("../../../../lib/magazines");

// GET /api/admin/magazine-settings - the saved settings (the defaults until saved)
export async function GET() {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const row = await prisma.magazineSetting.findUnique({ where: { key: SINGLETON_KEY } });
  return Response.json(serializeAdminSettings(row));
}

// PUT /api/admin/magazine-settings - upserts the singleton row
export async function PUT(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = magazineSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const data = settingsToRow(parsed.data);
  const row = await prisma.magazineSetting.upsert({
    where: { key: SINGLETON_KEY },
    create: { key: SINGLETON_KEY, ...data },
    update: data,
  });
  return Response.json(serializeAdminSettings(row));
}
