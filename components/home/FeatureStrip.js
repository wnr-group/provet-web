import { Truck, BadgeCheck, FlaskConical, HeartPulse } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const features = [
  { icon: Truck, title: "Reliable Supply", desc: "Consistent stock & timely delivery" },
  { icon: BadgeCheck, title: "Certified Quality", desc: "GMP-compliant manufacturing" },
  { icon: FlaskConical, title: "Research Backed", desc: "Formulated with veterinary experts" },
  { icon: HeartPulse, title: "Animal Wellness", desc: "Focused on better health outcomes" },
];

export default function FeatureStrip() {
  return (
    // The strip is a floating panel that overlaps the foot of the hero, which
    // ties the dark banner to the light page below it instead of the two
    // meeting at a hard edge. The section's own background is transparent over
    // the overlap and mist-50 underneath, matching the category band that
    // follows, so the panel sits across the seam.
    <section className="relative z-10 -mt-10 bg-[linear-gradient(to_bottom,transparent_2.5rem,var(--color-mist-50)_2.5rem)] sm:-mt-12 sm:bg-[linear-gradient(to_bottom,transparent_3rem,var(--color-mist-50)_3rem)]">
      <div className="container-page">
        {/* A thin trust strip, so its motion is the shortest on the page: a
            short horizontal deal-in, no vertical travel. It sits directly
            under the hero and must not compete with it. */}
        <RevealGroup className="panel overflow-hidden" stagger={0.06}>
          {/* gap-px over a tinted fill draws hairline dividers between cells
              that work in both the 2x2 and the 1x4 layout. */}
          <div className="grid grid-cols-2 gap-px bg-brand-100/60 md:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <RevealItem
              key={title}
              className="group flex items-center gap-3 bg-white p-4 transition-colors duration-300 hover:bg-mist-50 sm:gap-4 sm:p-6"
              direction="left"
              distance={14}
              duration={0.4}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-100 to-brand-100 text-accent-700 transition duration-300 group-hover:-rotate-6 group-hover:scale-110 sm:h-12 sm:w-12">
                <Icon size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="text-xs leading-snug text-ink-soft">{desc}</p>
              </div>
            </RevealItem>
          ))}
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
