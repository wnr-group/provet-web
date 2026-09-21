"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image as ImageIcon,
  FileText,
  Share2,
  Mail,
  LogOut,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";
import { logout } from "./adminApi";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/content", label: "Website Content", icon: FileText },
  { href: "/admin/social", label: "Social Media", icon: Share2 },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
];

function isActivePath(pathname, href, end) {
  if (end) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({ admin, children }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await logout();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-mist-50/60">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-brand-100 bg-white lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-brand-100 px-5">
          <Image src="/logo-mark.png" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="font-display text-lg font-extrabold text-ink">Provet</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {links.map(({ href, label, icon: Icon, end }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActivePath(pathname, href, end)
                  ? "bg-brand-600 text-white"
                  : "text-ink-soft hover:bg-brand-50 hover:text-brand-700"
              )}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-brand-100 p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-soft hover:bg-brand-50"
          >
            <ExternalLink size={16} /> View Site
          </Link>
          <div className="mt-2 flex items-center justify-between rounded-xl px-3 py-2">
            <div>
              <p className="text-sm font-semibold text-ink">{admin?.name}</p>
              <p className="text-xs text-ink-soft">{admin?.email}</p>
            </div>
            <button onClick={signOut} className="rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600" aria-label="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-brand-100 bg-white lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="font-display font-extrabold text-ink">Provet Admin</span>
            <button onClick={signOut} className="text-ink-soft">
              <LogOut size={18} />
            </button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-4 pb-3">
            {links.map(({ href, label, icon: Icon, end }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                  isActivePath(pathname, href, end) ? "bg-brand-600 text-white" : "bg-brand-50 text-ink-soft"
                )}
              >
                <Icon size={14} /> {label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
