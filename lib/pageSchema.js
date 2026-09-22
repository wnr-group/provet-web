const { z } = require("zod");
const { toSlug } = require("./slug");
const { DEFAULT_SECTION_TYPE, SECTION_TYPE_KEYS, validateSectionConfig } = require("./sectionTypes");

// Validation for the page-settings form and the section editor. Shared by
// the admin route and the admin screen, so the editor and the server agree
// on what a valid page looks like.

const pageSettingsSchema = z.object({
  title: z.string().trim().min(1, "Page title is required"),
  description: z.string().trim().optional().nullable(),
  heroImage: z.string().trim().optional().nullable(),
  seoTitle: z.string().trim().max(70, "SEO title should be 70 characters or fewer").optional().nullable(),
  seoDescription: z
    .string()
    .trim()
    .max(200, "SEO description should be 200 characters or fewer")
    .optional()
    .nullable(),
});

const sectionSchema = z.object({
  key: z.string().trim().min(1, "Every section needs a key"),
  type: z.enum(SECTION_TYPE_KEYS).optional(),
  title: z.string().trim().optional().nullable(),
  body: z.string().trim().optional().nullable(),
  image: z.string().trim().optional().nullable(),
  config: z.record(z.string(), z.any()).optional().nullable(),
  isVisible: z.boolean().optional(),
  order: z.number().int().optional(),
});

const pagePutSchema = z.object({
  page: pageSettingsSchema,
  sections: z.array(sectionSchema),
});

// Section keys identify a row within its page and are what the unique index
// is built on, so they have to be slug-shaped and unique. Returns an error
// message or null - the caller turns it into a 400.
function checkSectionKeys(sections) {
  const seen = new Set();
  for (const section of sections) {
    const key = toSlug(section.key);
    if (!key) return `"${section.key}" is not a usable section key`;
    if (seen.has(key)) return `Duplicate section key "${key}"`;
    seen.add(key);
  }
  return null;
}

// Validates each section's type-specific settings, naming the offending
// section so the admin knows which card to fix.
function checkSectionConfigs(sections) {
  for (const section of sections) {
    const type = section.type || DEFAULT_SECTION_TYPE;
    const result = validateSectionConfig(type, section.config);
    if (!result.success) {
      const issue = result.error.issues[0];
      return `Section "${section.key}": ${issue?.message || "invalid settings"}`;
    }
  }
  return null;
}

// Normalizes the submitted sections into rows ready for the database:
// slugified keys, a concrete type, and `order` taken from the submitted
// order so drag-to-reorder in the admin is what gets stored.
function toSectionRows(sections) {
  return sections.map((section, index) => ({
    key: toSlug(section.key),
    type: section.type || DEFAULT_SECTION_TYPE,
    title: section.title ?? null,
    body: section.body ?? null,
    image: section.image ?? null,
    config: section.config ? JSON.stringify(section.config) : null,
    isVisible: section.isVisible ?? true,
    order: index,
  }));
}

module.exports = {
  pageSettingsSchema,
  sectionSchema,
  pagePutSchema,
  checkSectionKeys,
  checkSectionConfigs,
  toSectionRows,
};
