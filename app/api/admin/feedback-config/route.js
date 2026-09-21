const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");
const { serializeFeedbackConfig } = require("../../../../lib/serializers");
const { DEFAULT_FEEDBACK_CONFIG, feedbackConfigSchema } = require("../../../../lib/feedbackSchema");

const SINGLETON_KEY = "default";

// GET /api/admin/feedback-config
export async function GET() {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const config = await prisma.feedbackSetting.findUnique({ where: { key: SINGLETON_KEY } });
  return Response.json(config ? serializeFeedbackConfig(config) : { ...DEFAULT_FEEDBACK_CONFIG });
}

// PUT /api/admin/feedback-config - upserts the singleton row
export async function PUT(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = feedbackConfigSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const data = { ...parsed.data, description: parsed.data.description?.trim() || null };

  const config = await prisma.feedbackSetting.upsert({
    where: { key: SINGLETON_KEY },
    create: { key: SINGLETON_KEY, ...data },
    update: data,
  });

  return Response.json(serializeFeedbackConfig(config));
}
