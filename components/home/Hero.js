"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import Counter from "@/components/motion/Counter";

const HERO_FALLBACK = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&h=900&fit=crop";

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
    <section className="relative overflow-hidden bg-brand-700">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(229,9,127,0.22),transparent_55%)]" />
      <div className="container-page relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="badge bg-white/10 text-accent-200"
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
              className="mt-5 max-w-xl font-display text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl"
            >
              {slide.title}
            </motion.h1>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 max-w-lg text-brand-100 leading-relaxed"
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
            <Link href="/contact" className="btn bg-white/10 text-white hover:bg-white/20">
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

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-lift">
            <AnimatePresence mode="sync">
              <motion.img
                key={slide.id ?? slide.image}
                src={slide.image || HERO_FALLBACK}
                alt={slide.title}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
          {slides.length > 1 && (
            <div className="mt-4 flex justify-center gap-2 lg:justify-start">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  aria-label={`Show slide ${i + 1}`}
                  className={clsx(
                    "h-2 rounded-full transition-all",
                    i === active ? "w-6 bg-accent-400" : "w-2 bg-white/30"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
