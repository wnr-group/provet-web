import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CategoryCard from "@/components/ui/CategoryCard";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export default function CategoryGrid({ categories }) {
  if (!categories?.length) return null;

  return (
    <section className="bg-mist-50/60 py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <SectionHeading
              eyebrow="Browse"
              title="Shop by Category"
              description="Find the right medicine faster, organized the way your clinic thinks."
            />
          </Reveal>
          <Link href="/products" className="btn-outline hidden sm:inline-flex">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <RevealGroup className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map((c) => (
            <RevealItem key={c.id}>
              <CategoryCard category={c} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
