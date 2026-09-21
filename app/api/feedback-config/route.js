const { getFeedbackForm } = require("../../../lib/data");

// GET /api/feedback-config - the public form: config plus the enabled fields
// in display order.
export async function GET() {
  return Response.json(await getFeedbackForm());
}
