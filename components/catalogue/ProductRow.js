import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SiteImage from "@/components/ui/SiteImage";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1664216294580-079bc527ae49?auto=format&fit=crop&w=200&h=200&q=80";

// The catalogue's list view: one product per row, scannable down a column,
// the way the animal-health catalogues list products for vets and
// distributors (Intas's table of brand, segment, composition and packing).
// The label as a small square, the name and product group, the short
// description and the pack size, the whole row opening the product.
//
// From md the parts line up in columns under ProductListHeader; on phones the
// row stacks: label, then name, group and pack size, with the description
// left to the product page.
export default function ProductRow({ product }) {
  const image = product.images?.[0] || FALLBACK_IMG;
  const group = product.subcategory?.name || product.category?.name;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group grid grid-cols-[4rem_minmax(0,1fr)_auto] items-center gap-4 px-3 py-3 transition-colors hover:bg-(--range-soft)/50 sm:px-4 md:grid-cols-[4.5rem_minmax(0,13rem)_minmax(0,1fr)_8rem_8.5rem] md:gap-5"
    >
      {/* The label, zoomed 5% to trim its frame line (see CatalogueCard). */}
      <span className="relative block aspect-square overflow-hidden rounded-lg border border-brand-100 bg-white">
        <SiteImage
          src={image}
          alt={product.name}
          sizes="72px"
          className="h-full w-full scale-[1.05] object-cover transition-transform duration-300 group-hover:scale-[1.1]"
        />
      </span>

      <span className="min-w-0">
        <span className="block truncate font-display text-[15px] font-bold text-ink transition-colors group-hover:text-(--range-text)">
          {product.name}
        </span>
        {group && <span className="mt-0.5 block truncate text-xs font-medium text-(--range-accent)">{group}</span>}
        {product.packSize && <span className="mt-0.5 block truncate text-xs text-ink-soft md:hidden">{product.packSize}</span>}
      </span>

      <span className="hidden text-[13px] leading-5 text-ink-soft md:line-clamp-2">{product.shortDescription}</span>

      <span className="hidden truncate text-[13px] text-ink-soft md:block" title={product.packSize || undefined}>
        {product.packSize || "—"}
      </span>

      {/* The row's call to action, as on the cards: a solid button in the
          range's colour - "View product" from md, an arrow on phones. */}
      <span className="flex h-9 w-9 items-center justify-center justify-self-end rounded-lg bg-(--range-accent) text-white shadow-[0_6px_14px_-6px_var(--range-accent)] transition-[filter,box-shadow] duration-300 group-hover:shadow-[0_10px_20px_-8px_var(--range-accent)] group-hover:brightness-110 md:w-auto md:gap-1.5 md:px-3.5 md:text-[13px] md:font-semibold">
        <span className="hidden md:inline">View product</span>
        <ChevronRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

// The column headings over the list, from md (the rows stack below that).
export function ProductListHeader() {
  return (
    <div
      aria-hidden="true"
      className="hidden grid-cols-[4.5rem_minmax(0,13rem)_minmax(0,1fr)_8rem_8.5rem] gap-5 border-b border-brand-100 bg-mist-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft md:grid"
    >
      <span />
      <span>Product</span>
      <span>Description</span>
      <span>Pack size</span>
      <span />
    </div>
  );
}
