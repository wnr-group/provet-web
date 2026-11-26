const { parseSectionConfig } = require("./sectionTypes");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The address job applications are emailed to, as the admin set it: the "Send
// applications to" box on the Careers page's job-posters section (Admin >
// Website Content > Careers). Read from the database on the server for every
// application - never taken from the form - so a visitor cannot redirect it.
// Null when none is set (or it is not a valid address), which lets the caller
// fall back to HR_EMAIL, then VENDOR_EMAIL.
async function getApplicationRecipient(prisma) {
  const blocks = await prisma.contentBlock.findMany({
    where: { page: "careers", type: "imageCards" },
    orderBy: { order: "asc" },
    select: { config: true },
  });
  for (const block of blocks) {
    const config = parseSectionConfig("imageCards", block.config);
    const email = typeof config.applyEmail === "string" ? config.applyEmail.trim() : "";
    if (config.imageStyle === "poster" && EMAIL_RE.test(email)) return email;
  }
  return null;
}

module.exports = { getApplicationRecipient };
