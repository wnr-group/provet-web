import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Globe, Handshake, Lightbulb, Sparkles } from "lucide-react";
import clsx from "clsx";
import PointIcon from "@/components/sections/PointIcon";
import { splitItems } from "@/lib/contentFormat";
import CategoryCard from "@/components/ui/CategoryCard";
import { Enter, EnterGroup, EnterItem } from "@/components/sections/entrances";
import Carousel from "@/components/sections/Carousel";
import LocationCards from "@/components/sections/LocationCards";
import CatalogueCard from "@/components/catalogue/CatalogueCard";
import ProductRail from "@/components/catalogue/ProductRail";
import { ScrollTilt, Tilt } from "@/components/motion/effects";
import YouTubePlayer from "@/components/sections/YouTubePlayer";
import MagazineRack from "@/components/sections/MagazineRack";
import BookletShelf from "@/components/sections/BookletShelf";
import ImageAccordion from "@/components/sections/ImageAccordion";
import { isYouTubeUrl } from "@/lib/youtube";
import Pic from "@/components/ui/Pic";
import { categoryTheme, rangeThemeVars } from "@/lib/categoryTheme";

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
      {description && <p className="band-desc mt-5 leading-relaxed text-ink-soft">{description}</p>}
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
  if (section.config?.layout === "editorial") return <EditorialIntro section={section} />;
  if (section.config?.layout === "statement") return <StatementIntro section={section} />;
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
        className="absolute inset-x-8 top-0 h-1 rounded-b-full bg-accent-500"
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

// The round photos that open a magazine page: poultry, aquaculture and cattle -
// the three ranges - overlapping in a row, echoing the cluster of circles on
// the magazine's own cover. Site pictures, decorative (the copy beside them
// carries the meaning).
const INTRO_PHOTOS = [
  "/content/hero/01-poultry-house.jpg",
  "/content/ranges/blunova-shrimp.jpg",
  "/content/ranges/bovinova-cattle.jpg",
];

