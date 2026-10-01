import { getCategoryTree, getProducts } from "@/lib/data";
import { resolveCategorySlug } from "@/lib/categoryTree";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import CatalogueCard from "@/components/catalogue/CatalogueCard";
import CatalogueHero from "@/components/catalogue/CatalogueHero";
import FeaturedSpotlight from "@/components/catalogue/FeaturedSpotlight";
import CategoryBrowser from "@/components/catalogue/CategoryBrowser";
import { ScrollTilt } from "@/components/motion/effects";
import EmptyState from "@/components/ui/EmptyState";
import ProductsFilters from "@/components/products/ProductsFilters";
import ProductsPagination from "@/components/products/ProductsPagination";
import BrochureDownload from "@/components/products/BrochureDownload";
import prisma from "@/lib/prisma";
import { getBrochureSettings, brochureAvailable } from "@/lib/brochureSettings";
import CategoryBackdrop from "@/components/catalogue/CategoryBackdrop";
import { categoryTheme, rangeThemeVars } from "@/lib/categoryTheme";

const LIMIT = 12;

export const metadata = {
  title: "Products",
  description: "Browse Provet's full catalogue by category and subcategory, or search for a specific product.",
};

export default async function Products({ searchParams }) {
  const params = await searchParams;
  const category = params.category || "";
  const search = params.search || "";
  const page = Number(params.page || 1);

  // The spotlight opens browsing (the catalogue or a category); searching and
  // paging skip it.
  const showSpotlight = page === 1 && !search;

  const [tree, result, featured, brochure] = await Promise.all([
    getCategoryTree(),
    getProducts({ category, search, page, limit: LIMIT, sort: "newest" }),
    showSpotlight ? getProducts({ category, featured: true, limit: 8 }) : null,
    getBrochureSettings(prisma),
  ]);

  const totalPages = Math.max(1, Math.ceil(result.total / LIMIT));
  // `?category=` names either level: a category (everything in its
  // subcategories) or one subcategory.
  const active = resolveCategorySlug(tree, category);
  const activeCategory = active?.category || null;
  const activeSubcategory = active?.subcategory || null;
  const activeNode = activeSubcategory || activeCategory;
  const spotlight = featured?.items || [];
  // A search spans the whole catalogue, so it keeps the neutral backdrop.
  const theme = categoryTheme(search ? null : activeCategory);

  return (
    <div className="range-theme" style={rangeThemeVars(theme)}>
      <CatalogueHero
        themeKey={theme.key}
        title={activeNode ? activeNode.name : "Our Products"}
        description={
          activeNode?.description ||
          activeCategory?.description ||
          "Explore Provet's complete catalogue across two specialist ranges: Avinova for poultry health and Blunova for aquaculture. From anticoccidials, growth promoters and probiotics to mineral mixtures, feed additives and water-quality solutions, every formulation is research-based and backed by our technical services and support."
        }
        count={result.total}
        images={Object.fromEntries(tree.map((c) => [c.slug, c.image]))}
        products={spotlight.length ? spotlight : result.items}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: activeCategory ? "/products" : undefined },
          ...(activeCategory
            ? [{ label: activeCategory.name, href: activeSubcategory ? `/products?category=${activeCategory.slug}` : undefined }]
            : []),
          ...(activeSubcategory ? [{ label: activeSubcategory.name }] : []),
        ]}
      >
        {/* Admin > Brochure: hidden when switched off or no PDF is set. The
            file link is only put in the page when no details are asked for -
            otherwise it comes back from /api/brochure after the form. */}
        {brochureAvailable(brochure) && (
          <BrochureDownload
            label={brochure.buttonLabel}
            fileUrl={brochure.requireDetails ? null : brochure.fileUrl}
          />
        )}
      </CatalogueHero>

      {/* Everything below the banner sits on the chosen range's backdrop. */}
      <div className="relative isolate">
        <CategoryBackdrop themeKey={theme.key} />

        {/* Browsing opens with the spotlight; searching and paging skip it. */}
        {spotlight.length > 0 && (
          <div className="container-page pt-8 sm:pt-10">
            <Reveal distance={20}>
              <FeaturedSpotlight products={spotlight} />
            </Reveal>
          </div>
        )}

        <div className="container-page grid gap-8 py-10 lg:grid-cols-[260px_1fr] sm:py-14">
          <ProductsFilters
            tree={tree}
            activeCategoryId={activeCategory?.id}
            activeSubcategoryId={activeSubcategory?.id}
            category={category}
            search={search}
          />

          <div>
            {/* The range cards, the catalogue's first step. A search
                spans the whole catalogue, so it goes straight to results. */}
            {!search && (
              <CategoryBrowser tree={tree} category={activeCategory} />
            )}
            {result.items.length ? (
              <>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-ink-soft">
                    {theme.label && (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]"
                        style={{ backgroundColor: "var(--range-soft)", color: "var(--range-accent)" }}
                      >
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                        {activeCategory.name} · {theme.label}
                      </span>
                    )}
                    <span>
                      Showing <span className="font-semibold text-ink">{result.items.length}</span> of{" "}
                      <span className="font-semibold text-ink">{result.total}</span> products
                      {search && (
                        <>
                          {" "}for <span className="font-semibold text-brand-700">&ldquo;{search}&rdquo;</span>
                        </>
                      )}
                    </span>
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
                    className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3"
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
    </div>
  );
}
