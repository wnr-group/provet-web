import { BookOpen, Fish, Feather } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { Tilt, Parallax, DrawLine, SplitText } from "@/components/motion/effects";
import Counter from "@/components/motion/Counter";

const MAIN_IMAGE =
  "https://images.unsplash.com/photo-1630090374791-c9eb7bab3935?auto=format&fit=crop&w=1100&h=900&q=80";
const INSET_IMAGE =
  "https://images.unsplash.com/photo-1766744489655-328ec3d4f417?auto=format&fit=crop&w=520&h=520&q=80";

// The About page's "Our Story": an editorial split, a layered picture on one
// side and the story set as a lead paragraph on the other.
//
// The picture is a small 3D scene rather than an image in a card: a gradient
// plate set back, the main photo, an aquaculture inset overlapping its corner
// and a "founded" tag floating in front, each at its own depth, so the whole
// composition leans toward the pointer (Tilt) and the layers slide against one
// another. On hover the photos zoom slowly, the overlay deepens and a caption
// rises; while scrolling the main photo drifts inside its frame (Parallax).
//
// Scrolling adds depth: the main photo and the aquaculture inset drift in
// opposite directions, so the layers separate as the section passes; the
// heading uncovers word by word and the figures count up once seen.
//
// Tilt and Parallax switch themselves off on touch screens and under
// prefers-reduced-motion; the CSS hover movement is `motion-safe:` only, with
// the global reduced-motion rule in globals.css as the backstop.
export default function OurStory({ story }) {
  if (!story?.title && !story?.body) return null;

  // The first sentence leads, larger; the rest follows as body copy.
  const body = String(story.body || "").trim();
  const split = body.match(/^(.+?[.!?])\s+([\s\S]+)$/);
  const lead = split ? split[1] : body;
  const rest = split ? split[2] : "";

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(72,62,168,0.10),transparent_65%)]"
      />
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <Reveal direction="right">
          <Tilt max={6} lift={1.02} shadow className="mx-auto w-full max-w-xl">
            <figure className="group relative pb-10 pr-8 [transform-style:preserve-3d] sm:pb-12 sm:pr-14">
              {/* Plate set back behind the photo. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bottom-10 right-8 translate-x-5 translate-y-5 rounded-[2rem] bg-gradient-to-br from-brand-500 via-brand-600 to-accent-500 opacity-90 [transform:translateZ(-40px)] sm:bottom-12 sm:right-14 sm:translate-x-7 sm:translate-y-7"
              />
              <div
                aria-hidden="true"
                className="bg-dots absolute -left-6 -top-6 h-32 w-32 text-brand-300/60 [transform:translateZ(-20px)]"
              />

              {/* Main photo */}
              <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-mist-100 shadow-card ring-1 ring-black/5">
                <Parallax distance={18} className="absolute -inset-y-[6%] inset-x-0">
                  {/* eslint-disable-next-line @next/next/no-img-element -- fixed decorative photo */}
                  <img
                    src={MAIN_IMAGE}
                    alt="White broiler hens in a commercial poultry house"
                    loading="lazy"
                    className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-[1400ms] motion-safe:ease-out motion-safe:group-hover:scale-[1.07]"
                  />
                </Parallax>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-brand-900/65 via-brand-900/10 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-100"
                />
                <figcaption className="absolute bottom-0 left-0 flex max-w-[58%] flex-wrap items-center gap-x-2 gap-y-1 p-5 text-sm font-semibold text-white motion-safe:translate-y-2 motion-safe:opacity-80 motion-safe:transition motion-safe:duration-500 motion-safe:group-hover:translate-y-0 motion-safe:group-hover:opacity-100 sm:p-6">
                  <Feather size={15} className="text-accent-300" /> Poultry
                  <span className="text-white/40">·</span>
                  <Fish size={15} className="text-accent-300" /> Aquaculture
                </figcaption>
              </div>

              {/* Aquaculture inset, floating in front of the corner. */}
              <div className="absolute bottom-0 right-0 w-[40%] [transform:translateZ(45px)]">
                <Parallax distance={-22}>
                  <div className="aspect-square overflow-hidden rounded-3xl bg-mist-100 shadow-[0_24px_40px_-18px_rgba(21,18,48,0.55)] ring-[6px] ring-white motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:-translate-x-2 motion-safe:group-hover:-translate-y-2">
                    {/* eslint-disable-next-line @next/next/no-img-element -- fixed decorative photo */}
                    <img
                      src={INSET_IMAGE}
                      alt="Circular fish-farm pens seen from above"
                      loading="lazy"
                      className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-[1400ms] motion-safe:ease-out motion-safe:group-hover:scale-110"
                    />
                  </div>
                </Parallax>
              </div>

              {/* Founded tag, frontmost. */}
              <div className="absolute left-1 top-6 rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ring-brand-100 [transform:translateZ(70px)] motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:-translate-y-1 sm:-left-6 sm:top-8">
                <p className="font-display text-2xl font-extrabold leading-none text-brand-700">2009</p>
                <p className="mt-1 text-xs font-medium text-ink-soft">Year founded</p>
              </div>
            </figure>
          </Tilt>
        </Reveal>

        <Reveal direction="left" delay={0.1}>
          <span className="badge bg-accent-100 text-accent-700">
            <BookOpen size={14} /> Our Story
          </span>
          <SplitText
            as="h2"
            text={story.title || "Our Story"}
            delay={0.1}
            className="mt-4 block font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          />
          <DrawLine className="mt-5 block h-1 w-16 rounded-full bg-accent-400" origin="left" delay={0.2} />
          {lead && <p className="mt-6 text-lg font-medium leading-relaxed text-ink sm:text-xl">{lead}</p>}
          {rest && <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-soft">{rest}</p>}

          <dl className="mt-8 grid max-w-md grid-cols-2 gap-4 border-t border-brand-100 pt-6">
            <div>
              <dt className="sr-only">Years in animal health</dt>
              <dd className="font-display text-3xl font-extrabold tabular-nums text-brand-700"><Counter value="15+" /></dd>
              <dd className="mt-1 text-xs font-medium text-ink-soft">Years in animal health</dd>
            </div>
            <div>
              <dt className="sr-only">Specialist ranges</dt>
              <dd className="font-display text-3xl font-extrabold tabular-nums text-brand-700"><Counter value="2" duration={0.9} /></dd>
              <dd className="mt-1 text-xs font-medium text-ink-soft">Ranges: Avinova poultry &amp; Blunova aqua</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
