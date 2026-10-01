const { z } = require("zod");

const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().optional(),
  sku: z.string().trim().optional().nullable(),
  // The subcategory the product is filed under (see lib/categoryTree.js).
  categoryId: z.string().trim().min(1, "Choose a subcategory"),
  shortDescription: z.string().trim().optional().nullable(),
  composition: z.string().trim().optional().nullable(),
  uses: z.string().trim().optional().nullable(),
  dosage: z.string().trim().optional().nullable(),
  applications: z.string().trim().optional().nullable(),
  specifications: z.record(z.string(), z.any()).optional().nullable(),
  images: z.array(z.string()).optional().nullable(),
  packSize: z.string().trim().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// Product.specifications/images are stored as JSON-encoded strings in
// SQLite; the API/admin UI always works with the parsed array/object.
function toDbData(input) {
  const data = { ...input };
  // SKU is unique, and the admin form sends "" when it is left blank. Stored
  // as "", a second product without a SKU would collide with the first; as
  // null, any number of products can have none.
  if (Object.prototype.hasOwnProperty.call(data, "sku") && !data.sku) {
    data.sku = null;
  }
  if (Object.prototype.hasOwnProperty.call(data, "specifications")) {
    data.specifications = data.specifications ? JSON.stringify(data.specifications) : null;
  }
  if (Object.prototype.hasOwnProperty.call(data, "images")) {
    data.images = data.images ? JSON.stringify(data.images) : null;
  }
  return data;
}

// A readable message for a unique-constraint failure on save (Prisma P2002),
// or null for any other error. SKU and slug (derived from the name) are the
// product's unique fields.
function uniqueConflictMessage(err) {
  if (err?.code !== "P2002") return null;
  const target = JSON.stringify(err.meta ?? "");
  if (/sku/i.test(target)) return "Another product already uses this SKU. Enter a different SKU or leave it blank.";
  if (/slug/i.test(target)) return "Another product already has this name. Give this product a different name.";
  return "Another product already uses one of these details (SKU or name).";
}

module.exports = { productSchema, toDbData, uniqueConflictMessage };
