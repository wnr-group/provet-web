/* eslint-disable @next/next/no-img-element -- admin-uploaded or fixed photos, not a fixed set of remote hosts */
import Link from "next/link";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { DrawLine, MaskReveal, Parallax, ScrollDrift, SplitText, Tilt } from "@/components/motion/effects";
import { Enter } from "@/components/sections/entrances";

// The banner for every page except the homepage (which keeps its own hero).
//
// One Provet language - the same breadcrumb, type scale, brand navy and
// magenta accent, and a single figure (`chip`) set as a quiet stat - but a
// different composition per kind of page, so moving between pages never
// feels like the same template with new text:
//
//   layered     About Us - a dark band; the page photo and a second one
//               overlap at different depths with a floating stat card, and
//               the stack shifts in 3D with the pointer.
//   asymmetric  Who We Are - a light band; the page photo large and offset,
//               a second photo overlapping its corner.
//   editorial   Core Values, Media, Search - oversized headline, a hairline,
//               then the intro beside a wide photo strip. Pure typography
//               when the page has no photo.
//   oversized   Why Provet, Resources - a dark band with a giant headline the
//               page photo shows through.
//   immersive   Careers - the photo full-bleed, drifting on scroll, the title
//               low over a gradient.
//   panel       Contact - a photo band with a white panel floating over its
//               lower edge.
//   product     the catalogue - a light band, the copy beside a product
//               visual passed in as `media`.
//
// Everything in it stays admin-editable where it was before: the menu pages'
// title, intro and hero image come from Admin > Website Content > page
// settings. `secondaryImage` is the second photo of the layered and
// asymmetric compositions. `crumbs` is a breadcrumb trail [{ label, href }];
// `eyebrow` alone gives Home / eyebrow; `breadcrumbs` is a ready-made node.
export default function PageBanner({ variant = "asymmetric", eyebrow, crumbs, breadcrumbs, ...props }) {
  const trail = crumbs || [{ label: "Home", href: "/" }, ...(eyebrow ? [{ label: eyebrow }] : [])];
  const Composition = VARIANTS[variant] || Asymmetric;
  const crumb = (tone) => breadcrumbs || <Crumbs trail={trail} tone={tone} />;
  return <Composition crumb={crumb} {...props} />;
}

// ---- shared pieces ----------------------------------------------------------

function Crumbs({ trail, tone = "light" }) {
  const dark = tone === "dark";
  return (
    <nav aria-label="Breadcrumb">
      <ol className={clsx("flex flex-wrap items-center gap-1.5 text-xs font-medium", dark ? "text-brand-200" : "text-ink-soft")}>
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={12} aria-hidden="true" className="shrink-0 opacity-60" />}
              {last || !c.href ? (
                <span aria-current={last ? "page" : undefined} className={last ? (dark ? "text-white" : "font-semibold text-ink") : undefined}>
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className={clsx("transition-colors", dark ? "hover:text-white" : "hover:text-brand-700")}>
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// The page's figure, as a quiet stat under a hairline.
function Stat({ chip, dark = false, className }) {
  if (!chip) return null;
  return (
    <p className={clsx("flex items-baseline gap-3 border-t pt-4", dark ? "border-white/15" : "border-brand-200/70", className)}>
      <span className={clsx("font-display text-3xl font-extrabold tabular-nums tracking-tight", dark ? "text-white" : "text-brand-800")}>
        {chip.value}
      </span>
      <span className={clsx("text-sm", dark ? "text-brand-200" : "text-ink-soft")}>{chip.label}</span>
    </p>
  );
}

// The light compositions' two-colour ground: a soft brand-blue glow at the
// top left and a magenta one at the bottom right.
function DualGlow() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(97,87,193,0.16),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-32 -z-10 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(229,9,127,0.12),transparent_65%)]"
      />
    </>
  );
}

// The short accent rule, blue into pink.
const DualRule = ({ className }) => (
  <span aria-hidden="true" className={clsx("block h-1 w-14 rounded-full bg-gradient-to-r from-brand-500 to-accent-500", className)} />
);

function Actions({ children }) {
  if (!children) return null;
  return <div className="mt-7 flex flex-wrap items-center gap-3">{children}</div>;
}

const Photo = ({ src, alt = "", className }) =>
  src ? <img src={src} alt={alt} className={clsx("h-full w-full object-cover", className)} /> : null;

// ---- layered: About Us -------------------------------------------------------

