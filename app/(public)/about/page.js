import { Award, Microscope, Users, Target } from "lucide-react";
import { getContentSections } from "@/lib/data";
import CtaBanner from "@/components/home/CtaBanner";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/effects";
import PageBanner from "@/components/ui/PageBanner";

const ICONS = { story: Target, mission: Target, quality: Award, team: Users };

const TEAM_PHOTO =
  "https://images.unsplash.com/photo-1770836037793-95bdbf190f71?auto=format&fit=crop&w=800&h=800&q=80";

// See app/(public)/page.js for why this is needed - otherwise admin edits to
// the About content blocks wouldn't show up without a rebuild.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Provet's mission to deliver quality, research-backed veterinary medicine to clinics and animal owners.",
};

export default async function About() {
  const sections = await getContentSections("about");
  const story = sections.find((s) => s.key === "story");
  const team = sections.find((s) => s.key === "team");

  return (
    <div>
      <PageBanner
        eyebrow="About Us"
        title={story?.title || "Dedicated to Better Animal Health"}
        description={
          story?.body ||
          "For over 15 years, Provet has partnered with veterinarians and clinics to deliver reliable, research-backed animal healthcare products."
        }
        image="https://images.unsplash.com/photo-1498191923457-88552caeccb3?auto=format&fit=crop&w=900&h=700&q=80"
        imageAlt="Cattle grazing in an open field"
        chip={{ value: "15+", label: "Years in animal health" }}
      />

      {team && (
        <div className="container-page grid items-center gap-10 pt-14 sm:pt-20 lg:grid-cols-2">
          <Reveal direction="right">
            {/* The team photo as a 3D stack: a gradient plate set back, the
                photo, and a "founded" card floating in front. */}
            <Tilt max={10} shadow className="mx-auto max-w-lg">
            <div className="relative [transform-style:preserve-3d]">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-400 to-accent-400 [transform:translateZ(-40px)_translate(-16px,16px)_rotate(-3deg)]"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist-100 shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element -- fixed decorative photo, not a dynamic host */}
              <img
                src={TEAM_PHOTO}
                alt="A veterinarian warmly examining a dog, representing the Provet team"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-3 rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ring-brand-100 [transform:translateZ(70px)] sm:-right-6">
              <p className="font-display text-xl font-extrabold leading-none text-brand-700">2009</p>
              <p className="mt-1 text-xs font-medium text-ink-soft">Year founded</p>
            </div>
            </div>
            </Tilt>
          </Reveal>
          <Reveal direction="left" delay={0.1}>
            <span className="badge bg-accent-100 text-accent-700">
              <Users size={14} /> Our Team
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">{team.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft whitespace-pre-line">{team.body}</p>
          </Reveal>
        </div>
      )}

      <RevealGroup className="container-page grid gap-6 py-14 sm:py-20 md:grid-cols-2">
        {sections
          .filter((s) => s.key !== "story" && s.key !== "team")
          .map((section) => {
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

      <CtaBanner />
    </div>
  );
}
