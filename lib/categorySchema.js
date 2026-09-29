const { z } = require("zod");

// `parentId` null or "" makes a top-level category; an id makes a subcategory
// of that category. Where a category may sit is checked against the database
// by parentChangeError in lib/categoryTree.js.
//
// No transform here on purpose: the edit route uses `.partial()`, and a
// missing parentId must stay missing (leave the parent alone) rather than
// turn into null (promote to the top level). normalizeParentId does the ""
// -> null step only when the key was actually sent.
const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional().nullable(),
  image: z.string().trim().optional().nullable(),
  parentId: z.string().trim().optional().nullable(),
});

function normalizeParentId(data) {
  if (!Object.prototype.hasOwnProperty.call(data, "parentId")) return data;
  return { ...data, parentId: data.parentId || null };
}

// One level of siblings at a time: the top-level categories (parentId null)
// or one category's subcategories, in their new order.
const categoryReorderSchema = z.object({
  parentId: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((v) => v || null),
  order: z.array(z.string().trim().min(1)).min(1, "Nothing to reorder"),
});

module.exports = { categorySchema, categoryReorderSchema, normalizeParentId };
