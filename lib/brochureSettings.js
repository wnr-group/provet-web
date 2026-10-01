const { z } = require("zod");

// The catalogue brochure's settings (Admin > Brochure, the BrochureSetting
// singleton). Shared by the admin API, the public brochure route and the
// products page.
//
// Until the admin saves, the brochure is the one the site shipped with: the
// file in public/brochure (or BROCHURE_FILE_URL), behind the details form.

const SINGLETON_KEY = "default";

const DEFAULT_BROCHURE_SETTINGS = {
  isEnabled: true,
  fileUrl: process.env.BROCHURE_FILE_URL || "/brochure/provet-brochure.pdf",
  fileName: null,
  buttonLabel: "Download Brochure",
  requireDetails: true,
};

// An uploaded file (/uploads/...), a file shipped in public/ (/brochure/...)
// or a full http(s) link to wherever the PDF is hosted.
const fileUrlSchema = z
  .string()
  .trim()
  .max(500, "The brochure link is too long")
  .refine((url) => /^\/(uploads|brochure)\/[\w.\-]+$/.test(url) || /^https?:\/\/\S+$/i.test(url), {
    message: "Upload a PDF, or paste a full link starting with https://",
  });

const brochureSettingsSchema = z.object({
  isEnabled: z.boolean(),
  fileUrl: fileUrlSchema.nullable().optional(),
  fileName: z.string().trim().max(200).nullable().optional(),
  buttonLabel: z
    .string({ error: "Button label is required" })
    .trim()
    .min(1, "Button label is required")
    .max(40, "Keep the button label to 40 characters or fewer"),
  requireDetails: z.boolean(),
});

function serializeBrochureSettings(row) {
  if (!row) return { ...DEFAULT_BROCHURE_SETTINGS };
  return {
    isEnabled: row.isEnabled,
    fileUrl: row.fileUrl,
    fileName: row.fileName,
    buttonLabel: row.buttonLabel,
    requireDetails: row.requireDetails,
  };
}

// The saved settings, or the defaults while nothing has been saved.
async function getBrochureSettings(prisma) {
  const row = await prisma.brochureSetting.findUnique({ where: { key: SINGLETON_KEY } });
  return serializeBrochureSettings(row);
}

// Whether the Download Brochure button should show at all.
const brochureAvailable = (settings) => Boolean(settings.isEnabled && settings.fileUrl);

module.exports = {
  SINGLETON_KEY,
  DEFAULT_BROCHURE_SETTINGS,
  brochureSettingsSchema,
  serializeBrochureSettings,
  getBrochureSettings,
  brochureAvailable,
};
