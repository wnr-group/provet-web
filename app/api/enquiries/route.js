const { z } = require("zod");
const { after } = require("next/server");
const prisma = require("../../../lib/prisma");
const {
  sendCustomerEnquiryConfirmation,
  sendVendorEnquiryNotification,
} = require("../../../lib/email");

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

  let productName = null;
  if (productId) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return Response.json({ error: "productId does not reference an existing product" }, { status: 400 });
    }
    productName = product.name;
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

  // Notifications are best-effort and must not sit between the customer and
  // their confirmation: SMTP round trips are slow (seconds against a real
  // provider), and the enquiry is already safely committed by this point.
  // after() runs the sends once the response has been flushed - unlike a
  // bare floating promise, the platform keeps the invocation alive for it.
  // Both senders resolve rather than throw (see lib/email.js), and
  // allSettled means one failing address can't stop the other.
  after(async () => {
    const [customerResult, vendorResult] = await Promise.allSettled([
      sendCustomerEnquiryConfirmation(enquiry, productName),
      sendVendorEnquiryNotification(enquiry, productName),
    ]);

    for (const [label, result] of [
      ["customer confirmation", customerResult],
      ["vendor notification", vendorResult],
    ]) {
      if (result.status === "rejected") {
        console.error(`[enquiries] Unexpected error sending ${label} for ${enquiry.id}:`, result.reason);
      }
    }
  });

  // Response shape unchanged - no email status, no SMTP detail.
  return Response.json({ id: enquiry.id, createdAt: enquiry.createdAt }, { status: 201 });
}
