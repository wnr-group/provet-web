import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import SiteImage from "@/components/ui/SiteImage";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1664216294580-079bc527ae49?auto=format&fit=crop&w=600&h=450&q=80";

// The product card for the catalogue, search results and the product page's
// related rail. (The homepage keeps components/ui/ProductCard.)
//
// Plain, as the animal-health catalogues present products: the label, the
// product group, the name, a short description, the pack size and a solid
// "View product" button. A soft shadow at rest; on hover the card lifts a
// little, the shadow deepens, the border takes the range's colour (--range-*,
// set by the page) and the label zooms a touch.
//
// The label artwork fills the image area edge to edge. It is a wordmark
// across the middle of a square with a thin grey frame line about 1.7% in
// from each edge: cropped to 4:3 (only white space goes off the top and
// bottom) and zoomed 5% - past the frame, while the widest wordmark (7% in)
// keeps a clear margin. The footer is pinned to the bottom, so the cards of
// a row line up.
export default function CatalogueCard({ product }) {
  const image = product.images?.[0] || FALLBACK_IMG;
  const group = product.subcategory?.name || product.category?.name;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-brand-100 bg-white shadow-[0_8px_24px_-12px_rgba(32,27,75,0.22)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-(--range-ring) hover:shadow-[0_22px_44px_-18px_rgba(32,27,75,0.38)] focus-visible:border-(--range-ring)"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-brand-100/70 bg-white">
        <SiteImage
          src={image}
          alt={product.name}
          sizes="(min-width: 1280px) 280px, (min-width: 768px) 30vw, 48vw"
          className="h-full w-full scale-[1.05] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.09]"
        />
        {product.isFeatured && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-(--range-accent) px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {group && (
          <p className="line-clamp-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-(--range-accent) sm:text-[11px]">{group}</p>
        )}
        <h3 className="mt-1 line-clamp-2 font-display text-sm font-bold leading-snug text-ink transition-colors group-hover:text-(--range-text) sm:text-base">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-[1.125rem] text-ink-soft sm:text-[13px] sm:leading-5">{product.shortDescription}</p>
        )}

        {/* The pack size, then "View product" as a solid button in the
            range's colour - the card's one call to action, full width so it
            lines up across a row. */}
        <div className="mt-auto pt-3">
          {product.packSize && (
            <p className="mb-3 flex min-w-0 items-center gap-1.5 border-t border-brand-100/70 pt-3 text-[11px] text-ink-soft sm:text-xs" title={product.packSize}>
              <Package size={13} aria-hidden="true" className="shrink-0 opacity-70" />
              <span className="truncate">{product.packSize}</span>
            </p>
          )}
          <span className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-(--range-accent) px-3 py-2 text-xs font-semibold text-white shadow-[0_6px_14px_-6px_var(--range-accent)] transition-[filter,box-shadow] duration-300 group-hover:shadow-[0_10px_20px_-8px_var(--range-accent)] group-hover:brightness-110 sm:text-[13px]">
            View product
            <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
