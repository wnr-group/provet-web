import { notFound } from "next/navigation";
import clsx from "clsx";
import {
  Compass,
  Handshake,
  Heart,
  Leaf,
  Lightbulb,
  Link2,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { getManagedPage } from "@/lib/data";
import { parseHeadedItems } from "@/lib/contentFormat";
import PageBanner from "@/components/ui/PageBanner";
import PageSections from "@/components/sections/PageSections";
import LineMark from "@/components/ui/LineMark";
import Reveal from "@/components/motion/Reveal";
import { DrawLine } from "@/components/motion/effects";
import { Enter, EnterGroup, EnterItem } from "@/components/sections/entrances";
import { DEFAULT_HERO, bannerFor, pageCrumbs } from "@/components/sections/ContentPage";

const PAGE_KEY = "about/core-values";

// Each value's mark (components/ui/LineMark.js), matched on a word in its
// name so it follows the admin's copy; a value that matches nothing gets
// the default pair.
const MARKS = [
  { match: /customer|client/i, icon: Handshake, companion: Heart },
  { match: /performance|result|excellence/i, icon: TrendingUp, companion: Target },
  { match: /entrepreneur|innovat|ownership/i, icon: Lightbulb, companion: Compass },
  { match: /team|together|collaborat/i, icon: Users, companion: Link2 },
  { match: /trust|integrity|honest|respect/i, icon: ShieldCheck, companion: Scale },
];
const DEFAULT_MARK = { icon: Sparkles, companion: Leaf };
const markFor = (name) => MARKS.find((m) => m.match.test(name)) || DEFAULT_MARK;

// The Core Values page (About Us > Core Values). Its content is the admin's
// (Admin > Website Content > Core Values): the banner from the page settings,
// then its blocks -
//
//   intro   an editorial split: the block's title as a small label on the
//           left, its text set large and light on the right.
//   values  one "Name: tagline" per line, as cards on a pale band - three
//           then two, centred - each with an illustrated mark, the name, a
//           magenta rule and the tagline. The same visual language as the
//           homepage trust strip.
//   cta     last, as on every menu page.
//
// Any other block an admin adds renders between the values and the CTA,
// through PageSections, so nothing added in the admin is dropped.
export default async function CoreValuesPage() {
  const data = await getManagedPage(PAGE_KEY);
  if (!data) notFound();
  const { page, sections } = data;

  const intro = sections.find((s) => s.key === "intro");
  const valuesBlock = sections.find((s) => s.key === "values");
  const cta = sections.find((s) => s.key === "cta");
  const rest = sections.filter((s) => !["intro", "values", "cta"].includes(s.key));
  const values = parseHeadedItems(valuesBlock?.body);

  return (
    <div className="bg-white">
      <PageBanner
        {...bannerFor(PAGE_KEY)}
        crumbs={pageCrumbs(PAGE_KEY, page.title)}
        title={page.title}
        description={page.description}
        image={page.heroImage || DEFAULT_HERO}
      />

      {intro?.body && (
        <section className="py-16 sm:py-24">
          <div className="container-page grid gap-6 lg:grid-cols-12 lg:gap-12">
            {/* Motion: the label's rule draws in, then the statement comes into
                focus in place - a quiet read, not a slide. */}
            <Reveal className="lg:col-span-4" distance={8}>
              <p className="flex items-center gap-3 text-sm font-semibold text-accent-600">
                <DrawLine origin="left" className="block h-0.5 w-8 rounded-full bg-accent-400" />
                {intro.title || "Our values"}
              </p>
            </Reveal>
            <Enter preset="blur" delay={0.15} className="lg:col-span-8">
              <p className="whitespace-pre-line text-pretty font-display text-2xl font-normal leading-snug tracking-tight text-brand-800 sm:text-3xl sm:leading-snug">
                {intro.body}
              </p>
            </Enter>
          </div>
        </section>
      )}

      {values.length > 0 && (
        <section className="relative overflow-hidden bg-mist-50 py-16 sm:py-24">
          <div className="container-page">
            {valuesBlock.title && (
              <Reveal distance={12}>
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{valuesBlock.title}</h2>
                <span aria-hidden="true" className="mt-4 block h-1 w-12 rounded-full bg-accent-400" />
              </Reveal>
            )}

            {/* Three then two on large screens, the second row centred: six
                columns, every card spanning two, the fourth card starting
                one column in. Two per row on tablets, one on phones. */}
            {/* Motion: the value cards tip upright one after another, like
                cards being stood on a table - the values' own entrance, unlike
                the fades and wipes elsewhere on the site. */}
            <EnterGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-6" stagger={0.1}>
              {values.map((value, i) => {
                const mark = markFor(value.heading);
                return (
                  <EnterItem
                    key={value.heading}
                    preset="flip"
                    className={clsx(
                      "h-full lg:col-span-2",
                      values.length === 5 && i === 3 && "lg:col-start-2",
                      // An odd last card on the two-column layout spans the row.
                      i === values.length - 1 && values.length % 2 === 1 && "sm:col-span-2 lg:col-span-2"
                    )}
                  >
                    <article className="group flex h-full flex-col rounded-3xl bg-white p-8 ring-1 ring-brand-100 transition duration-500 ease-out hover:-translate-y-1 hover:shadow-hover hover:ring-brand-200">
                      <LineMark icon={mark.icon} companion={mark.companion} backdrop="#fff" />
                      <h3 className="mt-6 font-display text-2xl font-normal tracking-tight text-brand-800 sm:text-[1.7rem]">
                        {value.heading}
                      </h3>
                      <span aria-hidden="true" className="mt-4 block h-0.5 w-10 rounded-full bg-accent-400" />
                      {value.text && <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{value.text}</p>}
                    </article>
                  </EnterItem>
                );
              })}
            </EnterGroup>
          </div>
        </section>
      )}

      <PageSections sections={[...rest, ...(cta ? [cta] : [])]} />
    </div>
  );
}
