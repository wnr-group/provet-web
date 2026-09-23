import Reveal from "@/components/motion/Reveal";
import { SplitText, DrawLine } from "@/components/motion/effects";

// The "mission" Website Content block, as a calm editorial statement rather
// than another card grid - the page already has three of those, and a short
// statement of intent reads better with air around it than boxed in.
// Returns null when the admin clears the block, so an empty one leaves no
// hollow section behind.
export default function Mission({ section }) {
  if (!section?.title && !section?.body) return null;

  return (
    <section className="relative overflow-hidden bg-mist-50/60 py-16 sm:py-24">
      {/* Tinted rather than white: it sits between the (white) featured
          products above and the dark "Why Provet" band below, so a plain
          white band would merge into the products section. The soft brand
          glow keeps it from reading as a flat empty strip. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(57,49,133,0.08),transparent_70%)]"
      />

      {/* This section's motion identity is an editorial type reveal: the
          heading uncovers word by word from behind its own baseline, the rule
          draws outward from the centre, and only the body paragraph fades.
          Nothing here slides in from the side - that belongs to the bands
          above and below it. */}
      <div className="container-page relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal distance={10}>
            <span className="badge bg-accent-100 text-accent-700">Who We Are</span>
          </Reveal>

          {section.title && (
            <SplitText
              as="h2"
              text={section.title}
              delay={0.08}
              className="mt-4 block font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
            />
          )}

          <DrawLine className="mx-auto mt-6 block h-1 w-16 rounded-full bg-accent-400" delay={0.25} />

          {section.body && (
            <Reveal delay={0.3} distance={12}>
              <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-ink-soft sm:text-xl">
                {section.body}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
