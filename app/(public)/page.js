import { getActiveBanners, getCategories, getProducts, getContentSections } from "@/lib/data";
import Hero from "@/components/home/Hero";
import FeatureStrip from "@/components/home/FeatureStrip";
import Mission from "@/components/home/Mission";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyUs from "@/components/home/WhyUs";
import Stats from "@/components/home/Stats";
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

export default async function Home() {
  const [banners, categories, { items: products }, content] = await Promise.all([
    getActiveBanners(),
    getCategories(),
    getProducts({ limit: 8, sort: "newest" }),
    getContentSections("home"),
  ]);

  const section = (key) => content.find((s) => s.key === key);
  const featured = products.filter((p) => p.isFeatured).length
    ? products.filter((p) => p.isFeatured)
    : products;

  return (
    <>
      <Hero banners={banners} />
      <FeatureStrip />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featured} />
      <Mission section={section("mission")} />
      <WhyUs section={section("why-us")} />
      <Stats section={section("stats")} />
      <CtaBanner />
    </>
  );
}
