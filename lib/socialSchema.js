const { z } = require("zod");

// The supported platforms are a fixed product decision, not admin data - the
// admin only supplies the URL and the enabled flag for each. This list is the
// single source of truth: the DB seeds from it, the admin API pads its
// response with it, and the UI derives its rows and icons from it.
const PLATFORMS = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourhandle" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/yourcompany" },
  { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/yourhandle" },
];

const PLATFORM_KEYS = PLATFORMS.map((p) => p.key);

function platformLabel(key) {
  return PLATFORMS.find((p) => p.key === key)?.label || key;
}

// Only http(s) is accepted. These URLs are rendered straight into an `href`,
// so allowing arbitrary schemes would let an admin store `javascript:...`
// and turn the footer into a stored-XSS vector on every public page.
function isSafeHttpUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  return parsed.protocol === "https:" || parsed.protocol === "http:";
}

// An empty/blank URL is "not configured yet" rather than an error, so the
// admin can save a partially filled form - but a platform can't be *enabled*
// without one, which is what keeps the public UI from rendering dead icons.
const socialLinkSchema = z
  .object({
    platform: z.enum(PLATFORM_KEYS, { message: "Unsupported platform" }),
    url: z.string().trim().optional().nullable(),
    isActive: z.boolean().optional(),
    order: z.number().int().optional(),
  })
  .superRefine((link, ctx) => {
    const url = link.url?.trim();
    if (url && !isSafeHttpUrl(url)) {
      ctx.addIssue({
        code: "custom",
        path: ["url"],
        message: `${platformLabel(link.platform)} URL must be a valid http(s) link`,
      });
    }
    if (link.isActive && !url) {
      ctx.addIssue({
        code: "custom",
        path: ["url"],
        message: `${platformLabel(link.platform)} needs a URL before it can be enabled`,
      });
    }
  });

const socialLinksSchema = z.object({
  links: z
    .array(socialLinkSchema)
    .superRefine((links, ctx) => {
      const seen = new Set();
      for (const link of links) {
        if (seen.has(link.platform)) {
          ctx.addIssue({ code: "custom", message: `Duplicate entry for ${platformLabel(link.platform)}` });
          return;
        }
        seen.add(link.platform);
      }
    }),
});

// Merges stored rows onto the full platform list so the admin form always
// shows every supported platform, including ones with no row yet. Pure, so a
// GET can use it without writing placeholder rows as a side effect.
function mergeWithPlatformDefaults(rows = []) {
  const byPlatform = new Map(rows.map((row) => [row.platform, row]));
  return PLATFORMS.map((platform, index) => {
    const row = byPlatform.get(platform.key);
    return {
      platform: platform.key,
      label: platform.label,
      placeholder: platform.placeholder,
      url: row?.url ?? "",
      isActive: row?.isActive ?? false,
      order: row?.order ?? index,
    };
  }).sort((a, b) => a.order - b.order);
}

module.exports = {
  PLATFORMS,
  PLATFORM_KEYS,
  platformLabel,
  isSafeHttpUrl,
  mergeWithPlatformDefaults,
  socialLinkSchema,
  socialLinksSchema,
};
