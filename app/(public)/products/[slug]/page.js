import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  PackageCheck,
  FlaskConical,
  Stethoscope,
  ListChecks,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import ProductGallery from "@/components/products/ProductGallery";
import ProductSpecs from "@/components/products/ProductSpecs";
import ProductCard from "@/components/ui/ProductCard";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1664216294580-079bc527ae49?auto=format&fit=crop&w=800&h=600&q=80";

// The long-form fields, in the order a vet reads them. Declared as data so the
// page can ask how many actually have copy before deciding how to lay them
// out - a product with one populated field should not render a lopsided
// two-column grid with a hole in it.
const DETAIL_FIELDS = [
  { key: "composition", title: "Composition", icon: FlaskConical },
  { key: "uses", title: "Uses", icon: Stethoscope },
  { key: "dosage", title: "Dosage & Administration", icon: ListChecks },
  { key: "applications", title: "Target Species", icon: PackageCheck },
];

function DetailCard({ icon: Icon, title, children }) {
  return (
    <div className="panel group h-full p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(57,49,133,0.06),0_20px_44px_-16px_rgba(57,49,133,0.28)] sm:p-7">
      <h2 className="flex items-center gap-3 font-display text-base font-semibold text-ink">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 text-accent-600 transition duration-300 group-hover:from-accent-100 group-hover:to-accent-200">
          <Icon size={18} />
        </span>
        {title}
      </h2>
      <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{children}</div>
    </div>
  );
}

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
  const details = DETAIL_FIELDS.filter((field) => product[field.key]);
  const related = await getRelatedProducts({
    categoryId: product.category?.id,
    excludeId: product.id,
  });

  return (
    <div className="bg-white">
      <nav aria-label="Breadcrumb" className="relative z-10">
        <ol className="container-page flex flex-wrap items-center gap-1.5 py-5 text-sm text-ink-soft">
          <li>
            <Link href="/" className="transition hover:text-brand-700">Home</Link>
          </li>
          <ChevronRight size={14} aria-hidden="true" className="shrink-0" />
          <li>
            <Link href="/products" className="transition hover:text-brand-700">Products</Link>
          </li>
          {product.category && (
            <>
              <ChevronRight size={14} aria-hidden="true" className="shrink-0" />
              <li>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="transition hover:text-brand-700"
                >
                  {product.category.name}
                </Link>
              </li>
            </>
          )}
          <ChevronRight size={14} aria-hidden="true" className="shrink-0" />
          <li aria-current="page" className="font-medium text-ink">{product.name}</li>
        </ol>
      </nav>

      {/* Gallery and summary only. The long-form copy used to sit in this
          right-hand column too, which left the gallery's column empty for the
          whole scroll - it now runs full width below. */}
      <div className="relative">
        {/* Brand-tinted wash behind the hero. The page was flat white edge to
            edge, which is what made it read as a generic template. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 bottom-0 -z-10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-mist-50 via-white to-white" />
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-100/50 blur-3xl" />
          <div className="absolute -right-24 top-32 h-80 w-80 rounded-full bg-accent-100/40 blur-3xl" />
        </div>

        <div className="container-page grid gap-10 pb-14 pt-4 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="right" mode="mount">
            <ProductGallery images={images} name={product.name} />
          </Reveal>

          <Reveal direction="left" delay={0.08} mode="mount" className="lg:py-4">
            <div className="flex flex-wrap items-center gap-2">
              {product.category?.name && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="badge bg-white text-accent-700 shadow-soft ring-1 ring-accent-100 transition hover:ring-accent-300"
                >
                  {product.category.name}
                </Link>
              )}
              {product.isFeatured && (
                <span className="badge bg-brand-600 text-white shadow-soft">
                  <ShieldCheck size={13} /> Featured
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
                {product.shortDescription}
              </p>
            )}

            <ProductSpecs product={product} className="mt-8" />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="btn-gradient w-full sm:w-auto"
              >
                <Mail size={16} /> Enquire About This Product
              </Link>
              <Link
                href="/contact"
                className="btn w-full bg-white text-brand-700 shadow-soft ring-1 ring-brand-100 transition hover:ring-brand-300 sm:w-auto"
              >
                <Phone size={16} /> Talk to Our Team
              </Link>
            </div>

            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-ink-soft/80">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-brand-400" />
              For veterinary use only. Dosage and administration should be confirmed by a
              registered veterinary practitioner.
            </p>
          </Reveal>
        </div>
      </div>

      {details.length > 0 && (
        <section className="bg-gradient-to-b from-mist-50/70 to-white py-14 sm:py-20">
          <div className="container-page">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
              Details
            </span>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Product Information
            </h2>
            <RevealGroup
              className={`mt-8 grid gap-5 ${details.length > 1 ? "md:grid-cols-2" : ""}`}
            >
              {details.map((field) => (
                <RevealItem key={field.key} className="h-full">
                  <DetailCard icon={field.icon} title={field.title}>
                    {product[field.key]}
                  </DetailCard>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-14 sm:py-20">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
                  Explore
                </span>
                <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                  Related Products
                </h2>
                {product.category?.name && (
                  <p className="mt-1.5 text-sm text-ink-soft">
                    More from {product.category.name}
                  </p>
                )}
              </div>
              {product.category && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-sm font-semibold text-brand-600 link-underline"
                >
                  View all
                </Link>
              )}
            </div>

            <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <RevealItem key={item.id} className="h-full">
                  <ProductCard product={item} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}
    </div>
  );
}
