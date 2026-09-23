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
    <section className="bg-brand-800 py-16 text-white sm:py-20">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        {/* Image-and-text identity: the photo is *uncovered* by a clip-path
            travelling up while the picture inside settles back from an
            overscale, and the copy arrives from the other side a beat later.
            The two halves are deliberately out of sync - moving together reads
            as one block sliding, which is what every other band already does. */}
        <div className="relative max-w-md">
          <MaskReveal
            direction="up"
            className="aspect-square overflow-hidden rounded-3xl border border-white/10"
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
            <div className="rounded-2xl bg-accent-400 p-5 text-brand-900 shadow-lift">
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
            <h2 className="mt-3 max-w-lg font-display text-2xl font-bold sm:text-3xl">
              {section?.title || "Science-led animal healthcare, delivered reliably"}
            </h2>
          </Reveal>

          {/* The checklist ticks in one after another, so the list reads as
              points being counted off rather than a paragraph appearing. */}
          <RevealGroup as="ul" className="mt-7 space-y-4" stagger={0.09} delay={0.3}>
            {points.map((point) => (
              <RevealItem key={point} as="li" direction="left" distance={20} className="flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent-400" />
                <span className="text-brand-100">{point}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
