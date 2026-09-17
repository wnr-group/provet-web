import Link from "next/link";

const ICON_FALLBACK = "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=300&h=300&fit=crop";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="card group flex flex-col items-center gap-3 p-5 text-center transition hover:-translate-y-1 hover:border-accent-300 hover:shadow-card"
    >
      <div className="h-16 w-16 overflow-hidden rounded-2xl bg-mist-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={category.image || ICON_FALLBACK} alt="" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-ink group-hover:text-brand-700">{category.name}</h3>
        {typeof category.productCount === "number" && (
          <p className="mt-0.5 text-xs text-ink-soft">{category.productCount} products</p>
        )}
      </div>
    </Link>
  );
}
