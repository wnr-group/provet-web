/* eslint-disable @next/next/no-img-element -- admin-uploaded/external URLs */
import clsx from "clsx";
import PageBanner from "@/components/ui/PageBanner";
import { MaskReveal, Tilt } from "@/components/motion/effects";
import { Enter } from "@/components/sections/entrances";
import { CATEGORY_THEMES, DEFAULT_THEME } from "@/lib/categoryTheme";
import SiteImage from "@/components/ui/SiteImage";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1630090374791-c9eb7bab3935?auto=format&fit=crop&w=1200&h=900&q=80";

// The banner's own photo for each view - deliberately not the ranges' category
// images, which are the homepage's range cards, so the catalogue banner never
// repeats the homepage. A range without one here uses its category image.
const BANNER_IMAGES = {
  all: DEFAULT_IMAGE,
  avinova: "https://images.unsplash.com/photo-1589922585952-b31ed31b2c92?auto=format&fit=crop&w=1200&h=900&q=80",
  blunova: "https://images.unsplash.com/photo-1652459569826-ed99561223af?auto=format&fit=crop&w=1200&h=900&q=80",
};
const LAYERS = ["all", "avinova", "blunova"];

// The catalogue's banner: the shared banner's product composition
// (components/ui/PageBanner.js). The copy on the left; on the right the
// range's own photograph in a large rounded panel, with a few of the range's
// product labels fanned in front of it in 3D - the middle one forward, the
// outer two turned and set back - tilting toward the pointer. The band takes
// the range's tint (amber for Avinova, ocean for Blunova).
//
// One photo per range, stacked; changing category is a soft navigation, so
// the layers stay mounted and switching range cross-fades the photo.
// `images` maps a range slug to its photo (the ranges' own category images).
export default function CatalogueHero({ title, description, crumbs, count, products = [], images = {}, themeKey = DEFAULT_THEME.key, children }) {
  const theme = CATEGORY_THEMES[themeKey] || DEFAULT_THEME;
  const fan = products.filter((p) => p.images?.[0]).slice(0, 3);
  // Middle, left, right - the first product takes the front position.
  const slots = [
    "z-20 left-[30%] top-[14%] w-[38%] [transform:translateZ(70px)]",
    "z-10 left-[4%] top-[24%] w-[32%] [transform:translateZ(-10px)_rotateY(22deg)_rotate(-6deg)]",
    "z-10 left-[62%] top-[26%] w-[32%] [transform:translateZ(-10px)_rotateY(-22deg)_rotate(6deg)]",
  ];

  const media = (
    <div className="relative h-[17rem] sm:h-[22rem]">
      {/* The range photo panel, right-aligned behind the fan. */}
      <div className="absolute inset-y-0 right-0 w-[72%] overflow-hidden rounded-[2rem] shadow-card">
        <MaskReveal direction="right" wrapperClassName="h-full" className="relative h-full w-full">
        {LAYERS.map((key) => (
          <img
            key={key}
            src={BANNER_IMAGES[key] || images[key] || DEFAULT_IMAGE}
            alt=""
            data-banner-layer={key}
            className={clsx(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
              key === themeKey ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-brand-900/15 to-transparent" />
        </MaskReveal>
      </div>

      {fan.length > 0 && (
        <Tilt max={12} lift={1.03} className="absolute inset-0">
          <div className="relative h-full w-full [perspective:1000px] [transform-style:preserve-3d]">
            {/* Each label arrives from depth in turn, the front one first. */}
            {fan.map((p, i) => (
              <div key={p.id} className={clsx("absolute aspect-square", slots[i])}>
                <Enter
                  preset="depth"
                  delay={0.35 + i * 0.15}
                  className="h-full w-full rounded-2xl bg-white p-2.5 shadow-[0_30px_50px_-20px_rgba(21,18,48,0.55)] ring-1 ring-brand-100"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <SiteImage src={p.images[0]} alt={p.name} sizes="220px" eager className="h-full w-full object-cover" />
                  </div>
                </Enter>
              </div>
            ))}
          </div>
        </Tilt>
      )}
    </div>
  );

  return (
    <PageBanner
      variant="product"
      crumbs={crumbs}
      title={title}
      description={description}
      tone={theme.ui.accent}
      chip={typeof count === "number" ? { value: count, label: count === 1 ? "product" : "products" } : null}
      media={media}
    >
      {children}
    </PageBanner>
  );
}
