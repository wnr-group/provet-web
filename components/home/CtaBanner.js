import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CenterReveal, Parallax } from "@/components/motion/effects";

export default function CtaBanner() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        {/* CTA identity: the panel expands out of its own centre, then the
            headline, copy and buttons rise inside it. Nothing slides in from
            an edge - this is the one band on the page that should feel like it
            opened rather than arrived, which is what separates it from the
            content sections either side. */}
        <CenterReveal className="relative overflow-hidden rounded-3xl bg-accent-400 px-6 py-12 text-center sm:px-12 sm:py-16">
          {/* The two orbs drift against the scroll, giving the panel depth
              without anything looping forever in the corner of the eye. */}
          <Parallax
            distance={26}
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56"
            aria-hidden="true"
          >
            <span className="block h-full w-full rounded-full bg-white/20" />
          </Parallax>
          <Parallax
            distance={-18}
            className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56"
            aria-hidden="true"
          >
            <span className="block h-full w-full rounded-full bg-brand-700/10" />
          </Parallax>

          <RevealGroup className="relative mx-auto max-w-xl" stagger={0.1} delay={0.15}>
            <RevealItem distance={16}>
              <h2 className="font-display text-2xl font-bold text-brand-900 sm:text-3xl">
                Need help choosing the right product for your clinic?
              </h2>
            </RevealItem>
            <RevealItem distance={14}>
              <p className="mt-3 text-brand-800/80">
                Our veterinary specialists are ready to guide you through composition, dosage and
                suitability for your practice.
              </p>
            </RevealItem>
            <RevealItem distance={12}>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="btn group bg-brand-800 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-brand-900"
                >
                  Send an Enquiry
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <a
                  href="tel:+914422442124"
                  className="btn group bg-white text-brand-800 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/90"
                >
                  <PhoneCall size={16} className="transition-transform duration-200 group-hover:-rotate-12" />
                  +91 44 2244 2124
                </a>
              </div>
            </RevealItem>
          </RevealGroup>
        </CenterReveal>
      </div>
    </section>
  );
}
