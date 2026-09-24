import { MapPin, Phone, Mail, Clock, Info } from "lucide-react";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import ContactForm from "@/components/contact/ContactForm";
import SocialLinks from "@/components/ui/SocialLinks";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import LocationCards from "@/components/sections/LocationCards";
import { getActiveSocialLinks, getContentSections, getFeedbackForm } from "@/lib/data";
import { withContactDefaults, parseDetailLines } from "@/lib/contactContent";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Provet for product enquiries, bulk orders or veterinary support.",
};

// The contact details are free-form "Heading: value" lines the admin writes,
// so the icon is picked from the heading's wording rather than its position.
function detailIcon(label) {
  const text = label.toLowerCase();
  if (/visit|address|office|location/.test(text)) return MapPin;
  if (/call|phone|tel|mobile/.test(text)) return Phone;
  if (/mail/.test(text)) return Mail;
  if (/hour|time|open/.test(text)) return Clock;
  return Info;
}

// A value that is a phone number or an email address becomes a link. Phone
// values may hold several numbers ("+91 44 2244 2124 / +91 44 2244 2127"),
// so each is linked on its own.
function DetailValue({ label, value }) {
  if (/mail/i.test(label) && /^\S+@\S+\.\S+$/.test(value)) {
    return (
      <a href={`mailto:${value}`} className="hover:text-accent-600">
        {value}
      </a>
    );
  }
  if (/call|phone|tel|mobile/i.test(label)) {
    const parts = value.split(/\s*\/\s*/);
    return parts.map((part, i) => (
      <span key={part}>
        {i > 0 && " / "}
        <a href={`tel:${part.replace(/[^\d+]/g, "")}`} className="hover:text-accent-600">
          {part}
        </a>
      </span>
    ));
  }
  return value;
}

export default async function Contact({ searchParams }) {
  const params = await searchParams;
  const productName = params.product || "";
  // Social links: same admin config the footer reads - no separate Contact-page setting.
  const [socialLinks, feedback, content] = await Promise.all([
    getActiveSocialLinks(),
    getFeedbackForm(),
    getContentSections("contact"),
  ]);

  // Admin > Website Content > Contact Us. Blocks never saved fall back to the
  // defaults in lib/contactContent.js; a block the admin hid is dropped.
  const blocks = Object.fromEntries(withContactDefaults(content).map((s) => [s.key, s]));
  const visible = (key) => (blocks[key]?.isVisible === false ? null : blocks[key]);
  const hero = visible("hero");
  const details = visible("details");
  const branches = visible("branches");
  const detailLines = parseDetailLines(details?.body);

  return (
    <div className="bg-mist-50/40">
      <div className="relative isolate overflow-hidden bg-brand-900 py-14 text-center text-white sm:py-20">
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed decorative background, not a dynamic host */}
        <img
          src="https://images.unsplash.com/photo-1770836037289-e00e5f351d11?auto=format&fit=crop&w=1920&h=800&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(21,18,48,0.92),rgba(21,18,48,0.8)_55%,rgba(21,18,48,0.9))]" />
        <Reveal mode="mount" className="container-page">
          <span className="badge bg-white/10 text-accent-200">Contact</span>
          <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
            {hero?.title || "Contact Us"}
          </h1>
          {hero?.body && <p className="mx-auto mt-3 max-w-lg text-brand-100">{hero.body}</p>}
        </Reveal>
      </div>

      <div className="container-page grid gap-8 py-14 sm:py-20 lg:grid-cols-[1fr_1.3fr]">
        <RevealGroup mode="mount" className="space-y-4">
          {detailLines.map(({ label, value }) => {
            const Icon = detailIcon(label);
            return (
              <RevealItem key={`${label}-${value}`} direction="right" className="card flex items-start gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  {label && <p className="text-sm font-semibold text-ink">{label}</p>}
                  <p className="break-words text-sm text-ink-soft">
                    <DetailValue label={label} value={value} />
                  </p>
                </div>
              </RevealItem>
            );
          })}

          {socialLinks.length > 0 && (
            <RevealItem direction="right" className="card p-5">
              <p className="text-sm font-semibold text-ink">Follow Us</p>
              <p className="mt-1 text-sm text-ink-soft">Stay up to date with our latest products and updates.</p>
              <SocialLinks links={socialLinks} variant="light" className="mt-4" iconSize={16} />
            </RevealItem>
          )}
        </RevealGroup>

        <Reveal direction="left" delay={0.1} mode="mount" className="card p-6 sm:p-8">
          <ContactForm productName={productName} />
        </Reveal>
      </div>

      {branches?.config.items?.length > 0 && (
        <section className="border-t border-brand-100 bg-white">
          <div className="container-page py-14 sm:py-20">
            <Reveal className="mx-auto mb-10 max-w-2xl text-center">
              <span className="badge bg-accent-100 text-accent-700">Across India</span>
              {branches.title && (
                <h2 className="mt-4 font-display text-2xl font-extrabold text-ink sm:text-3xl">{branches.title}</h2>
              )}
              {branches.body && <p className="mx-auto mt-3 max-w-lg text-ink-soft">{branches.body}</p>}
            </Reveal>
            <LocationCards items={branches.config.items} columns={branches.config.columns} />
          </div>
        </section>
      )}

      {/* Separate from the enquiry form above on purpose: an enquiry expects a
          reply, feedback doesn't. Hidden entirely when the admin disables it. */}
      {feedback.config.isEnabled && feedback.fields.length > 0 && (
        <div className="border-t border-brand-100 bg-white">
          <div className="container-page py-14 sm:py-20">
            <Reveal className="mx-auto max-w-2xl">
              <div className="text-center">
                <span className="badge bg-accent-100 text-accent-700">Feedback</span>
                <h2 className="mt-4 font-display text-2xl font-extrabold text-ink sm:text-3xl">
                  {feedback.config.title}
                </h2>
                {feedback.config.description && (
                  <p className="mx-auto mt-3 max-w-lg text-ink-soft">{feedback.config.description}</p>
                )}
              </div>
              <div className="card mt-8 p-6 sm:p-8">
                <FeedbackForm fields={feedback.fields} />
              </div>
            </Reveal>
          </div>
        </div>
      )}
    </div>
  );
}
