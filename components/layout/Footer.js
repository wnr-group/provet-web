import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.5 21v-8.02h2.69l.4-3.12h-3.09V7.85c0-.9.25-1.52 1.55-1.52h1.66V3.53C15.94 3.43 15.02 3.33 13.94 3.33c-2.24 0-3.77 1.37-3.77 3.87v2.66H7.5v3.12h2.67V21h3.33Z" />
  </svg>
);
const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.9 3h3.2l-7 8 8.2 10.9h-6.4l-5-6.6-5.7 6.6H2l7.5-8.6L1.7 3h6.5l4.5 6 6.2-6Zm-1.1 17h1.8L7.3 4.9H5.4L17.8 20Z" />
  </svg>
);
const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.98 1.83-2 3.77-2 4.03 0 4.78 2.55 4.78 5.86V21h-4v-5.9c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.5-2.3 3.1V21h-4V9Z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo-mark.png" alt="" width={36} height={36} className="h-9 w-9" />
            <span className="font-display text-xl font-extrabold text-white">Provet</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-200">
            Excellence through innovation — solution-oriented veterinary healthcare products
            backed by expert technical guidance.
          </p>
          <div className="mt-5 flex gap-3">
            {[FacebookIcon, TwitterIcon, LinkedinIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-brand-100 transition hover:bg-accent-400 hover:text-brand-900"
              >
                <Icon width={15} height={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-accent-300">Home</Link></li>
            <li><Link href="/products" className="hover:text-accent-300">Products</Link></li>
            <li><Link href="/about" className="hover:text-accent-300">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-accent-300">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Categories</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/products" className="hover:text-accent-300">Antibiotics</Link></li>
            <li><Link href="/products" className="hover:text-accent-300">Anti-parasitics</Link></li>
            <li><Link href="/products" className="hover:text-accent-300">Vaccines</Link></li>
            <li><Link href="/products" className="hover:text-accent-300">Supplements</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Get in Touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-accent-300" />
              <span>
                No. 9, 1st Floor, 2nd Lane, Chakrapani Street, Narasingapuram Extension,
                Maduvankarai, Guindy, Chennai - 600 032
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0 text-accent-300" />
              <span>+91 44 2244 2124</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0 text-accent-300" />
              <span>info@provet.in</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-brand-300 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Provet Pharma Private Limited. All rights reserved.</p>
          <p>Excellence through innovation.</p>
        </div>
      </div>
    </footer>
  );
}
