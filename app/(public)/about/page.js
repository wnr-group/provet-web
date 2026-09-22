import { Award, Microscope, Users, Target } from "lucide-react";
import { getContentSections } from "@/lib/data";
import CtaBanner from "@/components/home/CtaBanner";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";

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
      <div className="relative isolate overflow-hidden bg-brand-900 py-14 text-center text-white sm:py-20">
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed decorative background, not a dynamic host */}
        <img
          src="https://images.unsplash.com/photo-1498191923457-88552caeccb3?auto=format&fit=crop&w=1920&h=800&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(21,18,48,0.92),rgba(21,18,48,0.8)_55%,rgba(21,18,48,0.9))]" />
        <Reveal mode="mount" className="container-page">
          <span className="badge bg-white/10 text-accent-200">About Provet</span>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-extrabold sm:text-4xl">
            {story?.title || "Dedicated to Better Animal Health"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-brand-100">
            {story?.body ||
              "For over 15 years, Provet has partnered with veterinarians and clinics to deliver reliable, research-backed animal healthcare products."}
          </p>
        </Reveal>
      </div>

      {team && (
        <div className="container-page grid items-center gap-10 pt-14 sm:pt-20 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-mist-100">
              {/* eslint-disable-next-line @next/next/no-img-element -- fixed decorative photo, not a dynamic host */}
              <img
                src={TEAM_PHOTO}
                alt="A veterinarian warmly examining a dog, representing the Provet team"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
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
              <RevealItem key={section.key} className="card p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{section.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft whitespace-pre-line">{section.body}</p>
              </RevealItem>
            );
          })}
      </RevealGroup>

      <CtaBanner />
    </div>
  );
}
