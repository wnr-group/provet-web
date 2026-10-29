import { getCategoryTree, getProducts, getPublicBrochureSettings } from "@/lib/data";
import { resolveCategorySlug, navCategoryTree } from "@/lib/categoryTree";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import CatalogueCard from "@/components/catalogue/CatalogueCard";
import CatalogueHeader from "@/components/catalogue/CatalogueHeader";
import RangeTabs from "@/components/catalogue/RangeTabs";
import ProductRow, { ProductListHeader } from "@/components/catalogue/ProductRow";
import EmptyState from "@/components/ui/EmptyState";
import ProductsFilters from "@/components/products/ProductsFilters";
import ProductsPagination from "@/components/products/ProductsPagination";
import ProductsToolbar from "@/components/products/ProductsToolbar";
import BrochureDownload from "@/components/products/BrochureDownload";
import { brochureAvailable } from "@/lib/brochureSettings";
import { CatalogueNavigationProvider, PendingResults } from "@/components/catalogue/CatalogueNavigation";
import { categoryTheme, rangeThemeVars } from "@/lib/categoryTheme";

const LIMIT = 12;
const SORTS = ["newest", "name"];

export const metadata = {
  title: "Products",
  description: "Browse Provet's full catalogue by category and subcategory, or search for a specific product.",
};

// The catalogue, laid out the way the animal-health companies' catalogues
// are: a short header, the ranges as tiles to pick the sector first, then the
// product groups and search on the left and the products on the right - as a
// grid of cards or a scannable list (`?view=list`).
//
// One page of products (LIMIT) is fetched per request, plus the cached
// category tree and the brochure settings.
export default async function Products({ searchParams }) {
  const params = await searchParams;
  const category = params.category || "";
  const search = params.search || "";
  const page = Math.max(1, Number(params.page) || 1);
  const sort = SORTS.includes(params.sort) ? params.sort : "newest";
  const view = params.view === "list" ? "list" : "grid";

  const [tree, result, brochure] = await Promise.all([
    getCategoryTree(),
    getProducts({ category, search, page, limit: LIMIT, sort, prefixFirst: true }),
    getPublicBrochureSettings(),
  ]);

  const totalPages = Math.max(1, Math.ceil(result.total / LIMIT));
  // `?category=` names either level: a category (everything in its
  // subcategories) or one subcategory.
  const active = resolveCategorySlug(tree, category);
  const activeCategory = active?.category || null;
  const activeSubcategory = active?.subcategory || null;
  const activeNode = activeSubcategory || activeCategory;
  const theme = categoryTheme(activeCategory);

  // The filters in force, as chips above the products. Removing a product
  // group steps back up to its range; removing the range shows every range.
  const chips = [
    ...(activeCategory ? [{ key: "range", label: activeCategory.name, clear: { category: "" } }] : []),
    ...(activeSubcategory
      ? [{ key: "group", label: activeSubcategory.name, clear: { category: activeCategory?.slug || "" } }]
      : []),
    ...(search ? [{ key: "search", label: `Search: “${search}”`, clear: { search: "" } }] : []),
  ];

  return (
    <div className="range-theme bg-white" style={rangeThemeVars(theme)}>
      <CatalogueHeader
        tint={theme.base}
        eyebrow={activeCategory ? theme.label || activeCategory.name : "Product catalogue"}
        title={activeNode ? activeNode.name : "Our Products"}
        description={
          activeNode?.description ||
          activeCategory?.description ||
          "Explore Provet's complete catalogue across two specialist ranges: Avinova for poultry health and Blunova for aquaculture. From anticoccidials, growth promoters and probiotics to mineral mixtures, feed additives and water-quality solutions, every formulation is research-based and backed by our technical services and support."
        }
        count={result.total}
        logo={activeCategory ? { logo: theme.logo, alt: activeCategory.name, asTitle: !activeSubcategory } : null}
        // The range's own photo from the admin; for the whole catalogue, the
        // ranges' photos (the header shows the first two that are set).
        images={(activeCategory ? [activeCategory] : tree).map((r) => ({
          src: r.image,
          alt: r.name,
        }))}
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
      </CatalogueHeader>

      <RangeTabs ranges={tree} activeId={activeCategory?.id} />

      <CatalogueNavigationProvider>
        <div className="container-page grid gap-5 pb-16 pt-6 sm:pb-20 sm:pt-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
          <ProductsFilters
            tree={navCategoryTree(tree)}
            activeCategoryId={activeCategory?.id}
            activeSubcategoryId={activeSubcategory?.id}
            category={category}
            search={search}
            total={result.total}
          />

          <PendingResults>
            <ProductsToolbar
              shown={result.items.length}
              total={result.total}
              page={page}
              limit={LIMIT}
              sort={sort}
              view={view}
              chips={chips}
            />
            {result.items.length ? (
              <>
                {/* Keyed on the query, so the products fade in afresh whenever
                    the filter, search, sort, view or page changes - a visible
                    answer to the click. mode="mount" because they are above
                    the fold. */}
                {view === "list" ? (
                  <div className="overflow-hidden rounded-xl border border-brand-100">
                    <ProductListHeader />
                    <RevealGroup
                      key={`${category}|${search}|${sort}|${page}|list`}
                      mode="mount"
                      stagger={0.025}
                      className="divide-y divide-brand-100"
                    >
                      {result.items.map((p) => (
                        <RevealItem key={p.id} distance={8} duration={0.3}>
                          <ProductRow product={p} />
                        </RevealItem>
                      ))}
                    </RevealGroup>
                  </div>
                ) : (
                  <RevealGroup
                    key={`${category}|${search}|${sort}|${page}|grid`}
                    mode="mount"
                    stagger={0.03}
                    className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5"
                  >
                    {result.items.map((p) => (
                      <RevealItem key={p.id} className="h-full" distance={10} duration={0.35}>
                        <CatalogueCard product={p} />
                      </RevealItem>
                    ))}
                  </RevealGroup>
                )}
                <ProductsPagination page={page} totalPages={totalPages} />
              </>
            ) : (
              // A search with no matches, or a range or product group just
              // added in the admin that has no products yet.
              <EmptyState
                title={search || !activeNode ? "No products found" : `No products in ${activeNode.name} yet`}
                description={
                  search || !activeNode
                    ? "Try a different search term, or choose another range or product group."
                    : "Products added to it in the admin will appear here. Meanwhile, browse the other ranges above."
                }
              />
            )}
          </PendingResults>
        </div>
      </CatalogueNavigationProvider>
    </div>
  );
}
