import Link from "next/link";
import { Package, FolderTree, Image as ImageIcon, Mail, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = { title: "Dashboard" };

async function getDashboardData() {
  const [products, categories, banners, newEnquiries, recentEnquiries] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.banner.count(),
    prisma.enquiry.count({ where: { status: "new" } }),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  return { products, categories, banners, newEnquiries, recentEnquiries };
}

export default async function Dashboard() {
  const stats = await getDashboardData();

  const cards = [
    { label: "Products", value: stats.products, icon: Package, href: "/admin/products", color: "bg-brand-100 text-brand-700" },
    { label: "Categories", value: stats.categories, icon: FolderTree, href: "/admin/categories", color: "bg-accent-100 text-accent-700" },
    { label: "Banners", value: stats.banners, icon: ImageIcon, href: "/admin/banners", color: "bg-mist-100 text-brand-700" },
    { label: "New Enquiries", value: stats.newEnquiries, icon: Mail, href: "/admin/enquiries", color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-soft">Overview of your website content and activity.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-card">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon size={18} />
            </span>
            <p className="mt-3 font-display text-2xl font-extrabold text-ink">{value}</p>
            <p className="text-sm text-ink-soft">{label}</p>
          </Link>
        ))}
      </div>

      <div className="card mt-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-ink">Recent Enquiries</h2>
          <Link href="/admin/enquiries" className="flex items-center gap-1 text-sm font-medium text-brand-700">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {stats.recentEnquiries.length ? (
          <div className="mt-4 divide-y divide-brand-100">
            {stats.recentEnquiries.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{e.name}</p>
                  <p className="text-ink-soft">{e.subject}</p>
                </div>
                <span
                  className={`badge ${
                    e.status === "new"
                      ? "bg-orange-100 text-orange-700"
                      : e.status === "resolved"
                        ? "bg-accent-100 text-accent-700"
                        : "bg-mist-100 text-brand-700"
                  }`}
                >
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink-soft">No enquiries yet.</p>
        )}
      </div>
    </div>
  );
}
