const { z } = require("zod");

const bannerSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  subtitle: z.string().trim().optional().nullable(),
  image: z.string().trim().min(1, "Image is required"),
  ctaText: z.string().trim().optional().nullable(),
  ctaLink: z.string().trim().optional().nullable(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

module.exports = { bannerSchema };
