const prisma = require("../../../lib/prisma");
const { brochureLeadSchema, firstFieldErrors } = require("../../../lib/brochureLeadSchema");
const { getBrochureSettings, brochureAvailable } = require("../../../lib/brochureSettings");

// POST /api/brochure - records the lead, then returns the brochure location.
// The file is whatever Admin > Brochure holds (lib/brochureSettings.js); the
// client downloads the file_url that comes back rather than hardcoding a path.
export async function POST(request) {
  const settings = await getBrochureSettings(prisma);
  if (!brochureAvailable(settings)) {
    return Response.json({ error: "The brochure is unavailable right now." }, { status: 404 });
  }

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

  return Response.json({ file_url: settings.fileUrl }, { status: 201 });
}
