import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Tilt } from "@/components/motion/effects";
import SiteImage from "@/components/ui/SiteImage";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1664216294580-079bc527ae49?auto=format&fit=crop&w=600&h=450&q=80";

// The product card for the catalogue and the product page's related rail.
// (The homepage keeps components/ui/ProductCard.)
//
// The product image fills its square edge to edge - no backdrop showing
// around it. The product shots are square label artwork (white, the name in
// the middle) with a thin grey frame line near the edge; a slight zoom
// (scale-106) trims that line off, so the picture reads as one clean white
// label. Nothing that matters is lost: the name sits well inside the frame.
// Tilt leans the whole card toward the cursor and the image zooms a little
// further on hover. On touch screens and under reduced motion there is no
// tilt and the card is simply flat.
export default function CatalogueCard({ product }) {
  const image = product.images?.[0] || FALLBACK_IMG;

  return (
    <Tilt className="h-full" max={12} glare shadow glareClassName="rounded-2xl">
      <Link
        href={`/products/${product.slug}`}
        className="group relative flex h-full flex-col rounded-2xl bg-white p-2 sm:p-3 shadow-soft ring-1 ring-brand-100/80 transition duration-300 [transform-style:preserve-3d] hover:shadow-card hover:ring-(--range-ring)"
      >
        {/* The image, filling its square. */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-white ring-1 ring-brand-100">
          <SiteImage
            src={image}
            alt={product.name}
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 30vw, 50vw"
            className="h-full w-full scale-106 object-cover transition-transform duration-500 ease-out group-hover:scale-112"
          />
          {product.isFeatured && (
            <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-700 shadow-soft ring-1 ring-accent-100">
              <Sparkles size={10} /> Featured
            </span>
          )}
        </div>

        {/* Text wraps rather than being cut to one line: the category in full,
            the name over up to two lines, the description over up to six - three
            on phones, where the cards are half the screen wide - (the rest is
            on the product page) and the pack size over two. Cards in a
            row still line up - the grid stretches each to the row's height and
            the footer is pinned to the bottom with mt-auto. */}
        <div className="flex flex-1 flex-col px-1 pb-1 pt-2.5 sm:px-1.5 sm:pt-3">
          <span className="text-[11px] font-semibold uppercase leading-4 tracking-[0.12em] text-accent-600">
            {product.subcategory?.name || product.category?.name}
          </span>
          <h3 className="mt-1 line-clamp-2 font-display text-[15px] font-bold sm:text-base leading-snug text-ink transition-colors group-hover:text-(--range-text)">
            {product.name}
          </h3>
          <p className="mt-1.5 line-clamp-3 text-[13px] leading-5 text-ink-soft sm:line-clamp-6 sm:text-sm">{product.shortDescription}</p>
          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <span className="line-clamp-2 min-w-0 break-words text-xs leading-4 text-ink-soft">{product.packSize}</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--range-soft) text-(--range-text) transition-colors duration-300 group-hover:bg-(--range-accent) group-hover:text-white">
              <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </Link>
    </Tilt>
  );
}
