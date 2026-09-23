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
    <section className="border-b border-brand-100 bg-white">
      {/* A thin trust strip, so its motion is the shortest on the page: a
          6px horizontal deal-in, no vertical travel. It sits directly under
          the hero and must not compete with it. */}
      <RevealGroup className="container-page grid grid-cols-2 gap-6 py-8 sm:py-10 md:grid-cols-4" stagger={0.06}>
        {features.map(({ icon: Icon, title, desc }) => (
          <RevealItem
            key={title}
            className="group flex items-center gap-3"
            direction="left"
            distance={14}
            duration={0.4}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700 transition duration-300 group-hover:scale-105 group-hover:bg-accent-200">
              <Icon size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="text-xs text-ink-soft">{desc}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
