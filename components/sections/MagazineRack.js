import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, BookOpen } from "lucide-react";
import { Enter, EnterGroup, EnterItem } from "@/components/sections/entrances";

// Magazine issues presented as printed magazines rather than image cards:
// the latest issue featured large, the rest standing on a rack.
//
// The cover images Provet has are landscape crops of each cover's top half
// (masthead, issue month, lead photo). Squeezed into a portrait card they
// lose the masthead, so each cover is composed instead: that crop at its own
// shape across the top, then a printed cover band beneath it - the issue
// month, cover lines and a barcode strip - in the magazine's purple and
// green. Spine fold, page edges, gloss and a floor shadow make it an object.
// On hover a cover lifts and swings open on its spine (motion-safe only).

const MONTH = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i;

// The issue name out of an item title ("Propulse August 2025" -> "August 2025").
function issueOf(title) {
  return String(title || "").match(MONTH)?.[0] || title || "";
}
// The masthead name: whatever precedes the month ("Propulse").
function mastheadOf(title) {
  const t = String(title || "");
  const m = t.match(MONTH);
  return (m ? t.slice(0, m.index) : "").trim();
}

// Cover band tints, cycling through the issues - Propulse's purple and green
// with Provet's pink.
const BANDS = [
  "from-brand-700 to-brand-900",
  "from-[#1d7a4f] to-[#0f4a31]",
  "from-accent-600 to-brand-800",
  "from-brand-600 to-[#2a1f5c]",
];

function MagazineCover({ item, index, size = "rack" }) {
  const issue = issueOf(item.title);
  const masthead = mastheadOf(item.title) || "Provet";
  const large = size === "feature";

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
        {/* The cover */}
        <div className="relative flex aspect-[3/4] flex-col overflow-hidden rounded-[3px_10px_10px_3px] bg-white shadow-[0_22px_40px_-20px_rgba(21,18,48,0.55)] ring-1 ring-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded cover */}
          <img src={item.image} alt={item.title || ""} loading="lazy" className="aspect-[4/3] w-full object-cover object-top" />
          <div className={clsx("relative flex flex-1 flex-col justify-between bg-gradient-to-br text-white", BANDS[index % BANDS.length], large ? "p-5" : "p-3")}>
            <div>
              <p className={clsx("font-semibold uppercase tracking-[0.2em] text-white/70", large ? "text-[10px]" : "text-[8px]")}>
                {masthead} · Monthly
              </p>
              <p className={clsx("mt-1 font-display font-extrabold uppercase leading-none tracking-tight", large ? "text-3xl" : "text-base sm:text-lg")}>
                {issue}
              </p>
            </div>
            <div className="flex items-end justify-between gap-2">
              <p className={clsx("leading-snug text-white/80", large ? "text-xs" : "hidden text-[9px] sm:block")}>
                Animal health · Innovation · Company news
              </p>
              {/* Barcode strip */}
              <span
                aria-hidden="true"
                className={clsx(
                  "shrink-0 rounded-sm bg-white p-0.5",
                  large ? "h-8 w-12" : "h-5 w-8"
                )}
              >
                <span className="block h-full w-full bg-[repeating-linear-gradient(to_right,#151230_0px,#151230_1px,transparent_1px,transparent_2px,#151230_2px,#151230_4px,transparent_4px,transparent_5px)]" />
              </span>
            </div>
          </div>
          {/* Spine fold */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/25 via-white/25 to-transparent"
          />
          {/* Gloss, sweeping across on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>
      </div>
    </div>
  );
}

// A link when the issue has one (a PDF, an article), otherwise just the cover.
function MaybeLink({ href, className, children }) {
  if (!href) return <div className={className}>{children}</div>;
  const external = /^https?:\/\//.test(href);
  return (
    <Link href={href} className={className} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {children}
    </Link>
  );
}

// Back issues per row on wide screens - the admin's "Columns" setting.
const RACK_COLUMNS = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

export default function MagazineRack({ section, items, columns = 4 }) {
  const [latest, ...back] = items;

  return (
    <div>
      {/* Latest issue */}
      <div className="grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
        <Enter preset="zoom" className="flex justify-center">
          <MaybeLink href={latest.href} className="group block w-full max-w-[20rem]">
            <MagazineCover item={latest} index={0} size="feature" />
          </MaybeLink>
        </Enter>
        <Enter preset="drop">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
            <BookOpen size={14} /> Latest issue
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {issueOf(latest.title)}
          </h2>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">
            {mastheadOf(latest.title) || section.title}
          </p>
          <span aria-hidden="true" className="mt-5 block h-1 w-14 rounded-full bg-accent-400" />
          <p className="mt-5 max-w-lg leading-relaxed text-ink-soft">
            {latest.text || section.body || "The latest edition of Provet's monthly in-house magazine."}
          </p>
          {latest.href && (
            <MaybeLink href={latest.href} className="btn-primary mt-7">
              Read this issue <ArrowRight size={16} />
            </MaybeLink>
          )}
        </Enter>
      </div>

      {/* Back issues on the rack */}
      {back.length > 0 && (
        <div className="mt-20">
          <Enter preset="drop">
            <div className="flex items-end justify-between gap-4 border-b border-brand-900/10 pb-3">
              <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink">{section.title || "Back issues"}</h3>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                {back.length} {back.length === 1 ? "issue" : "issues"}
              </span>
            </div>
          </Enter>
          {/* No column gap: each cell's ledge meets its neighbour's, so every
              row stands on one continuous shelf. */}
          <EnterGroup className={clsx("mt-10 grid grid-cols-2 gap-y-12 sm:grid-cols-3", RACK_COLUMNS[columns] || RACK_COLUMNS[4])} stagger={0.08}>
            {back.map((item, i) => (
              <EnterItem key={`${item.title}-${i}`} preset="flip">
                <MaybeLink href={item.href} className="group block">
                  <div className="px-4 sm:px-6">
                    <MagazineCover item={item} index={i + 1} />
                  </div>
                  {/* Shelf ledge */}
                  <div
                    aria-hidden="true"
                    className="relative mt-4 h-3 bg-gradient-to-b from-mist-100 to-mist-200 shadow-[0_10px_16px_-10px_rgba(21,18,48,0.45)]"
                  />
                  <div className="mt-4 px-4 text-center sm:px-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-600">{issueOf(item.title)}</p>
                    <p className="mt-0.5 text-sm font-semibold text-ink transition-colors group-hover:text-brand-700">{item.title}</p>
                  </div>
                </MaybeLink>
              </EnterItem>
            ))}
          </EnterGroup>
        </div>
      )}
    </div>
  );
}
