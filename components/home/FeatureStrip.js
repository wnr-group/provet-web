import { Truck, ShieldCheck, FlaskConical, Microscope, GraduationCap, Factory, Handshake, ClipboardCheck, HeartPulse } from "lucide-react";
import clsx from "clsx";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";

// The icons, by position - the points themselves are the admin's.
const ICONS = [Truck, ShieldCheck, FlaskConical, Microscope, GraduationCap, Factory, Handshake, ClipboardCheck, HeartPulse];

const DEFAULT_ITEMS = [
  { heading: "Reliable Supply", text: "Consistent stock & timely delivery" },
  { heading: "Certified Quality", text: "GMP-compliant manufacturing" },
  { heading: "Research Backed", text: "Formulated with veterinary experts" },
  { heading: "Animal Wellness", text: "Focused on better health outcomes" },
];

// The trust strip under the hero, under its own heading.
//
// `items` ([{ heading, text }]) come from the "feature-strip" block in Admin >
// Website Content > Homepage (lib/homeContent.js), and `title` is that
// block's title; up to twelve points show. Up to four stand on the band in a
// row (a line icon over a soft disc, the point, a short magenta rule and a
// line of description, with hairline dividers between columns). More than
// that would make a tall, sparse wall of text, so they become compact cards
// in a grid: three across (two on tablets), icon beside the text.
export default function FeatureStrip({ items = DEFAULT_ITEMS, title = "" }) {
  const features = items.slice(0, 12).map((item, i) => ({
    icon: ICONS[i % ICONS.length],
    title: item.heading,
    desc: item.text,
  }));
  if (!features.length) return null;
  const compact = features.length > 4;

  return (
    <section className="border-b border-brand-100/70 bg-mist-50">
      <div className="container-page py-12 sm:py-16">
        {title && (
          <Reveal className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-brand-800 sm:text-3xl">{title}</h2>
            <span aria-hidden="true" className="mx-auto mt-4 block h-1 w-14 rounded-full bg-accent-400" />
          </Reveal>
        )}

        {/* Equal spacing in the row layout: every column has the same padding
            on both sides and the dividers sit between them. The grid is pulled
            out by that padding (-mx) so the first and last columns still line
            up with the page edges. Phones: a compact two-by-two grid. */}
        <RevealGroup
          className={clsx(
            "grid",
            compact
              ? "gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
              : "grid-cols-2 gap-x-5 gap-y-8 sm:-mx-6 sm:gap-x-0 sm:gap-y-10 lg:-mx-8 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:gap-0 lg:divide-x lg:divide-brand-100"
          )}
          style={{ "--cols": features.length }}
          stagger={0.08}
        >
          {features.map(({ icon: Icon, title: heading, desc }, i) =>
            compact ? (
              <RevealItem
                key={heading}
                className="group rounded-2xl bg-white p-5 ring-1 ring-brand-100 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-800/10 hover:ring-accent-300"
                distance={14}
                duration={0.5}
              >
                <div className="flex h-full items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-50 to-brand-100 text-brand-700 transition-all duration-300 group-hover:rotate-3 group-hover:scale-110 group-hover:from-brand-600 group-hover:to-brand-500 group-hover:text-white"
                  >
                    <Icon size={24} strokeWidth={1.6} absoluteStrokeWidth />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-brand-800">{heading}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{desc}</p>
                  </div>
                </div>
              </RevealItem>
            ) : (
              <RevealItem key={heading} className="group sm:px-6 lg:px-8" distance={14} duration={0.5}>
                {/* The mark: a soft magenta-to-lavender disc set up and to the
                    left, the icon over it. The disc grows a touch on hover. */}
                <span aria-hidden="true" className="relative block h-12 w-14">
                  <span
                    className="absolute left-0 top-1.5 h-10 w-10 rounded-full transition-transform duration-500 ease-out group-hover:scale-110 motion-safe:animate-float"
                    style={{
                      background: "radial-gradient(circle at 35% 35%, var(--color-accent-50), var(--color-brand-100) 75%)",
                      animationDelay: `${i * 0.7}s`,
                    }}
                  />
                  <Icon size={34} strokeWidth={1.5} absoluteStrokeWidth className="absolute left-3 top-0 text-brand-700" />
                </span>
                <h3 className="mt-3 font-display text-base font-semibold leading-snug tracking-tight text-brand-800 sm:mt-4 sm:text-lg">{heading}</h3>
                <span aria-hidden="true" className="mt-2.5 block h-0.5 w-8 rounded-full bg-accent-400 transition-all duration-300 group-hover:w-12" />
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{desc}</p>
              </RevealItem>
            )
          )}
        </RevealGroup>
      </div>
    </section>
  );
}
