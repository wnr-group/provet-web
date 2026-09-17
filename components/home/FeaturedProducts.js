import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export default function FeaturedProducts({ products }) {
  if (!products?.length) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <SectionHeading
              eyebrow="Popular"
              title="Featured Products"
              description="A snapshot of the medicines veterinarians trust most."
            />
          </Reveal>
          <Link href="/products" className="btn-outline hidden sm:inline-flex">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <RevealItem key={p.id}>
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
