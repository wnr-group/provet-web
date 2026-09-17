"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 bg-white/90 backdrop-blur transition-shadow duration-300",
        scrolled ? "shadow-card" : "shadow-none"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image src="/logo-mark.png" alt="" width={36} height={36} className="h-8 w-8 sm:h-9 sm:w-9" />
          <span className="font-display text-xl font-extrabold tracking-tight text-brand-700">Provet</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = isActivePath(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition",
                  active ? "text-brand-700" : "text-ink-soft hover:text-brand-700"
                )}
              >
                {l.label}
                {active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent-500" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/contact" className="btn-accent">
            Enquire Now <ArrowRight size={16} />
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-brand-700 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-100 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((l) => {
              const active = isActivePath(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "rounded-lg px-3 py-2.5 text-sm font-medium",
                    active ? "bg-brand-50 text-brand-700" : "text-ink-soft"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link href="/contact" className="btn-accent mt-2 w-full" onClick={() => setOpen(false)}>
              Enquire Now <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