function Layered({ crumb, title, description, image, imageAlt, secondaryImage, chip, children }) {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(115deg,#3f3790_0%,#5b41a8_50%,#c2217f_100%)] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_65%)]"
      />
      <div className="container-page grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2">
        {/* Motion: the headline rises word by word; on scroll the copy lifts
            away faster than the picture beside it. */}
        <ScrollDrift y={-50} fade={0.4}>
          <Reveal mode="mount" distance={10}>{crumb("dark")}</Reveal>
          <SplitText
            as="h1"
            mode="mount"
            text={title}
            className="mt-5 block text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          />
          <Reveal mode="mount" delay={0.3} distance={12}>
            {description && <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-brand-100">{description}</p>}
            <Actions>{children}</Actions>
          </Reveal>
        </ScrollDrift>

        {/* Three planes at different depths - the second photo set back, the
            page photo in front, the stat card nearest - each arriving from
            its own depth in turn, then separating as the stack tilts toward
            the pointer and drifting slower than the copy on scroll. */}
        <ScrollDrift y={30} className="hidden md:block">
          <Tilt max={8} lift={1.02} className="relative h-[24rem] lg:h-[26rem]">
            <div className="relative h-full w-full [transform-style:preserve-3d]">
              {secondaryImage && (
                <div className="absolute right-0 top-0 h-[68%] w-[58%] [transform:translateZ(-40px)]">
                  <Enter preset="depth" delay={0.1} className="h-full w-full overflow-hidden rounded-3xl opacity-90 ring-1 ring-white/10">
                    <Photo src={secondaryImage} />
                  </Enter>
                </div>
              )}
              <div className="absolute bottom-0 left-0 h-[74%] w-[70%] [transform:translateZ(30px)]">
                <Enter
                  preset="depth"
                  delay={0.3}
                  className="h-full w-full overflow-hidden rounded-3xl shadow-[0_40px_70px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/15"
                >
                  <Photo src={image} alt={imageAlt} />
                </Enter>
              </div>
              {chip && (
                <div className="absolute bottom-[12%] right-[4%] [transform:translateZ(80px)]">
                  <Enter preset="pop" delay={0.65} className="rounded-2xl bg-white px-5 py-4 text-ink shadow-[0_24px_40px_-16px_rgba(0,0,0,0.5)]">
                    <p className="font-display text-3xl font-extrabold leading-none text-brand-700">{chip.value}</p>
                    <p className="mt-1.5 text-xs font-medium text-ink-soft">{chip.label}</p>
                  </Enter>
                </div>
              )}
            </div>
          </Tilt>
        </ScrollDrift>
      </div>
    </section>
  );
}

// ---- asymmetric: Who We Are ---------------------------------------------------

function Asymmetric({ crumb, title, description, image, imageAlt, secondaryImage, chip, children }) {
  return (
    <section className="relative isolate overflow-hidden bg-mist-50">
      <DualGlow />
      <div className="container-page grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-12">
        {/* Motion: the headline rises word by word, then the rest follows. */}
        <div className="lg:col-span-5">
          <Reveal mode="mount" distance={10}>{crumb("light")}</Reveal>
          <SplitText
            as="h1"
            mode="mount"
            text={title}
            className="mt-5 block text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-900 sm:text-5xl lg:text-6xl"
          />
          <Reveal mode="mount" delay={0.3} distance={12}>
            <DualRule className="mt-5" />
            {description && <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-ink-soft">{description}</p>}
            <Actions>{children}</Actions>
            <Stat chip={chip} className="mt-8 max-w-xs" />
          </Reveal>
        </div>

        {/* The main photo is wiped in from the right; the second opens as a
            growing circle a beat later. On scroll the two drift in opposite
            directions, so the pair separates in depth. */}
        {image && (
          <div className="lg:col-span-7">
            <div className="relative h-[16rem] sm:h-[24rem] lg:h-[28rem]">
              <span aria-hidden="true" className="absolute -bottom-6 right-[8%] -z-10 h-40 w-40 rounded-full bg-accent-100/70 blur-2xl" />
              <div className={clsx("absolute right-0 top-0 h-full overflow-hidden rounded-[2rem] shadow-card", secondaryImage ? "w-full sm:w-[80%]" : "w-full")}>
                <MaskReveal direction="right" wrapperClassName="h-full" className="h-full w-full">
                  <Parallax distance={16} className="h-[115%] -translate-y-[7%]">
                    <Photo src={image} alt={imageAlt} />
                  </Parallax>
                </MaskReveal>
              </div>
              {secondaryImage && (
                <Parallax distance={-18} className="absolute -bottom-6 left-0 hidden aspect-[4/3] w-[40%] sm:block">
                  <div className="h-full w-full overflow-hidden rounded-2xl shadow-[0_30px_50px_-24px_rgba(21,18,48,0.55)] ring-8 ring-mist-50">
                    <MaskReveal direction="circle" delay={0.45} wrapperClassName="h-full" className="h-full w-full">
                      <Photo src={secondaryImage} />
                    </MaskReveal>
                  </div>
                </Parallax>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ---- editorial: Core Values, Media, Search ---------------------------------------

function Editorial({ crumb, title, description, image, imageAlt, chip, children }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-brand-100 bg-white">
      <DualGlow />
      <div className="container-page pb-12 pt-12 sm:pb-14 sm:pt-16">
        {/* Motion: the big headline rises word by word, then eases back a
            touch as the page scrolls on; the hairline draws across from the
            left; the photo strip is unveiled upward. */}
        <Reveal mode="mount" distance={10}>{crumb("light")}</Reveal>
        <ScrollDrift y={-24} scale={0.97} className="origin-left">
          <SplitText
            as="h1"
            mode="mount"
            text={title}
            className="mt-8 block max-w-5xl text-balance font-display text-5xl font-extrabold leading-[0.98] tracking-[-0.04em] text-brand-900 sm:text-7xl lg:text-8xl"
          />
        </ScrollDrift>
        <Reveal mode="mount" delay={0.3} distance={8}>
          <DualRule className="mt-6" />
        </Reveal>
        <DrawLine origin="left" delay={0.2} className="mt-10 block h-px w-full bg-brand-100" />
        <div className="grid gap-8 pt-8 md:grid-cols-12">
          <Reveal mode="mount" delay={0.35} distance={12} className={image ? "md:col-span-5" : "md:col-span-8"}>
            {description && <p className="text-pretty text-lg leading-relaxed text-ink-soft">{description}</p>}
            <Actions>{children}</Actions>
            <Stat chip={chip} className="mt-8 max-w-xs" />
          </Reveal>
          {image && (
            <div className="md:col-span-7">
              <div className="aspect-[21/9] overflow-hidden rounded-2xl">
                <MaskReveal direction="up" delay={0.25} wrapperClassName="h-full" className="h-full w-full">
                  <Parallax distance={14} className="h-[120%] -translate-y-[8%]">
                    <Photo src={image} alt={imageAlt} />
                  </Parallax>
                </MaskReveal>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ---- oversized: Why Provet, Resources --------------------------------------------

function Oversized({ crumb, title, description, image, chip, children }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-600 text-white">
      {/* The background photo drifts slower than the page. */}
      {image && (
        <>
          <Parallax distance={50} className="absolute inset-x-0 -top-[10%] -z-20 h-[120%]">
            <img src={image} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-60" />
          </Parallax>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(57,49,133,0.9)_0%,rgba(91,65,168,0.62)_50%,rgba(229,9,127,0.4)_100%)]"
          />
        </>
      )}
      <div className="container-page pb-12 pt-14 sm:pb-16 sm:pt-20">
        <Reveal mode="mount" distance={10}>{crumb("dark")}</Reveal>
        {/* Motion: the giant headline is wiped in left to right, then shrinks
            and lifts a little as the page scrolls on - the one piece of type
            on the site that reacts to scroll. The page photo shows through
            the letters. */}
        <ScrollDrift y={-40} scale={0.94} className="origin-left">
          {/* Plays on load (animate), not on scroll into view: the wipe starts
              fully clipped, the browser measures a fully clipped element as
              zero visible area, so the in-view trigger never fired and the
              headline stayed invisible. The banner is always at the top of
              the page, so there is nothing to wait for. */}
          <Enter preset="wipe" delay={0.1} animate="show">
            <h1
              className={clsx(
                // pb/-mb: the photo fill (background-clip: text) only paints
                // inside the element's box, and with this tight leading the
                // descenders of g, y, p, q fall below it - they rendered
                // invisible. The padding extends the painted area; the
                // negative margin keeps the spacing unchanged.
                "-mb-[0.18em] mt-6 max-w-6xl pb-[0.18em] text-balance font-display text-[clamp(3rem,8.5vw,8rem)] font-extrabold leading-[0.92] tracking-[-0.045em]",
                image ? "bg-cover bg-center bg-clip-text text-transparent [-webkit-background-clip:text]" : "text-white"
              )}
              style={image ? { backgroundImage: `linear-gradient(rgba(255,255,255,0.55),rgba(255,255,255,0.55)), url("${image}")` } : undefined}
            >
              {title}
            </h1>
          </Enter>
        </ScrollDrift>
        <Reveal mode="mount" delay={0.45} distance={12}>
          <div className="mt-10 grid gap-6 border-t border-white/15 pt-6 md:grid-cols-12">
            {description && <p className="text-pretty text-lg leading-relaxed text-brand-100 md:col-span-7">{description}</p>}
            <div className="md:col-span-4 md:col-start-9">
              <Stat chip={chip} dark className="border-t-0 pt-0" />
            </div>
          </div>
          <Actions>{children}</Actions>
        </Reveal>
      </div>
    </section>
  );
}

// ---- immersive: Careers ------------------------------------------------------------

function Immersive({ crumb, title, description, image, imageAlt, chip, children }) {
  return (
    <section className="relative isolate flex min-h-[26rem] items-end overflow-hidden bg-brand-900 text-white sm:min-h-[34rem]">
      {image && (
        <Parallax distance={40} className="absolute inset-x-0 -top-[10%] -z-20 h-[120%]">
          <Photo src={image} alt={imageAlt} />
        </Parallax>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(57,49,133,0.85)_0%,rgba(91,65,168,0.35)_45%,rgba(229,9,127,0.14)_100%)]"
      />
      {/* Motion: the headline rises word by word; on scroll the copy lifts
          and fades faster than the photo drifts, so the two separate. */}
      <ScrollDrift y={-90} fade={0} className="container-page w-full pb-12 pt-32 sm:pb-16">
        <Reveal mode="mount" distance={10}>{crumb("dark")}</Reveal>
        <SplitText
          as="h1"
          mode="mount"
          text={title}
          className="mt-5 block max-w-4xl text-balance font-display text-5xl font-extrabold leading-[1] tracking-tight sm:text-6xl lg:text-7xl"
        />
        <Reveal mode="mount" delay={0.35} distance={14}>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            {description && <p className="max-w-xl text-pretty text-lg leading-relaxed text-brand-100">{description}</p>}
            <Stat chip={chip} dark className="min-w-[12rem]" />
          </div>
          <Actions>{children}</Actions>
        </Reveal>
      </ScrollDrift>
    </section>
  );
}

// ---- panel: Contact --------------------------------------------------------------------

function Panel({ crumb, title, description, image, imageAlt, chip, children }) {
  return (
    <section className="relative isolate bg-white pb-10">
      {/* Motion: the photo band is unveiled downward, then the panel arrives
          from depth over its edge - quiet, as a contact page should be. */}
      <div className="relative h-[16rem] overflow-hidden bg-brand-100 sm:h-[22rem]">
        <MaskReveal direction="down" wrapperClassName="h-full" className="h-full w-full">
          <Parallax distance={24} className="h-[120%] -translate-y-[8%]">
            <Photo src={image} alt={imageAlt} />
          </Parallax>
        </MaskReveal>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(120deg,rgba(57,49,133,0.22),rgba(229,9,127,0.16))]" />
      </div>
      <div className="container-page relative -mt-28 sm:-mt-36">
        <Enter preset="depth" delay={0.35}>
          <div className="max-w-2xl rounded-3xl bg-white p-7 shadow-[0_40px_80px_-40px_rgba(21,18,48,0.45)] ring-1 ring-brand-100 sm:p-10">
            {crumb("light")}
            <h1 className="mt-4 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-900 sm:text-5xl">
              {title}
            </h1>
            <DualRule className="mt-5" />
            {description && <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-soft">{description}</p>}
            <Actions>{children}</Actions>
            <Stat chip={chip} className="mt-7 max-w-xs" />
          </div>
        </Enter>
      </div>
    </section>
  );
}

// ---- product: the catalogue ---------------------------------------------------------

function Product({ crumb, title, description, chip, media, tone = "#393185", children }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-brand-100 bg-mist-50">
      <DualGlow />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/2 -z-10 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full opacity-[0.12] transition-colors duration-700"
        style={{ backgroundImage: `radial-gradient(circle, ${tone}, transparent 65%)` }}
      />
      <div className="container-page grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-12">
        {/* Motion: the headline rises word by word; the product visual
            (passed in as `media`) brings its own entrance. */}
        <div className="lg:col-span-6">
          <Reveal mode="mount" distance={10}>{crumb("light")}</Reveal>
          <SplitText
            as="h1"
            mode="mount"
            text={title}
            className="mt-5 block text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-900 sm:text-5xl lg:text-6xl"
          />
          <Reveal mode="mount" delay={0.3} distance={12}>
            <DualRule className="mt-5" />
            {description && <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">{description}</p>}
            <Actions>{children}</Actions>
            <Stat chip={chip} className="mt-8 max-w-xs" />
          </Reveal>
        </div>
        {media && <div className="lg:col-span-6">{media}</div>}
      </div>
    </section>
  );
}

const VARIANTS = {
  layered: Layered,
  asymmetric: Asymmetric,
  editorial: Editorial,
  oversized: Oversized,
  immersive: Immersive,
  panel: Panel,
  product: Product,
};
