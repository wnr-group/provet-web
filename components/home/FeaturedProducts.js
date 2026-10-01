import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ScrollTilt } from "@/components/motion/effects";

// `title` / `description` come from the "featured" block in Admin > Website
// Content > Homepage (lib/homeContent.js).
export default function FeaturedProducts({
  products,
  title = "Featured Products",
  description = "A snapshot of the medicines veterinarians trust most.",
}) {
  if (!products?.length) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <SectionHeading animated eyebrow="Popular" title={title} description={description || undefined} />
          </Reveal>
          <Link href="/products" className="btn-outline hidden sm:inline-flex">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        {/* Products identity: cards deal in from the right, one after another,
            like a row being laid out. Categories above grow in place and stats
            below lift - the three grids on this page each move differently on
            purpose. Hover (lift + image zoom) lives on ProductCard itself.

            Only featured products show, so there may be fewer than four:
            each card keeps its quarter-row width and the row is centred,
            rather than one card sitting at the left of an empty row. */}
        {/* Phones: a swipeable row, the next card peeking in from the edge,
            instead of four full-height cards stacked down the page. */}
        {/* The row swings up from a slight backward lean as it scrolls into
            view (off on phones, where it is a swipe row). */}
        <ScrollTilt amount={8}>
        <RevealGroup
          className="-mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:mt-10 sm:flex-wrap sm:justify-center sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
          stagger={0.1}
        >
          {products.slice(0, 4).map((p) => (
            <RevealItem
              key={p.id}
              className="flex w-[78%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]"
              direction="left"
              distance={32}
              duration={0.55}
            >
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </RevealGroup>
        </ScrollTilt>
        {/* The heading's View All button sits beside the title from tablets up. */}
        <Link href="/products" className="btn-outline mt-4 w-full justify-center sm:hidden">
          View All Products <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
