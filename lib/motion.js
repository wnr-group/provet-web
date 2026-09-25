// The site's motion vocabulary, in one place.
//
// Every section is meant to have its own *kind* of entrance (see
// components/sections/entrances.js for the preset set), but they all have to
// feel like one product while doing it. That consistency comes from here:
// sections choose a different movement, never a different tempo or curve.
//
// Nothing in this file animates a layout property. Every value below drives
// `transform`, `opacity`, `filter` or `clip-path`, which the compositor can
// handle without re-laying out the page.

// One easing for everything that settles into place (a decelerating curve),
// and one for the rare thing that has to leave.
export const EASE = [0.22, 1, 0.36, 1];
export const EASE_OUT = [0.4, 0, 0.2, 1];

// Three speeds, not fifteen. `base` is the default for an entrance; `slow` is
// for large surfaces (a hero image, a masked photo) where a fast move reads as
// a flinch; `fast` is for micro-interactions the pointer is waiting on.
export const DURATION = {
  fast: 0.28,
  base: 0.55,
  slow: 0.85,
};

// Stagger steps. Anything longer than `loose` starts to feel like the page is
// loading rather than arriving.
export const STAGGER = {
  tight: 0.05,
  base: 0.08,
  loose: 0.12,
};

// Travel distances. Mobile uses the smaller of each pair: a 90px slide on a
// 390px-wide screen is a quarter of the viewport, which reads as a lurch and
// costs more to composite on a weaker GPU. Components pick with useMotionScale
// below rather than hard-coding either number.
export const DISTANCE = {
  sm: { mobile: 8, desktop: 14 },
  md: { mobile: 16, desktop: 28 },
  lg: { mobile: 24, desktop: 56 },
};

// One viewport rule, so sections do not trigger at visibly different depths as
// you scroll. `once` matters as much as the margin: re-animating on the way
// back up is the single fastest way to make a site feel like a demo.
export const VIEWPORT = { once: true, margin: "-60px" };
// For full-bleed bands, which are already partly on screen when their top edge
// is still below the fold.
export const VIEWPORT_WIDE = { once: true, margin: "-120px" };

// Hover feedback, shared by buttons, cards, icons and links so the whole site
// answers the pointer at the same speed.
export const HOVER = {
  transition: { duration: DURATION.fast, ease: EASE_OUT },
  lift: -4,
  nudge: 3,
  scale: 1.03,
};

export const spring = (stiffness = 140, damping = 18) => ({
  type: "spring",
  stiffness,
  damping,
});

// Pointer-driven 3D (card tilt). One spring and one perspective for all of
// it. Well damped on purpose: the surface eases after the cursor and never
// wobbles past it - wobble is what makes 3D read as a toy.
export const TILT = {
  spring: { stiffness: 180, damping: 22, mass: 0.6 },
  perspective: 1000,
};
