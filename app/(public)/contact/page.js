import { MapPin, Phone, Mail, Clock, User } from "lucide-react";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import ContactForm from "@/components/contact/ContactForm";
import SocialLinks from "@/components/ui/SocialLinks";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { getActiveSocialLinks, getFeedbackForm } from "@/lib/data";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Provet for product enquiries, bulk orders or veterinary support.",
};

// Branch and distributor (CFA) locations, as listed on the old provet.in
// contact page.
const BRANCHES = [
  {
    label: "Chennai (CWH)",
    address: ["260, First Floor, Gnanam Complex,", "Poonamallee Bye Pass Road,", "Poonamalle, Thiruvallur,", "Tamil Nadu - 600 056"],
    contact: "Rajesh Devan",
    phone: "+91 97908 16924",
  },
  {
    label: "Nashik (CFA)",
    company: "ARV Enterprises",
    address: ["Shop No. 1, Darshan Apartment,", "Upnagar, Nashik,", "Maharashtra - 422 006"],
    contact: "Bablu Kalekar",
    phone: "+91 91464 56873",
  },
  {
    label: "Kolkata (Branch)",
    address: ["268-XII, Makaltala, Bally,", "Durgapur, Howrah,", "West Bengal - 711 205"],
    contact: "Sanjoy Sau",
    phone: "+91 75501 99914",
  },
  {
    label: "Bhimavaram (Branch)",
    address: [
      "19-16-113, Old Jagadamba Rice Mill,",
      "Near Ganganama Temple, Rest House Road,",
      "Bhimavaram, West Godavari District,",
      "Andhra Pradesh - 534 201",
    ],
    contact: "Omkar Vara Prasad",
    phone: "+91 95422 20291",
  },
  {
    label: "Hyderabad (CFA)",
    company: "Sun Vet Enterprises",
    address: ["1-5-1118/1/20, Jannabanda,", "Near St. Paul's School, Old Alwal,", "Secunderabad, Telangana - 500 010"],
    contact: "Shiva Krishna",
    phone: "+91 63000 82953",
  },
  {
    label: "Ambala (CFA)",
    company: "Somya Nutraceuticals",
    address: ["Third Floor, 3-A-3, Alvid House,", "Grand Trunk Road, New Kuldeep Nagar,", "Ambala, Haryana - 133 001"],
    contact: "Sushil",
    phone: "+91 93503 65689",
  },
];

export default async function Contact({ searchParams }) {
  const params = await searchParams;
  const productName = params.product || "";
  // Same admin config the footer reads - no separate Contact-page setting.
  const [socialLinks, feedback] = await Promise.all([getActiveSocialLinks(), getFeedbackForm()]);

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
            [Phone, "Call Us", "+91 44 2244 2124 / +91 44 2244 2127"],
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

      <section className="border-t border-brand-100 bg-white">
        <div className="container-page py-14 sm:py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="badge bg-accent-100 text-accent-700">Across India</span>
            <h2 className="mt-4 font-display text-2xl font-extrabold text-ink sm:text-3xl">Branch Locations</h2>
            <p className="mx-auto mt-3 max-w-lg text-ink-soft">
              Our branches and distribution partners, for stock and support close to your farm.
            </p>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {BRANCHES.map((branch) => (
              <RevealItem key={branch.label} className="h-full">
                <div className="card flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                      <MapPin size={18} />
                    </span>
                    <div>
                      <h3 className="font-display font-semibold text-ink">{branch.label}</h3>
                      {branch.company && <p className="text-xs text-ink-soft">{branch.company}</p>}
                    </div>
                  </div>
                  <address className="mt-4 text-sm not-italic leading-relaxed text-ink-soft">
                    {branch.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <div className="mt-auto space-y-1.5 border-t border-brand-100 pt-4 text-sm">
                    <p className="flex items-center gap-2 text-ink">
                      <User size={14} className="shrink-0 text-accent-600" /> {branch.contact}
                    </p>
                    <a
                      href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-2 font-medium text-brand-700 hover:text-accent-600"
                    >
                      <Phone size={14} className="shrink-0 text-accent-600" /> {branch.phone}
                    </a>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

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
