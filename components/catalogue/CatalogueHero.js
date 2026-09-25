import Reveal from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/effects";

// The catalogue's banner: a compact dark navy band. Copy on the left; on the
// right, instead of a stock photo, three of Provet's own product images
// fanned out in 3D - the middle one forward, the outer two turned and set
// back - which tilt with the pointer and spread a little on hover.
//
// The fan is hidden below `md`: on a phone it would push the catalogue down
// for decoration.
export default function CatalogueHero({ title, description, breadcrumbs, count, products = [], children }) {
  const fan = products.filter((p) => p.images?.[0]).slice(0, 3);
  // Middle, left, right - the first product takes the front position.
  const slots = [
    { className: "z-20 [transform:translateZ(70px)]", img: fan[0] },
    {
      className:
        "z-10 [transform:translateX(-62%)_translateZ(-30px)_rotateY(28deg)_rotate(-7deg)] group-hover:[transform:translateX(-80%)_translateZ(-20px)_rotateY(24deg)_rotate(-10deg)]",
      img: fan[1],
    },
    {
      className:
        "z-10 [transform:translateX(62%)_translateZ(-30px)_rotateY(-28deg)_rotate(7deg)] group-hover:[transform:translateX(80%)_translateZ(-20px)_rotateY(-24deg)_rotate(10deg)]",
      img: fan[2],
    },
  ].filter((s) => s.img);

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

      <div className="container-page grid items-center gap-8 py-10 sm:py-12 md:grid-cols-[1.2fr_0.8fr]">
        <Reveal mode="mount" distance={14}>
          {breadcrumbs}
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <span aria-hidden="true" className="mt-4 block h-1 w-12 rounded-full bg-accent-400" />
          {description && <p className="mt-4 max-w-xl leading-relaxed text-brand-100">{description}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {children}
            {typeof count === "number" && (
              <span className="inline-flex items-baseline gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs text-brand-100 ring-1 ring-white/15">
                <span className="font-display text-sm font-extrabold text-white">{count}</span>
                {count === 1 ? "product" : "products"}
              </span>
            )}
          </div>
        </Reveal>

        {slots.length > 0 && (
          <Reveal mode="mount" delay={0.15} distance={20} className="hidden justify-center md:flex">
            <Tilt max={14} lift={1.04} className="group">
              {/* Sways on its own (idle 3D), tilts further under the pointer. */}
              <div className="animate-sway3d">
              <div className="relative flex h-52 w-44 items-center justify-center [transform-style:preserve-3d] lg:h-56 lg:w-48">
                <span
                  aria-hidden="true"
                  className="absolute -bottom-2 left-1/2 h-6 w-[160%] -translate-x-1/2 rounded-full bg-black/40 blur-xl"
                />
                {slots.map(({ className, img }) => (
                  <div
                    key={img.id}
                    className={`absolute inset-0 rounded-2xl bg-white p-2.5 shadow-[0_24px_40px_-16px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out ${className}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- uploaded/external URLs */}
                    <img src={img.images[0]} alt="" className="h-full w-full rounded-xl object-contain" />
                  </div>
                ))}
              </div>
              </div>
            </Tilt>
          </Reveal>
        )}
      </div>
    </section>
  );
}
