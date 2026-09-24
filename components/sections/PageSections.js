import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import clsx from "clsx";
import { splitItems } from "@/lib/contentFormat";
import CategoryCard from "@/components/ui/CategoryCard";
import { Enter, EnterGroup, EnterItem } from "@/components/sections/entrances";
import Carousel from "@/components/sections/Carousel";
import LocationCards from "@/components/sections/LocationCards";
import CatalogueCard from "@/components/catalogue/CatalogueCard";
import ProductRail from "@/components/catalogue/ProductRail";
import { ScrollTilt, Tilt } from "@/components/motion/effects";

// Renders a page's admin-configured sections. One component per type in
// lib/sectionTypes.js; anything unknown is skipped rather than crashing the
// page, so removing a type later degrades quietly.
//
// Every type renders as a full-bleed band rather than another block in one
// long column. Stacked in a single container they read as undifferentiated
// paragraphs however good the copy is; alternating the background is what
// gives a page built from six text sections any rhythm at all. The bands and
// the staggered reveals deliberately follow the homepage sections
// (components/home/*), so a menu page and the homepage look like one site.

function Paragraphs({ body, className }) {
  if (!body) return null;
  return (
    <div className={clsx("space-y-4 leading-relaxed", className)}>
      {String(body)
        .split(/\n{2,}/)
        .map((para) => para.trim())
        .filter(Boolean)
        .map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            {para}
          </p>
        ))}
    </div>
  );
}

// Heading plus the accent rule the homepage uses under its section titles.
function Heading({ title, description, align = "left", className }) {
  if (!title && !description) return null;
  const centered = align === "center";
  return (
    <div className={clsx("mb-8", centered && "mx-auto max-w-2xl text-center", className)}>
      {title && (
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h2>
      )}
      <span
        aria-hidden="true"
        className={clsx("mt-4 block h-1 w-14 rounded-full bg-accent-400", centered && "mx-auto")}
      />
      {description && <p className="mt-5 leading-relaxed text-ink-soft">{description}</p>}
    </div>
  );
}

// Each type gets its own entrance. They all used to be the default fade-up,
// which made a page of six sections animate identically six times over and
// read as one long shrug. The movement now says something about the content:
// prose drifts, lists deal in from the side, cards pop, a CTA arrives whole.
// Prose sits in a card, never loose on the band: a gradient rule along the top,
// the title on the left, the copy on the right (stacked on phones).
function RichText({ section }) {
  return (
    <Enter
      preset="blur"
      className={clsx(
        "relative mx-auto rounded-3xl bg-white p-6 shadow-card ring-1 ring-brand-100/80 sm:p-10",
        section.title ? "max-w-5xl" : "max-w-3xl text-center"
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-8 top-0 h-1 rounded-b-full bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500"
      />
      <div className={clsx("grid gap-6", section.title && "lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10")}>
        {section.title && (
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{section.title}</h2>
            <span aria-hidden="true" className="mt-4 block h-1 w-12 rounded-full bg-accent-400" />
          </div>
        )}
        <Paragraphs body={section.body} className="text-lg text-ink-soft" />
      </div>
    </Enter>
  );
}

function ImageText({ section }) {
  const imageLeft = section.config.imagePosition === "left";
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <Enter preset={imageLeft ? "slideRight" : "slideLeft"} className={clsx(imageLeft && "lg:order-1")}>
        <Heading title={section.title} />
        <Paragraphs body={section.body} className="text-ink-soft" />
      </Enter>
      {section.image && (
        <Enter
          preset="zoom"
          delay={0.12}
          className={clsx("aspect-[4/3] overflow-hidden rounded-3xl bg-mist-100", imageLeft && "lg:order-0")}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- uploaded/external URL, not a fixed set of remote hosts */}
          <img src={section.image} alt="" loading="lazy" className="h-full w-full object-cover" />
        </Enter>
      )}
    </div>
  );
}

