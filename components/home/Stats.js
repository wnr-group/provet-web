import {
  CalendarClock,
  Users,
  Tractor,
  Sprout,
  Globe2,
  BadgeCheck,
} from "lucide-react";
import Counter from "@/components/motion/Counter";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { parseStatItems } from "@/lib/contentFormat";

// The "stats" Website Content block as a single ledger: a centred heading over
// one full-width run of equal figures, split by hairlines. Nothing here is
// hard-coded - the figures and captions are the block's rows (Admin > Website
// Content > Homepage > By the Numbers, defaults in lib/homeContent.js), and
// the icons follow each caption's wording.
//
// The admin can write either one item per line or a single line separated by
// " - " / " • " / " | " (see lib/contentFormat.js). An item with a leading
// number becomes a figure; a plain sentence in the same block still renders,
// as a note under the heading, instead of being silently dropped.

// A row the admin renames keeps a fitting icon; anything unrecognised gets
// the fallback.
const ICON_BY_KEYWORD = [
  [/year|exist|experience|since|founded/i, CalendarClock],
  [/employee|team|people|staff|professional|member/i, Users],
  [/farm|clinic|customer|client|farmer/i, Tractor],
  [/acre|hectare|land|area/i, Sprout],
  [/countr|nation|global|export|region/i, Globe2],
];

function StatIcon({ label, ...props }) {
  const hit = ICON_BY_KEYWORD.find(([pattern]) => pattern.test(label));
  const Icon = hit ? hit[1] : BadgeCheck;
  return <Icon aria-hidden="true" {...props} />;
}

export default function Stats({ section }) {
  const items = parseStatItems(section?.body);
  const figures = items.filter((item) => item.value);
  const notes = items.filter((item) => !item.value);

  if (!section?.title && items.length === 0) return null;

  return (
    <section className="relative isolate overflow-hidden bg-white py-16 sm:py-24">
      {/* A soft band of brand colour behind the figures. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-64 -translate-y-1/4 bg-gradient-to-r from-brand-50 via-accent-50/70 to-brand-50 sm:h-80"
      />

      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="badge bg-accent-100 text-accent-700">
            Track Record
          </span>
          {section?.title && (
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {section.title}
            </h2>
          )}
          <span
            aria-hidden="true"
            className="mx-auto mt-5 block h-1 w-14 rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
          />
          {notes.map((note) => (
            <p
              key={note.label}
              className="mt-5 leading-relaxed text-ink-soft first-letter:uppercase"
            >
              {note.label}
            </p>
          ))}
        </Reveal>

        {figures.length > 0 && (
          // One card per figure: two across on phones, three on tablets and
          // all in a row on desktop. flex-1 shares the width, so five, four
          // or three cards fill the row evenly and an odd last card stretches
          // across instead of leaving a hole.
          <RevealGroup
            className="mt-12 flex flex-wrap justify-center gap-4 sm:mt-14 sm:gap-5"
            stagger={0.1}
            delay={0.1}
          >
            {figures.map((item) => (
              <RevealItem
                key={item.label}
                className="group relative flex-1 basis-[calc(50%-0.5rem)] overflow-hidden rounded-2xl bg-white p-5 text-center shadow-soft ring-1 ring-brand-100 transition duration-300 hover:-translate-y-1 hover:shadow-card hover:ring-accent-300 sm:basis-[calc(33.333%-0.8rem)] sm:p-6 lg:min-w-0 lg:basis-0"
                distance={18}
                duration={0.6}
              >
                {/* A brand-colour line that draws across the top on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand-500 to-accent-500 transition-transform duration-500 group-hover:scale-x-100"
                />
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-md shadow-accent-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <StatIcon label={item.label} size={22} strokeWidth={1.75} />
                </span>
                <div>
                  <p className="mt-5 font-display text-3xl font-extrabold leading-none tracking-tight sm:text-4xl">
                    <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
                      <Counter value={item.value} />
                    </span>
                  </p>
                  <p className="mx-auto mt-3 max-w-[12rem] text-sm leading-snug text-ink-soft first-letter:uppercase">
                    {item.label}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
