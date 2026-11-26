import { Award, Microscope, Users, Target } from "lucide-react";
import { getContentSections, getAddedSections } from "@/lib/data";
import { parseStatItems } from "@/lib/contentFormat";
import { withAboutDefaults } from "@/lib/aboutContent";
import PageSections from "@/components/sections/PageSections";
import CtaBanner from "@/components/home/CtaBanner";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import PageBanner from "@/components/ui/PageBanner";
import Pic from "@/components/ui/Pic";
import OurStory from "@/components/about/OurStory";
import VisionMission from "@/components/about/VisionMission";
import WhyUs from "@/components/home/WhyUs";

const ICONS = { mission: Target, quality: Award, team: Users };

// See app/(public)/page.js for why this is needed - otherwise admin edits to
// the About content blocks wouldn't show up without a rebuild.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Provet's mission to deliver quality, research-backed veterinary medicine to clinics and animal owners.",
};

// Everything on this page is a block in Admin > Website Content > About Us
// (lib/aboutContent.js) - the banner, story, values, Why Provet and the
// closing call to action.
export default async function About() {
  const [sections, added] = await Promise.all([getContentSections("about"), getAddedSections("about")]);
  const blocks = withAboutDefaults(sections);
  const shown = (key) => blocks.find((s) => s.key === key && s.isVisible !== false) || null;
  const banner = shown("banner");
  const story = shown("story");
  const visionBlock = shown("vision");
  const missionBlock = shown("mission");
  const whyUs = shown("why-us");
  const figureBlock = shown("why-us-figure");
  const figure = figureBlock ? parseStatItems(figureBlock.body).find((f) => f.value) || null : null;
  const cta = shown("cta");

  // Vision and Mission here are this page's own blocks; the Who We Are page
  // keeps separate ones.
  const vision = visionBlock?.body || null;
  const mission = missionBlock?.body || null;

  // The "What We Stand For" cards: Quality Commitment and Our Team. Sections
  // the admin adds render further down, through PageSections.
  const values = ["quality", "team"].map(shown).filter(Boolean);

  return (
    <div>
      {/* Layered: two farm scenes - cattle at pasture in front, goats set
          back - with the years figure floating nearest. Deliberately not the
          homepage's hero photos, so the About page has its own look. */}
      <PageBanner
        variant="layered"
        eyebrow="About Us"
        title={banner?.title || "About Us"}
        description={banner?.body || undefined}
        image={banner?.image || "https://images.unsplash.com/photo-1549488235-42996ae3b650?auto=format&fit=crop&w=1000&h=800&q=80"}
        imageAlt="Cattle grazing on a farm pasture"
        secondaryImage="https://images.unsplash.com/photo-1593750187970-84858a2aaf5e?auto=format&fit=crop&w=900&h=700&q=80"
        chip={{ value: "15+", label: "Years in animal health" }}
      />

      <OurStory story={story} />

      <VisionMission vision={vision} mission={mission} />

      {values.length > 0 && (
        <section className="bg-white">
          {/* Open, not boxed: the title and a picture on the left, the two values
              on the right as soft-tinted rows - the same arrangement as the
              Trial Reports lists. A light band, so the copy leads rather than a
              heavy background. */}
          <div className="container-page py-10 sm:py-14">
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)] lg:gap-16">
              <Reveal className="text-center">
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">What We Stand For</h2>
                <span aria-hidden="true" className="mx-auto mt-4 block h-1.5 w-14 rounded-full bg-accent-500" />
                <div className="relative mx-auto mt-6 aspect-[16/9] max-w-xs overflow-hidden rounded-3xl shadow-lift">
                  <Pic src="/content/hero/05-farm-animals.jpg" alt="" sizes="(min-width: 1024px) 320px, 92vw" className="h-full w-full object-cover" />
                </div>
              </Reveal>

              <RevealGroup className="space-y-3" stagger={0.1}>
                {values.map((section) => {
                  const Icon = ICONS[section.key] || Microscope;
                  return (
                    <RevealItem key={section.key}>
                      <article className="group flex gap-5 rounded-2xl bg-brand-50 p-5 transition-colors duration-300 hover:bg-brand-100/70 sm:p-6">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-400 text-white shadow-[0_10px_22px_-8px_rgba(229,9,127,0.6)] transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
                          <Icon size={24} aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-display text-xl font-bold tracking-tight text-brand-600 sm:text-2xl">{section.title}</h3>
                          <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-ink-soft sm:text-lg">{section.body}</p>
                        </div>
                      </article>
                    </RevealItem>
                  );
                })}
              </RevealGroup>
            </div>
          </div>
        </section>
      )}

      {whyUs && <WhyUs section={whyUs} figure={figure} />}

      {/* Sections added in Admin > Website Content > About Us. */}
      <PageSections navy offset={3} sections={added} />

      {cta && <CtaBanner title={cta.title || undefined} body={cta.body} />}
    </div>
  );
}
