// The magazine library's rules, with no React and no database in them: how the
// issues are split into Recent Editions and the year-by-year Archives, which
// year opens first, and the wording of the page. An issue belongs to a year the
// admin has added (Admin > Magazine); each year is either shown under Recent
// Editions or is an Archive year. components/sections/
// MagazineRack.js renders what this works out; lib/magazines.js is where the
// admin's settings are validated and saved.

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DATE_IN_TITLE = new RegExp(`\\b(${MONTH_NAMES.join("|")})\\s+(\\d{4})\\b`, "i");

// What the page says until the admin changes it (Admin > Magazine > Wording).
// Every label has a default, so a blank field in the admin simply puts the
// default back.
const DEFAULT_MAGAZINE_SETTINGS = {
  recentTabLabel: "Recent Editions",
  archivesTabLabel: "Archives",
  latestLabel: "Latest edition",
  readLabel: "Read now",
  downloadLabel: "Download PDF",
  otherMagazinesLabel: "View other magazines",
  archivesHeading: "Magazine Archives",
  archivesIntro: "Pick a year to see its editions, newest first. The latest editions are under Recent Editions.",
};

// Saved settings over the defaults; anything blank or missing keeps its default.
function resolveMagazineSettings(saved) {
  const out = { ...DEFAULT_MAGAZINE_SETTINGS };
  for (const key of Object.keys(DEFAULT_MAGAZINE_SETTINGS)) {
    const v = saved?.[key];
    if (typeof v === "string" && v.trim()) out[key] = v.trim();
  }
  return out;
}

// One issue as the page needs it. An issue saved in the admin carries its own
// publication date; an older one (a card in the page's section) has only a
// title like "Propulse August 2025", which is read for its month and year.
function describe(item) {
  const title = String(item.title || "");
  if (item.publishedAt) {
    const d = new Date(item.publishedAt);
    if (!Number.isNaN(d.getTime())) {
      return {
        ...item,
        masthead: title.trim(),
        month: MONTH_NAMES[d.getUTCMonth()],
        year: d.getUTCFullYear(),
        time: Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
      };
    }
  }
  const m = title.match(DATE_IN_TITLE);
  if (!m) return { ...item, masthead: title.trim(), month: "", year: null, time: null };
  const monthIndex = MONTH_NAMES.findIndex((n) => n.toLowerCase() === m[1].toLowerCase());
  return {
    ...item,
    masthead: title.slice(0, m.index).trim(),
    month: MONTH_NAMES[monthIndex],
    year: Number(m[2]),
    time: Date.UTC(Number(m[2]), monthIndex, 1),
  };
}

// Newest first (by year, then month); the admin's order breaks ties. `recentYears`
// are the years the admin has marked to show under Recent Editions; if none of
// them has an issue, the newest year does, so Recent Editions is never empty
// while there is anything to show. Returns the Recent Editions, the older issues
// and the archive's years (newest first).
function organise(rawItems, { recentYears = [] } = {}) {
  const seen = new Set();
  const issues = [];
  rawItems.forEach((item, order) => {
    const key = item.id || `${item.title}|${item.image}|${item.href}`;
    if (seen.has(key)) return; // never the same issue twice
    seen.add(key);
    issues.push({ ...describe(item), order });
  });
  issues.sort((a, b) => (b.time ?? -Infinity) - (a.time ?? -Infinity) || a.order - b.order);

  const wanted = new Set(recentYears.map(Number));
  const datedYears = issues.filter((i) => i.year !== null).map((i) => i.year);
  const newestYear = datedYears.length ? Math.max(...datedYears) : null;
  const recentSet = datedYears.some((y) => wanted.has(y)) ? wanted : new Set(newestYear === null ? [] : [newestYear]);

  const recent = issues.filter((i) => i.year !== null && recentSet.has(i.year));
  const archived = issues.filter((i) => i.year === null || !recentSet.has(i.year));
  const years = [];
  for (const i of archived) {
    if (i.year === null) continue;
    const entry = years.find((y) => y.year === i.year);
    if (entry) entry.count += 1;
    else years.push({ year: i.year, count: 1 });
  }
  years.sort((a, b) => b.year - a.year);
  return { recent, archived, years };
}

// The year the Archives show: the visitor's choice ("2024", "earlier"), else the
// newest year that has archived issues.
function pickYear(requested, { years, archived }) {
  if (requested === "earlier") return "earlier";
  if (/^\d{4}$/.test(String(requested || ""))) return Number(requested);
  return years[0]?.year ?? (archived.length ? "earlier" : null);
}

module.exports = { MONTH_NAMES, DEFAULT_MAGAZINE_SETTINGS, resolveMagazineSettings, describe, organise, pickYear };
