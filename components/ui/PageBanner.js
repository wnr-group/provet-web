import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/effects";

// The dark banner for the inner pages (about, contact, search and the
// admin-built menu pages) - the same family as the catalogue's banner.
//
// Copy on the left. On the right, the page photo as a 3D stack: a gradient
// plate set back behind it, the photo angled toward the copy, a stat card and
// the Provet mark floating in front at different depths. The stack sways on
// its own (idle 3D) and tilts further under the pointer, so the layers visibly
// separate. Hidden below `md`, where it would only push the page down.
export default function PageBanner({ eyebrow, title, description, image, imageAlt = "", chip, breadcrumbs, children }) {
  const crumbs =
    breadcrumbs ||
    (eyebrow && (
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-brand-200">
        <Link href="/" className="transition-colors hover:text-white">
          Home
        </Link>
        <ChevronRight size={12} aria-hidden="true" />
        <span className="text-white">{eyebrow}</span>
      </nav>
    ));

  return (
    <section className="relative isolate overflow-hidden bg-banner text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-40 -z-10 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(229,9,127,0.2),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="bg-dots pointer-events-none absolute inset-0 -z-10 text-white/[0.05] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_60%)]"
      />

      <div className={`container-page grid items-center gap-8 py-10 sm:py-12 ${image ? "md:grid-cols-[1.2fr_0.8fr]" : ""}`}>
        <Reveal mode="mount" distance={14}>
          {crumbs}
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <span aria-hidden="true" className="mt-4 block h-1 w-12 rounded-full bg-accent-400" />
          {description && <p className="mt-4 max-w-xl leading-relaxed text-brand-100">{description}</p>}
          {children && <div className="mt-6 flex flex-wrap items-center gap-3">{children}</div>}
        </Reveal>

        {image && (
          <Reveal mode="mount" delay={0.15} distance={20} className="hidden justify-center md:flex">
            <Tilt max={14} lift={1.04}>
              <div className="animate-sway3d">
                <div className="relative h-48 w-64 [transform-style:preserve-3d] lg:h-52 lg:w-72">
                  {/* Plate, set back */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-500 to-brand-500 opacity-80 [transform:translateZ(-50px)_translate(22px,18px)_rotate(5deg)]"
                  />
                  {/* Photo */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl shadow-[0_30px_50px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/20 [transform:rotateY(-10deg)]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded or fixed photo, not a fixed set of remote hosts */}
                    <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
                  </div>
                  {/* Floating stat card */}
                  {chip && (
                    <div className="absolute -bottom-5 -left-8 rounded-2xl bg-white px-4 py-3 text-ink shadow-[0_20px_30px_-12px_rgba(0,0,0,0.5)] [transform:translateZ(70px)]">
                      <p className="font-display text-xl font-extrabold leading-none text-brand-700">{chip.value}</p>
                      <p className="mt-1 text-xs font-medium text-ink-soft">{chip.label}</p>
                    </div>
                  )}
                  {/* Floating brand mark */}
                  <div
                    aria-hidden="true"
                    className="absolute -right-5 -top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_16px_24px_-10px_rgba(0,0,0,0.5)] [transform:translateZ(100px)]"
                  >
                    <Image src="/logo-mark.png" alt="" width={28} height={28} className="h-7 w-7" />
                  </div>
                </div>
              </div>
            </Tilt>
          </Reveal>
        )}
      </div>
    </section>
  );
}
