import { Eye, Target, Compass } from "lucide-react";
import clsx from "clsx";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Tilt, DrawLine, Parallax, ScrollExpand, SplitText } from "@/components/motion/effects";

// Vision and Mission as the page's centrepiece: a dark band of their own,
// each statement in a card with a clear "Our Vision" / "Our Mission" heading,
// set large enough to read as a declaration rather than another paragraph.
//
// The two cards differ on purpose - Vision solid white, Mission frosted glass
// - and Mission sits a step lower on wide screens, so the pair reads as a
// composed spread rather than two identical boxes. Either can be missing;
// the other then centres on its own.
//
// On scroll the band opens out from a rounded, slightly inset panel to full
// width (ScrollExpand), the heading uncovers word by word, and the cards
// drift at different speeds - Mission faster than Vision - with their big
// index numbers floating inside them. All of it is tied to scroll position
// and is off under prefers-reduced-motion (Parallax also on phones).
const DRIFT = { vision: 10, mission: 34 };
export default function VisionMission({ vision, mission }) {
  const items = [
    vision && { key: "vision", heading: "Our Vision", text: vision, icon: Eye, index: "01", tone: "solid" },
    mission && { key: "mission", heading: "Our Mission", text: mission, icon: Target, index: "02", tone: "glass" },
  ].filter(Boolean);
  if (!items.length) return null;

  return (
    <ScrollExpand>
      <section className="relative isolate overflow-hidden bg-banner py-16 text-white sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(229,9,127,0.22),transparent_65%)]"
        />
        <div
          aria-hidden="true"
          className="bg-dots pointer-events-none absolute inset-0 -z-10 text-white/[0.05] [mask-image:radial-gradient(ellipse_at_bottom_left,black,transparent_65%)]"
        />

        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="badge bg-white/10 text-accent-200 ring-1 ring-white/15">
              <Compass size={14} /> What guides us
            </span>
            <SplitText as="h2" text="Vision & Mission" delay={0.1} className="mt-4 block font-display text-3xl font-extrabold tracking-tight sm:text-4xl" />
            <DrawLine className="mx-auto mt-5 block h-1 w-16 rounded-full bg-accent-400" delay={0.2} />
          </Reveal>

          <RevealGroup
            stagger={0.14}
            className={clsx(
              "mx-auto mt-12 grid gap-6 lg:gap-8",
              items.length === 2 ? "max-w-5xl md:grid-cols-2 md:pb-12" : "max-w-2xl"
            )}
          >
            {items.map((item, i) => (
              <RevealItem key={item.key} distance={28} className={clsx("h-full", items.length === 2 && i === 1 && "md:translate-y-12")}>
                <Parallax distance={DRIFT[item.key]} className="h-full">
                  <Tilt max={5} lift={1.02} className="h-full">
                    <article
                      className={clsx(
                        "relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8 sm:p-10",
                        item.tone === "solid"
                          ? "bg-white text-ink shadow-[0_30px_60px_-25px_rgba(0,0,0,0.55)]"
                          : "bg-white/[0.07] text-white ring-1 ring-white/15 backdrop-blur-md"
                      )}
                    >
                      {/* Oversized index, faint, as a typographic anchor. */}
                      <Parallax distance={26} className="pointer-events-none absolute -right-2 -top-6">
                        <span
                          aria-hidden="true"
                          className={clsx(
                            "block select-none font-display text-[7.5rem] font-extrabold leading-none sm:text-[9rem]",
                            item.tone === "solid" ? "text-brand-50" : "text-white/[0.06]"
                          )}
                        >
                          {item.index}
                        </span>
                    </Parallax>

                    <span
                      className={clsx(
                        "relative flex h-12 w-12 items-center justify-center rounded-2xl",
                        item.tone === "solid"
                          ? "bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-[0_12px_20px_-8px_rgba(72,62,168,0.6)]"
                          : "bg-white/10 text-accent-200 ring-1 ring-white/20"
                      )}
                    >
                      <item.icon size={22} />
                    </span>

                    <h3
                      className={clsx(
                        "relative mt-6 font-display text-2xl font-extrabold tracking-tight sm:text-[1.75rem]",
                        item.tone === "solid" ? "text-brand-800" : "text-white"
                      )}
                    >
                      {item.heading}
                    </h3>
                    <span
                      aria-hidden="true"
                      className={clsx("relative mt-3 block h-1 w-10 rounded-full", item.tone === "solid" ? "bg-accent-500" : "bg-accent-300")}
                    />
                    <p
                      className={clsx(
                        "relative mt-5 text-lg font-medium leading-relaxed sm:text-xl",
                        item.tone === "solid" ? "text-ink" : "text-brand-50"
                      )}
                    >
                      {item.text}
                    </p>
                  </article>
                </Tilt>
                </Parallax>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </ScrollExpand>
  );
}
