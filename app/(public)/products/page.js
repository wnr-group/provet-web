import { getCategories, getProducts } from "@/lib/data";
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
      <div className="relative isolate overflow-hidden bg-brand-900 py-10 text-white sm:py-14">
        {/* eslint-disable-next-line @next/next/no-img-element -- category photo (DB) or fixed fallback, neither a dynamic host */}
        <img src={headerImage} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(21,18,48,0.92),rgba(21,18,48,0.8)_55%,rgba(21,18,48,0.9))]" />
        <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
              {activeCategory ? activeCategory.name : "Our Products"}
            </h1>
            <p className="mt-2 max-w-xl text-brand-100">
              {activeCategory?.description || "Explore our full range of veterinary medicines, vaccines and healthcare products."}
            </p>
          </div>
          <BrochureDownload />
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[260px_1fr] sm:py-14">
        <ProductsFilters categories={categories} category={category} search={search} />

        <div>
          {result.items.length ? (
            <>
              <p className="mb-4 text-sm text-ink-soft">
                Showing {result.items.length} of {result.total} products
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
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
