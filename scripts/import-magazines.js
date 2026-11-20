// Moves the Magazine page's card list (the "recent-issues" section of
// resources/magazine: a cover, a title like "Propulse August 2025" and an
// optional PDF link per card) into the Magazine table, so the issues can be
// managed in Admin > Magazine. The section itself is left as it is.
//
//   node scripts/import-magazines.js          show what would be created
//   node scripts/import-magazines.js --apply  create the missing issues
//
// Safe to run again: an issue already in the table (same name and month) is
// skipped. Each card's month and year come from its title; a card without one
// is reported and skipped rather than given an invented date. The old covers are
// landscape crops of each cover's top half, so they are saved with the "crop"
// cover shape; a card's link becomes the issue's PDF. Imported issues are
// published, as they were on the page.
require("dotenv").config();
const prisma = require("../lib/prisma");
const { MONTH_NAMES } = require("../lib/magazineLibrary");

const DATE_IN_TITLE = new RegExp(`\\b(${MONTH_NAMES.join("|")})\\s+(\\d{4})\\b`, "i");

async function main() {
  const apply = process.argv.includes("--apply");
  const block = await prisma.contentBlock.findUnique({
    where: { page_key: { page: "resources/magazine", key: "recent-issues" } },
  });
  let items = [];
  try {
    items = JSON.parse(block?.config || "{}").items || [];
  } catch {
    // an unreadable list has nothing to import
  }
  if (!items.length) {
    console.log("No issue list found on resources/magazine - nothing to import.");
    return;
  }

  const existing = await prisma.magazine.findMany({ select: { title: true, publishedAt: true } });
  let created = 0;
  let skipped = 0;
  for (const item of items) {
    const match = String(item.title || "").match(DATE_IN_TITLE);
    if (!match) {
      console.log(`skip    "${item.title}" (no month and year in the title)`);
      skipped += 1;
      continue;
    }
    const month = MONTH_NAMES.findIndex((m) => m.toLowerCase() === match[1].toLowerCase());
    const publishedAt = new Date(Date.UTC(Number(match[2]), month, 1));
    const title = item.title.slice(0, match.index).trim() || "Propulse";

    if (existing.some((e) => e.title === title && e.publishedAt.getTime() === publishedAt.getTime())) {
      console.log(`exists  ${title} ${MONTH_NAMES[month]} ${match[2]}`);
      continue;
    }
    console.log(`${apply ? "create " : "would create"} ${title} ${MONTH_NAMES[month]} ${match[2]}`);
    if (apply) {
      await prisma.magazine.create({
        data: {
          title,
          publishedAt,
          coverImage: item.image || null,
          coverLayout: "crop",
          pdfUrl: item.href || null,
          summary: item.text || null,
          isPublished: true,
        },
      });
      // The issue's year must be in the library's list of years.
      await prisma.magazineYear.upsert({ where: { year: Number(match[2]) }, create: { year: Number(match[2]) }, update: {} });
      existing.push({ title, publishedAt });
    }
    created += 1;
  }
  console.log(`${apply ? "Created" : "Would create"} ${created} issue(s); ${skipped} skipped.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
