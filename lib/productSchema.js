const { z } = require("zod");

const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().optional(),
  sku: z.string().trim().optional().nullable(),
  categoryId: z.string().trim().min(1, "categoryId is required"),
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
  if (Object.prototype.hasOwnProperty.call(data, "specifications")) {
    data.specifications = data.specifications ? JSON.stringify(data.specifications) : null;
  }
  if (Object.prototype.hasOwnProperty.call(data, "images")) {
    data.images = data.images ? JSON.stringify(data.images) : null;
  }
  return data;
}

module.exports = { productSchema, toDbData };
