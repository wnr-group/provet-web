import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { categoryTheme } from "@/lib/categoryTheme";

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
export default function CategoryGrid({ categories, title = "Solutions by Species", description }) {
  if (!categories?.length) return null;

  return (
    // Solid mist-50 (not a translucent tint) so it continues the lower half of
    // the feature strip's background seamlessly.
    <section className="bg-mist-50 pb-16 pt-14 sm:pb-20 sm:pt-16">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <SectionHeading eyebrow="Our Portfolio" title={title} description={description || undefined} />
          </Reveal>
          <Link href="/products" className="btn-outline hidden sm:inline-flex">
            View Full Portfolio <ArrowRight size={16} />
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
              <RangePanel category={category} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Link href="/products" className="btn-outline mt-8 w-full justify-center sm:hidden">
          View Full Portfolio <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function RangePanel({ category }) {
  const href = `/products?category=${category.slug}`;
  // The range's own colour (amber for Avinova, ocean for Blunova) marks its
  // label rule and link, the same colours the catalogue themes it with.
  const theme = categoryTheme(category);

  // The whole panel is one link, so a click anywhere on it - the photo, the
  // name, the counts or the arrow - opens the range in the catalogue.
  return (
    <Link
      href={href}
      aria-label={`${category.name}: ${category.productCount} products`}
      className="group relative isolate flex h-full min-h-[20rem] flex-col justify-end overflow-hidden rounded-3xl text-white shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-500 sm:min-h-[26rem]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded/external URLs */}
      <img
        src={category.image || FALLBACK_IMG}
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-900/95 via-brand-900/60 to-brand-900/5"
      />

      <div className="p-6 sm:p-8">
        {theme.label && (
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
            <span
              aria-hidden="true"
              className="h-0.5 w-8 rounded-full transition-all duration-300 group-hover:w-12"
              style={{ backgroundColor: theme.bannerAccent }}
            />
            {theme.label}
          </p>
        )}
        <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{category.name}</h3>
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/15 pt-5">
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-brand-900"
          >
            <ArrowRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}
