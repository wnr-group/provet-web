import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import SiteImage from "@/components/ui/SiteImage";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { categoryTheme, rangeThemeVars } from "@/lib/categoryTheme";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1664216294580-079bc527ae49?auto=format&fit=crop&w=600&h=450&q=80";

// The homepage's flagship brands - the old site's "Top Brands" row of label
// tiles. All of them sit side by side as one wall: each tile is the brand's
// label artwork, a rule in its range's colour (amber for Avinova's poultry
// brands, teal for Blunova's aquaculture ones), the range, the name and a
// one-line tagline, and the whole tile opens the product.
//
// `brands` is [{ product, tagline }] from the "top-brands" block in Admin >
// Website Content > Homepage (lib/homeContent.js), resolved in the page.
export default function TopBrands({ brands, title = "Top Brands" }) {
  if (!brands?.length) return null;
  // Up to four on one row; five or six fall into rows of three rather than
  // leaving one tile alone on a second row.
  const columns = brands.length <= 4 ? brands.length : 3;

  return (
    <section className="relative isolate overflow-hidden bg-mist-50 py-16 sm:py-20">
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-10 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl"
      />
      <div className="container-page">
        <Reveal>
          <SectionHeading animated align="center" eyebrow="Flagship Range" title={title} />
        </Reveal>

        {/* Phones: a swipe row, the next tile peeking in from the edge. */}
        <RevealGroup
          className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-auto sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] [&::-webkit-scrollbar]:hidden"
          style={{ "--cols": columns, maxWidth: columns < 4 ? `${columns * 19}rem` : undefined }}
          stagger={0.1}
        >
          {brands.map((brand) => (
            <RevealItem key={brand.product.id} className="w-[72%] shrink-0 snap-start sm:w-auto" direction="up" distance={24}>
              <BrandTile {...brand} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function BrandTile({ product, tagline }) {
  const theme = categoryTheme(product.category);

  return (
    <Link
      href={`/products/${product.slug}`}
      style={rangeThemeVars(theme)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-brand-100/70 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-hover hover:ring-(--range-ring) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-500"
    >
      {/* The label artwork fills the tile's image area edge to edge. It is a
          wordmark across the middle of a square with a thin grey frame line
          about 1.7% in from each edge: cropped to 4:3 (only white space goes
          off the top and bottom) and zoomed 5% - which trims 2.4% off each
          side, past the frame, while the widest wordmark (7% in) keeps a
          clear margin. On hover it zooms a little further. */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <SiteImage
          src={product.images?.[0] || FALLBACK_IMG}
          alt={product.name}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 72vw"
          className="h-full w-full scale-[1.05] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.09]"
        />
      </div>

      {/* The range's colour, drawn across the tile; it thickens on hover. */}
      <span
        aria-hidden="true"
        className="h-1 bg-gradient-to-r from-(--range-bar-from) to-(--range-bar-to) transition-all duration-300 group-hover:h-1.5"
      />

      <div className="flex flex-1 flex-col p-5">
        {theme.label && (
          <span className="text-[11px] font-semibold uppercase leading-4 tracking-[0.12em] text-(--range-text)">
            {product.category?.name} · {theme.label}
          </span>
        )}
        <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-ink">{product.name}</h3>
        {tagline && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">{tagline}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-(--range-text)">
          View product
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
