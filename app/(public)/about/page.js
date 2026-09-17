import { Award, Microscope, Users, Target } from "lucide-react";
import { getContentSections } from "@/lib/data";
import CtaBanner from "@/components/home/CtaBanner";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const ICONS = { story: Target, mission: Target, quality: Award, team: Users };

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

  return (
    <div>
      <div className="bg-brand-700 py-14 text-center text-white sm:py-20">
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

      <RevealGroup className="container-page grid gap-6 py-14 sm:py-20 md:grid-cols-2">
        {sections
          .filter((s) => s.key !== "story")
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
