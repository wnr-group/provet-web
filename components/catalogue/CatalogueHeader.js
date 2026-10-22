import clsx from "clsx";
import { Crumbs } from "@/components/ui/PageBanner";
import Reveal from "@/components/motion/Reveal";
import SiteImage from "@/components/ui/SiteImage";

// The catalogue's page header: a title and a line of context beside the
// range's own photography, as the animal-health catalogues it is modelled on
// open each species (Zoetis's photo banner over its poultry products).
//
// The copy on the left: the breadcrumb, the range's label as an eyebrow, the
// title, the intro (the category's own description from the admin, or the
// catalogue's), the product count and the brochure button. On the right from
// md: the range's photo (Admin > Categories), or - for the whole catalogue -
// the ranges' photos overlapping. The band takes the range's tint (`tint`,
// lib/categoryTheme.js).
//
// `images` is a list of { src, alt }: one for a range, up to two for the
// catalogue. None leaves the copy full width.
export default function CatalogueHeader({ title, description, eyebrow, crumbs, count, tint, images = [], children }) {
  const photos = images.filter((i) => i?.src).slice(0, 2);

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: tint }}>
      {/* A soft glow in the range's colour behind the photos. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-(--range-ring) opacity-40 blur-3xl"
      />
      <div
        className={clsx(
          "container-page relative grid gap-8 pb-9 pt-7 sm:pb-12 sm:pt-9",
          photos.length && "md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center lg:gap-14"
        )}
      >
        <Reveal mode="mount" distance={10}>
          <Crumbs trail={crumbs} />
          {eyebrow && (
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-(--range-accent)">{eyebrow}</p>
          )}
          <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {title}
          </h1>
          <span aria-hidden="true" className="mt-4 block h-1 w-12 rounded-full bg-(--range-accent)" />
          {description && (
            <p className="mt-4 line-clamp-4 max-w-2xl text-pretty text-sm leading-relaxed text-ink-soft sm:line-clamp-none sm:text-[15px]">
              {description}
            </p>
          )}
          {/* The brochure button is full width on phones by default; here it
              sits beside the count instead. */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 [&>a]:w-auto [&>button]:w-auto">
            {typeof count === "number" && (
              <p className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold tabular-nums tracking-tight text-ink">{count}</span>
                <span className="text-sm text-ink-soft">{count === 1 ? "product" : "products"}</span>
              </p>
            )}
            {children}
          </div>
        </Reveal>

        {photos.length > 0 && (
          <Reveal mode="mount" delay={0.1} distance={14} className="relative hidden md:block">
            {photos.length === 1 ? (
              <Photo {...photos[0]} className="aspect-[16/11]" />
            ) : (
              // Two ranges: the first photo large, the second overlapping its
              // lower corner, set forward with a white edge.
              <div className="relative pb-10 pl-10">
                <Photo {...photos[0]} className="aspect-[16/11]" />
                <Photo
                  {...photos[1]}
                  className="absolute bottom-0 left-0 aspect-[4/3] w-[52%] ring-4 ring-white"
                />
              </div>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Photo({ src, alt = "", className }) {
  return (
    <div className={clsx("overflow-hidden rounded-2xl bg-white shadow-[0_24px_48px_-24px_rgba(32,27,75,0.45)]", className)}>
      <SiteImage src={src} alt={alt} eager sizes="(min-width: 1024px) 520px, 45vw" className="h-full w-full object-cover" />
    </div>
  );
}
