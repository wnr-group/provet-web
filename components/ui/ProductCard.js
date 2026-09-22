import Link from "next/link";
import { ArrowUpRight, PackageSearch } from "lucide-react";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1664216294580-079bc527ae49?auto=format&fit=crop&w=600&h=450&q=80";

export default function ProductCard({ product }) {
  const image = product.images?.[0] || FALLBACK_IMG;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-mist-100">
        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external/uploaded URLs, not a fixed set of remote hosts */}
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {product.isFeatured && (
          <span className="badge absolute left-3 top-3 bg-accent-400 text-brand-900">Featured</span>
        )}
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brand-700 opacity-0 transition group-hover:opacity-100">
          <ArrowUpRight size={16} />
        </span>
      </div>
      {/* Every text row reserves a fixed number of lines (min-h matches the
          line-height, line-clamp caps the overflow) and is always rendered,
          even when empty. Without that, a product with no category or a
          one-line description produced a shorter card than its neighbours -
          card height followed the copy instead of being uniform. */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="line-clamp-1 min-h-4 text-xs font-semibold uppercase tracking-wide text-accent-600">
          {product.category?.name}
        </span>
        <h3 className="line-clamp-1 font-display font-semibold text-ink">{product.name}</h3>
        <p className="line-clamp-2 min-h-10 text-sm text-ink-soft">{product.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          {product.packSize ? (
            <span className="inline-flex items-center gap-1.5 text-ink-soft">
              <PackageSearch size={14} /> {product.packSize}
            </span>
          ) : (
            <span />
          )}
          <span className="font-semibold text-brand-600 link-underline">View details</span>
        </div>
      </div>
    </Link>
  );
}
