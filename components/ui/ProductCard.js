import Link from "next/link";
import { ArrowUpRight, PackageSearch, Sparkles } from "lucide-react";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1664216294580-079bc527ae49?auto=format&fit=crop&w=600&h=450&q=80";

export default function ProductCard({ product }) {
  const image = product.images?.[0] || FALLBACK_IMG;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-brand-100/70 transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-hover hover:ring-brand-200"
    >
      {/* Accent rule that draws across the top edge on hover - scaleX, so it
          costs nothing to animate. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand-500 to-accent-500 transition-transform duration-500 ease-out group-hover:scale-x-100"
      />

      {/* The photo is inset with its own radius rather than bleeding to the
          card edge, so the card reads as a frame holding a product shot. */}
      <div className="relative m-2 mb-0 aspect-[4/3] overflow-hidden rounded-2xl bg-mist-100">
        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external/uploaded URLs, not a fixed set of remote hosts */}
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
        />
        {/* A soft scrim at the foot of the image so a pale product shot still
            separates from the white card below it. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-900/15 to-transparent"
        />
        {product.isFeatured && (
          <span className="badge absolute left-3 top-3 bg-white/90 text-accent-700 shadow-soft backdrop-blur">
            <Sparkles size={12} /> Featured
          </span>
        )}
      </div>

      {/* Every text row reserves a fixed number of lines (min-h matches the
          line-height, line-clamp caps the overflow) and is always rendered,
          even when empty. Without that, a product with no category or a
          one-line description produced a shorter card than its neighbours -
          card height followed the copy instead of being uniform. */}
      <div className="flex flex-1 flex-col gap-2 px-5 pb-5 pt-4">
        <span className="line-clamp-1 min-h-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-600">
          {product.category?.name}
        </span>
        <h3 className="line-clamp-1 font-display text-[17px] font-bold tracking-tight text-ink transition-colors group-hover:text-brand-700">
          {product.name}
        </h3>
        <p className="line-clamp-2 min-h-10 text-sm leading-relaxed text-ink-soft">{product.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          {product.packSize ? (
            <span className="inline-flex min-w-0 items-center gap-1.5 truncate rounded-full bg-mist-100 px-2.5 py-1 text-xs font-medium text-ink-soft">
              <PackageSearch size={13} className="shrink-0" /> {product.packSize}
            </span>
          ) : (
            <span className="text-xs font-semibold text-brand-600">View details</span>
          )}
          {/* The arrow fills with the brand gradient on hover: the gradient
              sits underneath at opacity 0 and fades up, since a background
              gradient itself can't be transitioned. */}
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:text-white">
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-brand-600 to-accent-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <ArrowUpRight
              size={16}
              className="relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
