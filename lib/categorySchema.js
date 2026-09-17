const { z } = require("zod");

const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional().nullable(),
  image: z.string().trim().optional().nullable(),
});

module.exports = { categorySchema };