function BulletList({ section }) {
  const items = splitItems(section.body);
  if (!items.length) return null;
  return (
    <div className="mx-auto max-w-4xl">
      <Enter preset="drop">
        <Heading title={section.title} align="center" />
      </Enter>
      <EnterGroup className="grid gap-4 sm:grid-cols-2" stagger={0.08}>
        {items.map((item, i) => (
          <EnterItem key={i} preset="wipe" className="h-full">
            {/* Each point lifts and leans a little under the pointer; the
                tick floats in front of its card. */}
            <Tilt max={8} lift={1.03} className="h-full">
              <div className="flex h-full items-start gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-brand-100/70 transition hover:shadow-card [transform-style:preserve-3d]">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent-500 [transform:translateZ(30px)]" />
                <span className="leading-relaxed text-ink-soft">{item}</span>
              </div>
            </Tilt>
          </EnterItem>
        ))}
      </EnterGroup>
    </div>
  );
}

// "Heading: text" per line, falling back to the whole line as the heading
// when the admin didn't use a separator.
function Cards({ section }) {
  const items = splitItems(section.body);
  if (!items.length) return null;
  const columns = section.config.columns || 3;

  return (
    <div>
      <Enter preset="drop">
        <Heading title={section.title} align="center" />
      </Enter>
      <EnterGroup
        className={clsx(
          "grid gap-5 sm:grid-cols-2",
          columns === 3 && "lg:grid-cols-3",
          columns === 4 && "lg:grid-cols-4"
        )}
        stagger={0.1}
      >
        {items.map((item, i) => {
          const [heading, ...rest] = item.split(/\s*:\s*/);
          const text = rest.join(": ");
          return (
            <EnterItem key={i} preset="flip" className="h-full">
              {/* A 3D card: it leans toward the pointer with a shadow sliding
                  the other way, and the number badge floats in front of it.
                  No overflow clipping (that would flatten the depth), so the
                  accent bar rounds its own ends. */}
              <Tilt max={12} shadow className="h-full">
                <div className="group relative h-full rounded-2xl bg-white p-6 shadow-soft ring-1 ring-brand-100/70 transition hover:shadow-card [transform-style:preserve-3d]">
                  <span
                    aria-hidden="true"
                    className="absolute left-6 top-0 h-1 w-1/4 rounded-b-full bg-accent-400 transition-all duration-300 group-hover:w-[calc(100%-3rem)]"
                  />
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 font-display text-sm font-bold text-white shadow-[0_12px_20px_-8px_rgba(72,62,168,0.6)] [transform:translateZ(50px)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink [transform:translateZ(20px)]">{heading}</h3>
                  {text && <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{text}</p>}
                </div>
              </Tilt>
            </EnterItem>
          );
        })}
      </EnterGroup>
    </div>
  );
}

// Full-width rows rather than a grid of boxes. The oversized pale numeral
// does the structural work a card's border would, so the page reads as an
// editorial list - deliberately unlike the card grids elsewhere.
function NumberedRows({ section }) {
  const items = splitItems(section.body);
  if (!items.length) return null;

  return (
    <div className="mx-auto max-w-4xl">
      <Enter preset="drop">
        <Heading title={section.title} align="center" />
      </Enter>
      <EnterGroup className="divide-y divide-brand-100" stagger={0.1}>
        {items.map((item, i) => {
          const [heading, ...rest] = item.split(/\s*:\s*/);
          const text = rest.join(": ");
          return (
            <EnterItem key={i} preset="slideLeft">
              <div className="group flex items-baseline gap-6 py-7 transition sm:gap-10">
                <span
                  aria-hidden="true"
                  className="font-display text-4xl font-extrabold leading-none text-brand-100 transition-colors duration-300 group-hover:text-accent-300 sm:text-6xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-brand-700 sm:text-xl">
                    {heading}
                  </h3>
                  {text && <p className="mt-1.5 leading-relaxed text-ink-soft">{text}</p>}
                </div>
                {/* Grows from nothing on hover, echoing the accent rule under
                    each section heading without adding another box. */}
                <span
                  aria-hidden="true"
                  className="hidden h-0.5 w-0 shrink-0 self-center rounded-full bg-accent-400 transition-all duration-300 group-hover:w-10 sm:block"
                />
              </div>
            </EnterItem>
          );
        })}
      </EnterGroup>
    </div>
  );
}

const ASPECT = { square: "aspect-square", portrait: "aspect-[3/4]", landscape: "aspect-[4/3]" };
// Cover width on desktop for 2 / 3 / 4 covers across (gaps accounted for).
const SHELF_WIDTH = { 2: "lg:w-[calc(50%-0.7rem)]", 3: "lg:w-[calc(33.333%-0.9rem)]", 4: "lg:w-[calc(25%-1rem)]" };

// Cards that each carry a picture, in two presentations:
//
//   - Photo cards (imageStyle "card", and any landscape pictures such as
//     event photos): a grid of cards, the admin's "Columns" per row.
//   - Covers (booklets, magazine issues): a 3D shelf in a
//     sideways rail. Each cover stands turned away on its vertical axis,
//     visibly 3D at rest, and squares up and lifts when hovered.
//   - People (imageStyle "avatar"): portrait cards that tilt toward the
//     pointer, the photo floating in front of the card.
function ImageCards({ section }) {
  const items = (section.config.items || []).filter((it) => it && (it.image || it.title));
  if (!items.length) return null;
  const aspect = ASPECT[section.config.aspect] || ASPECT.square;
  const isAvatar = section.config.imageStyle === "avatar";
  // Photo cards in a grid when the admin picks that style - and always for
  // landscape pictures (event photos), which don't suit a book shelf.
  const isCardGrid = !isAvatar && (section.config.imageStyle === "card" || section.config.aspect === "landscape");
  // The admin "Columns" setting: people per row, or covers visible across
  // the shelf on desktop (more than that scroll).
  const columns = section.config.columns || 3;

  if (isCardGrid) {
    return (
      <div>
        <Enter preset="drop">
          <Heading title={section.title} description={section.body} align="center" />
        </Enter>
        <EnterGroup
          className={clsx(
            "grid gap-6 sm:grid-cols-2",
            columns === 3 && "lg:grid-cols-3",
            columns === 4 && "lg:grid-cols-4"
          )}
          stagger={0.1}
        >
          {items.map((item, i) => {
            const card = (
              <Tilt max={8} shadow className="h-full">
                <div className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-brand-100/70 transition hover:shadow-card">
                  {item.image && (
                    <div className={clsx("overflow-hidden bg-mist-100", aspect)}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- uploaded/external URLs, not a fixed set of remote hosts */}
                      <img
                        src={item.image}
                        alt={item.title || ""}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  {(item.title || item.text) && (
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <span aria-hidden="true" className="mb-3 block h-1 w-10 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
                      {item.title && <h3 className="font-display text-lg font-bold text-ink group-hover:text-brand-700">{item.title}</h3>}
                      {item.text && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>}
                    </div>
                  )}
                </div>
              </Tilt>
            );
            return (
              <EnterItem key={i} preset="spring" className="h-full">
                {item.href ? (
                  <Link href={item.href} className="block h-full">
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </EnterItem>
            );
          })}
        </EnterGroup>
      </div>
    );
  }

  if (isAvatar) {
    return (
      <div>
        <Enter preset="drop">
          <Heading title={section.title} description={section.body} align="center" />
        </Enter>
        <EnterGroup
          className={clsx(
            "mx-auto grid gap-6 sm:grid-cols-2",
            columns === 2 && "max-w-5xl",
            columns === 3 && "lg:grid-cols-3",
            columns === 4 && "lg:grid-cols-4"
          )}
          stagger={0.11}
        >
          {items.map((item, i) => (
            <EnterItem key={i} preset="spring" className="h-full">
              <Tilt max={10} shadow className="h-full">
                <div className="flex h-full flex-col items-center gap-5 rounded-3xl bg-white p-6 text-center shadow-soft ring-1 ring-brand-100/70 [transform-style:preserve-3d] sm:flex-row sm:items-start sm:text-left">
                  {item.image && (
                    <div className="relative h-28 w-28 shrink-0 [transform-style:preserve-3d]">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-400 to-accent-400 [transform:translate(8px,8px)]"
                      />
                      <div className="relative h-full w-full overflow-hidden rounded-3xl bg-mist-100 [transform:translateZ(40px)]">
                        {/* eslint-disable-next-line @next/next/no-img-element -- uploaded/external URLs, not a fixed set of remote hosts */}
                        <img src={item.image} alt={item.title || ""} loading="lazy" className="h-full w-full object-cover" />
                      </div>
                    </div>
                  )}
                  <div className="min-w-0">
                    {item.title && <h3 className="font-display text-lg font-bold text-ink">{item.title}</h3>}
                    {item.text && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>}
                  </div>
                </div>
              </Tilt>
            </EnterItem>
          ))}
        </EnterGroup>
      </div>
    );
  }

  // The cover shelf advances on its own (see ProductRail for when it pauses).
  return (
    <ProductRail
      autoplay={3500}
      title={
        <Enter preset="drop">
          <Heading title={section.title} description={section.body} className="mb-0" />
        </Enter>
      }
    >
      {items.map((item, i) => {
        const cover = (
          <div className="group [perspective:1200px]">
            <div
              className={clsx(
                "relative overflow-hidden rounded-2xl bg-mist-100 shadow-[0_24px_40px_-18px_rgba(21,18,48,0.55)] ring-1 ring-black/5 transition duration-500 ease-out",
                "[transform:rotateY(-18deg)_rotateX(4deg)] group-hover:[transform:rotateY(0deg)_translateY(-10px)_scale(1.04)] group-hover:shadow-[0_40px_60px_-24px_rgba(21,18,48,0.6)]",
                aspect
              )}
            >
              {item.image && (
                /* eslint-disable-next-line @next/next/no-img-element -- uploaded/external URLs, not a fixed set of remote hosts */
                <img src={item.image} alt={item.title || ""} loading="lazy" className="h-full w-full object-cover" />
              )}
              {/* Spine shading, and a sheen that sweeps across on hover. */}
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/25 to-transparent" />
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
            </div>
            {(item.title || item.text) && (
              <div className="mt-4">
                {item.title && (
                  <h3 className="font-display text-sm font-bold text-ink transition-colors group-hover:text-brand-700">
                    {item.title}
                  </h3>
                )}
                {item.text && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.text}</p>}
              </div>
            )}
          </div>
        );

        return (
          <div key={i} className={clsx("w-[46%] shrink-0 snap-start pt-3 sm:w-[30%]", SHELF_WIDTH[columns] || SHELF_WIDTH[3])}>
            {item.href ? (
              <Link href={item.href} className="block">
                {cover}
              </Link>
            ) : (
              cover
            )}
          </div>
        );
      })}
    </ProductRail>
  );
}

function CarouselSection({ section }) {
  const { items, aspect, autoplay, interval } = section.config;
  if (!items?.length) return null;
  return (
    <div>
      <Enter preset="drop">
        <Heading title={section.title} description={section.body} align="center" />
      </Enter>
      <Enter preset="blur">
        <Carousel items={items} aspect={aspect} autoplay={autoplay} interval={interval} />
      </Enter>
    </div>
  );
}

function ProductGrid({ section }) {
  if (!section.products?.length) return null;
  return (
    <div>
      <Enter preset="drop">
        <Heading title={section.title} description={section.body} align="center" />
      </Enter>
      <EnterGroup className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4" stagger={0.1}>
        {section.products.map((product) => (
          <EnterItem key={product.id} preset="slideLeft" className="h-full">
            <CatalogueCard product={product} />
          </EnterItem>
        ))}
      </EnterGroup>
      <Enter preset="blur" className="mt-8 text-center">
        <Link href="/products" className="btn-outline">
          View all products <ArrowRight size={16} />
        </Link>
      </Enter>
    </div>
  );
}

function CategoryGrid({ section }) {
  if (!section.categories?.length) return null;
  return (
    <div>
      <Enter preset="drop">
        <Heading title={section.title} description={section.body} align="center" />
      </Enter>
      <EnterGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" stagger={0.06}>
        {section.categories.map((category) => (
          <EnterItem key={category.id} preset="pop" className="h-full">
            <Tilt max={12} shadow className="h-full">
              <CategoryCard category={category} />
            </Tilt>
          </EnterItem>
        ))}
      </EnterGroup>
    </div>
  );
}

const BUTTON_CLASS = { primary: "btn-primary", accent: "btn-accent", outline: "btn-outline" };

function Cta({ section }) {
  const buttons = section.config.buttons || [];
  return (
    // A contained, light panel. It was brand-900, which was far darker than
    // anything else on these pages and cut the page in half; the homepage's
    // own CTA (components/home/CtaBanner.js) is a bright panel with dark
    // text, so a near-black one was off-language as well as heavy.
    //
    // Light also keeps the admin's button styles honest: on a dark panel an
    // "Accent" button had to be recoloured to stay legible, so the choice in
    // the editor stopped matching what rendered. Here btn-primary,
    // btn-accent and btn-outline all work exactly as labelled.
    <Enter
      preset="zoom"
      className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-accent-50 px-6 py-12 text-center shadow-card sm:px-12"
    >
      {/* The same soft discs the homepage CTA uses, so the panel still reads
          as a distinct object on a tinted band rather than a pale rectangle. */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-100/50" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand-100/50" />
      <div className="relative">
      <Heading title={section.title} align="center" />
      {section.body && <p className="mx-auto -mt-2 max-w-2xl text-ink-soft">{section.body}</p>}
      {buttons.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {buttons.map((button, i) => (
            <Link
              key={i}
              href={button.href}
              // An admin-entered link may point off-site, so a new-tab link
              // gets noopener - the tab it opens must not reach back here.
              {...(button.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={BUTTON_CLASS[button.style] || "btn-accent"}
            >
              {button.label}
            </Link>
          ))}
        </div>
      )}
      </div>
    </Enter>
  );
}

function Locations({ section }) {
  if (!section.config.items?.length) return null;
  return (
    <div>
      <Enter preset="drop">
        <Heading title={section.title} description={section.body} align="center" />
      </Enter>
      <LocationCards items={section.config.items} columns={section.config.columns} />
    </div>
  );
}

const RENDERERS = {
  richText: RichText,
  imageText: ImageText,
  list: BulletList,
  cards: Cards,
  numberedRows: NumberedRows,
  imageCards: ImageCards,
  carousel: CarouselSection,
  locations: Locations,
  productGrid: ProductGrid,
  categoryGrid: CategoryGrid,
  cta: Cta,
};

export default function PageSections({ sections }) {
  if (!sections?.length) return null;

  // Bands alternate white / tinted so neighbouring sections never merge into
  // one another. Every type takes part, the CTA included - it supplies its
  // own dark panel inside the band rather than colouring the band itself.
  return (
    <>
      {sections.map((section, index) => {
        const Renderer = RENDERERS[section.type];
        if (!Renderer) return null;

        const tinted = index % 2 === 1;

        return (
          <section
            key={section.key}
            className={clsx(
              "relative overflow-hidden py-14 sm:py-20",
              tinted ? "bg-mist-50/60" : "bg-white"
            )}
          >
            {tinted && (
              // The same soft brand glow the homepage's tinted band uses, so
              // the strip doesn't read as a flat grey box.
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(57,49,133,0.07),transparent_70%)]"
              />
            )}
            <div className="container-page relative">
              {/* Every section stands up in 3D as it scrolls into view. */}
              <ScrollTilt amount={12}>
                <Renderer section={section} />
              </ScrollTilt>
            </div>
          </section>
        );
      })}
    </>
  );
}
