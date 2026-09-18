const prisma = require("../../../lib/prisma");
const { brochureLeadSchema, firstFieldErrors } = require("../../../lib/brochureLeadSchema");

// Placeholder brochure, served statically from public/. When the tenant
// supplies the real PDF, either drop it in at this same path or point
// BROCHURE_FILE_URL at wherever it lives - no other code changes.
const BROCHURE_FILE_URL = process.env.BROCHURE_FILE_URL || "/brochure/provet-brochure.pdf";

// POST /api/brochure - records the lead, then returns the brochure location.
// The client downloads whatever file_url comes back rather than hardcoding a
// path, so swapping the file is a server-side change only.
export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    // Caught before safeParse so a non-object payload reports as a plain bad
    // request instead of leaking Zod's internal "expected object" wording.
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  const parsed = brochureLeadSchema.safeParse(body);
  if (!parsed.success) {
    // Field-keyed messages so the modal can mark the offending inputs even
    // when the browser skipped its own check.
    return Response.json(
      {
        error: parsed.error.issues[0]?.message || "Invalid input",
        fieldErrors: firstFieldErrors(parsed.error),
      },
      { status: 400 }
    );
  }

  const { name, email, phone, company, city } = parsed.data;
  await prisma.brochureLead.create({
    data: { name, email, phone, company, city: city || null },
  });

  return Response.json({ file_url: BROCHURE_FILE_URL }, { status: 201 });
}
