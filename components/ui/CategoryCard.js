import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ICON_FALLBACK =
  "https://images.unsplash.com/photo-1766297247072-93fd815afef3?auto=format&fit=crop&w=300&h=300&q=80";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative isolate flex h-full flex-col items-center gap-3 overflow-hidden rounded-2xl bg-white p-5 text-center shadow-soft ring-1 ring-brand-100/70 transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card hover:ring-accent-200"
    >
      {/* A tinted wash that fades up from the foot of the card on hover. A
          separate layer at opacity 0 rather than a background swap, because
          gradients can't be transitioned directly. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-white to-accent-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* The thumbnail zooms inside its own rounded frame while the card
          lifts - two speeds in one gesture, which is what stops a grid of six
          identical tiles feeling flat on hover. */}
      <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-mist-100 ring-4 ring-mist-50 transition duration-300 group-hover:ring-accent-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.image || ICON_FALLBACK}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>

      {/* Two lines reserved for the name and one for the count, so a long
          category ("Antibiotics & Anti-infectives") and a short one produce
          the same card height instead of the grid row stretching to the
          longest label. */}
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-ink transition-colors group-hover:text-brand-700">
          {category.name}
        </h3>
        <p className="mt-1.5 min-h-5">
          {typeof category.productCount === "number" && (
            <span className="rounded-full bg-mist-100 px-2 py-0.5 text-[11px] font-medium text-ink-soft transition-colors group-hover:bg-accent-100 group-hover:text-accent-700">
              {category.productCount} products
            </span>
          )}
        </p>
      </div>

      {/* Always shown on touch screens (there is no hover to reveal it); from
          `sm` up it rises in with the hover so a resting grid stays quiet. */}
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-600 transition duration-300 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
        Explore <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
