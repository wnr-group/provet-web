import { Eye, Target } from "lucide-react";
import SiteImage from "@/components/ui/SiteImage";
import clsx from "clsx";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { DrawLine, MaskReveal, SplitText } from "@/components/motion/effects";

// Vision on the left, Mission on the right, as two equal panels side by side
// (stacked on phones). Each is a photo over its statement; on scroll Vision
// slides in from the left and Mission from the right, and the photos are wiped
// into view. Either can be missing; the other then centres on its own.

// The photo for each panel, from the animals Provet serves: Vision is healthy
// cattle at pasture, Mission the poultry farms it supports every day.
const IMAGES = {
  vision: { src: "https://images.unsplash.com/photo-1549488235-42996ae3b650?auto=format&fit=crop&w=1000&h=700&q=80", alt: "Cattle grazing on a green pasture" },
  mission: { src: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1000&h=700&q=80", alt: "A healthy hen on a poultry farm" },
};

export default function VisionMission({ vision, mission }) {
  const items = [
    vision && { key: "vision", label: "Our Vision", text: vision, icon: Eye, from: "left" },
    mission && { key: "mission", label: "Our Mission", text: mission, icon: Target, from: "right" },
  ].filter(Boolean);
  if (!items.length) return null;
  const pair = items.length === 2;

  return (
    <section className="bg-brand-50/60 py-10 sm:py-14">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SplitText as="h2" text="Vision & Mission" className="block font-display text-2xl font-extrabold tracking-tight text-brand-800 sm:text-3xl" />
          <DrawLine className="mx-auto mt-4 block h-1 w-12 rounded-full bg-accent-500" delay={0.2} />
        </Reveal>

        <RevealGroup stagger={0.14} className={clsx("mx-auto mt-8 grid gap-5", pair ? "md:grid-cols-2 lg:gap-8" : "max-w-2xl")}>
          {items.map((item) => (
            <RevealItem key={item.key} direction={pair ? item.from : "up"} distance={48} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl sm:flex-row sm:items-stretch border border-brand-100 bg-white p-3 shadow-md shadow-brand-800/5 transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-800/10">
                <div className="relative h-40 overflow-hidden rounded-xl sm:h-auto sm:min-h-44 sm:w-2/5 sm:shrink-0">
                  <MaskReveal direction={item.from} wrapperClassName="absolute inset-0" className="h-full w-full">
                    <SiteImage
                      src={IMAGES[item.key].src}
                      alt={IMAGES[item.key].alt}
                      sizes="(min-width: 768px) 240px, 100vw"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </MaskReveal>
                </div>
                <div className="flex flex-1 flex-col justify-center px-2 pb-2 pt-4 sm:px-5 sm:py-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                    <item.icon size={16} />
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold text-brand-800">{item.label}</h3>
                  <DrawLine className="mt-3 block h-0.5 w-12 rounded-full bg-accent-500" origin="left" delay={0.2} />
                  <p className="mt-3 text-sm leading-relaxed text-ink/80">{item.text}</p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
