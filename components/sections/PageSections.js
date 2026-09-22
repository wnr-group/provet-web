import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import clsx from "clsx";
import { splitItems } from "@/lib/contentFormat";
import ProductCard from "@/components/ui/ProductCard";
import CategoryCard from "@/components/ui/CategoryCard";
import { Enter, EnterGroup, EnterItem } from "@/components/sections/entrances";

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
function Heading({ title, description, align = "left" }) {
  if (!title && !description) return null;
  const centered = align === "center";
  return (
    <div className={clsx("mb-8", centered && "mx-auto max-w-2xl text-center")}>
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
function RichText({ section }) {
  return (
    <Enter preset="blur" className="mx-auto max-w-3xl">
      <Heading title={section.title} align="center" />
      <Paragraphs body={section.body} className="text-center text-lg text-ink-soft sm:text-xl" />
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
          <EnterItem key={i} preset="wipe">
            <div className="flex h-full items-start gap-3 rounded-2xl border border-brand-100/70 bg-white p-4 transition hover:border-accent-200 hover:shadow-soft">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent-500" />
              <span className="leading-relaxed text-ink-soft">{item}</span>
            </div>
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
            <EnterItem key={i} preset="flip">
              {/* The accent bar grows across the top on hover, which gives a
                  grid of pure-text cards something to respond to without
                  needing a picture. */}
              <div className="group relative h-full overflow-hidden rounded-2xl border border-brand-100/70 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 w-1/4 bg-accent-400 transition-all duration-300 group-hover:w-full"
                />
                <span className="font-display text-xs font-bold text-accent-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">{heading}</h3>
                {text && <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{text}</p>}
              </div>
            </EnterItem>
          );
        })}
      </EnterGroup>
    </div>
  );
}

const ASPECT = { square: "aspect-square", portrait: "aspect-[3/4]", landscape: "aspect-[4/3]" };

// Cards that each carry a picture: team portraits, booklet covers, magazine
// issues. They rise and tilt upright, which is a motion nothing else uses.
function ImageCards({ section }) {
  const items = (section.config.items || []).filter((it) => it && (it.image || it.title));
  if (!items.length) return null;
  const columns = section.config.columns || 3;
  const aspect = ASPECT[section.config.aspect] || ASPECT.square;
  const isAvatar = section.config.imageStyle === "avatar";

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
        stagger={0.11}
      >
        {items.map((item, i) => {
          const card = isAvatar ? (
            <div className="group h-full rounded-2xl border border-brand-100/70 bg-white p-6 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-card">
              {item.image && (
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-mist-100 ring-4 ring-brand-50">
                  {/* eslint-disable-next-line @next/next/no-img-element -- uploaded/external URLs, not a fixed set of remote hosts */}
                  <img
                    src={item.image}
                    alt={item.title || ""}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              {item.title && <h3 className="mt-4 font-display font-semibold text-ink">{item.title}</h3>}
              {item.text && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>}
            </div>
          ) : (
            <div className="group h-full overflow-hidden rounded-2xl border border-brand-100/70 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card">
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
                <div className="p-5">
                  {item.title && <h3 className="font-display font-semibold text-ink">{item.title}</h3>}
                  {item.text && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>}
                </div>
              )}
            </div>
          );

          return (
            <EnterItem key={i} preset="spring">
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

function ProductGrid({ section }) {
  if (!section.products?.length) return null;
  return (
    <div>
      <Enter preset="drop">
        <Heading title={section.title} description={section.body} align="center" />
      </Enter>
      <EnterGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
        {section.products.map((product) => (
          <EnterItem key={product.id} preset="slideLeft">
            <ProductCard product={product} />
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
          <EnterItem key={category.id} preset="pop">
            <CategoryCard category={category} />
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

const RENDERERS = {
  richText: RichText,
  imageText: ImageText,
  list: BulletList,
  cards: Cards,
  imageCards: ImageCards,
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
              <Renderer section={section} />
            </div>
          </section>
        );
      })}
    </>
  );
}
