import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Mail, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import Reveal from "@/components/motion/Reveal";
import ProductGallery from "@/components/products/ProductGallery";
import ProductSpecs from "@/components/products/ProductSpecs";
import CatalogueCard from "@/components/catalogue/CatalogueCard";
import ProductTabs from "@/components/catalogue/ProductTabs";
import ProductRail from "@/components/catalogue/ProductRail";
import { ScrollTilt, Tilt } from "@/components/motion/effects";
import { categoryTheme } from "@/lib/categoryTheme";
import { Enter } from "@/components/sections/entrances";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1664216294580-079bc527ae49?auto=format&fit=crop&w=800&h=600&q=80";

// The long-form fields, in the order a vet reads them. Only the ones with
// copy become tabs.
const DETAIL_FIELDS = [
  { key: "composition", title: "Composition" },
  { key: "uses", title: "Uses" },
  { key: "dosage", title: "Dosage & Administration" },
  { key: "applications", title: "Target Species" },
];

// Rendered on every request: this page is built from admin-edited data, and
// without this Next.js would serve a cached copy in production, so changes
// saved in the admin would not show up on the live site.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.shortDescription || product.name,
  };
}

export default async function ProductDetail({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = product.images?.length ? product.images : [FALLBACK_IMG];
  const details = DETAIL_FIELDS.filter((field) => product[field.key]).map((field) => ({
    ...field,
    value: product[field.key],
  }));
  // Siblings from the same subcategory - the closest match. A product filed
  // directly on a category (none should be) falls back to that category.
  const filedUnder = product.subcategory || product.category;
  const related = await getRelatedProducts({
    categoryId: filedUnder?.id,
    excludeId: product.id,
    limit: 8,
  });

  // The product's range colour (amber for Avinova, ocean for Blunova).
  const tone = categoryTheme(product.category).ui.accent;

  return (
    <div className="bg-mist-50/40">
      {/* ---- Banner -----------------------------------------------------
          Product-focused, in the catalogue's light banner language
          (components/ui/PageBanner.js "product"): the copy on the left, and
          the product itself as the visual - a large white stage lit by a
          soft glow in the range's colour, leaning toward the pointer. The
          stage hangs a little below the band into the page, so the product
          reads as lifted off it. The band's decoration is clipped in its own
          layer - the section itself can't clip, or the overhang would be cut
          off. */}
      <section className="relative isolate border-b border-brand-100">
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-mist-50">
          {/* Blue into pink: a soft brand-blue glow top left, magenta bottom
              left, the range's colour behind the product. */}
          <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(97,87,193,0.16),transparent_65%)]" />
          <div className="absolute -bottom-48 left-1/3 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(229,9,127,0.1),transparent_65%)]" />
          <div
            className="absolute -right-24 top-1/2 h-[42rem] w-[42rem] -translate-y-1/2 rounded-full opacity-[0.16]"
            style={{ backgroundImage: `radial-gradient(circle, ${tone}, transparent 65%)` }}
          />
        </div>

        <div className="container-page grid items-center gap-10 pb-10 pt-10 md:grid-cols-2 md:gap-14 md:pb-0 md:pt-14">
          <Reveal mode="mount" distance={14} className="md:pb-16">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-ink-soft">
                <li>
                  <Link href="/" className="transition-colors hover:text-brand-700">Home</Link>
                </li>
                <ChevronRight size={12} aria-hidden="true" className="shrink-0 opacity-60" />
                <li>
                  <Link href="/products" className="transition-colors hover:text-brand-700">Products</Link>
                </li>
                {[product.category, product.subcategory].filter(Boolean).map((level) => (
                  <Fragment key={level.id}>
                    <ChevronRight size={12} aria-hidden="true" className="shrink-0 opacity-60" />
                    <li>
                      <Link href={`/products?category=${level.slug}`} className="transition-colors hover:text-brand-700">
                        {level.name}
                      </Link>
                    </li>
                  </Fragment>
                ))}
                <ChevronRight size={12} aria-hidden="true" className="shrink-0 opacity-60" />
                <li aria-current="page" className="font-semibold text-ink">{product.name}</li>
              </ol>
            </nav>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {product.category?.name && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1 ring-brand-100 transition hover:ring-brand-300"
                  style={{ color: tone }}
                >
                  {product.category.name}
                </Link>
              )}
              {product.subcategory?.name && (
                <Link
                  href={`/products?category=${product.subcategory.slug}`}
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-soft ring-1 ring-brand-100 transition hover:text-ink hover:ring-brand-300"
                >
                  {product.subcategory.name}
                </Link>
              )}
              {product.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-white">
                  <Sparkles size={12} /> Featured
                </span>
              )}
            </div>

            <h1 className="mt-5 break-words text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-brand-900 sm:text-5xl lg:text-6xl">
              {product.name}
            </h1>
            {product.shortDescription && (
              <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">{product.shortDescription}</p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="btn-accent w-full sm:w-auto"
              >
                <Mail size={16} /> Enquire About This Product
              </Link>
              <Link href="/contact" className="btn-outline w-full bg-white sm:w-auto">
                <Phone size={16} /> Talk to Our Team
              </Link>
            </div>
          </Reveal>

          {/* The stage: a white plate on the band, leaning toward the
              pointer; it overhangs the band's foot by 3rem on desktop. */}
          <Enter preset="depth" delay={0.15} className="mx-auto w-full max-w-md md:-mb-12">
            <Tilt max={6} lift={1.01}>
              <div className="rounded-[2rem] bg-white p-4 shadow-[0_40px_70px_-40px_rgba(21,18,48,0.5)] ring-1 ring-brand-100 sm:p-5">
                <ProductGallery images={images} name={product.name} />
              </div>
            </Tilt>
          </Enter>
        </div>
      </section>

      {/* ---- Information --------------------------------------------------
          The long-form copy in one tabbed card, beside a key-details card and
          the safety note. */}
      <section className="container-page grid items-start gap-6 pb-14 pt-10 md:pt-20 lg:grid-cols-[1fr_22rem] lg:gap-8">
        <Reveal distance={16}>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">Product information</h2>
          <span aria-hidden="true" className="mb-6 mt-3 block h-1 w-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
          {details.length > 0 ? (
            <ScrollTilt amount={10}>
              <ProductTabs fields={details} />
            </ScrollTilt>
          ) : (
            <p className="rounded-3xl bg-white p-6 text-sm text-ink-soft shadow-soft ring-1 ring-brand-100">
              Detailed information for this product is available on request.
            </p>
          )}
        </Reveal>

        {/* The key details slide in from the side while the tabs rise, so the
            information arrives as two columns, not one block. */}
        <Reveal delay={0.12} direction="left" distance={28} className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-brand-100">
            <h2 className="font-display text-base font-bold text-ink">Key details</h2>
            <ProductSpecs product={product} className="mt-4" />
          </div>
          <p className="flex items-start gap-2.5 rounded-2xl bg-brand-50 p-4 text-xs leading-relaxed text-ink-soft ring-1 ring-brand-100">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-500" />
            For veterinary use only. Dosage and administration should be confirmed by a registered
            veterinary practitioner.
          </p>
        </Reveal>
      </section>

      {/* ---- Related: a sideways rail ------------------------------------ */}
      {related.length > 0 && (
        <section className="border-t border-brand-100 bg-white py-12 sm:py-14">
          <ScrollTilt amount={12} className="container-page">
            <ProductRail
              title={
                <div>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">Related products</h2>
                  {filedUnder?.name && (
                    <p className="mt-1 text-sm text-ink-soft">
                      More from{" "}
                      <Link
                        href={`/products?category=${filedUnder.slug}`}
                        className="font-semibold text-brand-600 link-underline"
                      >
                        {filedUnder.name}
                      </Link>
                    </p>
                  )}
                </div>
              }
            >
              {related.map((item) => (
                <div key={item.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23%]">
                  <CatalogueCard product={item} />
                </div>
              ))}
            </ProductRail>
          </ScrollTilt>
        </section>
      )}
    </div>
  );
}
