"use client";

import { useMemo, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { Archive, ArrowRight, BookOpen, CalendarDays, CalendarX, Download } from "lucide-react";

// The Propulse magazine library: Recent Editions and a year-by-year Archives,
// both worked out from the issues the admin lists in this section (cover,
// title, optional link to the PDF). Nothing about years or issues is written
// here.
//
// An issue's publication month and year are read from its title ("Propulse
// August 2025") - the only date the issue records carry. Issues are then
// sorted newest first and split by date:
//   Recent Editions  every issue within a year of the newest one
//   Archives         everything older, grouped by year
// so as new issues are added, the oldest recent ones move to the archive on
// their own and nothing is ever hidden. Issues whose title has no date are
// kept (under an "Earlier" year button) rather than dropped.
//
// The tab, year and what is open live in the address (?view=archives&year=
// 2024), so a selection survives reload and is where Back returns to.
//
// The cover image of an early issue is a landscape crop of the cover's top
// half (masthead, issue month, lead photo). Squeezed into a portrait card it
// loses the masthead, so each cover is composed: that crop across the top and
// a printed cover band beneath it in the magazine's purple and green.

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DATE_IN_TITLE = new RegExp(`\\b(${MONTH_NAMES.join("|")})\\s+(\\d{4})\\b`, "i");

// "Propulse August 2025" -> { month: "August", year: 2025, time, masthead }
function describe(item) {
  const title = String(item.title || "");
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

// Newest first; dated before undated; the admin's order breaks ties.
function organise(rawItems) {
  const seen = new Set();
  const issues = [];
  rawItems.forEach((item, order) => {
    const key = `${item.title}|${item.image}|${item.href}`;
    if (seen.has(key)) return; // never the same issue twice
    seen.add(key);
    issues.push({ ...describe(item), order });
  });
  issues.sort((a, b) => (b.time ?? -Infinity) - (a.time ?? -Infinity) || a.order - b.order);

  const newest = issues.find((i) => i.time !== null);
  let recent = issues;
  let archived = [];
  if (newest) {
    const d = new Date(newest.time);
    // The newest issue's month and the eleven before it.
    const cutoff = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 11, 1);
    recent = issues.filter((i) => i.time !== null && i.time >= cutoff);
    archived = issues.filter((i) => i.time === null || i.time < cutoff);
  }
  const years = [];
  for (const i of archived) {
    if (i.year === null) continue;
    const entry = years.find((y) => y.year === i.year);
    if (entry) entry.count += 1;
    else years.push({ year: i.year, count: 1 });
  }
  return { recent, archived, years };
}

const issueName = (i) => (i.month ? `${i.month} ${i.year}` : i.title || "");
const isPdf = (href) => /\.pdf(?:$|[?#])/i.test(href || "");

// Cover band tints, cycling through the issues - Propulse's purple and green
// with Provet's pink.
const BANDS = ["bg-brand-700", "bg-brand-800", "bg-accent-600", "bg-brand-600"];

function MagazineCover({ item, index, size = "rack" }) {
  const large = size === "feature";
  const name = issueName(item);

  return (
    <div className={clsx("relative [perspective:1400px]", large ? "w-full max-w-[20rem]" : "w-full")}>
      {/* Floor shadow, widening as the cover lifts. */}
      <span
        aria-hidden="true"
        className="absolute -bottom-3 left-[8%] h-5 w-[84%] rounded-[50%] bg-brand-900/25 blur-md transition-all duration-500 motion-safe:group-hover:w-[90%] motion-safe:group-hover:opacity-70"
      />
      <div
        className={clsx(
          "relative origin-left transition-transform duration-700 ease-out [transform-style:preserve-3d]",
          large
            ? "[transform:rotateY(-10deg)] motion-safe:group-hover:[transform:rotateY(-18deg)_translateY(-6px)]"
            : "motion-safe:group-hover:[transform:rotateY(-20deg)_translateY(-8px)]"
        )}
      >
        {/* Page edges, peeking out on the open side. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-[1.5%] -right-1.5 w-full rounded-r-md bg-[repeating-linear-gradient(to_right,#ffffff_0px,#ffffff_2px,#e8e5f2_2px,#e8e5f2_3px)] shadow-[4px_6px_14px_-6px_rgba(21,18,48,0.35)] [transform:translateZ(-2px)]"
        />
        <div className="relative flex aspect-[3/4] flex-col overflow-hidden rounded-[3px_10px_10px_3px] bg-white shadow-[0_22px_40px_-20px_rgba(21,18,48,0.55)] ring-1 ring-black/5">
          {item.image && (
            // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded cover
            <img
              src={item.image}
              alt={`${item.title || "Magazine"} cover`}
              loading={large ? "eager" : "lazy"}
              decoding="async"
              className="aspect-[4/3] w-full object-cover object-top"
            />
          )}
          {/* The printed cover band; with no cover image it is the whole cover. */}
          <div className={clsx("relative flex flex-1 flex-col justify-between text-white", BANDS[index % BANDS.length], large ? "p-5" : "p-3")}>
            {!item.image && <BookOpen aria-hidden="true" size={large ? 44 : 26} className="absolute right-3 top-3 opacity-25" />}
            <div>
              <p className={clsx("font-semibold uppercase tracking-[0.2em] text-white/70", large ? "text-[10px]" : "text-[8px]")}>
                {item.masthead || "Provet"} · Monthly
              </p>
              <p className={clsx("mt-1 font-display font-extrabold uppercase leading-none tracking-tight", large ? "text-3xl" : "text-base sm:text-lg")}>
                {name}
              </p>
            </div>
            <div className="flex items-end justify-between gap-2">
              <p className={clsx("leading-snug text-white/80", large ? "text-xs" : "hidden text-[9px] sm:block")}>
                Animal health · Innovation · Company news
              </p>
              {/* Barcode strip */}
              <span aria-hidden="true" className={clsx("shrink-0 rounded-sm bg-white p-0.5", large ? "h-8 w-12" : "h-5 w-8")}>
                <span className="block h-full w-full bg-[repeating-linear-gradient(to_right,#151230_0px,#151230_1px,transparent_1px,transparent_2px,#151230_2px,#151230_4px,transparent_4px,transparent_5px)]" />
              </span>
            </div>
          </div>
          {/* Spine fold */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/25 via-white/25 to-transparent" />
          {/* Gloss, sweeping across on hover */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      </div>
    </div>
  );
}

// A link when the issue has one (a PDF, an article), otherwise just the cover.
function MaybeLink({ href, className, children, ...rest }) {
  if (!href) return <div className={className}>{children}</div>;
  const external = /^https?:\/\//.test(href);
  return (
    <Link href={href} className={className} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...rest}>
      {children}
    </Link>
  );
}

// Back issues per row on wide screens - the admin's "Columns" setting.
const RACK_COLUMNS = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

function IssueShelf({ issues, columns, startIndex = 0 }) {
  return (
    /* No column gap: each cell's ledge meets its neighbour's, so every row
       stands on one continuous shelf. */
    <ul className={clsx("grid grid-cols-2 gap-y-12 sm:grid-cols-3", RACK_COLUMNS[columns] || RACK_COLUMNS[4])}>
      {issues.map((item, i) => (
        <li key={`${item.title}-${item.order}`}>
          <MaybeLink href={item.href} className="group block" aria-label={item.href ? `Read ${item.title}` : undefined}>
            <div className="px-4 sm:px-6">
              <MagazineCover item={item} index={startIndex + i} />
            </div>
            {/* Shelf ledge */}
            <div aria-hidden="true" className="relative mt-4 h-3 bg-gradient-to-b from-mist-100 to-mist-200 shadow-[0_10px_16px_-10px_rgba(21,18,48,0.45)]" />
          </MaybeLink>
          <div className="mt-4 px-4 text-center sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-600">{issueName(item)}</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">{item.title}</p>
            {item.href && (
              <div className="mt-2.5 flex items-center justify-center gap-3 text-xs font-semibold">
                <MaybeLink href={item.href} className="inline-flex items-center gap-1 text-brand-700 hover:text-accent-600">
                  Read <ArrowRight size={12} aria-hidden="true" />
                </MaybeLink>
                {isPdf(item.href) && (
                  <a href={item.href} download className="inline-flex items-center gap-1 text-ink-soft hover:text-accent-600">
                    <Download size={12} aria-hidden="true" /> PDF
                  </a>
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function MagazineRack({ section, items, columns = 4 }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const { recent, archived, years } = useMemo(() => organise(items), [items]);
  const view = params.get("view") === "archives" ? "archives" : "recent";
  const yearParam = params.get("year");
  // One year is shown at a time: the chosen one - a year, or "earlier" for
  // issues whose title has no date - and, until one is chosen, the newest
  // year in the archive.
  const chosen = yearParam === "earlier" ? "earlier" : /^\d{4}$/.test(yearParam || "") ? Number(yearParam) : null;
  const year = chosen ?? years[0]?.year ?? (archived.length ? "earlier" : null);

  const go = (nextView, nextYear = null) => {
    const q = new URLSearchParams();
    if (nextView === "archives") {
      q.set("view", "archives");
      if (nextYear) q.set("year", String(nextYear));
    }
    startTransition(() => router.replace(q.size ? `${pathname}?${q}` : pathname, { scroll: false }));
  };

  if (!recent.length && !archived.length) return null;
  const hasArchive = archived.length > 0;
  const undatedCount = archived.filter((i) => i.year === null).length;
  // Only the chosen year's issues, newest first.
  const shown =
    year === null ? [] : year === "earlier" ? archived.filter((i) => i.year === null) : archived.filter((i) => i.year === year);

  return (
    <div>
      <nav aria-label="Magazine sections" className="flex justify-center">
        <div role="tablist" className="inline-flex rounded-full bg-mist-100 p-1 ring-1 ring-brand-100">
          <TabButton active={view === "recent"} onClick={() => go("recent")} icon={BookOpen} label="Recent Editions" />
          <TabButton active={view === "archives"} onClick={() => go("archives")} icon={Archive} label="Archives" />
        </div>
      </nav>

      <div className={clsx("mt-12 transition-opacity duration-200 sm:mt-14", pending && "opacity-60")} aria-busy={pending}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${view}-${year}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {view === "recent" ? (
              <Recent section={section} issues={recent} columns={columns} archiveCount={archived.length} onArchives={() => go("archives")} />
            ) : (
              <div>
                <div className="text-center">
                  <h3 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Magazine Archives</h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft">
                    Pick a year to see its editions, newest first. The latest editions are under Recent Editions.
                  </p>
                </div>

                {hasArchive && (
                  <div role="group" aria-label="Filter archives by year" className="mt-8 flex flex-wrap justify-center gap-2">
                    {years.map((y) => (
                      <YearChip key={y.year} active={year === y.year} onClick={() => go("archives", y.year)} label={String(y.year)} />
                    ))}
                    {undatedCount > 0 && (
                      <YearChip active={year === "earlier"} onClick={() => go("archives", "earlier")} label="Earlier" />
                    )}
                  </div>
                )}

                <div className="mt-12">
                  {!hasArchive ? (
                    <Empty
                      icon={Archive}
                      title="No older editions yet"
                      text="Every edition so far is under Recent Editions. As newer ones are published, earlier ones move here, grouped by year."
                      action={{ label: "Back to Recent Editions", onClick: () => go("recent") }}
                    />
                  ) : year === null ? (
                    <Empty icon={CalendarDays} title="Select a year" text="Pick a year above to see the magazines published in it." />
                  ) : shown.length === 0 ? (
                    <Empty
                      icon={CalendarX}
                      title={`No editions from ${year}`}
                      text="Nothing was published in that year. Please choose another year."
                    />
                  ) : (
                    <section aria-label={`Editions from ${year === "earlier" ? "earlier years" : year}`}>
                      <div className="mb-10 flex items-baseline gap-3 border-b border-brand-900/10 pb-3">
                        <h4 className="font-display text-3xl font-extrabold text-brand-700">{year === "earlier" ? "Earlier issues" : year}</h4>
                      </div>
                      <IssueShelf issues={shown} columns={columns} />
                    </section>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Recent({ section, issues, columns, archiveCount, onArchives }) {
  const [latest, ...rest] = issues;
  if (!latest) {
    return <Empty icon={BookOpen} title="No recent editions" text="Check back soon for the latest edition of Propulse." />;
  }
  return (
    <div>
      {/* Latest edition */}
      <div className="grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
        <div className="flex justify-center">
          <MaybeLink href={latest.href} className="group block w-full max-w-[20rem]" aria-label={latest.href ? `Read ${latest.title}` : undefined}>
            <MagazineCover item={latest} index={0} size="feature" />
          </MaybeLink>
        </div>
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
            <BookOpen size={14} aria-hidden="true" /> Latest edition
          </p>
          <h3 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">{issueName(latest)}</h3>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">{latest.masthead || section.title}</p>
          <span aria-hidden="true" className="mt-5 block h-1 w-14 rounded-full bg-accent-400" />
          <p className="mt-5 max-w-lg leading-relaxed text-ink-soft">
            {latest.text || section.body || "The latest edition of Provet's monthly in-house magazine."}
          </p>
          {latest.href ? (
            <div className="mt-7 flex flex-wrap gap-3">
              <MaybeLink href={latest.href} className="btn-primary">
                Read now <ArrowRight size={16} />
              </MaybeLink>
              {isPdf(latest.href) && (
                <a href={latest.href} download className="btn-outline">
                  <Download size={16} /> Download PDF
                </a>
              )}
            </div>
          ) : (
            <p className="mt-6 text-sm text-ink-soft">This edition isn&rsquo;t available to read online yet.</p>
          )}
          {/* The way to every other issue, kept in view beside the latest. */}
          <button
            type="button"
            onClick={onArchives}
            className="btn-accent mt-5 px-6 py-3 text-base ring-4 ring-accent-100 hover:ring-accent-200"
          >
            <Archive size={18} aria-hidden="true" /> View other magazines <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {rest.length > 0 && (
        <div className="mt-20">
          <div className="flex items-end justify-between gap-4 border-b border-brand-900/10 pb-3">
            <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink">{section.title || "Recent editions"}</h3>
          </div>
          <div className="mt-10">
            <IssueShelf issues={rest} columns={columns} startIndex={1} />
          </div>
        </div>
      )}

      <div className="mt-16 flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-br from-brand-50 to-mist-100 px-6 py-10 text-center ring-1 ring-brand-100">
        <Archive size={22} className="text-brand-600" aria-hidden="true" />
        <p className="font-display text-xl font-bold text-ink">Looking for an earlier issue?</p>
        <p className="max-w-md text-sm text-ink-soft">
          Earlier editions are kept in the archive, organised by year.
        </p>
        <button type="button" onClick={onArchives} className="btn-primary mt-1">
          View other magazines <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-6",
        active ? "bg-brand-700 text-white shadow-soft" : "text-ink-soft hover:text-brand-700"
      )}
    >
      <Icon size={15} aria-hidden="true" /> {label}
    </button>
  );
}

function YearChip({ active, onClick, label }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        active ? "border-brand-700 bg-brand-700 text-white shadow-soft" : "border-brand-200 bg-white text-brand-700 hover:border-brand-400 hover:bg-brand-50"
      )}
    >
      {label}
    </button>
  );
}

function Empty({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-brand-200 bg-mist-50/60 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-400 shadow-soft ring-1 ring-brand-100">
        <Icon size={26} aria-hidden="true" />
      </span>
      <h4 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h4>
      <p className="mt-1.5 max-w-sm text-sm text-ink-soft">{text}</p>
      {action && (
        <button type="button" onClick={action.onClick} className="btn-outline mt-5">
          {action.label}
        </button>
      )}
    </div>
  );
}
