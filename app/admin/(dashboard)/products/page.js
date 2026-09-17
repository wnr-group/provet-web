"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react";
import { adminGetProducts, adminDeleteProduct } from "@/components/admin/adminApi";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";

const LIMIT = 10;

export default function ProductsAdmin() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);

  const load = () => adminGetProducts({ search: search || undefined, page, limit: LIMIT }).then(setResult);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    adminGetProducts({ search: search || undefined, page: 1, limit: LIMIT }).then(setResult);
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

      <form onSubmit={onSearchSubmit} className="relative mt-5 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input
          className="input pl-9"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <div className="mt-5">
        {!result ? (
          <PageSpinner />
        ) : result.items.length === 0 ? (
          <EmptyState icon={Package} title="No products found" description="Try a different search or add a new product." />
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white">
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
                      <td className="px-4 py-3 text-ink-soft">{p.category?.name || "—"}</td>
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
