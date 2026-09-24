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
        {/* The brand gradient pans very slowly behind the copy - the one
            ambient loop on the page, and it only moves colour, never content. */}
        <CenterReveal className="bg-brand-gradient relative isolate animate-gradient-pan overflow-hidden rounded-3xl px-6 py-12 text-center shadow-[0_30px_60px_-24px_rgba(57,49,133,0.55)] sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="bg-dots pointer-events-none absolute inset-0 -z-10 text-white/10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          />
          {/* The two orbs drift against the scroll, giving the panel depth
              without anything looping forever in the corner of the eye. */}
          <Parallax
            distance={26}
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56"
            aria-hidden="true"
          >
            <span className="block h-full w-full rounded-full bg-white/10 blur-sm" />
          </Parallax>
          <Parallax
            distance={-18}
            className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56"
            aria-hidden="true"
          >
            <span className="block h-full w-full rounded-full bg-accent-400/25 blur-sm" />
          </Parallax>

          <RevealGroup className="relative mx-auto max-w-xl" stagger={0.1} delay={0.15}>
            <RevealItem distance={16}>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Need help choosing the right product for your clinic?
              </h2>
            </RevealItem>
            <RevealItem distance={14}>
              <p className="mt-4 text-brand-100">
                Our veterinary specialists are ready to guide you through composition, dosage and
                suitability for your practice.
              </p>
            </RevealItem>
            <RevealItem distance={12}>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="btn group bg-white text-brand-800 shadow-lift transition-transform duration-200 hover:-translate-y-0.5 hover:bg-mist-50"
                >
                  Send an Enquiry
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <a
                  href="tel:+914422442124"
                  className="btn group bg-white/10 text-white ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/20"
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
