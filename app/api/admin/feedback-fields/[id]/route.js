const prisma = require("../../../../../lib/prisma");
const { requireAdmin } = require("../../../../../lib/requireAdmin");
const { serializeFeedbackField } = require("../../../../../lib/serializers");
const {
  SYSTEM_FIELDS,
  feedbackFieldSchema,
  systemFieldUpdateSchema,
  typeHasOptions,
} = require("../../../../../lib/feedbackSchema");

// PUT /api/admin/feedback-fields/:id
export async function PUT(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.feedbackField.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Field not found" }, { status: 404 });

  const body = await request.json().catch(() => null);

  // A system field's key and type are fixed - it writes to a real column, so
  // changing either would orphan the data. Only presentation and the
  // enabled/required flags are editable, and `message` not even those.
  if (existing.isSystem) {
    const parsed = systemFieldUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }

    const locked = SYSTEM_FIELDS[existing.key]?.locked;
    const input = parsed.data;

    if (locked && (input.isEnabled === false || input.isRequired === false)) {
      return Response.json(
        { error: `"${existing.label}" must stay enabled and required` },
        { status: 400 }
      );
    }

    const field = await prisma.feedbackField.update({
      where: { id },
      data: {
        label: input.label,
        placeholder: input.placeholder?.trim() || null,
        helpText: input.helpText?.trim() || null,
        isEnabled: locked ? true : input.isEnabled ?? existing.isEnabled,
        isRequired: locked ? true : input.isRequired ?? existing.isRequired,
        order: input.order ?? existing.order,
      },
    });
    return Response.json(serializeFeedbackField(field));
  }

  const parsed = feedbackFieldSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const input = parsed.data;
  const field = await prisma.feedbackField.update({
    where: { id },
    data: {
      // key deliberately untouched - see the model comment in schema.prisma.
      label: input.label,
      type: input.type,
      placeholder: input.placeholder?.trim() || null,
      helpText: input.helpText?.trim() || null,
      options: typeHasOptions(input.type) ? JSON.stringify(input.options.filter((o) => o.trim())) : null,
      isRequired: input.isRequired ?? existing.isRequired,
      isEnabled: input.isEnabled ?? existing.isEnabled,
      order: input.order ?? existing.order,
    },
  });

  return Response.json(serializeFeedbackField(field));
}

// DELETE /api/admin/feedback-fields/:id
export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.feedbackField.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Field not found" }, { status: 404 });

  if (existing.isSystem) {
    return Response.json(
      { error: "Built-in fields can't be deleted — disable it instead" },
      { status: 409 }
    );
  }

  // Answers already submitted under this field are left alone: they carry
  // their own label, so past submissions stay readable after the delete.
  await prisma.feedbackField.delete({ where: { id } });
  return Response.json({ success: true });
}
