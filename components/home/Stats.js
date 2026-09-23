import Counter from "@/components/motion/Counter";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { parseStatItems } from "@/lib/contentFormat";

// The "stats" Website Content block. One elevated panel split by hairline
// dividers rather than separate cards - it reads as a single run of figures,
// and it keeps the section distinct from the three card grids on the page.
//
// The admin can write either one item per line or a single line separated by
// " - " / " • " / " | " (see lib/contentFormat.js). An item with a leading
// number becomes a figure; a plain sentence in the same block still renders,
// as a note under the panel, instead of being silently dropped.
export default function Stats({ section }) {
  const items = parseStatItems(section?.body);
  const figures = items.filter((item) => item.value);
  const notes = items.filter((item) => !item.value);

  if (!section?.title && items.length === 0) return null;

  return (
    <section className="bg-mist-50/60 py-16 sm:py-20">
      <div className="container-page">
        {section?.title && (
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="badge bg-accent-100 text-accent-700">Track Record</span>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {section.title}
            </h2>
          </Reveal>
        )}

        {figures.length > 0 && (
          // Stats identity: the panel itself uncovers, then each figure lifts
          // in sequence while its number counts up. No card stagger here - the
          // products and categories grids own that, and this has to read as
          // one instrument panel rather than three cards.
          <RevealGroup
            className="card mt-10 flex flex-col divide-y divide-brand-100 sm:flex-row sm:divide-x sm:divide-y-0"
            stagger={0.14}
            delay={0.1}
          >
            {figures.map((item) => (
              // flex-1 + the row's default stretch keeps every cell the same
              // width and height however long its caption runs.
              <RevealItem key={item.label} className="flex-1 px-6 py-8 text-center" distance={18} duration={0.6}>
                <p className="font-display text-4xl font-extrabold tracking-tight text-brand-600 sm:text-5xl">
                  <Counter value={item.value} />
                </p>
                {/* The seeded captions start lower-case ("years combined
                    formulation experience"); lift the first letter so admin
                    copy looks deliberate either way. */}
                <p className="mx-auto mt-3 max-w-[16rem] text-sm leading-relaxed text-ink-soft first-letter:uppercase">
                  {item.label}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        )}

        {notes.length > 0 && (
          <Reveal delay={0.15} className="mx-auto mt-8 max-w-2xl text-center">
            {notes.map((note) => (
              <p key={note.label} className="text-ink-soft first-letter:uppercase">
                {note.label}
              </p>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
