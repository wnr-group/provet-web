import { Award, Microscope, Users, Target } from "lucide-react";
import { getContentSections, getAddedSections } from "@/lib/data";
import { findHeadedText } from "@/lib/contentFormat";
import { isBuiltInSection } from "@/lib/fixedPages";
import PageSections from "@/components/sections/PageSections";
import CtaBanner from "@/components/home/CtaBanner";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Tilt, ScrollTilt } from "@/components/motion/effects";
import PageBanner from "@/components/ui/PageBanner";
import OurStory from "@/components/about/OurStory";
import VisionMission from "@/components/about/VisionMission";
import WhyUs from "@/components/home/WhyUs";

const ICONS = { mission: Target, quality: Award, team: Users };

// Provet's Vision and Mission are written once, in the "Vision & Mission"
// block on the Who We Are page (Admin > Website Content > Who We Are), as
// "Vision: ..." and "Mission: ..." lines. This page reads the same block, so
// the two pages can never state them differently. If that block has no
// Mission line, this page's own "mission" block stands in.
const VISION_MISSION_PAGE = "about/who-we-are";
const VISION_MISSION_KEY = "vision-mission";

// See app/(public)/page.js for why this is needed - otherwise admin edits to
// the About content blocks wouldn't show up without a rebuild.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Provet's mission to deliver quality, research-backed veterinary medicine to clinics and animal owners.",
};

export default async function About() {
  const [sections, whoWeAre, added, home] = await Promise.all([
    getContentSections("about"),
    getContentSections(VISION_MISSION_PAGE),
    getAddedSections("about"),
    getContentSections("home"),
  ]);
  // Why Provet is still edited as a Homepage block (Admin > Website Content >
  // Homepage), but is shown here.
  const homeBlock = (key) => home.find((s) => s.key === key && s.isVisible !== false);
  const visible = sections.filter((s) => s.isVisible !== false);
  const story = visible.find((s) => s.key === "story");
  const ownMission = visible.find((s) => s.key === "mission");

  const statements = whoWeAre.find((s) => s.key === VISION_MISSION_KEY)?.body;
  const vision = findHeadedText(statements, "Vision");
  const mission = findHeadedText(statements, "Mission") || ownMission?.body || null;

  // The other built-in blocks: Quality Commitment and Our Team. Sections the
  // admin adds render further down, through PageSections.
  const values = visible.filter((s) => isBuiltInSection("about", s.key) && s.key !== "story" && s.key !== "mission");

  return (
    <div>
      {/* Layered: the two ranges - a broiler flock in front, fish-farm cages
          set back - with the years figure floating nearest. */}
      <PageBanner
        variant="layered"
        eyebrow="About Us"
        title="Dedicated to Better Animal Health"
        description="For over 15 years, Provet has partnered with veterinarians and clinics to deliver reliable, research-backed animal healthcare products."
        image="https://images.unsplash.com/photo-1589922583749-6b8473a85048?auto=format&fit=crop&w=1000&h=800&q=80"
        imageAlt="A broiler flock on a commercial poultry farm"
        secondaryImage="https://images.unsplash.com/photo-1723134085909-19da487ac9bd?auto=format&fit=crop&w=900&h=700&q=80"
        chip={{ value: "15+", label: "Years in animal health" }}
      />

      <OurStory story={story} />

      <VisionMission vision={vision} mission={mission} />

      {values.length > 0 && (
        <section className="container-page py-16 sm:py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">What We Stand For</h2>
            <span aria-hidden="true" className="mx-auto mt-4 block h-1 w-14 rounded-full bg-accent-400" />
          </Reveal>
          {/* The grid stands up from a slight lean as it scrolls in. */}
          <ScrollTilt amount={10} className="mt-10">
            <RevealGroup className="grid gap-6 md:grid-cols-2">
              {values.map((section) => {
                const Icon = ICONS[section.key] || Microscope;
                return (
                  <RevealItem key={section.key} className="h-full">
                    {/* 3D card: leans to the pointer, the icon floats in front. */}
                    <Tilt max={10} shadow className="h-full">
                      <div className="card h-full p-7 [transform-style:preserve-3d]">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-[0_12px_20px_-8px_rgba(72,62,168,0.6)] [transform:translateZ(50px)]">
                          <Icon size={20} />
                        </span>
                        <h3 className="mt-4 font-display text-lg font-semibold text-ink">{section.title}</h3>
                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{section.body}</p>
                      </div>
                    </Tilt>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </ScrollTilt>
        </section>
      )}

      <WhyUs section={homeBlock("why-us")} />

      {/* Sections added in Admin > Website Content > About Us. */}
      <PageSections sections={added} />

      <CtaBanner />
    </div>
  );
}
