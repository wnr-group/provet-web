import Link from "next/link";
import { ArrowUpRight, LayoutGrid, FileText, Search as SearchIcon } from "lucide-react";
import { globalSearch } from "@/lib/data";
import { MIN_QUERY_LENGTH, normalizeQuery, isSearchableQuery } from "@/lib/search";
import ProductCard from "@/components/ui/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import ProductsPagination from "@/components/products/ProductsPagination";
import SearchInput from "@/components/search/SearchInput";
import Highlight from "@/components/search/Highlight";
import Reveal from "@/components/motion/Reveal";

const LIMIT = 12;

// Categories and pages are shown in full - there are only ever a handful of
// each - so the page limit only ever paginates the product results.
const AUXILIARY_LIMIT = 24;

export const metadata = {
  title: "Search",
  description: "Search Provet's products, categories and pages.",
};

function SectionTitle({ icon: Icon, label, count }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon size={16} className="text-brand-500" />
      <h2 className="font-display text-lg font-semibold text-ink">{label}</h2>
      <span className="badge bg-brand-50 text-brand-700">{count}</span>
    </div>
  );
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = normalizeQuery(typeof params.q === "string" ? params.q : "");
  const page = Math.max(Number(params.page) || 1, 1);
  const searchable = isSearchableQuery(query);

  const result = searchable
    ? await globalSearch({ query, page, limit: LIMIT, auxiliaryLimit: AUXILIARY_LIMIT })
    : null;

  const totalPages = result ? Math.max(1, Math.ceil(result.products.total / LIMIT)) : 1;

  return (
    <div className="bg-white">
      <div className="relative isolate overflow-hidden bg-brand-900 py-12 text-white sm:py-16">
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed decorative background, not a dynamic host */}
        <img
          src="https://images.unsplash.com/photo-1579165466949-3180a3d056d5?auto=format&fit=crop&w=1920&h=500&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(21,18,48,0.92),rgba(21,18,48,0.8)_55%,rgba(21,18,48,0.9))]" />
        <Reveal mode="mount" className="container-page">
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {query ? `Results for "${query}"` : "Search"}
          </h1>
          <span aria-hidden="true" className="mt-5 block h-1 w-16 rounded-full bg-accent-400" />
          <p className="mt-5 text-brand-100">
            {result
              ? `${result.total} ${result.total === 1 ? "result" : "results"} across products, categories and pages.`
              : "Find a product, a category or a page anywhere on the site."}
          </p>
          <div className="mt-6">
            <SearchInput query={query} />
          </div>
        </Reveal>
      </div>

      <div className="container-page space-y-12 py-12 sm:py-16">
        {!searchable ? (
          <EmptyState
            icon={SearchIcon}
            title="Start typing to search"
            description={`Enter at least ${MIN_QUERY_LENGTH} characters to search products, categories and pages.`}
          />
        ) : !result.total ? (
          <EmptyState
            title={`No results for "${query}"`}
            description="Check the spelling, try a shorter term, or browse the full catalogue instead."
          />
        ) : (
          <>
            {result.pages.items.length > 0 && (
              <section>
                <SectionTitle icon={FileText} label="Pages" count={result.pages.total} />
                <ul className="grid gap-3 sm:grid-cols-2">
                  {result.pages.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="card group flex h-full items-start gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-card"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mist-100 text-brand-500">
                          <FileText size={16} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1 font-display text-sm font-semibold text-ink group-hover:text-brand-700">
                            <Highlight text={item.title} query={query} />
                            <ArrowUpRight size={14} className="opacity-0 transition group-hover:opacity-100" />
                          </span>
                          {item.excerpt && (
                            <span className="mt-1 line-clamp-2 block text-sm text-ink-soft">
                              <Highlight text={item.excerpt} query={query} />
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {result.categories.items.length > 0 && (
              <section>
                <SectionTitle icon={LayoutGrid} label="Categories" count={result.categories.total} />
                <ul className="flex flex-wrap gap-2.5">
                  {result.categories.items.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/products?category=${category.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-brand-300 hover:text-brand-700"
                      >
                        <Highlight text={category.name} query={query} />
                        {typeof category.productCount === "number" && (
                          <span className="text-xs text-ink-soft">{category.productCount}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Keyed off the total rather than the current page's items, so a
                `?page=` past the end still renders the pager the visitor
                needs to get back instead of dropping the section. */}
            {result.products.total > 0 && (
              <section>
                <SectionTitle icon={SearchIcon} label="Products" count={result.products.total} />
                {result.products.items.length ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {result.products.items.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink-soft">
                    That page is past the end of the results &mdash; pick a page below.
                  </p>
                )}
                <ProductsPagination page={page} totalPages={totalPages} />
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
