"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { MAIN_NAV } from "@/lib/navigation";
import GlobalSearch from "@/components/search/GlobalSearch";

function isActivePath(pathname, href) {
  if (!href) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// A menu item's children: either the fixed list from lib/navigation.js, or
// the live catalogue for the entry flagged `dynamic: "categories"`. Resolving
// it here keeps the nav tree itself declarative.
function resolveChildren(item, categories) {
  if (item.dynamic === "categories") {
    return categories.map((c) => ({ label: c.name, href: `/products?category=${c.slug}` }));
  }
  return item.children || [];
}

// A child's href can carry a query string ("/products?category=x"); activity
// is judged on the path alone.
const pathOf = (href) => href.split("?")[0];

function isBranchActive(pathname, item, children) {
  return isActivePath(pathname, item.href) || children.some((c) => isActivePath(pathname, pathOf(c.href)));
}

export default function Navbar({ categories = [] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Which desktop dropdown is showing, and which mobile group is expanded.
  const [openMenu, setOpenMenu] = useState(null);
  const [openGroup, setOpenGroup] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A menu left open while the page changes underneath is disorienting, so
  // every link closes the menus on the way out. Done on click rather than in
  // an effect watching the pathname: following a link to the page you are
  // already on produces no pathname change, and so would leave it open.
  const closeAll = () => {
    setOpen(false);
    setOpenMenu(null);
    setOpenGroup(null);
  };

  // Click-away and Escape, so a dropdown opened by keyboard or touch can
  // always be dismissed without navigating.
  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 bg-white/90 backdrop-blur transition-shadow duration-300",
        scrolled ? "shadow-card" : "shadow-none"
      )}
    >
      {/* Three zones, with the outer two sharing the leftover space equally
          (flex-1 basis-0). The nav then sits dead-centre in the bar whatever
          the logo and the action cluster happen to measure - justify-between
          only equalises the gaps, which leaves the nav visibly off-centre
          when one side is much wider than the other. */}
      <div className="container-page flex h-16 items-center gap-6 sm:h-20">
        <div className="flex flex-1 basis-0 items-center">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image src="/logo-mark.png" alt="" width={36} height={36} className="h-8 w-8 sm:h-9 sm:w-9" />
            <span className="font-display text-xl font-extrabold tracking-tight text-brand-700">Provet</span>
          </Link>
        </div>

        <nav ref={navRef} className="hidden shrink-0 items-center gap-1 xl:flex">
          {MAIN_NAV.map((item) => {
            const children = resolveChildren(item, categories);
            const active = isBranchActive(pathname, item, children);

            if (!children.length) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeAll}
                  className={clsx(
                    "relative flex h-10 items-center rounded-full px-3 text-sm font-medium transition",
                    active ? "text-brand-700" : "text-ink-soft hover:text-brand-700"
                  )}
                >
                  {item.label}
                  {/* layoutId hands the indicator to whichever item is active,
                      so it slides along the bar between pages instead of
                      disappearing here and reappearing there. */}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-accent-500"
                      transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                    />
                  )}
                </Link>
              );
            }

            const expanded = openMenu === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu((m) => (m === item.label ? null : m))}
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu((m) => (m === item.label ? null : item.label))}
                  className={clsx(
                    "relative flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium transition",
                    active ? "text-brand-700" : "text-ink-soft hover:text-brand-700"
                  )}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className={clsx("transition-transform duration-200", expanded && "rotate-180")}
                  />
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-accent-500"
                      transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {expanded && (
                    // The wrapper's padding keeps the pointer inside the
                    // hover area while it travels from the button to the panel.
                    <motion.div
                      className="absolute left-0 top-full z-50 w-60 pt-2"
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: EASE_OUT }}
                      style={{ transformOrigin: "top left" }}
                    >
                    <div className="card max-h-[70vh] overflow-y-auto p-1.5 shadow-lift">
                      {/* The parent stays reachable in its own right when it
                          has a page of its own (About Us, Products). */}
                      {item.href && (
                        <Link
                          href={item.href}
                          onClick={closeAll}
                          className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                        >
                          {item.label} overview
                        </Link>
                      )}
                      {children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeAll}
                          className={clsx(
                            "block rounded-lg px-3 py-2 text-sm transition",
                            isActivePath(pathname, pathOf(child.href))
                              ? "bg-brand-50 font-semibold text-brand-700"
                              : "text-ink-soft hover:bg-mist-50 hover:text-brand-700"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Every control here is h-10 so the search pill, the CTA and the
            menu button share one baseline - the pill used to be 38px against
            the CTA's 40px, which read as a misalignment. */}
        <div className="flex flex-1 basis-0 items-center justify-end gap-2">
          {/* Closing the mobile menu on open keeps the overlay from covering
              an expanded accordion nobody can see behind it. */}
          <GlobalSearch onOpen={closeAll} />
          <Link
            href="/contact"
            onClick={closeAll}
            className="btn-accent hidden h-10 shrink-0 whitespace-nowrap xl:inline-flex"
          >
            Enquire Now <ArrowRight size={16} className="shrink-0" />
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-700 transition hover:bg-brand-50 xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* The panel opens by animating its own height, which is a layout
          property - but it is the one case where that is the right call: a
          transform-based open would slide the panel over the page instead of
          pushing it down, and the height is animated once per toggle, not per
          scroll frame. Content fades slightly behind it so the text does not
          appear to stretch. */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            className="overflow-hidden border-t border-brand-100 bg-white xl:hidden"
          >
        <div className="max-h-[75vh] overflow-y-auto px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {MAIN_NAV.map((item) => {
              const children = resolveChildren(item, categories);
              const active = isBranchActive(pathname, item, children);

              if (!children.length) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeAll}
                    className={clsx(
                      "rounded-lg px-3 py-2.5 text-sm font-medium",
                      active ? "bg-brand-50 text-brand-700" : "text-ink-soft"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }

              const expanded = openGroup === item.label;
              return (
                <div key={item.label}>
                  {/* An accordion rather than a hover menu: on touch there is
                      no hover, and tapping a parent must not navigate away
                      before its children can be seen. */}
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setOpenGroup((g) => (g === item.label ? null : item.label))}
                    className={clsx(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium",
                      active ? "bg-brand-50 text-brand-700" : "text-ink-soft"
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={clsx("transition-transform duration-200", expanded && "rotate-180")}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: EASE_OUT }}
                      className="ml-3 overflow-hidden border-l border-brand-100 pl-3"
                    >
                      {item.href && (
                        <Link
                          href={item.href}
                          onClick={closeAll}
                          className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand-700"
                        >
                          {item.label} overview
                        </Link>
                      )}
                      {children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeAll}
                          className={clsx(
                            "block rounded-lg px-3 py-2 text-sm",
                            isActivePath(pathname, pathOf(child.href))
                              ? "font-semibold text-brand-700"
                              : "text-ink-soft"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                  </AnimatePresence>
                </div>
              );
            })}
            <Link href="/contact" onClick={closeAll} className="btn-accent mt-2 w-full">
              Enquire Now <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
