const { z } = require("zod");
const { after } = require("next/server");
const prisma = require("../../../lib/prisma");
const { sendJobApplicationNotification, sendJobApplicantConfirmation } = require("../../../lib/email");
const { getApplicationRecipient } = require("../../../lib/applicationRecipient");

// Applications from the Careers page's "Apply now" form (components/sections/
// JobApplyButton). Each one is emailed to HR - the address the admin set on the
// Careers page (lib/applicationRecipient.js), else HR_EMAIL, else VENDOR_EMAIL -
// and also kept as an enquiry with the subject "Job application: <position>", so
// it shows up in Admin > Enquiries even if the mail fails.
//
// The form arrives as multipart so it can carry a resume. The resume is
// attached to HR's email and is not stored anywhere on the site: a CV is
// personal data, and the public storage bucket is not the place for it. The
// enquiry records only that one was attached and its file name.
const applicationSchema = z.object({
  job: z.string().trim().min(1, "The position is missing").max(160),
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("A valid email is required").max(160),
  phone: z.string().trim().min(6, "A phone number is required").max(30),
  location: z.string().trim().max(120).optional().nullable(),
  experience: z.string().trim().max(60).optional().nullable(),
  qualification: z.string().trim().max(160).optional().nullable(),
  message: z.string().trim().max(2000).optional().nullable(),
  // A honeypot: hidden from people, filled in by form-stuffing bots.
  website: z.string().optional().nullable(),
});

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

// The kinds of resume accepted, each with the bytes a genuine file starts with
// (so a renamed .exe is turned away, not just judged by its extension).
const RESUME_TYPES = {
  pdf: { mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  doc: { mime: "application/msword", magic: [0xd0, 0xcf, 0x11, 0xe0] }, // OLE2
  docx: {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    magic: [0x50, 0x4b, 0x03, 0x04], // zip
  },
};

// The resume from the form, as { filename, content, contentType } - or null
// for none, or a string for what is wrong with it.
async function readResume(file) {
  if (!file || typeof file === "string" || !file.size) return null;
  if (file.size > MAX_RESUME_BYTES) return "The resume is too large - please keep it under 5 MB.";
  const ext = String(file.name || "").split(".").pop().toLowerCase();
  const type = RESUME_TYPES[ext];
  if (!type) return "Please attach your resume as a PDF or Word document.";
  const content = Buffer.from(await file.arrayBuffer());
  if (!type.magic.every((byte, i) => content[i] === byte)) {
    return "That file does not look like a valid PDF or Word document.";
  }
  // The name goes into an email header: keep it to plain characters.
  const base = String(file.name).replace(/\.[^.]*$/, "").replace(/[^\w\- ]+/g, "").trim().slice(0, 60) || "resume";
  return { filename: `${base}.${ext}`, content, contentType: type.mime };
}

export async function POST(request) {
  const form = await request.formData().catch(() => null);
  if (!form) return Response.json({ error: "Invalid input" }, { status: 400 });

  const fields = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string"));
  // Required fields default to empty, so a missing one reads "Name is required".
  const parsed = applicationSchema.safeParse({ job: "", name: "", email: "", phone: "", ...fields });
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }
  const { website, ...application } = parsed.data;
  // A bot: pretend it worked, keep and send nothing.
  if (website) return Response.json({ ok: true }, { status: 201 });

  const resume = await readResume(form.get("resume"));
  if (typeof resume === "string") return Response.json({ error: resume }, { status: 400 });

  const enquiry = await prisma.enquiry.create({
    data: {
      name: application.name,
      email: application.email,
      phone: application.phone,
      subject: `Job application: ${application.job}`,
      message: [
        `Position: ${application.job}`,
        application.location && `Current location: ${application.location}`,
        application.experience && `Experience: ${application.experience}`,
        application.qualification && `Qualification: ${application.qualification}`,
        resume && `Resume: ${resume.filename} (attached to the email sent to HR)`,
        application.message && `\n${application.message}`,
      ]
        .filter(Boolean)
        .join("\n"),
      status: "new",
    },
  });

  // Best-effort and after the response, like /api/enquiries: the application is
  // already saved, and SMTP round trips are slow.
  after(async () => {
    const recipient = await getApplicationRecipient(prisma).catch(() => null);
    await Promise.allSettled([
      sendJobApplicationNotification(application, enquiry.createdAt, resume, recipient),
      sendJobApplicantConfirmation(application),
    ]);
  });

  return Response.json({ ok: true }, { status: 201 });
}
