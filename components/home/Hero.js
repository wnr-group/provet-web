"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import Counter from "@/components/motion/Counter";

// Requested at full-bleed width now that the image spans the viewport rather
// than sitting in a ~450px card.
const HERO_FALLBACK = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1920&h=1080&fit=crop";

// The banner is admin-uploaded, so it can be any photo - light, busy, or
// low-contrast. These two layers guarantee the white text stays readable over
// whatever is behind it: a vertical wash on narrow screens (where the text
// sits over the middle of the image) and a left-weighted one from `sm` up
// (where the text occupies the left half and the photo should stay visible on
// the right). Arbitrary values rather than `bg-gradient-to-*` so the
// direction switch is explicit and version-proof.
const OVERLAY_GRADIENT =
  "bg-[linear-gradient(to_bottom,rgba(21,18,48,0.88),rgba(21,18,48,0.72)_55%,rgba(21,18,48,0.82))] " +
  "sm:bg-[linear-gradient(to_right,rgba(21,18,48,0.94),rgba(21,18,48,0.78)_45%,rgba(21,18,48,0.30))]";

const STATS = [
  ["250+", "Products"],
  ["15+", "Years Experience"],
  ["1,200+", "Clinics Served"],
];

export default function Hero({ banners = [] }) {
  const slides = banners.length
    ? banners
    : [
        {
          id: "default",
          title: "Quality Veterinary Medicine You Can Trust",
          subtitle:
            "Antibiotics, vaccines, supplements and therapeutic solutions formulated for better animal health outcomes.",
          image: HERO_FALLBACK,
          ctaText: "Explore Products",
          ctaLink: "/products",
        },
      ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[active];

  return (
    <section className="relative isolate overflow-hidden bg-brand-900">
      {/* Full-bleed banner: the image covers the whole section rather than
          sitting in a card, so it spans the viewport edge to edge. */}
      <AnimatePresence mode="sync">
        <motion.img
          key={slide.id ?? slide.image}
          src={slide.image || HERO_FALLBACK}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className={clsx("pointer-events-none absolute inset-0 -z-10", OVERLAY_GRADIENT)} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(229,9,127,0.22),transparent_55%)]" />

      {/* A fixed height, not min-height: the banners have titles of 30-47
          characters, so with min-height the whole hero (and the image with
          it) grew or shrank as the slides rotated. The content is centred
          inside it and each text block below reserves its maximum number of
          lines, so nothing shifts between slides either. */}
      <div className="container-page relative flex h-[600px] flex-col justify-center pb-20 sm:h-[620px] sm:pb-24 lg:h-[680px]">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="badge bg-white/10 text-accent-200 backdrop-blur-sm"
          >
            <ShieldCheck size={14} /> Trusted by veterinarians nationwide
          </motion.span>

          <AnimatePresence mode="wait">
            <motion.h1
              key={slide.id ?? slide.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              // Three lines reserved (leading-[1.1] x 3), clamped to the
              // same, so a 30-character title and a 47-character one occupy
              // identical space and an over-long one can't stretch the hero.
              className="mt-5 line-clamp-3 min-h-[7.425rem] max-w-xl font-display text-4xl font-extrabold leading-[1.1] text-white sm:min-h-[9.9rem] sm:text-5xl"
            >
              {slide.title}
            </motion.h1>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            // Two lines reserved (leading-relaxed x 2) for the same reason.
            className="mt-5 line-clamp-2 min-h-[3.25rem] max-w-lg leading-relaxed text-brand-100"
          >
            {slide.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href={slide.ctaLink || "/products"} className="btn-accent">
              {slide.ctaText || "Explore Products"} <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
              Talk to Our Team
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6"
          >
            {STATS.map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl font-extrabold text-white">
                  <Counter value={value} />
                </dt>
                <dd className="text-xs text-brand-200">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

      </div>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-8 z-10">
          <div className="container-page flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === active}
                className={clsx(
                  "h-2 rounded-full transition-all",
                  i === active ? "w-6 bg-accent-400" : "w-2 bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
