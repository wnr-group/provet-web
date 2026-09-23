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
        {/* Products identity: cards deal in from the right, one after another,
            like a row being laid out. Categories above grow in place and stats
            below lift - the three grids on this page each move differently on
            purpose. Hover (lift + image zoom) lives on ProductCard itself. */}
        <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {products.slice(0, 4).map((p) => (
            <RevealItem key={p.id} className="h-full" direction="left" distance={32} duration={0.55}>
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
