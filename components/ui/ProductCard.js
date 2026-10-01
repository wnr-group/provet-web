import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import SiteImage from "@/components/ui/SiteImage";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1664216294580-079bc527ae49?auto=format&fit=crop&w=600&h=450&q=80";

export default function ProductCard({ product }) {
  const image = product.images?.[0] || FALLBACK_IMG;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative isolate flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-brand-100/70 transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-hover hover:ring-brand-200"
    >
      {/* Accent rule that draws across the top edge on hover - scaleX, so it
          costs nothing to animate. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand-500 to-accent-500 transition-transform duration-500 ease-out group-hover:scale-x-100"
      />

      {/* The photo is inset with its own radius rather than bleeding to the
          card edge, so the card reads as a frame holding a product shot. Same
          treatment as the catalogue cards (components/catalogue/CatalogueCard):
          the square label artwork fills its square, zoomed just enough
          (scale-106) to trim the thin frame line near its edge, and a little
          further on hover. */}
      <div className="relative m-2 mb-0 aspect-square overflow-hidden rounded-xl bg-white ring-1 ring-brand-100 sm:m-3 sm:mb-0">
        <SiteImage
          src={image}
          alt={product.name}
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 78vw"
          className="h-full w-full scale-106 object-cover transition-transform duration-500 ease-out group-hover:scale-112"
        />
        {product.isFeatured && (
          <span className="badge absolute left-3 top-3 bg-white/90 text-accent-700 shadow-soft backdrop-blur">
            <Sparkles size={12} /> Featured
          </span>
        )}
      </div>

      {/* The text block matches the catalogue cards: the category in full,
          the name over up to two lines, the description over up to six -
          three on phones - and the pack size over two. The padding puts the
          text where the catalogue card's own padding does (12px from the
          edge, 18px from `sm`). Cards in a row still line up - the row
          stretches each to the tallest and the footer is pinned to the
          bottom with mt-auto. */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5 sm:px-[18px] sm:pb-4 sm:pt-3">
        <span className="text-[11px] font-semibold uppercase leading-4 tracking-[0.12em] text-accent-600">
          {product.subcategory?.name || product.category?.name}
        </span>
        <h3 className="mt-1 line-clamp-2 font-display text-[15px] font-bold leading-snug text-ink transition-colors group-hover:text-(--range-text) sm:text-base">
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
  );
}
