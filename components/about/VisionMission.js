import { Eye, Target } from "lucide-react";
import clsx from "clsx";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { DrawLine, SplitText } from "@/components/motion/effects";

// Vision on the left, Mission on the right, as two equal panels side by side
// (stacked on phones), each an icon over its statement. On scroll Vision slides
// in from the left and Mission from the right. Either can be missing; the other
// then centres on its own.

export default function VisionMission({ vision, mission }) {
  const items = [
    vision && { key: "vision", label: "Our Vision", text: vision, icon: Eye, from: "left", dark: true, eyebrow: "Where we are headed" },
    mission && { key: "mission", label: "Our Mission", text: mission, icon: Target, from: "right", dark: false, eyebrow: "What we do every day" },
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

        <RevealGroup stagger={0.14} className={clsx("mx-auto mt-10 grid gap-5", pair ? "md:grid-cols-2 lg:gap-8" : "max-w-2xl")}>
          {items.map((item) => (
            <RevealItem key={item.key} direction={pair ? item.from : "up"} distance={48} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-lg shadow-brand-800/5 transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-800/10">
                {/* The coloured header carries the icon and name; the statement sits on white beneath it. */}
                <div
                  className={clsx(
                    "relative flex items-center gap-4 overflow-hidden px-7 py-6 text-white sm:px-10",
                    item.dark ? "bg-gradient-to-r from-brand-700 to-brand-500" : "bg-gradient-to-r from-accent-600 to-accent-400"
                  )}
                >
                  <item.icon aria-hidden="true" size={120} strokeWidth={1} className="pointer-events-none absolute -right-4 -top-4 text-white/15 transition-transform duration-700 ease-out group-hover:rotate-12 group-hover:scale-110" />
                  <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <item.icon size={28} strokeWidth={1.6} />
                  </span>
                  <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{item.eyebrow}</p>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{item.label}</h3>
                  </div>
                </div>
                <div className="flex flex-1 p-7 sm:p-10">
                  <p className="text-base leading-relaxed text-ink/80 sm:text-lg">{item.text}</p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
