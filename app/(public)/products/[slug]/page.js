import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, PackageCheck, FlaskConical, Stethoscope, ListChecks, Mail } from "lucide-react";
import { getProductBySlug } from "@/lib/data";
import Reveal from "@/components/motion/Reveal";
import ProductGallery from "@/components/products/ProductGallery";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&h=600&fit=crop";

function Section({ icon: Icon, title, children }) {
  if (!children) return null;
  return (
    <div className="border-t border-brand-100 py-6 first:border-t-0 first:pt-0">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
        <Icon size={18} className="text-accent-600" /> {title}
      </h2>
      <div className="mt-2.5 text-sm leading-relaxed text-ink-soft whitespace-pre-line">{children}</div>
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
  const specs = product.specifications || {};

  return (
    <div className="bg-white">
      <div className="container-page flex items-center gap-1.5 py-5 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-brand-700">Products</Link>
        {product.category && (
          <>
            <ChevronRight size={14} />
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-700">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="font-medium text-ink">{product.name}</span>
      </div>

      <div className="container-page grid gap-10 pb-16 lg:grid-cols-2">
        <Reveal direction="right" mode="mount">
          <ProductGallery images={images} name={product.name} />
        </Reveal>

        <Reveal direction="left" delay={0.08} mode="mount">
          {product.category?.name && (
            <span className="badge bg-accent-100 text-accent-700">{product.category.name}</span>
          )}
          <h1 className="mt-3 font-display text-2xl font-extrabold text-ink sm:text-3xl">{product.name}</h1>
          {product.shortDescription && (
            <p className="mt-3 text-ink-soft leading-relaxed">{product.shortDescription}</p>
          )}

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            {product.sku && <span className="rounded-full bg-mist-100 px-3 py-1.5 text-brand-700">SKU: {product.sku}</span>}
            {product.packSize && (
              <span className="rounded-full bg-mist-100 px-3 py-1.5 text-brand-700">Pack: {product.packSize}</span>
            )}
            {Object.entries(specs).map(([key, value]) => (
              <span key={key} className="rounded-full bg-mist-100 px-3 py-1.5 text-brand-700 capitalize">
                {key}: {String(value)}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="btn-primary">
              <Mail size={16} /> Enquire About This Product
            </Link>
          </div>

          <div className="mt-8">
            <Section icon={FlaskConical} title="Composition">{product.composition}</Section>
            <Section icon={Stethoscope} title="Uses">{product.uses}</Section>
            <Section icon={ListChecks} title="Dosage">{product.dosage}</Section>
            <Section icon={PackageCheck} title="Applications">{product.applications}</Section>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
