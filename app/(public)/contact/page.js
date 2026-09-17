import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Provet for product enquiries, bulk orders or veterinary support.",
};

export default async function Contact({ searchParams }) {
  const params = await searchParams;
  const productName = params.product || "";

  return (
    <div className="bg-mist-50/40">
      <div className="bg-brand-700 py-14 text-center text-white sm:py-20">
        <Reveal mode="mount" className="container-page">
          <span className="badge bg-white/10 text-accent-200">Contact</span>
          <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">We&apos;re Here to Help</h1>
          <p className="mx-auto mt-3 max-w-lg text-brand-100">
            Reach out for product information, bulk pricing, or veterinary support — our team responds within one
            business day.
          </p>
        </Reveal>
      </div>

      <div className="container-page grid gap-8 py-14 sm:py-20 lg:grid-cols-[1fr_1.3fr]">
        <RevealGroup mode="mount" className="space-y-4">
          {[
            [MapPin, "Visit Us", "No. 9, 1st Floor, 2nd Lane, Chakrapani Street, Guindy, Chennai - 600 032"],
            [Phone, "Call Us", "+91 44 2244 2124"],
            [Mail, "Email Us", "info@provet.in"],
            [Clock, "Working Hours", "Mon – Sat, 9:00 AM – 6:00 PM"],
          ].map(([Icon, title, value]) => (
            <RevealItem key={title} direction="right" className="card flex items-start gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                <Icon size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="text-sm text-ink-soft">{value}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal direction="left" delay={0.1} mode="mount" className="card p-6 sm:p-8">
          <ContactForm productName={productName} />
        </Reveal>
      </div>
    </div>
  );
}
