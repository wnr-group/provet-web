import { getActiveBanners, getCategoryTree, getProducts, getContentSections, getAddedSections } from "@/lib/data";
import { parseHeadedItems, parseStatItems } from "@/lib/contentFormat";
import { withHomeDefaults, homeSectionOrder } from "@/lib/homeContent";
import PageSections from "@/components/sections/PageSections";
import Hero from "@/components/home/Hero";
import FeatureStrip from "@/components/home/FeatureStrip";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/home/CtaBanner";

// Without this, Next.js prerenders this page once at build time (no
// searchParams/cookies/etc. here to trigger dynamic rendering automatically)
// - meaning admin edits to banners/categories/content would never show up on
// the live homepage without a full rebuild. Force it to render per-request.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Home",
  description:
    "Browse Provet's catalogue of veterinary medicines, vaccines and animal healthcare products. Request a quote from our expert team.",
};

// The homepage is laid out from Admin > Website Content > Homepage
// (lib/homeContent.js): each block's copy, whether it shows, and - for the
// sections between the hero and the closing call to action - their order.
// The hero slides are Admin > Banners; the ranges, Admin > Categories; the
// featured products, the Featured switch in Admin > Products.
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
      <Hero
        banners={banners}
        badge={heroStats ? heroStats.title || null : null}
        stats={heroStats ? parseStatItems(heroStats.body).filter((s) => s.value) : []}
      />
      {homeSectionOrder(content).map(renderSection)}
      {/* Sections added in Admin > Website Content > Homepage. */}
      <PageSections sections={added} />
      {cta && <CtaBanner title={cta.title || undefined} body={cta.body} />}
    </>
  );
}
