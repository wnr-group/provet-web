import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategories, getProducts } from "@/lib/data";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import ProductCard from "@/components/ui/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import ProductsFilters from "@/components/products/ProductsFilters";
import ProductsPagination from "@/components/products/ProductsPagination";
import BrochureDownload from "@/components/products/BrochureDownload";

const LIMIT = 12;

export const metadata = {
  title: "Products",
  description: "Browse Provet's full catalogue of veterinary medicines by category, or search for a specific product.",
};

export default async function Products({ searchParams }) {
  const params = await searchParams;
  const category = params.category || "";
  const search = params.search || "";
  const page = Number(params.page || 1);

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({ category, search, page, limit: LIMIT, sort: "newest" }),
  ]);

  const totalPages = Math.max(1, Math.ceil(result.total / LIMIT));
  const activeCategory = categories.find((c) => c.slug === category);
  const headerImage =
    activeCategory?.image ||
    "https://images.unsplash.com/photo-1579165466949-3180a3d056d5?auto=format&fit=crop&w=1920&h=500&q=80";

  return (
    <div className="bg-mist-50/40">
      <div className="relative isolate overflow-hidden bg-brand-900 py-12 text-white sm:py-16">
        {/* eslint-disable-next-line @next/next/no-img-element -- category photo (DB) or fixed fallback, neither a dynamic host */}
        <img src={headerImage} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(21,18,48,0.92),rgba(21,18,48,0.8)_55%,rgba(21,18,48,0.9))]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(229,9,127,0.22),transparent_55%)]" />
        <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal mode="mount" distance={12}>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-brand-200">
              <Link href="/" className="transition-colors hover:text-white">Home</Link>
              <ChevronRight size={12} aria-hidden="true" />
              {activeCategory ? (
                <>
                  <Link href="/products" className="transition-colors hover:text-white">Products</Link>
                  <ChevronRight size={12} aria-hidden="true" />
                  <span className="text-white">{activeCategory.name}</span>
                </>
              ) : (
                <span className="text-white">Products</span>
              )}
            </nav>
            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {activeCategory ? activeCategory.name : "Our Products"}
            </h1>
            <p className="mt-2 max-w-xl text-brand-100">
              {activeCategory?.description || "Explore our full range of veterinary medicines, vaccines and healthcare products."}
            </p>
            <span className="badge mt-4 bg-white/10 text-accent-200 backdrop-blur-sm">
              {result.total} {result.total === 1 ? "product" : "products"}
            </span>
          </Reveal>
          <BrochureDownload />
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[260px_1fr] sm:py-14">
        <ProductsFilters categories={categories} category={category} search={search} />

        <div>
          {result.items.length ? (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-soft">
                  Showing <span className="font-semibold text-ink">{result.items.length}</span> of{" "}
                  <span className="font-semibold text-ink">{result.total}</span> products
                  {search && (
                    <>
                      {" "}for <span className="font-semibold text-brand-700">&ldquo;{search}&rdquo;</span>
                    </>
                  )}
                </p>
                {totalPages > 1 && (
                  <span className="text-xs font-medium text-ink-soft">
                    Page {page} of {totalPages}
                  </span>
                )}
              </div>
              {/* Keyed on the query, so the grid re-deals whenever the filter
                  or page changes - a visible answer to the click rather than
                  cards silently swapping in place. mode="mount" because the
                  grid is above the fold. */}
              <RevealGroup
                key={`${category}|${search}|${page}`}
                mode="mount"
                stagger={0.05}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {result.items.map((p) => (
                  <RevealItem key={p.id} className="h-full" distance={18} duration={0.45}>
                    <ProductCard product={p} />
                  </RevealItem>
                ))}
              </RevealGroup>
              <ProductsPagination page={page} totalPages={totalPages} />
            </>
          ) : (
            <EmptyState title="No products found" description="Try adjusting your search or browsing a different category." />
          )}
        </div>
      </div>
    </div>
  );
}
