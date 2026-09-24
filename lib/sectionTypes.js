const { z } = require("zod");

// The catalogue of section types a managed page can be built from, and the
// validation for each one's extra settings.
//
// One registry drives three things - the type dropdown in the admin, which
// editor fields that type shows, and which renderer the public page picks -
// so a type can never exist in one place and not the others.
//
// `config` holds whatever a type needs beyond the shared title/body/image
// columns. It is stored JSON-encoded in ContentBlock.config, the same
// convention Product.specifications and Feedback.answers already use.

const buttonSchema = z.object({
  label: z.string().trim().min(1, "Button label is required"),
  href: z.string().trim().min(1, "Button link is required"),
  style: z.enum(["primary", "accent", "outline"]).optional(),
  newTab: z.boolean().optional(),
});

// Which of the shared columns each type actually uses. The admin editor
// renders exactly these, so a rich-text section never shows an unused image
// picker and a product grid never shows a body box it would ignore.
const SECTION_TYPES = {
  richText: {
    label: "Rich text",
    description: "A heading and body copy. Blank lines start a new paragraph.",
    fields: ["title", "body"],
    configSchema: z.object({}).strict(),
    defaults: {},
  },
  imageText: {
    label: "Image + text",
    description: "Body copy beside an image.",
    fields: ["title", "body", "image"],
    configSchema: z
      .object({ imagePosition: z.enum(["left", "right"]).optional() })
      .strict(),
    defaults: { imagePosition: "right" },
  },
  list: {
    label: "Bullet list",
    description: "One item per line, rendered as a checklist.",
    fields: ["title", "body"],
    configSchema: z.object({}).strict(),
    defaults: {},
  },
  cards: {
    label: "Card grid",
    description: "One card per line, written as \"Heading: text\".",
    fields: ["title", "body"],
    configSchema: z.object({ columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional() }).strict(),
    defaults: { columns: 3 },
  },
  // Full-width numbered rows instead of a grid of boxes: an oversized
  // numeral beside the text, hairline between each. Same "Heading: text" body
  // as `cards`, so content moves between the two without being retyped - it
  // is the presentation that differs, which is the point of having both.
  numberedRows: {
    label: "Numbered rows",
    description: "Large numbered rows, one per line. Suits values, principles or a process.",
    fields: ["title", "body"],
    configSchema: z.object({}).strict(),
    defaults: {},
  },
  // Cards that each carry their own picture. Separate from `cards` because
  // that type's body is one line of text per card with nowhere to hang an
  // image; team portraits, booklet covers and magazine issues all need one.
  imageCards: {
    label: "Image cards",
    description: "A grid of cards, each with its own picture, heading and text.",
    fields: ["title", "body"],
    configSchema: z
      .object({
        columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
        // "cover" fills the card's width - right for booklet and magazine
        // covers, which are artwork worth showing large. "avatar" is a small
        // circle above the text, which is what a 300px headshot needs: shown
        // full-width it is both overbearing and visibly upscaled.
        imageStyle: z.enum(["cover", "avatar"]).optional(),
        // Crop for "cover" only: covers are tall, photos are not.
        aspect: z.enum(["square", "portrait", "landscape"]).optional(),
        items: z
          .array(
            z.object({
              image: z.string().trim().optional().nullable(),
              title: z.string().trim().optional().nullable(),
              text: z.string().trim().optional().nullable(),
              href: z.string().trim().optional().nullable(),
            })
          )
          .max(12)
          .optional(),
      })
      .strict(),
    defaults: { columns: 3, imageStyle: "cover", aspect: "square", items: [] },
  },
  // The same per-item shape as imageCards, shown as a slider instead of a
  // grid. Kept as its own type rather than a layout flag on imageCards so the
  // admin picks the presentation from one dropdown, and so the grid can stay
  // a server component while only this one ships JavaScript.
  carousel: {
    label: "Carousel",
    description: "Image slides that advance automatically - testimonials, awards, partner logos.",
    fields: ["title", "body"],
    configSchema: z
      .object({
        aspect: z.enum(["square", "portrait", "landscape", "wide"]).optional(),
        autoplay: z.boolean().optional(),
        // Below 2s nothing is readable before it moves on.
        interval: z.number().int().min(2000).max(20000).optional(),
        items: z
          .array(
            z.object({
              image: z.string().trim().optional().nullable(),
              title: z.string().trim().optional().nullable(),
              text: z.string().trim().optional().nullable(),
              href: z.string().trim().optional().nullable(),
            })
          )
          .max(12)
          .optional(),
      })
      .strict(),
    defaults: { aspect: "square", autoplay: true, interval: 6000, items: [] },
  },
  // Offices, branches and distributors. Structured per item (rather than a
  // "Heading: text" line like `cards`) because an address runs over several
  // lines and the phone number has to come out on its own to become a
  // tap-to-call link.
  locations: {
    label: "Locations",
    description: "Address cards for offices, branches or distributors, each with a contact person and phone.",
    fields: ["title", "body"],
    configSchema: z
      .object({
        columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
        items: z
          .array(
            z.object({
              title: z.string().trim().optional().nullable(),
              subtitle: z.string().trim().optional().nullable(),
              address: z.string().trim().optional().nullable(),
              contact: z.string().trim().optional().nullable(),
              phone: z.string().trim().optional().nullable(),
            })
          )
          .max(24)
          .optional(),
      })
      .strict(),
    defaults: { columns: 3, items: [] },
  },
  productGrid: {
    label: "Product grid",
    description: "Products pulled live from the catalogue.",
    fields: ["title", "body"],
    configSchema: z
      .object({
        // Empty means "any category" rather than "none", so a freshly added
        // section shows something instead of looking broken.
        categorySlug: z.string().trim().optional().nullable(),
        limit: z.number().int().min(1).max(12).optional(),
        featuredOnly: z.boolean().optional(),
      })
      .strict(),
    defaults: { categorySlug: null, limit: 3, featuredOnly: false },
  },
  categoryGrid: {
    label: "Category grid",
    description: "Product categories pulled live from the catalogue.",
    fields: ["title", "body"],
    configSchema: z.object({ limit: z.number().int().min(1).max(12).optional() }).strict(),
    defaults: { limit: 6 },
  },
  cta: {
    label: "Call to action",
    description: "A closing panel with buttons.",
    fields: ["title", "body"],
    configSchema: z.object({ buttons: z.array(buttonSchema).max(3).optional() }).strict(),
    defaults: { buttons: [] },
  },
};

