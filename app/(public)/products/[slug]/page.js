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
import { Tilt } from "@/components/motion/effects";
import { categoryTheme } from "@/lib/categoryTheme";
import RangeLogo from "@/components/ui/RangeLogo";

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

  // The product's range colour (amber for Avinova, ocean for Blunova) and
  // its wordmark.
  const rangeTheme = categoryTheme(product.category);
  const tone = rangeTheme.ui.accent;

  return (
    <div className="bg-white">
      {/* ---- Overview ---------------------------------------------------
          Two columns under the breadcrumb: the product image and its key
          details on the left, and on the right the range, name, summary,
          enquiry buttons, product information tabs and the safety note, read
          top to bottom. The related products come after. */}
      <section className="relative isolate">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-mist-50 to-white" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ backgroundImage: `linear-gradient(90deg, ${tone}, transparent)` }} />

        <div className="container-page pb-12 pt-6 sm:pt-8 lg:pb-16">
          <Reveal mode="mount" distance={10}>
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
          </Reveal>

          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-12">
            {/* Left: the product, with its key details under it. */}
            <Reveal mode="mount" delay={0.05} distance={16}>
              <Tilt max={4} lift={1.005}>
                <div className="mx-auto w-full max-w-sm rounded-[2rem] bg-white p-3 lg:max-w-none shadow-[0_30px_60px_-34px_rgba(21,18,48,0.45)] ring-1 ring-brand-100 sm:p-4">
                  <ProductGallery images={images} name={product.name} />
                </div>
              </Tilt>

              {/* Under the image, in a card of the same width. */}
              <div className="mx-auto mt-5 w-full max-w-sm rounded-3xl bg-white p-5 shadow-soft ring-1 ring-brand-100 lg:max-w-none">
                <h2 className="font-display text-base font-bold text-ink">Key details</h2>
                <ProductSpecs product={product} className="mt-4" />
              </div>
            </Reveal>

            {/* Right: the product's details, one block after another. */}
            <Reveal mode="mount" delay={0.1} distance={16} className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {/* The range: its logo where it has one (it links to the range,
                    named by the logo's alt text), otherwise its name. */}
                {product.category?.name && rangeTheme.logo && (
                  <Link
                    href={`/products?category=${product.category.slug}`}
                    className="rounded-full bg-white px-3 py-1.5 ring-1 ring-brand-100 transition hover:ring-brand-300"
                  >
                    <RangeLogo logo={rangeTheme.logo} alt={product.category.name} eager sizes="108px" className="h-5" />
                  </Link>
                )}
                {product.category?.name && !rangeTheme.logo && (
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

              <h1 className="mt-4 break-words text-balance font-display text-3xl font-extrabold leading-tight tracking-tight text-brand-900 sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-soft">{product.shortDescription}</p>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="btn-accent w-full sm:flex-1"
                >
                  <Mail size={16} /> Enquire About This Product
                </Link>
                <Link href="/contact" className="btn-outline w-full bg-white sm:flex-1">
                  <Phone size={16} /> Talk to Our Team
                </Link>
              </div>

              {details.length > 0 && (
                <div className="mt-9">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">Product information</h2>
                  <span aria-hidden="true" className="mb-5 mt-3 block h-1 w-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
                  <ProductTabs fields={details} />
                </div>
              )}

              <p className="mt-6 flex items-start gap-2.5 rounded-2xl bg-brand-50 p-4 text-xs leading-relaxed text-ink-soft ring-1 ring-brand-100">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-500" />
                For veterinary use only. Dosage and administration should be confirmed by a registered
                veterinary practitioner.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Related: a sideways rail ------------------------------------ */}
      {related.length > 0 && (
        <section className="border-t border-brand-100 bg-mist-50/60 py-8 sm:py-10">
          <div className="container-page">
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
          </div>
        </section>
      )}
    </div>
  );
}
