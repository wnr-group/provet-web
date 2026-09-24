import { CheckCircle2 } from "lucide-react";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import Counter from "@/components/motion/Counter";
import { MaskReveal, Parallax } from "@/components/motion/effects";

const DEFAULT_POINTS = [
  "GMP-certified manufacturing & strict quality control",
  "Formulated with practicing veterinarians and researchers",
  "Reliable cold-chain logistics for sensitive biologicals",
  "Dedicated technical support for clinics and distributors",
];

export default function WhyUs({ section }) {
  const points = section?.body ? section.body.split("\n").filter(Boolean) : DEFAULT_POINTS;

  return (
    <section className="relative isolate overflow-hidden bg-brand-800 py-16 text-white sm:py-24">
      {/* Texture and light for the one dark band mid-page: a faint dot grid
          fading out toward the centre, and a magenta glow behind the copy
          side. Both static - the motion here belongs to the photo and list. */}
      <div
        aria-hidden="true"
        className="bg-dots pointer-events-none absolute inset-0 -z-10 text-white/[0.07] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 -z-10 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(229,9,127,0.22),transparent_65%)]"
      />
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image-and-text identity: the photo is *uncovered* by a clip-path
            travelling up while the picture inside settles back from an
            overscale, and the copy arrives from the other side a beat later.
            The two halves are deliberately out of sync - moving together reads
            as one block sliding, which is what every other band already does. */}
        <div className="relative max-w-md">
          <MaskReveal
            direction="up"
            className="aspect-square overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]"
          >
            <Parallax distance={18} className="h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1770836037793-95bdbf190f71?auto=format&fit=crop&w=800&h=800&q=80"
                alt="Veterinarian warmly examining a dog during a clinic visit"
                className="h-full w-full scale-110 object-cover"
              />
            </Parallax>
          </MaskReveal>

          {/* The stat card deliberately overhangs the photo's bottom-right
              corner, so it has to sit OUTSIDE MaskReveal: a clip-path clips
              every descendant, wherever it is positioned, so nesting it inside
              the mask sliced the card off at the frame's edge. */}
          <Reveal
            direction="up"
            delay={0.5}
            distance={16}
            className="absolute -bottom-6 -right-4 hidden max-w-[220px] sm:block"
          >
            {/* Drifts gently once it has landed - a slow CSS loop on the inner
                card, so it never fights the entrance transform on Reveal. */}
            <div className="animate-float rounded-2xl bg-accent-400 p-5 text-brand-900 shadow-lift ring-4 ring-brand-800">

              <p className="font-display text-3xl font-extrabold">
                <Counter value="98%" />
              </p>
              <p className="text-sm font-medium">Client satisfaction across partner clinics</p>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal direction="left" delay={0.18} distance={40}>
            <span className="badge bg-white/10 text-accent-200">Why Provet</span>
            <h2 className="mt-3 max-w-lg font-display text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-[2.125rem]">
              {section?.title || "Science-led animal healthcare, delivered reliably"}
            </h2>
            <span aria-hidden="true" className="mt-4 block h-1 w-12 rounded-full bg-accent-400" />
          </Reveal>

          {/* The checklist ticks in one after another, so the list reads as
              points being counted off rather than a paragraph appearing. Each
              point is a glass row so the list has shape against the dark band. */}
          <RevealGroup as="ul" className="mt-8 space-y-3" stagger={0.09} delay={0.3}>
            {points.map((point) => (
              <RevealItem
                key={point}
                as="li"
                direction="left"
                distance={20}
                className="group flex items-start gap-3 rounded-2xl bg-white/[0.04] px-4 py-3.5 ring-1 ring-white/10 transition duration-300 hover:bg-white/[0.08] hover:ring-accent-400/40"
              >
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-accent-400 transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-brand-100">{point}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
