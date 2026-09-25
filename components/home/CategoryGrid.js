import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CategoryCard from "@/components/ui/CategoryCard";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export default function CategoryGrid({ categories }) {
  if (!categories?.length) return null;

  return (
    // Solid mist-50 (not a translucent tint) so it continues the lower half of
    // the feature strip's background seamlessly.
    <section className="bg-mist-50 pb-16 pt-14 sm:pb-20 sm:pt-16">
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
        {/* Categories identity: a grid that scales up into place rather than
            sliding. The tiles are small and there are six of them, so a
            vertical slide turns into a ripple of movement; growing from 92%
            with a tight stagger reads as the grid settling as a unit, which is
            also what tells the eye these are peers of one another. Products
            below use travel instead, so the two grids never read the same. */}
        <RevealGroup className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" stagger={0.05}>
          {categories.slice(0, 6).map((c) => (
            <RevealItem key={c.id} className="h-full" direction="none" scale={0.92} duration={0.45}>
              <CategoryCard category={c} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
