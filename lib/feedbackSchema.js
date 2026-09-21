const { z } = require("zod");
const { toSlug } = require("./slug");

// The three built-ins. They write to Feedback's own columns rather than the
// JSON `answers` blob, which is why they can't be deleted - the admin list
// and every existing row depend on those columns. `locked` fields can't be
// disabled or made optional either: a feedback form with no message would
// collect nothing.
const SYSTEM_FIELDS = {
  name: { type: "text", locked: false },
  email: { type: "email", locked: false },
  message: { type: "textarea", locked: true },
};

const SYSTEM_KEYS = Object.keys(SYSTEM_FIELDS);

// Field types the admin can choose from. `hasOptions` types need a non-empty
// option list; `multi` types submit an array rather than a scalar.
const FIELD_TYPES = [
  { key: "text", label: "Short text", hasOptions: false, multi: false },
  { key: "textarea", label: "Long text", hasOptions: false, multi: false },
  { key: "email", label: "Email", hasOptions: false, multi: false },
  { key: "tel", label: "Phone", hasOptions: false, multi: false },
  { key: "number", label: "Number", hasOptions: false, multi: false },
  { key: "select", label: "Dropdown", hasOptions: true, multi: false },
  { key: "radio", label: "Single choice", hasOptions: true, multi: false },
  { key: "checkbox", label: "Multiple choice", hasOptions: true, multi: true },
  { key: "rating", label: "Rating (1-5)", hasOptions: false, multi: false },
];

const FIELD_TYPE_KEYS = FIELD_TYPES.map((t) => t.key);
const typeInfo = (type) => FIELD_TYPES.find((t) => t.key === type);
const typeHasOptions = (type) => Boolean(typeInfo(type)?.hasOptions);
const typeIsMulti = (type) => Boolean(typeInfo(type)?.multi);

const DEFAULT_FEEDBACK_CONFIG = {
  isEnabled: true,
  title: "Share Your Feedback",
  description: "Tell us how we're doing — your comments help us improve our products and service.",
};

// Used to recreate the built-ins on a fresh database.
const DEFAULT_FEEDBACK_FIELDS = [
  { key: "name", label: "Name", type: "text", placeholder: "Jane Doe", isRequired: true, isEnabled: true, isSystem: true, order: 0 },
  { key: "email", label: "Email", type: "email", placeholder: "jane@clinic.com", isRequired: true, isEnabled: true, isSystem: true, order: 1 },
  {
    key: "message",
    label: "Feedback",
    type: "textarea",
    placeholder: "What did you think? What could we do better?",
    isRequired: true,
    isEnabled: true,
    isSystem: true,
    order: 2,
  },
];

const TEXT_MAX = 500;
const TEXTAREA_MAX = 2000;
const EMAIL_MAX = 200;
const TEL_MAX = 40;
const LABEL_MAX = 80;
const RATING_MIN = 1;
const RATING_MAX = 5;

// ---- Admin-side validation -------------------------------------------------

const feedbackConfigSchema = z.object({
  isEnabled: z.boolean(),
  title: z.string().trim().min(1, "Title is required").max(120, "Title is too long"),
  description: z.string().trim().max(500, "Description is too long").optional().nullable(),
});

const feedbackFieldSchema = z
  .object({
    label: z.string().trim().min(1, "Label is required").max(LABEL_MAX, `Label must be ${LABEL_MAX} characters or fewer`),
    type: z.enum(FIELD_TYPE_KEYS, { message: "Unsupported field type" }),
    placeholder: z.string().trim().max(120, "Placeholder is too long").optional().nullable(),
    helpText: z.string().trim().max(200, "Help text is too long").optional().nullable(),
    options: z.array(z.string().trim().min(1, "Options can't be blank")).max(30, "That's too many options").optional(),
    isRequired: z.boolean().optional(),
    isEnabled: z.boolean().optional(),
    order: z.number().int().optional(),
  })
  .superRefine((field, ctx) => {
    if (typeHasOptions(field.type)) {
      const options = (field.options || []).filter((o) => o.trim());
      if (options.length < 1) {
        ctx.addIssue({ code: "custom", path: ["options"], message: "Add at least one option for this field type" });
      }
      if (new Set(options.map((o) => o.toLowerCase())).size !== options.length) {
        ctx.addIssue({ code: "custom", path: ["options"], message: "Options must be unique" });
      }
    }
  });

