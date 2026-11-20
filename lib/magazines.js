const { z } = require("zod");
const { DEFAULT_MAGAZINE_SETTINGS, resolveMagazineSettings } = require("./magazineLibrary");

// The Propulse magazine as the admin manages it (Admin > Magazine): the years,
// the issues inside them, and the page's wording - their validation and the
// shapes sent to the browser.
//
// The admin adds a year, then adds magazines to it. Each year is either shown
// under Recent Editions or is an Archive year; nothing is filed by date and
// nothing has to be moved by hand (lib/magazineLibrary.js does the splitting).

const MIN_YEAR = 1990;
const MAX_YEAR = 2100;

// A file the site holds or an https link - the rule the other admin forms use,
// since these land in <img src> and <a href>.
const fileUrl = (what) =>
  z
    .string()
    .trim()
    .refine(
      (v) => v === "" || (/^\/(uploads|content|magazines)\/[\w./%-]+$/.test(v) && !v.includes("..")) || /^https:\/\//i.test(v),
      `The ${what} must be an uploaded file or an https link`
    )
    .transform((v) => v || null)
    .nullable()
    .optional();

const optionalText = (max) =>
  z.string().trim().max(max).transform((v) => v || null).nullable().optional();

const yearNumber = z
  .number({ error: "Choose the year" })
  .int("Choose the year")
  .min(MIN_YEAR, `The year must be ${MIN_YEAR} or later`)
  .max(MAX_YEAR, `The year must be ${MAX_YEAR} or earlier`);
const monthNumber = z.number({ error: "Choose the month" }).int("Choose the month").min(1, "Choose the month").max(12, "Choose the month");

// An issue is stored with its publication date set to the 1st of its month, at
// midnight UTC, so the year and month can never slip into a neighbour in
// another time zone.
const issueFields = {
  title: z.string().trim().min(1, "Magazine name is required").max(120),
  issueNumber: optionalText(40),
  year: yearNumber,
  month: monthNumber,
  coverImage: fileUrl("cover image"),
  // "portrait": the image is a whole cover. "crop": a landscape crop of a
  // cover's top half, shown above a printed cover band.
  coverLayout: z.enum(["portrait", "crop"]).optional(),
  pdfUrl: fileUrl("PDF"),
  pdfFileName: optionalText(200),
  summary: optionalText(600),
  isPublished: z.boolean().optional(),
};

const toColumns = ({ year, month, ...rest }) => ({ ...rest, publishedAt: new Date(Date.UTC(year, month - 1, 1)) });

const magazineSchema = z.object(issueFields).transform(toColumns);

// A partial update: the publish switch sends only isPublished; moving or
// re-dating an issue sends the year and the month together.
const magazinePatchSchema = z
  .object(issueFields)
  .partial()
  .refine((v) => (v.year === undefined) === (v.month === undefined), "Send the year and the month together")
  .transform(({ year, month, ...rest }) => (year === undefined ? rest : toColumns({ year, month, ...rest })));

const magazineYearSchema = z.object({ year: yearNumber, isRecent: z.boolean().optional() });
const magazineYearPatchSchema = z.object({ isRecent: z.boolean({ error: "Choose whether the year is recent" }) });

// The page's wording. A label left blank returns to its default text.
const label = (max) => z.string().trim().max(max, `Keep this under ${max} characters`).optional().nullable();
const magazineSettingsSchema = z.object({
  recentTabLabel: label(30),
  archivesTabLabel: label(30),
  latestLabel: label(40),
  readLabel: label(30),
  downloadLabel: label(30),
  otherMagazinesLabel: label(40),
  archivesHeading: label(80),
  archivesIntro: label(300),
});
const SETTING_KEYS = Object.keys(DEFAULT_MAGAZINE_SETTINGS);

const yearOf = (d) => new Date(d).getUTCFullYear();
const monthOf = (d) => new Date(d).getUTCMonth() + 1;

// What the page may know about an issue, in the shape the library component
// reads (it was written for the page's old card list: title, image, href, text).
// Only published issues ever reach here.
function serializePublicMagazine(row) {
  return {
    id: row.id,
    title: row.title,
    issueNumber: row.issueNumber || null,
    publishedAt: new Date(row.publishedAt).toISOString(),
    image: row.coverImage || null,
    coverLayout: row.coverLayout === "crop" ? "crop" : "portrait",
    href: row.pdfUrl || null,
    text: row.summary || null,
  };
}

function serializeAdminMagazine(row) {
  return {
    id: row.id,
    title: row.title,
    issueNumber: row.issueNumber || null,
    year: yearOf(row.publishedAt),
    month: monthOf(row.publishedAt),
    publishedAt: new Date(row.publishedAt).toISOString(),
    coverImage: row.coverImage || null,
    coverLayout: row.coverLayout === "crop" ? "crop" : "portrait",
    pdfUrl: row.pdfUrl || null,
    pdfFileName: row.pdfFileName || null,
    summary: row.summary || null,
    isPublished: row.isPublished,
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

function serializeAdminYear(row, count = 0) {
  return { id: row.id, year: row.year, isRecent: row.isRecent, count };
}

// The wording as the admin form edits it: the saved text, with the standard
// wording wherever nothing has been saved.
function serializeAdminSettings(row) {
  return resolveMagazineSettings(row);
}

// The columns to write: blanks as null.
function settingsToRow(parsed) {
  const data = {};
  for (const key of SETTING_KEYS) data[key] = parsed[key] ? parsed[key] : null;
  return data;
}

module.exports = {
  MIN_YEAR,
  MAX_YEAR,
  magazineSchema,
  magazinePatchSchema,
  magazineYearSchema,
  magazineYearPatchSchema,
  magazineSettingsSchema,
  serializePublicMagazine,
  serializeAdminMagazine,
  serializeAdminYear,
  serializeAdminSettings,
  settingsToRow,
  SINGLETON_KEY: "default",
};
