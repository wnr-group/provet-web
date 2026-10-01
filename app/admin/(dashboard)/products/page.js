"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Pencil, Trash2, Search, Package, ChevronRight } from "lucide-react";
import { adminGetProducts, adminDeleteProduct, adminGetCategories } from "@/components/admin/adminApi";
import { buildCategoryTree } from "@/lib/categoryTree";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";

const LIMIT = 10;

// useSearchParams needs a Suspense boundary above it.
export default function ProductsAdminPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <ProductsAdmin />
    </Suspense>
  );
}

function ProductsAdmin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // The category filter lives in the URL (?category=<id>, either level), so
  // the product counts on the Categories screen can link straight here.
  const category = searchParams.get("category") || "";
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [categories, setCategories] = useState([]);

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);

  const load = () =>
    adminGetProducts({ search: search || undefined, category: category || undefined, page, limit: LIMIT }).then(setResult);

  useEffect(() => {
    adminGetCategories().then(setCategories);
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    adminGetProducts({ search: search || undefined, category: category || undefined, page: 1, limit: LIMIT }).then(setResult);
  };

  const onCategoryChange = (e) => {
    setPage(1);
    const value = e.target.value;
    router.replace(value ? `/admin/products?category=${value}` : "/admin/products");
  };

  const onDelete = async (p) => {
    if (!confirm(`Delete product "${p.name}"?`)) return;
    await adminDeleteProduct(p.id);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Products</h1>
          <p className="mt-1 text-sm text-ink-soft">Manage your veterinary medicine catalogue.</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <form onSubmit={onSearchSubmit} className="relative w-full sm:max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            className="input pl-9"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        {/* Grouped by category; picking a category lists everything in its
            subcategories, picking a subcategory narrows to it. */}
        <select
          className="input w-full sm:w-64"
          value={category}
          onChange={onCategoryChange}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {tree.map((c) => (
            <optgroup key={c.id} label={c.name}>
              <option value={c.id}>All {c.name}</option>
              {c.children.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="mt-5">
        {!result ? (
          <PageSpinner />
        ) : result.items.length === 0 ? (
          <EmptyState icon={Package} title="No products found" description="Try a different search or add a new product." />
        ) : (
          <>
            {/* Phones: one card per product with everything the table shows -
                category, SKU, status and the edit/delete actions - instead of
                a table that scrolls sideways with its actions off-screen. */}
            <ul className="divide-y divide-brand-100 overflow-hidden rounded-2xl border border-brand-100 bg-white sm:hidden">
              {result.items.map((p) => (
                <li key={p.id} className="flex gap-3 p-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-mist-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/products/${p.id}`} className="font-medium text-ink hover:text-brand-700">
                      {p.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {p.category ? [p.category.name, p.subcategory?.name].filter(Boolean).join(" › ") : "No category"}
                      {p.sku && <> · SKU {p.sku}</>}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className={`badge ${p.isActive ? "bg-accent-100 text-accent-700" : "bg-brand-50 text-ink-soft"}`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                      {p.isFeatured && <span className="badge bg-accent-100 text-accent-700">Featured</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <Link
                      href={`/admin/products/${p.id}`}
                      aria-label={`Edit ${p.name}`}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => onDelete(p)}
                      aria-label={`Delete ${p.name}`}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-soft hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white max-sm:hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-brand-100 bg-mist-50/60 text-left text-xs uppercase tracking-wide text-ink-soft">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100">
                  {result.items.map((p) => (
                    <tr key={p.id}>
                      <td className="flex items-center gap-3 px-4 py-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-mist-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <span className="font-medium text-ink">{p.name}</span>
                        {p.isFeatured && <span className="badge bg-accent-100 text-accent-700">Featured</span>}
                      </td>
                      <td className="px-4 py-3 text-ink-soft">
                        {p.category ? (
                          <span className="inline-flex flex-wrap items-center gap-1">
                            <span>{p.category.name}</span>
                            {p.subcategory && (
                              <>
                                <ChevronRight size={12} aria-hidden="true" className="text-ink-soft/60" />
                                <span className="font-medium text-ink">{p.subcategory.name}</span>
                              </>
                            )}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink-soft">{p.sku || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${p.isActive ? "bg-accent-100 text-accent-700" : "bg-brand-50 text-ink-soft"}`}>
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Link href={`/admin/products/${p.id}`} className="rounded-lg p-1.5 text-ink-soft hover:bg-brand-50 hover:text-brand-700">
                            <Pencil size={15} />
                          </Link>
                          <button onClick={() => onDelete(p)} className="rounded-lg p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={Math.max(1, Math.ceil(result.total / LIMIT))} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
