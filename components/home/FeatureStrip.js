import { Truck, ShieldCheck, FlaskConical, HeartPulse } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

// The icons, by position - the points themselves are the admin's.
const ICONS = [Truck, ShieldCheck, FlaskConical, HeartPulse];

const DEFAULT_ITEMS = [
  { heading: "Reliable Supply", text: "Consistent stock & timely delivery" },
  { heading: "Certified Quality", text: "GMP-compliant manufacturing" },
  { heading: "Research Backed", text: "Formulated with veterinary experts" },
  { heading: "Animal Wellness", text: "Focused on better health outcomes" },
];

// The trust strip under the hero: the points laid flat on a pale band, not
// boxed in cards - a line icon over a soft disc, the point, a short magenta
// rule and a line of description, with hairline dividers between the
// columns. In the theme's own colours (brand navy, accent magenta).
//
// `items` ([{ heading, text }]) come from the "feature-strip" block in Admin >
// Website Content > Homepage (lib/homeContent.js); up to four show, one
// column each on large screens.
export default function FeatureStrip({ items = DEFAULT_ITEMS }) {
  const features = items.slice(0, 4).map((item, i) => ({ icon: ICONS[i % ICONS.length], title: item.heading, desc: item.text }));
  if (!features.length) return null;
  return (
    <section className="border-b border-brand-100/70 bg-mist-50">
      <div className="container-page py-10 sm:py-12">
        {/* A short, quiet deal-in: the strip sits directly under the hero and
            must not compete with it.

            Equal spacing: every column has the same padding on both sides
            and the dividers sit between them, so all four have the same
            width of content and the same gap either side of each divider.
            The grid is pulled out by that padding (-mx) so the first and last
            columns still line up with the page edges.

            Phones: a compact two-by-two grid rather than four tall rows. */}
        <RevealGroup
          className="grid grid-cols-2 gap-x-5 gap-y-8 sm:-mx-6 sm:gap-x-0 sm:gap-y-10 lg:-mx-8 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:gap-0 lg:divide-x lg:divide-brand-100"
          style={{ "--cols": features.length }}
          stagger={0.08}
        >
          {features.map(({ icon: Icon, title, desc }, i) => (
            <RevealItem key={title} className="group sm:px-6 lg:px-8" distance={14} duration={0.5}>
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
              <h3 className="mt-3 font-display text-base font-semibold leading-snug sm:mt-4 sm:text-lg tracking-tight text-brand-800">{title}</h3>
              <span aria-hidden="true" className="mt-2.5 block h-0.5 w-8 rounded-full bg-accent-400" />
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
