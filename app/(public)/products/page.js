import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategories, getProducts } from "@/lib/data";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import CatalogueCard from "@/components/catalogue/CatalogueCard";
import CatalogueHero from "@/components/catalogue/CatalogueHero";
import FeaturedSpotlight from "@/components/catalogue/FeaturedSpotlight";
import { ScrollTilt } from "@/components/motion/effects";
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

  // The spotlight opens browsing (the catalogue or a category); searching and
  // paging skip it.
  const showSpotlight = page === 1 && !search;

  const [categories, result, featured] = await Promise.all([
    getCategories(),
    getProducts({ category, search, page, limit: LIMIT, sort: "newest" }),
    showSpotlight ? getProducts({ category, featured: true, limit: 8 }) : null,
  ]);

  const totalPages = Math.max(1, Math.ceil(result.total / LIMIT));
  const activeCategory = categories.find((c) => c.slug === category);
  const spotlight = featured?.items || [];

  return (
    <div className="bg-mist-50/40">
      <CatalogueHero
        title={activeCategory ? activeCategory.name : "Our Products"}
        description={
          activeCategory?.description ||
          "Explore our full range of veterinary medicines, feed additives and animal healthcare products."
        }
        count={result.total}
        products={spotlight.length ? spotlight : result.items}
        breadcrumbs={
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
        }
      >
        <BrochureDownload />
      </CatalogueHero>

      {/* Browsing opens with the spotlight; searching and paging skip it. */}
      {spotlight.length > 0 && (
        <div className="container-page pt-8 sm:pt-10">
          <Reveal distance={20}>
            <FeaturedSpotlight products={spotlight} />
          </Reveal>
        </div>
      )}

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
              <ScrollTilt amount={10}>
                <RevealGroup
                  key={`${category}|${search}|${page}`}
                  mode="mount"
                  stagger={0.05}
                  className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3"
                >
                  {result.items.map((p) => (
                    <RevealItem key={p.id} className="h-full" distance={18} duration={0.45}>
                      <CatalogueCard product={p} />
                    </RevealItem>
                  ))}
                </RevealGroup>
              </ScrollTilt>
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
