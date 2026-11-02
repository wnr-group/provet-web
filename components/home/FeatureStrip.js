"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Truck, ShieldCheck, FlaskConical, HeartPulse, ChevronDown, ArrowRight, ExternalLink } from "lucide-react";
import clsx from "clsx";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { useMotionEnv } from "@/components/motion/MotionProvider";
import { detailFor, isExternalLink } from "@/lib/featureDetails";

// The icons, by position - the points themselves are the admin's.
const ICONS = [Truck, ShieldCheck, FlaskConical, HeartPulse];

const DEFAULT_ITEMS = [
  { heading: "Reliable Supply", text: "Consistent stock & timely delivery" },
  { heading: "Certified Quality", text: "GMP-compliant manufacturing" },
  { heading: "Research Backed", text: "Formulated with veterinary experts" },
  { heading: "Animal Wellness", text: "Focused on better health outcomes" },
];

// The trust strip under the hero: the points laid flat on a pale band, not
// boxed in cards - a line icon over a soft disc, the point, a short magenta
// rule and a line of description, with hairline dividers between the
// columns. In the theme's own colours (brand navy, accent magenta).
//
// `items` ([{ heading, text }]) come from the "feature-strip" block in Admin >
// Website Content > Homepage (lib/homeContent.js); up to four show, one
// column each on large screens. A point that has `details` (the same block's
// config, matched by heading - lib/featureDetails.js) becomes a button that
// opens them in a panel under the strip: one open at a time, and a second
// click closes it. A point with none stays plain text.
export default function FeatureStrip({ items = DEFAULT_ITEMS, details = [] }) {
  const [openIndex, setOpenIndex] = useState(null);
  const panelId = useId();
  const { reduced } = useMotionEnv();

  const features = items.slice(0, 4).map((item, i) => ({
    icon: ICONS[i % ICONS.length],
    title: item.heading,
    desc: item.text,
    detail: detailFor(details, item.heading),
  }));
  if (!features.length) return null;
  const open = openIndex === null ? null : features[openIndex];

  return (
    <section className="border-b border-brand-100/70 bg-mist-50">
      <div className="container-page py-10 sm:py-12">
        {/* A short, quiet deal-in: the strip sits directly under the hero and
            must not compete with it.

            Equal spacing: every column has the same padding on both sides
            and the dividers sit between them, so all four have the same
            width of content and the same gap either side of each divider.
            The grid is pulled out by that padding (-mx) so the first and last
            columns still line up with the page edges.

            Phones: a compact two-by-two grid rather than four tall rows. */}
        <RevealGroup
          className="grid grid-cols-2 gap-x-5 gap-y-8 sm:-mx-6 sm:gap-x-0 sm:gap-y-10 lg:-mx-8 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:gap-0 lg:divide-x lg:divide-brand-100"
          style={{ "--cols": features.length }}
          stagger={0.08}
        >
          {features.map(({ icon: Icon, title, desc, detail }, i) => {
            const isOpen = openIndex === i;
            const content = (
              <>
                {/* The mark: a soft magenta-to-lavender disc set up and to the
                    left, the icon over it. The disc grows a touch on hover. */}
                <span aria-hidden="true" className="relative block h-12 w-14">
                  <span
                    className="absolute left-0 top-1.5 h-10 w-10 rounded-full transition-transform duration-500 ease-out group-hover:scale-110 motion-safe:animate-float"
                    style={{
                      background: "radial-gradient(circle at 35% 35%, var(--color-accent-50), var(--color-brand-100) 75%)",
                      animationDelay: `${i * 0.7}s`,
                    }}
                  />
                  <Icon size={34} strokeWidth={1.5} absoluteStrokeWidth className="absolute left-3 top-0 text-brand-700" />
                </span>
                <h3 className="mt-3 font-display text-base font-semibold leading-snug sm:mt-4 sm:text-lg tracking-tight text-brand-800">{title}</h3>
                <span
                  aria-hidden="true"
                  className={clsx(
                    "mt-2.5 block h-0.5 rounded-full bg-accent-400 transition-all duration-300",
                    isOpen ? "w-14" : "w-8 group-hover:w-12"
                  )}
                />
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{desc}</p>
                {detail && (
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent-600">
                    {isOpen ? "Close" : "Learn more"}
                    <ChevronDown size={14} aria-hidden="true" className={clsx("transition-transform duration-300", isOpen && "rotate-180")} />
                  </span>
                )}
              </>
            );

            return (
              <RevealItem key={title} className="group sm:px-6 lg:px-8" distance={14} duration={0.5}>
                {detail ? (
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="block w-full cursor-pointer rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-500"
                  >
                    {content}
                  </button>
                ) : (
                  content
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>

        <AnimatePresence initial={false}>
          {open?.detail && (
            <motion.div
              key={openIndex}
              id={panelId}
              role="region"
              aria-label={open.title}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <DetailPanel title={open.title} detail={open.detail} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// What a point opens to: its heading, the paragraphs and bullets, and its
// links down the side. Links to another site open in a new tab.
function DetailPanel({ title, detail }) {
  return (
    <div className="mt-8 grid gap-8 rounded-3xl bg-white p-6 ring-1 ring-brand-100 sm:p-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-8">
        <h4 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">{title}</h4>
        <span aria-hidden="true" className="mt-3 block h-1 w-10 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
        <div className="mt-5 space-y-4 leading-relaxed text-ink-soft">
          {detail.blocks.map((block, i) =>
            block.type === "ul" ? (
              <ul key={i} className="space-y-2.5">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p key={i}>{block.text}</p>
            )
          )}
        </div>
      </div>

      {detail.links.length > 0 && (
        <ul className="flex flex-col gap-3 lg:col-span-4 lg:justify-center">
          {detail.links.map((link, i) => {
            const external = isExternalLink(link.url);
            const className = clsx("text-sm", i === 0 ? "btn-primary" : "btn-outline", "justify-between text-left");
            return (
              <li key={link.url}>
                {external ? (
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className={clsx(className, "w-full")}>
                    <span>{link.label}</span> <ExternalLink size={15} aria-hidden="true" className="shrink-0" />
                  </a>
                ) : (
                  <Link href={link.url} className={clsx(className, "w-full")}>
                    <span>{link.label}</span> <ArrowRight size={15} aria-hidden="true" className="shrink-0" />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
