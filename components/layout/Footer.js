import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import SocialLinks from "@/components/ui/SocialLinks";
import { getActiveSocialLinks } from "@/lib/data";

export default async function Footer() {
  const socialLinks = await getActiveSocialLinks();

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
          <SocialLinks links={socialLinks} variant="dark" className="mt-5" />
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