// A system field's type and key are fixed; only its presentation and (unless
// locked) its enabled/required flags may change.
const systemFieldUpdateSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(LABEL_MAX, `Label must be ${LABEL_MAX} characters or fewer`),
  placeholder: z.string().trim().max(120, "Placeholder is too long").optional().nullable(),
  helpText: z.string().trim().max(200, "Help text is too long").optional().nullable(),
  isRequired: z.boolean().optional(),
  isEnabled: z.boolean().optional(),
  order: z.number().int().optional(),
});

const reorderSchema = z.object({
  order: z.array(z.string().trim().min(1)).min(1, "Nothing to reorder"),
});

// Derives the stored key from the label. Frozen after creation: already
// submitted answers are keyed by it, so a rename must not orphan them.
function buildFieldKey(label, taken = []) {
  const base = toSlug(label) || "field";
  // Never let a custom field collide with a built-in column name.
  let candidate = SYSTEM_KEYS.includes(base) ? `${base}-field` : base;
  let n = 2;
  const used = new Set(taken);
  while (used.has(candidate)) candidate = `${base}-${n++}`;
  return candidate;
}

// ---- Public submission validation -----------------------------------------

function validatorForField(field) {
  const required = field.isRequired;
  const blankMessage = `${field.label} is required`;

  switch (field.type) {
    case "email": {
      const base = z.string().trim().max(EMAIL_MAX, `${field.label} is too long`);
      return required
        ? z.string({ message: blankMessage }).trim().min(1, blankMessage).max(EMAIL_MAX, `${field.label} is too long`).pipe(z.email(`${field.label} must be a valid email address`))
        : base
            .optional()
            .nullable()
            .refine((v) => !v || z.email().safeParse(v).success, `${field.label} must be a valid email address`);
    }

    case "tel": {
      const base = z.string().trim().max(TEL_MAX, `${field.label} is too long`);
      return required ? z.string({ message: blankMessage }).trim().min(1, blankMessage).max(TEL_MAX, `${field.label} is too long`) : base.optional().nullable();
    }

    case "textarea": {
      const base = z.string().trim().max(TEXTAREA_MAX, `${field.label} must be ${TEXTAREA_MAX} characters or fewer`);
      return required ? z.string({ message: blankMessage }).trim().min(1, blankMessage).max(TEXTAREA_MAX, `${field.label} must be ${TEXTAREA_MAX} characters or fewer`) : base.optional().nullable();
    }

    case "number": {
      // Accept the string a form control actually submits, but validate it as
      // a number so "abc" is rejected rather than stored.
      const asNumber = z.coerce.number({ message: `${field.label} must be a number` }).finite(`${field.label} must be a number`);
      return required
        ? // The union's own error would read "Invalid input"; label it so a
          // missing value reports the field name like every other type.
          z.union([z.number(), z.string().trim().min(1, blankMessage)], { message: blankMessage }).pipe(asNumber)
        : z
            .union([z.number(), z.string().trim(), z.null(), z.undefined()])
            .optional()
            .nullable()
            .refine((v) => v === undefined || v === null || v === "" || asNumber.safeParse(v).success, `${field.label} must be a number`);
    }

    case "rating": {
      const asRating = z.coerce
        .number({ message: `${field.label} must be a number` })
        .int(`${field.label} must be a whole number`)
        .min(RATING_MIN, `${field.label} must be between ${RATING_MIN} and ${RATING_MAX}`)
        .max(RATING_MAX, `${field.label} must be between ${RATING_MIN} and ${RATING_MAX}`);
      return required
        ? z.union([z.number(), z.string().trim().min(1, blankMessage)], { message: blankMessage }).pipe(asRating)
        : z
            .union([z.number(), z.string().trim(), z.null(), z.undefined()])
            .optional()
            .nullable()
            .refine((v) => v === undefined || v === null || v === "" || asRating.safeParse(v).success, `${field.label} must be between ${RATING_MIN} and ${RATING_MAX}`);
    }

    case "select":
    case "radio": {
      const options = parseFieldOptions(field.options);
      const oneOf = z.string().trim().refine((v) => options.includes(v), `${field.label} has an invalid selection`);
      return required ? z.string({ message: blankMessage }).trim().min(1, blankMessage).pipe(oneOf) : z.string().trim().optional().nullable().refine((v) => !v || options.includes(v), `${field.label} has an invalid selection`);
    }

    case "checkbox": {
      const options = parseFieldOptions(field.options);
      const list = z
        .array(z.string().trim())
        .refine((values) => values.every((v) => options.includes(v)), `${field.label} has an invalid selection`);
      return required ? list.min(1, blankMessage) : list.optional().nullable();
    }

    case "text":
    default: {
      const base = z.string().trim().max(TEXT_MAX, `${field.label} must be ${TEXT_MAX} characters or fewer`);
      return required ? z.string({ message: blankMessage }).trim().min(1, blankMessage).max(TEXT_MAX, `${field.label} must be ${TEXT_MAX} characters or fewer`) : base.optional().nullable();
    }
  }
}

