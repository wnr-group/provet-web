const { z } = require("zod");

const bannerSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  subtitle: z.string().trim().optional().nullable(),
  image: z.string().trim().min(1, "Image is required"),
  // The slide's background video, or empty/null for a photo slide. An
  // uploaded file, one shipped with the site, or an http(s) link: it lands in
  // a <video src> on the homepage, so nothing else is accepted.
  video: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || (/^\/(uploads|content)\/[\w./-]+$/.test(v) && !v.includes("..")) || /^https?:\/\//i.test(v),
      "The video must be an uploaded file or an http(s) link"
    )
    .transform((v) => v || null)
    .optional()
    .nullable(),
  ctaText: z.string().trim().optional().nullable(),
  ctaLink: z.string().trim().optional().nullable(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

module.exports = { bannerSchema };
