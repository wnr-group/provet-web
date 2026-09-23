import Link from "next/link";

const ICON_FALLBACK =
  "https://images.unsplash.com/photo-1766297247072-93fd815afef3?auto=format&fit=crop&w=300&h=300&q=80";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="card group flex h-full flex-col items-center gap-3 p-5 text-center transition duration-300 hover:-translate-y-1.5 hover:border-accent-300 hover:shadow-card"
    >
      {/* The thumbnail zooms inside its own rounded frame while the card
          lifts - two speeds in one gesture, which is what stops a grid of six
          identical tiles feeling flat on hover. */}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-mist-100">
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
      <div className="flex w-full flex-1 flex-col justify-center">
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-ink group-hover:text-brand-700">
          {category.name}
        </h3>
        <p className="mt-0.5 min-h-4 text-xs text-ink-soft">
          {typeof category.productCount === "number" ? `${category.productCount} products` : null}
        </p>
      </div>
    </Link>
  );
}
