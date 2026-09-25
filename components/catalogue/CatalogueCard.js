import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Tilt } from "@/components/motion/effects";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1664216294580-079bc527ae49?auto=format&fit=crop&w=600&h=450&q=80";

// The product card for the catalogue and the product page's related rail.
// (The homepage keeps components/ui/ProductCard.)
//
// Built as a small 3D scene: a soft pedestal at the back, the product image
// floating 60px in front of it (95px on hover). Tilt leans the whole card toward the cursor,
// so the image slides against its pedestal - depth rather than a skew. The
// card itself doesn't clip (overflow would flatten the 3D); each layer rounds
// its own corners instead.
//
// The image is contained, never cropped: the product shots are square label
// artwork with the product name printed on them. On touch screens and under
// reduced motion there is no tilt and the card is simply flat.
export default function CatalogueCard({ product }) {
  const image = product.images?.[0] || FALLBACK_IMG;

  return (
    <Tilt className="h-full" max={12} glare shadow glareClassName="rounded-2xl">
      <Link
        href={`/products/${product.slug}`}
        className="group relative flex h-full flex-col rounded-2xl bg-white p-3 shadow-soft ring-1 ring-brand-100/80 transition duration-300 [transform-style:preserve-3d] hover:shadow-card hover:ring-brand-200"
      >
        {/* Pedestal */}
        <div className="relative aspect-square rounded-xl bg-[radial-gradient(110%_90%_at_50%_10%,#ffffff_0%,var(--color-mist-100)_60%,var(--color-brand-100)_100%)] [transform-style:preserve-3d]">
          <span
            aria-hidden="true"
            className="absolute bottom-3 left-1/2 h-3 w-1/2 -translate-x-1/2 rounded-full bg-brand-900/15 blur-md transition-all duration-500 group-hover:w-2/5 group-hover:opacity-60"
          />
          <div className="absolute inset-[12%] flex items-center justify-center transition-transform duration-500 ease-out [transform:translateZ(60px)] group-hover:[transform:translateZ(95px)_translateY(-6px)_scale(1.06)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external/uploaded URLs, not a fixed set of remote hosts */}
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="max-h-full max-w-full rounded-lg object-contain shadow-[0_14px_24px_-12px_rgba(21,18,48,0.4)]"
            />
          </div>
          {product.isFeatured && (
            <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-700 shadow-soft [transform:translateZ(80px)]">
              <Sparkles size={10} /> Featured
            </span>
          )}
        </div>

        {/* Text wraps rather than being cut to one line: the category in full,
            the name over up to two lines, the description over up to six (the
            rest is on the product page) and the pack size over two. Cards in a
            row still line up - the grid stretches each to the row's height and
            the footer is pinned to the bottom with mt-auto. */}
        <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3">
          <span className="text-[11px] font-semibold uppercase leading-4 tracking-[0.12em] text-accent-600">
            {product.category?.name}
          </span>
          <h3 className="mt-1 line-clamp-2 font-display text-base font-bold leading-snug text-ink transition-colors group-hover:text-brand-700">
            {product.name}
          </h3>
          <p className="mt-1.5 line-clamp-6 text-sm leading-5 text-ink-soft">{product.shortDescription}</p>
          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <span className="line-clamp-2 min-w-0 break-words text-xs leading-4 text-ink-soft">{product.packSize}</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
              <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </Link>
    </Tilt>
  );
}
