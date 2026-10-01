import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1589922583749-6b8473a85048?auto=format&fit=crop&w=300&h=300&q=80";

// The catalogue's first step, above the product grid: with nothing chosen,
// the top-level categories as cards, so the first move on /products is
// picking a range rather than scrolling 100+ products. Once a range is chosen
// there is nothing here - its subcategories are listed in the sidebar filter.
export default function CategoryBrowser({ tree, category }) {
  if (!tree?.length || category) return null;
  return <CategoryCards tree={tree} />;
}

function CategoryCards({ tree }) {
  return (
    <section aria-labelledby="browse-categories" className="mb-8">
      <h2 id="browse-categories" className="mb-3 font-display text-lg font-bold text-ink">
        Browse by category
      </h2>
      <RevealGroup mode="mount" stagger={0.06} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tree.map((c) => (
          <RevealItem key={c.id} className="h-full" direction="none" scale={0.96} duration={0.4}>
            <Link
              href={`/products?category=${c.slug}`}
              className="group flex h-full items-center gap-4 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-brand-100/80 transition duration-300 hover:-translate-y-0.5 hover:shadow-card hover:ring-accent-200"
            >
              <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-mist-100">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded/external URLs */}
                <img
                  src={c.image || FALLBACK_IMG}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display font-bold text-ink transition-colors group-hover:text-brand-700">
                  {c.name}
                </span>
                <span className="mt-0.5 block text-xs text-ink-soft">
                  {c.children.length} {c.children.length === 1 ? "subcategory" : "subcategories"} · {c.productCount}{" "}
                  {c.productCount === 1 ? "product" : "products"}
                </span>
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-brand-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent-500"
              />
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
