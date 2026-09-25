import Carousel from "@/components/sections/Carousel";
import { parseSectionConfig } from "@/lib/sectionTypes";
import Reveal from "@/components/motion/Reveal";

// The homepage testimonials rail.
//
// The homepage is a bespoke layout rather than a stack of admin-built
// sections, so this reads its own ContentBlock ("home" / "testimonials") and
// renders the carousel from it. That keeps the slides editable in
// Admin > Website Content > Homepage alongside every other homepage block,
// using the same config shape as the carousel section type.
//
// Returns null when the admin clears it, so an emptied block leaves no
// hollow band behind.
export default function Testimonials({ section }) {
  // `isVisible === false` means the admin hid the block; the bespoke homepage
  // has to check that itself, where a managed page's renderer filters hidden
  // sections out before they ever reach it.
  if (!section || section.isVisible === false) return null;

  const config = parseSectionConfig("carousel", section.config);
  if (!config.items?.length) return null;

  return (
    <section className="relative overflow-hidden bg-mist-50/60 py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(57,49,133,0.07),transparent_70%)]"
      />
      <Reveal className="relative">
        <div className="mx-auto mb-10 max-w-2xl px-4 text-center">
          <span className="badge bg-accent-100 text-accent-700">In their words</span>
          <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {section.title || "What Our Customers Say"}
          </h2>
          <span aria-hidden="true" className="mx-auto mt-4 block h-1 w-14 rounded-full bg-accent-400" />
          {section.body && <p className="mt-5 leading-relaxed text-ink-soft">{section.body}</p>}
        </div>

        {/* The rail runs wider than the page column so wide screens use the
            side space for a fourth slide, rather than squeezing three
            text-heavy graphics together. */}
        <div className="mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8">
          <Carousel
            items={config.items}
            aspect={config.aspect}
            autoplay={config.autoplay}
            interval={config.interval}
            perView={4}
          />
        </div>
      </Reveal>
    </section>
  );
}
