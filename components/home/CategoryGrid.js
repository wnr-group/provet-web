import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Parallax, Tilt } from "@/components/motion/effects";
import { categoryTheme } from "@/lib/categoryTheme";
import RangeLogo from "@/components/ui/RangeLogo";
import Pic from "@/components/ui/Pic";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1589922583749-6b8473a85048?auto=format&fit=crop&w=1200&h=900&q=80";

// The homepage's view of the portfolio: one large panel per top-level range
// (Avinova, Blunova, ...), presented the way animal-health companies present
// their species ranges - not as shop departments. Each panel is kept to what
// reads at a glance: the range's photograph, the animals it serves, its name
// and one line of counts, and it opens the range in the catalogue. (The full
// description is on the range's catalogue page.)
// Takes the tree from getCategoryTree, so the counts include every
// subcategory.
// `title` / `description` come from the "species" block in Admin > Website
// Content > Homepage (lib/homeContent.js).
export default function CategoryGrid({ categories, title = "Solutions by Species", description, config = {} }) {
  if (!categories?.length) return null;
  const eyebrow = config.eyebrow || "Our Portfolio";
  const buttonLabel = config.buttonLabel || "View Full Portfolio";
  const overrides = new Map((config.ranges || []).map((r) => [r.slug, r]));

  return (
    // Solid mist-50 (not a translucent tint) so it continues the lower half of
    // the feature strip's background seamlessly.
    <section className="bg-brand-600 pb-10 pt-10 sm:pb-12 sm:pt-12">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <SectionHeading animated tone="light" eyebrow={eyebrow} title={title} description={description || undefined} />
          </Reveal>
          <Link href="/products" className="btn border border-white/40 text-white hover:bg-white/10 hidden sm:inline-flex">
            {buttonLabel} <ArrowRight size={16} />
          </Link>
        </div>

        {/* The panels scale up into place rather than sliding, which tells the
            eye they are peers of one another.

            One row of equal columns for however many ranges there are: every
            range on one line from `lg` (four per row past four), up to three
            on one line on tablets. A fixed two-column grid pushed a third
            range onto a row of its own beside an empty gap. Phones get a
            swipeable row, the next range peeking in from the edge, rather
            than a stack of full-height panels. */}
        <RevealGroup
          className="-mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:mt-10 sm:grid sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-[repeat(var(--cols-md),minmax(0,1fr))] lg:grid-cols-[repeat(var(--cols-lg),minmax(0,1fr))] [&::-webkit-scrollbar]:hidden"
          style={{
            "--cols-md": categories.length <= 3 ? categories.length : 2,
            "--cols-lg": Math.min(categories.length, 4),
          }}
          stagger={0.1}
        >
          {categories.map((category) => (
            <RevealItem key={category.id} className="h-auto w-[80%] shrink-0 snap-start sm:h-full sm:w-auto" direction="none" scale={0.96} duration={0.55}>
              {/* Leans toward the cursor in 3D (flat on touch screens). */}
              <Tilt max={6} lift={1.02} shadow className="h-full">
                <RangePanel category={category} override={overrides.get(category.slug)} />
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>

        <Link href="/products" className="btn border border-white/40 text-white hover:bg-white/10 mt-8 w-full justify-center sm:hidden">
          {buttonLabel} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function RangePanel({ category, override = {} }) {
  const href = `/products?category=${category.slug}`;
  // The range's own colour (amber for Avinova, ocean for Blunova) marks its
  // label rule and link, the same colours the catalogue themes it with.
  const theme = categoryTheme(category);
  // Set in Admin > Website Content > Homepage > Solutions by Species; empty
  // keeps the range's own name, photo, label and wordmark.
  const name = override.name || category.name;
  const label = override.label || theme.label;
  const logo = override.logo ? { src: override.logo } : theme.logo;

  // The whole panel is one link, so a click anywhere on it - the photo, the
  // name, the counts or the arrow - opens the range in the catalogue.
  return (
    <Link
      href={href}
      aria-label={`${name}: ${category.productCount} products`}
      className="group relative isolate flex h-full min-h-[15rem] flex-col justify-end overflow-hidden rounded-3xl text-white shadow-[0_24px_48px_-20px_rgba(8,6,30,0.75)] ring-1 ring-white/25 transition-shadow duration-300 hover:ring-2 hover:ring-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-500 sm:min-h-[18rem]"
    >
      {/* The photo drifts more slowly than the page as it scrolls past, so
          it reads as a window onto the scene rather than a flat card. It is
          taller than the card, so the drift never shows an edge. */}
      <Parallax distance={22} className="absolute -inset-y-8 inset-x-0 -z-10">
        <Pic
          src={override.image || category.image || FALLBACK_IMG}
          alt=""
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 48vw, 92vw"
          className="h-full w-full object-cover brightness-105 saturate-110 transition-transform duration-1000 ease-out group-hover:scale-105"
        />
      </Parallax>
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(12,10,28,0.88)_0%,rgba(12,10,28,0.55)_34%,rgba(12,10,28,0)_62%)]"
      />

      <div className="p-5 sm:p-6">
        {label && (
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
            <span
              aria-hidden="true"
              className="h-0.5 w-8 rounded-full transition-all duration-300 group-hover:w-12"
              style={{ backgroundColor: theme.bannerAccent }}
            />
            {label}
          </p>
        )}
        {/* A range with its own wordmark (Avinova, Blunova) shows that in
            place of its name - the logo's alt text keeps it the heading. */}
        <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          {logo ? (
            <RangeLogo
              logo={logo}
              alt={name}
              sizes="(min-width: 640px) 216px, 172px"
              className="mt-3 h-8 drop-shadow-[0_4px_14px_rgba(10,8,30,0.35)] sm:h-10"
            />
          ) : (
            name
          )}
        </h3>
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/15 pt-4">
          {/* Each count stays in one piece, so on a narrow panel the line
              breaks between them rather than mid-phrase. */}
          <p className="flex min-w-0 flex-wrap gap-x-3 gap-y-0.5 text-sm text-white/80">
            <span className="whitespace-nowrap">
              <span className="font-semibold text-white">{category.productCount}</span> products
            </span>
            <span className="whitespace-nowrap">
              <span className="font-semibold text-white">{category.children.length}</span> product groups
            </span>
          </p>
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-brand-900"
          >
            <ArrowRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}
