const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");
const { serializeFeedbackField } = require("../../../../lib/serializers");
const {
  DEFAULT_FEEDBACK_FIELDS,
  FIELD_TYPES,
  SYSTEM_FIELDS,
  feedbackFieldSchema,
  buildFieldKey,
  typeHasOptions,
} = require("../../../../lib/feedbackSchema");

// Recreates the built-ins if the table is empty, so the admin screen is never
// blank on a database that predates the field system.
async function ensureSystemFields() {
  const count = await prisma.feedbackField.count();
  if (count > 0) return;
  await prisma.$transaction(
    DEFAULT_FEEDBACK_FIELDS.map((field) =>
      prisma.feedbackField.upsert({ where: { key: field.key }, update: {}, create: field })
    )
  );
}

// GET /api/admin/feedback-fields - every field, enabled or not
export async function GET() {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  await ensureSystemFields();
  const fields = await prisma.feedbackField.findMany({ orderBy: { order: "asc" } });

  // `types` rides along so the admin UI doesn't have to import
  // lib/feedbackSchema (and drag zod into the client bundle) just to label a
  // dropdown - the field-type list stays defined in exactly one place.
  return Response.json({
    fields: fields.map((field) => ({
      ...serializeFeedbackField(field),
      locked: Boolean(SYSTEM_FIELDS[field.key]?.locked),
    })),
    types: FIELD_TYPES,
  });
}

// POST /api/admin/feedback-fields - add a custom field
export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = feedbackFieldSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const input = parsed.data;
  const existing = await prisma.feedbackField.findMany({ select: { key: true, order: true } });

  const field = await prisma.feedbackField.create({
    data: {
      // The key is derived here and then frozen - already-submitted answers
      // are keyed by it, so a later rename must not change it.
      key: buildFieldKey(input.label, existing.map((f) => f.key)),
      label: input.label,
      type: input.type,
      placeholder: input.placeholder?.trim() || null,
      helpText: input.helpText?.trim() || null,
      options: typeHasOptions(input.type) ? JSON.stringify(input.options.filter((o) => o.trim())) : null,
      isRequired: input.isRequired ?? false,
      isEnabled: input.isEnabled ?? true,
      isSystem: false,
      order: input.order ?? existing.length,
    },
  });

  return Response.json(serializeFeedbackField(field), { status: 201 });
}