// A page's opening as an editor's note (chosen per page in ContentPage): centred
// and open - no card, box, columns or rules around it. A row of overlapping
// round photos, the title as a small eyebrow label, the first paragraph as the
// pull-quote set very large in the display face, the rest as supporting text
// (also large), and a short magenta rule to close. The quote fades in, then the
// rule is drawn (through <Enter>, which honours reduced motion).
function EditorialIntro({ section }) {
  const [lead, ...rest] = String(section.body || "")
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter(Boolean);
  // The round photos: the section's own list (set in ContentPage), none when it
  // says false, otherwise the default three ranges.
  const photos = Array.isArray(section.config?.photos) ? section.config.photos : section.config?.photos === false ? [] : INTRO_PHOTOS;

  return (
    <div className="mx-auto max-w-6xl text-center">
      {photos.length > 0 && (
      <div aria-hidden="true" className="flex justify-center -space-x-5">
        {photos.map((src, i) => (
          <span
            key={src}
            className="relative block h-20 w-20 overflow-hidden rounded-full shadow-[0_10px_24px_-10px_rgba(32,27,75,0.5)] ring-4 ring-white sm:h-24 sm:w-24"
            style={{ zIndex: photos.length - i }}
          >
            <Pic src={src} alt="" sizes="96px" className="h-full w-full object-cover" />
          </span>
        ))}
      </div>
      )}
      {section.title && (
        <h2 className="mt-6 text-xs font-semibold uppercase tracking-[0.32em] text-accent-600">{section.title}</h2>
      )}
      <Enter preset="blur" delay={0.1} className="mt-4">
        {lead && (
          <p className="whitespace-pre-line font-display text-2xl font-bold leading-[1.2] tracking-tight text-brand-800 [text-wrap:pretty] sm:text-3xl lg:text-4xl lg:leading-[1.2]">
            {lead}
          </p>
        )}
        {rest.length > 0 && (
          <div className="mx-auto mt-6 max-w-5xl space-y-4 text-base leading-8 text-ink-soft [text-wrap:pretty] sm:text-lg lg:text-xl lg:leading-9">
            {rest.map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        )}
      </Enter>
      <Enter preset="wipe" delay={0.4} className="mt-6">
        <span aria-hidden="true" className="mx-auto block h-1 w-14 rounded-full bg-accent-500" />
      </Enter>
    </div>
  );
}

// A heading in the logo's blue (the pink goes on the icons, not the words). Used
// by the Who We Are page's open layouts.
function TwoToneTitle({ title }) {
  return <span className="text-brand-600">{String(title || "").trim()}</span>;
}

// The Who We Are page's opening (layout "statement", chosen in ContentPage): the
// title a small label, the first line as a large statement beside a gradient bar,
// the rest as a quieter line under it. Left-aligned and open.
function StatementIntro({ section }) {
  const [lead, ...rest] = String(section.body || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  return (
    <Enter preset="blur" className="mx-auto max-w-5xl">
      {section.title && <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-600">{section.title}</h2>}
      <div className="mt-4 flex gap-5 sm:gap-7">
        <span aria-hidden="true" className="w-1.5 shrink-0 rounded-full bg-gradient-to-b from-accent-500 to-brand-500" />
        <div>
          {lead && <p className="font-display text-2xl font-bold leading-snug tracking-tight text-brand-800 sm:text-3xl lg:text-4xl">{lead}</p>}
          {rest.length > 0 && <p className="mt-4 max-w-3xl text-base leading-8 text-ink-soft sm:text-lg">{rest.join(" ")}</p>}
        </div>
      </div>
    </Enter>
  );
}

const JOURNEY_ICONS = [Globe, Handshake, Lightbulb, Sparkles];

// "Heading: text" lines as steps along a dashed line (layout "journey"): a round
// icon for each on the line, then its heading in brand blue and its text, set
// open - no boxes - on a light band (see OPEN_BANDS): blue headings, grey text,
// pink icons. The ring around each icon is the band's colour, so the line seems
// to pass behind it.
function JourneyCards({ section, items }) {
  return (
    <div>
      <Enter preset="drop" className="text-center">
        <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          <TwoToneTitle title={section.title} />
        </h2>
        <span aria-hidden="true" className="mx-auto mt-3 block h-1 w-14 rounded-full bg-accent-500" />
      </Enter>
      <EnterGroup className="relative mx-auto mt-9 grid max-w-6xl gap-10 md:grid-cols-3 md:gap-8" stagger={0.12}>
        {items.length === 3 && (
          <span aria-hidden="true" className="absolute left-[16.6%] right-[16.6%] top-7 hidden border-t-2 border-dashed border-brand-200 md:block" />
        )}
        {items.map((item, i) => {
          const [heading, ...rest] = item.split(/\s*:\s*/);
          const text = rest.join(": ");
          const Icon = JOURNEY_ICONS[i % JOURNEY_ICONS.length];
          return (
            <EnterItem key={i} preset="spring" className="relative text-center">
              <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-400 text-white shadow-[0_10px_22px_-8px_rgba(229,9,127,0.6)] ring-8 ring-brand-50">
                <Icon size={24} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-brand-600">{heading}</h3>
              {text && <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft sm:text-base">{text}</p>}
            </EnterItem>
          );
        })}
      </EnterGroup>
    </div>
  );
}

// A short list as one row of ticked phrases (layout "strip"): the title above,
// the phrases large, in brand blue, wrapping onto a second line when they must.
function FeatureStrip({ section, items }) {
  return (
    <div className="text-center">
      <Enter preset="drop">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <TwoToneTitle title={section.title} />
        </h2>
        <span aria-hidden="true" className="mx-auto mt-3 block h-1 w-14 rounded-full bg-accent-500" />
      </Enter>
      <EnterGroup className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
        {items.map((item, i) => (
          <EnterItem key={i} preset="spring" className="h-full">
            <div className="group relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-brand-100 bg-white px-6 pb-8 pt-9 text-center shadow-[0_14px_30px_-20px_rgba(57,49,133,0.45)] transition duration-300 hover:-translate-y-1 hover:border-accent-300 hover:shadow-[0_26px_44px_-22px_rgba(57,49,133,0.5)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50 text-accent-500 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
                <PointIcon text={item} size={30} />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold leading-snug tracking-tight text-brand-600">{item}</h3>
            </div>
          </EnterItem>
        ))}
      </EnterGroup>
    </div>
  );
}

// Events as a zigzag (layout "zigzag", chosen in ContentPage). Each item's title
// ends in its date ("Launch of Nitrisol HP - 12 December 2016"): the date becomes
// a pink pill and a huge faint day number behind the text; the rest of the title
// is the heading. Big photos alternate left and right, with the story opposite -
// no cards or boxes. An item whose title has no date simply has no pill.
const EVENT_TITLE = /^(.*?)\s*[-–]\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\s*$/;

function EventZigzag({ section, items }) {
  const events = items.map((item) => {
    const m = String(item.title || "").match(EVENT_TITLE);
    return m ? { ...item, name: m[1].trim(), day: m[2], month: m[3], year: m[4] } : { ...item, name: item.title };
  });
  return (
    <div>
      <Enter preset="drop" className="text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <TwoToneTitle title={section.title} />
        </h2>
        <span aria-hidden="true" className="mx-auto mt-3 block h-1 w-14 rounded-full bg-accent-500" />
      </Enter>
      <EnterGroup className="mx-auto mt-12 max-w-6xl space-y-14 sm:space-y-20" stagger={0.1}>
        {events.map((ev, i) => (
          <EnterItem key={i} preset={i % 2 ? "slideRight" : "slideLeft"}>
            <article className="grid items-center gap-6 lg:grid-cols-2 lg:gap-14">
              {ev.image && (
                <div className={clsx("relative", i % 2 && "lg:order-2")}>
                  <span aria-hidden="true" className={clsx("absolute -bottom-4 h-full w-full rounded-[2rem] bg-accent-100", i % 2 ? "-left-4" : "-right-4")} />
                  <div className="relative aspect-[3/2] overflow-hidden rounded-[2rem]">
                    <Pic src={ev.image} alt={ev.name || ""} sizes="(min-width: 1024px) 560px, 92vw" className="h-full w-full object-cover object-[50%_30%]" />
                  </div>
                </div>
              )}
              <div className={clsx("relative min-w-0", !ev.image && "lg:col-span-2")}>
                {ev.day && (
                  <span aria-hidden="true" className="pointer-events-none absolute -top-6 right-0 select-none font-display text-[5.5rem] font-black leading-none text-brand-100 sm:text-[7rem]">
                    {ev.day}
                  </span>
                )}
                <div className="relative">
                  {ev.day && (
                    <p className="inline-flex rounded-full bg-accent-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-600">
                      {ev.day} {ev.month} {ev.year}
                    </p>
                  )}
                  {ev.name && <h3 className="mt-3 font-display text-2xl font-bold leading-snug tracking-tight text-brand-600 sm:text-3xl">{ev.name}</h3>}
                  {ev.text && <p className="mt-3 whitespace-pre-line text-base leading-7 text-ink-soft">{ev.text}</p>}
                </div>
              </div>
            </article>
          </EnterItem>
        ))}
      </EnterGroup>
    </div>
  );
}

// News as a newsroom list (layout "newsroom", chosen in ContentPage): the lines
// of a "Heading - 27 October 2017: text" list become stories, newest first. The
// date is a column on the left, the headline and text on the right, hairline
// rules between stories - no photos, boxes or numbers. The first story is the
// lead: a pink "Latest" label and a larger headline. A line with no date in its
// heading simply has no date column entry.
function NewsList({ section, items }) {
  const stories = items.map((item) => {
    const [heading, ...rest] = item.split(/ *: */);
    const m = heading.match(EVENT_TITLE);
    return {
      name: m ? m[1].trim() : heading,
      day: m ? m[2] : "",
      month: m ? m[3] : "",
      year: m ? m[4] : "",
      text: rest.join(": "),
    };
  });
  return (
    <div>
      <Enter preset="drop" className="text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <TwoToneTitle title={section.title} />
        </h2>
        <span aria-hidden="true" className="mx-auto mt-3 block h-1 w-14 rounded-full bg-accent-500" />
      </Enter>
      <EnterGroup className="mx-auto mt-10 max-w-5xl divide-y divide-brand-100 border-y border-brand-100" stagger={0.08}>
        {stories.map((st, i) => (
          <EnterItem key={i} preset="slideLeft">
            <article className="grid gap-3 py-7 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-8 sm:py-9">
              <div className="flex items-baseline gap-3 sm:block">
                {st.day && (
                  <>
                    <p className="font-display text-4xl font-extrabold leading-none text-brand-600 sm:text-5xl">{st.day}</p>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-600 sm:mt-2">
                      {st.month} {st.year}
                    </p>
                  </>
                )}
              </div>
              <div className="min-w-0">
                {i === 0 && (
                  <p className="mb-2 inline-flex rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-600">
                    Latest
                  </p>
                )}
                <h3
                  className={clsx(
                    "font-display font-bold leading-snug tracking-tight text-brand-600",
                    i === 0 ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
                  )}
                >
                  {st.name}
                </h3>
                {st.text && (
                  <p className={clsx("mt-3 whitespace-pre-line leading-7 text-ink-soft", i === 0 ? "text-lg" : "text-base")}>{st.text}</p>
                )}
              </div>
            </article>
          </EnterItem>
        ))}
      </EnterGroup>
    </div>
  );
}

// Avatar cards as profile cards (layout "people"): the photo in a circle with a
// magenta ring offset behind it, then the name in brand blue, the role as a
// small label (the card's title is "Name, Role"), and the text - each profile on
// a white card, lifting a little on hover.
function PeopleRow({ section, items }) {
  return (
    <div>
      <Enter preset="drop" className="text-center">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"><TwoToneTitle title={section.title} /></h2>
        <span aria-hidden="true" className="mx-auto mt-3 block h-1 w-14 rounded-full bg-accent-500" />
      </Enter>
      <EnterGroup className="mx-auto mt-9 grid max-w-6xl gap-10 md:grid-cols-2 md:gap-14" stagger={0.12}>
        {items.map((item, i) => {
          const [name, ...roleParts] = String(item.title || "").split(/\s*,\s*/);
          const role = roleParts.join(", ");
          return (
            <EnterItem key={i} preset="spring" className="h-full">
              <article className="flex h-full items-start gap-5 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-brand-100/70 transition duration-300 hover:-translate-y-1 hover:shadow-card sm:p-7">
                {item.image && (
                  <div className="relative shrink-0">
                    <span aria-hidden="true" className="absolute -bottom-1.5 -right-1.5 h-full w-full rounded-full border-2 border-accent-400" />
                    <div className="relative h-28 w-28 overflow-hidden rounded-full bg-white shadow-lift sm:h-32 sm:w-32">
                      <Pic src={item.image} alt={name} sizes="128px" className="h-full w-full object-cover" />
                    </div>
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold tracking-tight text-brand-600">{name}</h3>
                  {role && <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">{role}</p>}
                  {item.text && <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">{item.text}</p>}
                </div>
              </article>
            </EnterItem>
          );
        })}
      </EnterGroup>
    </div>
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
          <Pic src={section.image} alt="" sizes="(min-width: 1024px) 560px, 92vw" className="h-full w-full object-cover" />
        </Enter>
      )}
    </div>
  );
}

function BulletList({ section }) {
  const items = splitItems(section.body);
  if (!items.length) return null;
  if (section.config?.layout === "strip") return <FeatureStrip section={section} items={items} />;
  return (
    <div className="mx-auto max-w-6xl">
      <Enter preset="drop">
        <Heading title={section.title} align="center" />
      </Enter>
      <EnterGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
        {items.map((item, i) => (
          <EnterItem key={i} preset="wipe" className="h-full">
            {/* Each point lifts and leans a little under the pointer; the
                tick floats in front of its card. */}
            <Tilt max={8} lift={1.03} className="h-full">
              <div className="group relative flex h-full flex-col items-start gap-4 overflow-hidden rounded-2xl bg-white p-6 shadow-soft ring-1 ring-brand-100/70 transition hover:shadow-card hover:ring-brand-200 [transform-style:preserve-3d]">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent-500 transition-transform duration-500 group-hover:scale-x-100"
                />
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-[0_12px_20px_-8px_rgba(57,49,133,0.55)] transition-colors duration-300 group-hover:bg-accent-500 [transform:translateZ(30px)]">
                  <PointIcon text={item} />
                </span>
                <span className="font-display text-lg font-semibold leading-snug text-ink">{item}</span>
              </div>
            </Tilt>
          </EnterItem>
        ))}
      </EnterGroup>
    </div>
  );
}

// The two streams a library is split into (layout "streams"): one soft card per
// range, tinted in the range's own colours, with a round icon on white, the
// range name as the heading and its description beneath. A line reads
// "Poultry: text"; the range colours come from the name.
function StreamCards({ section, items }) {
  return (
    <div>
      <Enter preset="drop" className="text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          <TwoToneTitle title={section.title} />
        </h2>
      </Enter>
      <EnterGroup className="mx-auto mt-9 grid max-w-6xl gap-6 md:grid-cols-2" stagger={0.12}>
        {items.map((item, i) => {
          const [heading, ...rest] = item.split(/s*:s*/);
          const text = rest.join(": ");
          return (
            <EnterItem key={i} preset="spring" className="h-full">
              <article style={rangeThemeVars(rangeThemeFor(heading))} className="flex h-full items-start gap-5 rounded-3xl bg-(--range-soft) p-6 sm:p-8">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-(--range-accent) shadow-sm">
                  <PointIcon text={heading} size={28} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-(--range-text)">{heading}</h3>
                  {text && <p className="mt-2 text-base leading-7 text-ink-soft">{text}</p>}
                </div>
              </article>
            </EnterItem>
          );
        })}
      </EnterGroup>
    </div>
  );
}

// A range's articles (layout "articles"): the range title with its count in
// the range's colour, then each article as a white card - a numeral chip, the
// title, and a document icon - in a grid that lifts on hover.
function ArticleGrid({ section, items }) {
  const theme = rangeThemeFor(section.title);
  return (
    <div style={rangeThemeVars(theme)}>
      <Enter preset="drop" className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-brand-600 sm:text-3xl">{section.title}</h2>
        <p className="rounded-full bg-(--range-soft) px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-(--range-text)">
          {items.length} {items.length === 1 ? "article" : "articles"}
        </p>
      </Enter>
      <EnterGroup className="mx-auto mt-6 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
        {items.map((item, i) => {
          const [heading, ...rest] = item.split(/s*:s*/);
          const text = rest.join(": ");
          return (
            <EnterItem key={i} preset="spring" className="h-full">
              <article className="group flex h-full flex-col rounded-2xl border border-brand-100 bg-white p-5 shadow-[0_10px_24px_-18px_rgba(57,49,133,0.4)] transition duration-300 hover:-translate-y-1 hover:border-(--range-ring) hover:shadow-[0_20px_36px_-20px_rgba(57,49,133,0.5)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--range-soft) font-display text-sm font-bold text-(--range-text)">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <FileText size={20} aria-hidden="true" className="text-(--range-accent) transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-ink">{heading}</h3>
                {text && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>}
              </article>
            </EnterItem>
          );
        })}
      </EnterGroup>
    </div>
  );
}

// Which product range a list belongs to, from its title ("Poultry (Avinova)"):
// its own colours (lib/categoryTheme.js), or the Provet purple when none fits.
function rangeThemeFor(title) {
  const t = String(title || "").toLowerCase();
  const slug = /avinova|poultry/.test(t) ? "avinova" : /blunova|aqua/.test(t) ? "blunova" : /bovinova|cattle|dairy/.test(t) ? "bovinova" : null;
  return categoryTheme(slug ? { slug } : null);
}

// A titled list as open rows, not a grid of boxes (chosen per section in
// ContentPage): the title, a rule and the count on the left, in the range's
// colour, with a picture of the range under them; the entries on the right, each a document icon and its text, set
// large, spaced apart with no frames or dividers. The text is the admin's
// "Heading: text" lines, as in the card version.
function ReportList({ section, items }) {
  const theme = rangeThemeFor(section.title);
  return (
    <div style={rangeThemeVars(theme)} className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)] lg:gap-16">
      <Enter preset="slideRight" className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{section.title}</h2>
        <span aria-hidden="true" className="mt-4 block h-1.5 w-14 rounded-full bg-(--range-accent)" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-(--range-text)">
          {items.length} {items.length === 1 ? "report" : "reports"}
        </p>
        {section.config?.listImage && (
          <div className="relative mt-5 aspect-[16/9] max-w-xs overflow-hidden rounded-3xl shadow-lift">
            <Pic src={section.config.listImage} alt="" sizes="(min-width: 1024px) 360px, 92vw" className="h-full w-full object-cover" />
          </div>
        )}
      </Enter>
      <EnterGroup className="space-y-3" stagger={0.08}>
        {items.map((item, i) => {
          const [heading, ...rest] = item.split(/\s*:\s*/);
          const text = rest.join(": ");
          return (
            <EnterItem key={i} preset="slideLeft">
              {/* Each entry sits on a soft tint of the range's own colour (amber
                  for poultry, blue for aquaculture), with the icon on white. */}
              <article className="flex gap-4 rounded-2xl bg-(--range-soft) px-4 py-4 transition-colors duration-300 hover:bg-(--range-soft)/70 sm:px-5">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-(--range-accent) shadow-sm">
                  <FileText size={19} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold leading-snug text-ink sm:text-xl">{heading}</h3>
                  {text && <p className="mt-1.5 leading-relaxed text-ink-soft">{text}</p>}
                </div>
              </article>
            </EnterItem>
          );
        })}
      </EnterGroup>
    </div>
  );
}

// "Heading: text" per line, falling back to the whole line as the heading
// when the admin didn't use a separator.
function Cards({ section }) {
  const items = splitItems(section.body);
  if (!items.length) return null;
  if (section.config?.layout === "list") return <ReportList section={section} items={items} />;
  if (section.config?.layout === "journey") return <JourneyCards section={section} items={items} />;
  if (section.config?.layout === "newsroom") return <NewsList section={section} items={items} />;
  if (section.config?.layout === "streams") return <StreamCards section={section} items={items} />;
  if (section.config?.layout === "articles") return <ArticleGrid section={section} items={items} />;
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
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 font-display text-sm font-bold text-white shadow-[0_12px_20px_-8px_rgba(72,62,168,0.6)] [transform:translateZ(50px)]">
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
    <div className="mx-auto max-w-5xl">
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
  if (section.config.layout === "people") return <PeopleRow section={section} items={items} />;
  if (section.config.layout === "zigzag") return <EventZigzag section={section} items={items} />;
  const aspect = ASPECT[section.config.aspect] || ASPECT.square;
  const isAvatar = section.config.imageStyle === "avatar";
  // Photo cards in a grid when the admin picks that style - and always for
  // landscape pictures (event photos), which don't suit a book shelf.
  const isCardGrid = !isAvatar && (section.config.imageStyle === "card" || section.config.aspect === "landscape");
  // The admin "Columns" setting: people per row, or covers visible across
  // the shelf on desktop (more than that scroll).
  const columns = section.config.columns || 3;

  // Tall photo panels that open out on hover, on a light background.
  if (section.config.imageStyle === "accordion" && items.some((it) => it.image)) {
    return <ImageAccordion section={section} items={items} />;
  }

  // Magazine issues: the latest featured, the rest on a rack.
  if (section.config.imageStyle === "magazine") {
    return <MagazineRack section={section} items={items} columns={columns} settings={section.magazineSettings} recentYears={section.magazineRecentYears} />;
  }

  // Technical booklets: numbered, stapled reference volumes.
  if (section.config.imageStyle === "booklet" && items.some((it) => it.image)) {
    return <BookletShelf section={section} items={items.filter((it) => it.image)} columns={columns} />;
  }

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
                    // Phones take a wider crop: a full-width portrait or
                    // square photo made every card most of a screen tall.
                    <div className={clsx("overflow-hidden bg-mist-100 max-sm:aspect-[4/3]", aspect)}>
                      <Pic
                        src={item.image}
                        alt={item.title || ""}
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  {(item.title || item.text) && (
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <span aria-hidden="true" className="mb-3 block h-1 w-10 rounded-full bg-accent-500" />
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
                        className="absolute inset-0 rounded-3xl bg-accent-400 [transform:translate(8px,8px)]"
                      />
                      <div className="relative h-full w-full overflow-hidden rounded-3xl bg-mist-100 [transform:translateZ(40px)]">
                        <Pic src={item.image} alt={item.title || ""} sizes="(min-width: 1024px) 320px, 70vw" className="h-full w-full object-cover" />
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
                <Pic src={item.image} alt={item.title || ""} sizes="(min-width: 1024px) 320px, 70vw" className="h-full w-full object-cover" />
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

// YouTube videos. Each zooms in (the picture itself settles, rather than the
// box travelling), and the layout follows the count: one video plays wide and
// centred, two sit side by side, more make a grid. "Featured" gives the first
// video the full width and lines the rest up beneath it.
function Videos({ section }) {
  // Links are validated on save; this also drops anything that slipped past
  // (an older row, a hand-edited database) instead of rendering a dead player.
  const items = (section.config.items || []).filter((item) => item && isYouTubeUrl(item.url));
  if (!items.length) return null;

  const featured = section.config.layout === "featured" && items.length > 1;
  const [lead, ...rest] = items;
  const grid = featured ? rest : items;

  const gridClass = clsx(
    "grid gap-6",
    grid.length === 1 && "mx-auto max-w-4xl",
    grid.length === 2 && "sm:grid-cols-2",
    grid.length >= 3 && "sm:grid-cols-2 lg:grid-cols-3"
  );

  return (
    <div>
      <Enter preset="drop">
        <Heading title={section.title} description={section.body} align="center" />
      </Enter>
      {featured && (
        <Enter preset="zoom" className="mx-auto mb-8 max-w-5xl">
          <VideoItem item={lead} large />
        </Enter>
      )}
      <EnterGroup className={gridClass} stagger={0.1}>
        {grid.map((item, i) => (
          <EnterItem key={`${item.url}-${i}`} preset="zoom">
            <VideoItem item={item} large={grid.length === 1} />
          </EnterItem>
        ))}
      </EnterGroup>
    </div>
  );
}

function VideoItem({ item, large = false }) {
  return (
    <figure>
      <YouTubePlayer url={item.url} title={item.title} />
      {(item.title || item.text) && (
        <figcaption className={clsx("mt-3", large && "text-center")}>
          {item.title && (
            <span className={clsx("block font-display font-semibold text-ink", large ? "text-lg" : "text-base")}>
              {item.title}
            </span>
          )}
          {item.text && <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{item.text}</span>}
        </figcaption>
      )}
    </figure>
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
      {/* A centred row sized to the cards, not a fixed six-column grid: with
          only two ranges the grid left two small cards at the far left of an
          empty band. Any count now sits centred and wraps evenly. */}
      <EnterGroup className="flex flex-wrap justify-center gap-4 sm:gap-5" stagger={0.06}>
        {section.categories.map((category) => (
          <EnterItem key={category.id} preset="pop" className="w-[calc(50%-0.5rem)] sm:w-56 lg:w-64">
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
  // A full-width band (chosen per section in ContentPage; the band's colour is
  // set in PageSections): centred text and the admin's buttons, no panel. On the
  // dark band a "primary" button turns white and an "outline" one white-edged,
  // so each stays legible and keeps its meaning.
  // A call to action as one row (layout "bar", chosen in ContentPage): the text
  // on the left and the admin's buttons on the right, on a soft band.
  if (section.config?.layout === "bar") {
    return (
      <Enter preset="blur" className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 md:flex-row md:items-center md:gap-10">
        <div className="min-w-0">
          {section.title && <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{section.title}</h2>}
          {section.body && <p className="mt-2 text-lg leading-relaxed text-brand-100">{section.body}</p>}
        </div>
        {buttons.length > 0 && (
          <div className="flex shrink-0 flex-wrap gap-3">
            {buttons.map((button, i) => (
              <Link
                key={i}
                href={button.href}
                {...(button.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={BUTTON_CLASS[button.style] || "btn-accent"}
              >
                {button.label}
              </Link>
            ))}
          </div>
        )}
      </Enter>
    );
  }
  if (section.config?.layout === "band") {
    const BAND_BUTTON = {
      accent: "btn-accent",
      primary: "btn bg-white text-brand-700 hover:bg-brand-50",
      outline: "btn border border-white/50 text-white hover:bg-white/10",
    };
    return (
      <Enter preset="blur" className="mx-auto max-w-3xl text-center">
        {section.title && (
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{section.title}</h2>
        )}
        <span aria-hidden="true" className="mx-auto mt-4 block h-1 w-14 rounded-full bg-accent-400" />
        {section.body && <p className="mt-5 text-lg leading-relaxed text-brand-100">{section.body}</p>}
        {buttons.length > 0 && (
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {buttons.map((button, i) => (
              <Link
                key={i}
                href={button.href}
                {...(button.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={BAND_BUTTON[button.style] || "btn-accent"}
              >
                {button.label}
              </Link>
            ))}
          </div>
        )}
      </Enter>
    );
  }
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
      className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-brand-100 bg-brand-50 px-6 py-12 text-center shadow-card sm:px-12"
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
  videos: Videos,
  cta: Cta,
};

// The section types that stand up in 3D on scroll (see below).
const TILTED_TYPES = new Set(["cards", "imageCards", "productGrid", "categoryGrid"]);

// `offset`: where these sections fall in the alternation when they are
// rendered apart from their siblings (the homepage interleaves added sections
// with its own, one at a time).
// `flat`: single-colour bands (the homepage): light navy tints alternating, no glow.
// `navy`: a navy-and-white palette (the About pages) - white, light navy,
// medium navy and deep navy in a cycle. Dark bands only go to the types whose
// text sits straight on the band (headings over cards); prose in a card and the
// CTA panel stay on white or light navy.
const NAVY_CYCLE = ["white", "light", "medium", "white", "light", "deep"];
const NAVY_DARK_TYPES = new Set(["list", "cards", "imageCards"]);
const NAVY_CLASS = {
  white: "bg-white",
  light: "bg-brand-100",
  medium: "bg-brand-600 [&_h2]:text-white [&_.band-desc]:text-brand-100",
  deep: "bg-brand-800 [&_h2]:text-white [&_.band-desc]:text-brand-200",
};

function navySurfaces(sections, offset) {
  const out = [];
  sections.forEach((section, index) => {
    let surface = NAVY_CYCLE[(index + offset) % NAVY_CYCLE.length];
    if ((surface === "medium" || surface === "deep") && !NAVY_DARK_TYPES.has(section.type)) surface = "light";
    if (surface === out[index - 1]) surface = surface === "white" ? "light" : "white";
    out.push(surface);
  });
  return out;
}

// The Who We Are page's open layouts (ContentPage): each section type + layout
// has its own band background and padding, so none of them takes the default
// alternating bands.
const OPEN_BANDS = {
  "richText:statement": { bg: "bg-white", pad: "py-9 sm:py-10" },
  "cards:journey": { bg: "bg-brand-50", pad: "py-10 sm:py-14" },
  "cards:newsroom": { bg: "bg-white", pad: "py-12 sm:py-16" },
  "cards:streams": { bg: "bg-white", pad: "pb-4 pt-10 sm:pb-6 sm:pt-12" },
  "cards:articles": { bg: "bg-white", pad: "py-8 sm:py-10" },
  "list:strip": { bg: "bg-white", pad: "py-12 sm:py-16" },
  "imageCards:people": { bg: "bg-brand-100", pad: "py-10 sm:py-14" },
  "imageCards:zigzag": { bg: "bg-white", pad: "py-12 sm:py-16" },
  "cta:bar": { bg: "bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600", pad: "py-8 sm:py-10" },
};

export default function PageSections({ sections, offset = 0, flat = false, navy = false }) {
  if (!sections?.length) return null;
  const surfaces = navy ? navySurfaces(sections, offset) : [];

  // Bands alternate white / tinted so neighbouring sections never merge into
  // one another. Every type takes part, the CTA included - it supplies its
  // own dark panel inside the band rather than colouring the band itself.
  return (
    <>
      {sections.map((section, index) => {
        const Renderer = RENDERERS[section.type];
        if (!Renderer) return null;

        const tinted = (index + offset) % 2 === 1;
        // The magazine library always sits on plain white.
        const isMagazine = section.type === "imageCards" && section.config?.imageStyle === "magazine";
        // Open layouts chosen in ContentPage: a list on a white/tinted band, a
        // closing call to action on a full-width purple band.
        const isList = section.type === "cards" && section.config?.layout === "list";
        const isCtaBand = section.type === "cta" && section.config?.layout === "band";
        const openBand = OPEN_BANDS[`${section.type}:${section.config?.layout}`];
        // The editorial opening (see EditorialIntro) sits close above whatever
        // follows it: a short band, so the page does not open with a wide gap
        // between the note and the first thing under it.
        const isEditorialIntro = section.type === "richText" && section.config?.layout === "editorial";

        return (
          <section
            key={section.key}
            className={clsx(
              "relative overflow-hidden",
              openBand ? openBand.pad : isEditorialIntro ? "pb-2 pt-10 sm:pb-3 sm:pt-12" : flat ? "py-10 sm:py-12" : "py-12 sm:py-16",
              openBand ? openBand.bg : isCtaBand ? "bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800" : isList ? (tinted ? "bg-mist-50/60" : "bg-white") : isMagazine ? "bg-white" : navy ? NAVY_CLASS[surfaces[index]] : flat ? (tinted ? "bg-brand-600 [&_h2]:text-white [&_.band-desc]:text-brand-100" : "bg-white") : tinted ? "bg-mist-50/60" : "bg-white"
            )}
          >
            {tinted && !flat && !navy && (
              // The same soft brand glow the homepage's tinted band uses, so
              // the strip doesn't read as a flat grey box.
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(57,49,133,0.07),transparent_70%)]"
              />
            )}
            <div className="container-page relative">
              {/* Sets of cards and pictures stand up in 3D as they scroll into
                  view - the lift gives a grid depth. Text, lists, videos,
                  maps and the CTA hold still: with every band swinging, the
                  whole page moved and nothing stood out. */}
              {/* The magazine library does not lean in: the lean shifts a band
                  down until it scrolls into view, which left a wide empty gap
                  between the page's opening note and the library. */}
              {TILTED_TYPES.has(section.type) && !isMagazine && !isList && !openBand ? (
                <ScrollTilt amount={12}>
                  <Renderer section={section} />
                </ScrollTilt>
              ) : (
                <Renderer section={section} />
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
