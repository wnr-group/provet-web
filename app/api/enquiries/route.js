const { z } = require("zod");
const prisma = require("../../../lib/prisma");

const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("A valid email is required"),
  phone: z.string().trim().optional().nullable(),
  subject: z.string().trim().min(1, "Subject is required"),
  message: z.string().trim().min(1, "Message is required"),
  productId: z.string().trim().optional().nullable(),
});

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { name, email, phone, subject, message, productId } = parsed.data;

  if (productId) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return Response.json({ error: "productId does not reference an existing product" }, { status: 400 });
    }
  }

  const enquiry = await prisma.enquiry.create({
    data: {
      name,
      email,
      phone: phone || null,
      subject,
      message,
      productId: productId || null,
      status: "new",
    },
  });

  // NOTE: no SMTP configured yet. In production, wire up a real
  // transactional email here (e.g. via nodemailer/Resend). For now we just
  // log a clear notification so enquiries are visible during local dev.
  console.log(
    [
      "",
      "==================== [EMAIL NOTIFICATION] ====================",
      `New enquiry from ${name} <${email}>`,
      `Subject : ${subject}`,
      `Phone   : ${phone || "-"}`,
      `Product : ${productId || "-"}`,
      `Message : ${message}`,
      `Received: ${enquiry.createdAt.toISOString()}`,
      "================================================================",
      "",
    ].join("\n")
  );

  return Response.json({ id: enquiry.id, createdAt: enquiry.createdAt }, { status: 201 });
}