// Builds the submission validator from the *stored, enabled* fields, so a
// crafted request can't skip a required field or smuggle in a disabled one.
// strip() drops anything not in the shape.
function buildFeedbackSubmissionSchema(fields = []) {
  const shape = {};
  for (const field of enabledFields(fields)) {
    shape[field.key] = validatorForField(field);
  }
  return z.object(shape).strip();
}

function enabledFields(fields = []) {
  return fields
    .filter((f) => f.isEnabled)
    .slice()
    .sort((a, b) => a.order - b.order);
}

function parseFieldOptions(options) {
  if (Array.isArray(options)) return options;
  if (!options) return [];
  try {
    const parsed = JSON.parse(options);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Splits a validated submission into the dedicated columns and the JSON
// `answers` blob. Answers carry their label so a submission stays readable
// after the field is renamed or deleted.
function toFeedbackRow(data, fields = []) {
  const active = enabledFields(fields);
  const row = { name: null, email: null, message: "", answers: null };
  const answers = [];

  for (const field of active) {
    const raw = data[field.key];
    const value = normaliseValue(raw, field);

    if (field.key === "name" && field.isSystem) {
      row.name = typeof value === "string" ? value || null : null;
      continue;
    }
    if (field.key === "email" && field.isSystem) {
      row.email = typeof value === "string" ? value || null : null;
      continue;
    }
    if (field.key === "message" && field.isSystem) {
      row.message = typeof value === "string" ? value : "";
      continue;
    }

    if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) continue;
    answers.push({ key: field.key, label: field.label, value });
  }

  row.answers = answers.length ? JSON.stringify(answers) : null;
  return row;
}

function normaliseValue(raw, field) {
  if (raw === undefined || raw === null) return typeIsMulti(field.type) ? [] : null;
  if (typeIsMulti(field.type)) return Array.isArray(raw) ? raw.filter((v) => String(v).trim()) : [];
  if (field.type === "number" || field.type === "rating") {
    if (raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  return String(raw).trim();
}

module.exports = {
  SYSTEM_FIELDS,
  SYSTEM_KEYS,
  FIELD_TYPES,
  FIELD_TYPE_KEYS,
  DEFAULT_FEEDBACK_CONFIG,
  DEFAULT_FEEDBACK_FIELDS,
  TEXT_MAX,
  TEXTAREA_MAX,
  RATING_MIN,
  RATING_MAX,
  typeInfo,
  typeHasOptions,
  typeIsMulti,
  buildFieldKey,
  parseFieldOptions,
  enabledFields,
  feedbackConfigSchema,
  feedbackFieldSchema,
  systemFieldUpdateSchema,
  reorderSchema,
  buildFeedbackSubmissionSchema,
  toFeedbackRow,
};