const SECTION_TYPE_KEYS = Object.keys(SECTION_TYPES);
const DEFAULT_SECTION_TYPE = "richText";

function isSectionType(type) {
  return SECTION_TYPE_KEYS.includes(type);
}

function sectionTypeFields(type) {
  return SECTION_TYPES[type]?.fields || SECTION_TYPES[DEFAULT_SECTION_TYPE].fields;
}

// Parses the stored JSON and fills in the type's defaults. Unknown or
// malformed config degrades to the defaults rather than throwing - a bad row
// must not take the whole public page down.
function parseSectionConfig(type, raw) {
  const definition = SECTION_TYPES[type] || SECTION_TYPES[DEFAULT_SECTION_TYPE];
  let parsed = {};
  if (raw && typeof raw === "object") parsed = raw;
  else if (typeof raw === "string" && raw.trim()) {
    try {
      const json = JSON.parse(raw);
      if (json && typeof json === "object" && !Array.isArray(json)) parsed = json;
    } catch {
      parsed = {};
    }
  }
  const checked = definition.configSchema.safeParse(parsed);
  return { ...definition.defaults, ...(checked.success ? checked.data : {}) };
}

// Validates config on the way in, so the admin gets a message instead of a
// silently ignored setting.
function validateSectionConfig(type, config) {
  const definition = SECTION_TYPES[type] || SECTION_TYPES[DEFAULT_SECTION_TYPE];
  return definition.configSchema.safeParse(config || {});
}

module.exports = {
  SECTION_TYPES,
  SECTION_TYPE_KEYS,
  DEFAULT_SECTION_TYPE,
  buttonSchema,
  isSectionType,
  sectionTypeFields,
  parseSectionConfig,
  validateSectionConfig,
};
