const prisma = require("../../../lib/prisma");
const { getFeedbackConfig, getFeedbackFieldRows } = require("../../../lib/data");
const { buildFeedbackSubmissionSchema, toFeedbackRow } = require("../../../lib/feedbackSchema");

// POST /api/feedback - public submission.
//
// Validation is built from the *stored* field definitions, not from anything
// the client sends: the form's own `required` attributes are UX only, and a
// crafted request must not be able to skip a required field, submit to a
// disabled form, store a disabled field, or choose an option that isn't in
// the admin's list.
export async function POST(request) {
  const [config, fields] = await Promise.all([getFeedbackConfig(), getFeedbackFieldRows()]);

  if (!config.isEnabled) {
    return Response.json({ error: "The feedback form is currently unavailable" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = buildFeedbackSubmissionSchema(fields).safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const data = toFeedbackRow(parsed.data, fields);

  // The message column is NOT NULL. If the admin somehow disabled the system
  // message field, fall back to an empty-but-present value rather than
  // throwing a 500 at the visitor.
  const feedback = await prisma.feedback.create({ data: { ...data, message: data.message || "" } });

  // Deliberately no email notification here - that's a separate enhancement.
  return Response.json({ id: feedback.id, createdAt: feedback.createdAt }, { status: 201 });
}
