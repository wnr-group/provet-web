const { z } = require("zod");

// Shared by the API route (server-side validation, the real gate) and the
// modal form, so the messages the user sees match what the server enforces.
//
// Each required field leads with a min(1) "is required" check: Zod reports
// every failing check, so without it a blank input would surface a format
// rule it also happens to fail. Pair with firstFieldErrors(), which keeps the
// first issue per field.
const brochureLeadSchema = z.object({
  name: z
    .string({ error: "Full name is required" })
    .trim()
    .min(1, "Full name is required")
    .min(2, "Please enter your full name"),
  email: z
    .string({ error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string({ error: "Phone is required" })
    .trim()
    .min(1, "Phone is required")
    .min(7, "Please enter a valid phone number")
    .regex(/^[0-9+\-()\s]+$/, "Phone can only contain digits, spaces and + - ( )"),
  company: z
    .string({ error: "Company or organization is required" })
    .trim()
    .min(1, "Company or organization is required")
    .min(2, "Please enter your company or organization"),
  city: z.string().trim().max(120, "City must be 120 characters or fewer").optional().nullable(),
});

// Keeps the first issue per field - the most specific thing to tell the user
// to do next. Issues with no field path (object-level) are dropped rather
// than keyed as "undefined".
function firstFieldErrors(error) {
  const out = {};
  for (const issue of error.issues) {
    if (!issue.path.length) continue;
    const field = issue.path[0];
    if (!(field in out)) out[field] = issue.message;
  }
  return out;
}

module.exports = { brochureLeadSchema, firstFieldErrors };
