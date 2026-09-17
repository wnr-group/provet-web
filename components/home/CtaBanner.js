import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

export default function CtaBanner() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-3xl bg-accent-400 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/20" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand-700/10" />
          <div className="relative mx-auto max-w-xl">
            <h2 className="font-display text-2xl font-bold text-brand-900 sm:text-3xl">
              Need help choosing the right product for your clinic?
            </h2>
            <p className="mt-3 text-brand-800/80">
              Our veterinary specialists are ready to guide you through composition, dosage and
              suitability for your practice.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn bg-brand-800 text-white hover:bg-brand-900">
                Send an Enquiry <ArrowRight size={16} />
              </Link>
              <a href="tel:+914422442124" className="btn bg-white text-brand-800 hover:bg-white/90">
                <PhoneCall size={16} /> +91 44 2244 2124
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
