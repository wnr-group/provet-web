import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import Counter from "@/components/motion/Counter";

const DEFAULT_POINTS = [
  "GMP-certified manufacturing & strict quality control",
  "Formulated with practicing veterinarians and researchers",
  "Reliable cold-chain logistics for sensitive biologicals",
  "Dedicated technical support for clinics and distributors",
];

export default function WhyUs({ section }) {
  const points = section?.body ? section.body.split("\n").filter(Boolean) : DEFAULT_POINTS;

  return (
    <section className="bg-brand-800 py-16 text-white sm:py-20">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <Reveal direction="right">
          <div className="relative">
            <div className="aspect-square max-w-md overflow-hidden rounded-3xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1770836037793-95bdbf190f71?auto=format&fit=crop&w=800&h=800&q=80"
                alt="Veterinarian warmly examining a dog during a clinic visit"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden max-w-[220px] rounded-2xl bg-accent-400 p-5 text-brand-900 shadow-lift sm:block">
              <p className="font-display text-3xl font-extrabold">
                <Counter value="98%" />
              </p>
              <p className="text-sm font-medium">Client satisfaction across partner clinics</p>
            </div>
          </div>
        </Reveal>

        <Reveal direction="left" delay={0.1}>
          <div>
            <span className="badge bg-white/10 text-accent-200">Why Provet</span>
            <h2 className="mt-3 max-w-lg font-display text-2xl font-bold sm:text-3xl">
              {section?.title || "Science-led animal healthcare, delivered reliably"}
            </h2>
            <ul className="mt-7 space-y-4">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent-400" />
                  <span className="text-brand-100">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
