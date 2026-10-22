import { getActiveBanners, getCategoryTree, getProducts, getProductsByReference, getContentSections, getAddedSections } from "@/lib/data";
import { parseHeadedItems, parseStatItems } from "@/lib/contentFormat";
import { withHomeDefaults, homeSectionOrder, homeLayout } from "@/lib/homeContent";
import PageSections from "@/components/sections/PageSections";
import Hero from "@/components/home/Hero";
import FeatureStrip from "@/components/home/FeatureStrip";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TopBrands from "@/components/home/TopBrands";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/home/CtaBanner";
import ScrollProgress from "@/components/motion/ScrollProgress";

// Without this, Next.js prerenders this page once at build time (no
// searchParams/cookies/etc. here to trigger dynamic rendering automatically)
// - meaning admin edits to banners/categories/content would never show up on
// the live homepage without a full rebuild. Force it to render per-request.
export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: "Provet" },
  description:
    "Browse Provet's catalogue of veterinary medicines, vaccines and animal healthcare products. Request a quote from our expert team.",
};

// The homepage is laid out from Admin > Website Content > Homepage
// (lib/homeContent.js): each block's copy, whether it shows, and - for the
// sections between the hero and the closing call to action - their order.
// The hero slides are Admin > Banners; the ranges, Admin > Categories; the
// featured products, the Featured switch in Admin > Products; the top
// brands, the rows of that block.
export default async function Home() {
  // Only products marked Featured in the admin, asked for directly (not
  // picked out of the newest few, which would miss older featured products).
  // With none marked, the Featured Products section is left out rather than
  // filled with other products.
  const [banners, categories, { items: featured }, content, added] = await Promise.all([
    getActiveBanners(),
    getCategoryTree(),
    getProducts({ featured: true, limit: 4, sort: "newest" }),
    getContentSections("home"),
    getAddedSections("home"),
  ]);

  const blocks = withHomeDefaults(content);
  const block = (key) => blocks.find((b) => b.key === key);
  const shown = (key) => {
    const b = block(key);
    return b && b.isVisible !== false ? b : null;
  };

  // Top Brands: each row of the block names a product and may give it a
  // tagline; the product's own short description stands in when it doesn't.
  // Rows naming no active product are dropped.
  const brandsBlock = shown("top-brands");
  const brandRows = brandsBlock ? parseHeadedItems(brandsBlock.body).slice(0, 6) : [];
  const brandProducts = brandRows.length ? await getProductsByReference(brandRows.map((r) => r.heading)) : [];
  const brands = brandRows
    .map((row, i) => brandProducts[i] && { product: brandProducts[i], tagline: row.text || brandProducts[i].shortDescription || "" })
    .filter((b, i, all) => b && all.findIndex((o) => o?.product.id === b.product.id) === i);

  const heroStats = shown("hero-stats");
  const cta = shown("cta");

  // Each orderable section, by its block's key.
  const renderSection = (b) => {
    switch (b.key) {
      case "feature-strip":
        return <FeatureStrip key={b.key} items={parseHeadedItems(b.body)} />;
      case "species":
        return <CategoryGrid key={b.key} categories={categories} title={b.title || undefined} description={b.body} />;
      case "featured":
        return <FeaturedProducts key={b.key} products={featured} title={b.title || undefined} description={b.body} />;
      case "top-brands":
        return <TopBrands key={b.key} brands={brands} title={b.title || undefined} />;
      case "stats":
        return <Stats key={b.key} section={b} />;
      case "testimonials":
        return <Testimonials key={b.key} section={b} />;
      default:
        return null;
    }
  };

  return (
    <>
      <ScrollProgress />
      <Hero
        banners={banners}
        badge={heroStats ? heroStats.title || null : null}
        stats={heroStats ? parseStatItems(heroStats.body).filter((s) => s.value) : []}
      />
      {/* The homepage's own sections and those added in Admin > Website
          Content > Homepage, in the order set there - an added section can sit
          anywhere among the built-in ones. */}
      {homeLayout(homeSectionOrder(content), added).map((entry) =>
        entry.added ? (
          <PageSections key={entry.key} sections={[entry.added]} offset={entry.addedIndex} />
        ) : (
          renderSection(entry.block)
        )
      )}
      {cta && <CtaBanner title={cta.title || undefined} body={cta.body} />}
    </>
  );
}
