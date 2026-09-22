"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import clsx from "clsx";
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
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image src="/logo-mark.png" alt="" width={36} height={36} className="h-8 w-8 sm:h-9 sm:w-9" />
          <span className="font-display text-xl font-extrabold tracking-tight text-brand-700">Provet</span>
        </Link>

        <nav ref={navRef} className="hidden items-center gap-0.5 lg:flex">
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
                    "relative rounded-full px-3.5 py-2 text-sm font-medium transition",
                    active ? "text-brand-700" : "text-ink-soft hover:text-brand-700"
                  )}
                >
                  {item.label}
                  {active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent-500" />}
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
                    "relative flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition",
                    active ? "text-brand-700" : "text-ink-soft hover:text-brand-700"
                  )}
                >
                  {item.label}
                  <ChevronDown size={14} className={clsx("transition-transform", expanded && "rotate-180")} />
                  {active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent-500" />}
                </button>

                {expanded && (
                  // The wrapper's padding keeps the pointer inside the
                  // hover area while it travels from the button to the panel.
                  <div className="absolute left-0 top-full z-50 w-60 pt-2">
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
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 lg:gap-2">
          {/* Closing the mobile menu on open keeps the overlay from covering
              an expanded accordion nobody can see behind it. */}
          <GlobalSearch onOpen={closeAll} />
          <Link href="/contact" onClick={closeAll} className="btn-accent ml-1 hidden lg:inline-flex">
            Enquire Now <ArrowRight size={16} />
          </Link>
          <button
            className="rounded-lg p-2 text-brand-700 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[75vh] overflow-y-auto border-t border-brand-100 bg-white px-4 pb-4 lg:hidden">
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
                    <ChevronDown size={16} className={clsx("transition-transform", expanded && "rotate-180")} />
                  </button>
                  {expanded && (
                    <div className="ml-3 border-l border-brand-100 pl-3">
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
                    </div>
                  )}
                </div>
              );
            })}
            <Link href="/contact" onClick={closeAll} className="btn-accent mt-2 w-full">
              Enquire Now <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
