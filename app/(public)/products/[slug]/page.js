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
import { ScrollTilt } from "@/components/motion/effects";

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
  const related = await getRelatedProducts({
    categoryId: product.category?.id,
    excludeId: product.id,
    limit: 8,
  });

  return (
    <div className="bg-mist-50/40">
      {/* ---- Banner -----------------------------------------------------
          Dark navy, matching the catalogue. The product stage (gallery) sits
          on the right and hangs a little below the band into the page, so
          the product reads as lifted off the banner rather than boxed in it.
          The band's decoration is clipped in its own layer - the section
          itself can't clip, or the overhang would be cut off. */}
      <section className="relative isolate text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-banner" />
          <div className="absolute -left-32 -top-40 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(229,9,127,0.2),transparent_65%)]" />
          <div className="bg-dots absolute inset-0 text-white/[0.05] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_60%)]" />
        </div>

        <div className="container-page grid items-center gap-8 pb-10 pt-8 md:grid-cols-[1.15fr_0.85fr] md:gap-12 md:pb-0">
          <Reveal mode="mount" distance={14} className="md:pb-14">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-brand-200">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">Home</Link>
                </li>
                <ChevronRight size={12} aria-hidden="true" className="shrink-0" />
                <li>
                  <Link href="/products" className="transition-colors hover:text-white">Products</Link>
                </li>
                {product.category && (
                  <>
                    <ChevronRight size={12} aria-hidden="true" className="shrink-0" />
                    <li>
                      <Link
                        href={`/products?category=${product.category.slug}`}
                        className="transition-colors hover:text-white"
                      >
                        {product.category.name}
                      </Link>
                    </li>
                  </>
                )}
                <ChevronRight size={12} aria-hidden="true" className="shrink-0" />
                <li aria-current="page" className="text-white">{product.name}</li>
              </ol>
            </nav>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {product.category?.name && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-accent-200 ring-1 ring-white/15 transition hover:bg-white/15"
                >
                  {product.category.name}
                </Link>
              )}
              {product.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-white">
                  <Sparkles size={12} /> Featured
                </span>
              )}
            </div>

            <h1 className="mt-4 break-words font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <span aria-hidden="true" className="mt-4 block h-1 w-12 rounded-full bg-accent-400" />
            {product.shortDescription && (
              <p className="mt-4 max-w-xl leading-relaxed text-brand-100">{product.shortDescription}</p>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="btn-gradient w-full sm:w-auto"
              >
                <Mail size={16} /> Enquire About This Product
              </Link>
              <Link
                href="/contact"
                className="btn w-full bg-white/10 text-white ring-1 ring-white/25 transition hover:bg-white/20 sm:w-auto"
              >
                <Phone size={16} /> Talk to Our Team
              </Link>
            </div>
          </Reveal>

          {/* The stage overhangs the band's bottom edge by 3rem on desktop. */}
          <Reveal mode="mount" delay={0.1} distance={24} className="mx-auto w-full max-w-sm md:-mb-12 md:py-10">
            <ProductGallery images={images} name={product.name} />
          </Reveal>
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

        <Reveal delay={0.08} distance={16} className="space-y-4 lg:sticky lg:top-24">
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
                  {product.category?.name && (
                    <p className="mt-1 text-sm text-ink-soft">
                      More from{" "}
                      <Link
                        href={`/products?category=${product.category.slug}`}
                        className="font-semibold text-brand-600 link-underline"
                      >
                        {product.category.name}
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
