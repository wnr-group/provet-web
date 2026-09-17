"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { adminGetProduct, adminCreateProduct, adminUpdateProduct, adminGetCategories } from "./adminApi";
import { PageSpinner } from "@/components/ui/Spinner";
import { MultiImagePicker } from "@/components/admin/ImagePicker";

const emptyForm = {
  name: "",
  sku: "",
  categoryId: "",
  shortDescription: "",
  composition: "",
  uses: "",
  dosage: "",
  applications: "",
  packSize: "",
  images: [],
  isFeatured: false,
  isActive: true,
};

export default function ProductForm({ id }) {
  const isEdit = Boolean(id);
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminGetCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    adminGetProduct(id).then((p) => {
      setForm({
        name: p.name,
        sku: p.sku || "",
        categoryId: p.category?.id || "",
        shortDescription: p.shortDescription || "",
        composition: p.composition || "",
        uses: p.uses || "",
        dosage: p.dosage || "",
        applications: p.applications || "",
        packSize: p.packSize || "",
        images: p.images || [],
        isFeatured: p.isFeatured,
        isActive: p.isActive,
      });
      setSpecs(Object.entries(p.specifications || {}).map(([key, value]) => ({ key, value: String(value) })));
      setLoading(false);
    });
  }, [id, isEdit]);

  const set = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const updateSpec = (i, field, value) => {
    setSpecs((s) => s.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }
    setSaving(true);
    setError("");
    const specifications = Object.fromEntries(specs.filter((s) => s.key.trim()).map((s) => [s.key.trim(), s.value]));
    const payload = { ...form, specifications };
    try {
      if (isEdit) await adminUpdateProduct(id, payload);
      else await adminCreateProduct(payload);
      router.push("/admin/products");
    } catch (err) {
      setError(err.data?.error || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700">
        <ArrowLeft size={15} /> Back to Products
      </Link>
      <h1 className="font-display text-2xl font-bold text-ink">{isEdit ? "Edit Product" : "Add Product"}</h1>

      <form onSubmit={onSubmit} className="card mt-5 space-y-6 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Product Name</label>
            <input required className="input" value={form.name} onChange={set("name")} />
          </div>
          <div>
            <label className="label">SKU</label>
            <input className="input" value={form.sku} onChange={set("sku")} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Category</label>
            <select required className="input" value={form.categoryId} onChange={set("categoryId")}>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Pack Size</label>
            <input className="input" placeholder="e.g. 100ml" value={form.packSize} onChange={set("packSize")} />
          </div>
        </div>

        <div>
          <label className="label">Short Description</label>
          <textarea rows={2} className="input resize-none" value={form.shortDescription} onChange={set("shortDescription")} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Composition</label>
            <textarea rows={3} className="input resize-none" value={form.composition} onChange={set("composition")} />
          </div>
          <div>
            <label className="label">Uses</label>
            <textarea rows={3} className="input resize-none" value={form.uses} onChange={set("uses")} />
          </div>
          <div>
            <label className="label">Dosage</label>
            <textarea rows={3} className="input resize-none" value={form.dosage} onChange={set("dosage")} />
          </div>
          <div>
            <label className="label">Applications</label>
            <textarea rows={3} className="input resize-none" value={form.applications} onChange={set("applications")} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="label mb-0">Specifications</label>
            <button type="button" onClick={() => setSpecs((s) => [...s, { key: "", value: "" }])} className="btn-ghost text-xs">
              <Plus size={14} /> Add Spec
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {specs.map((row, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="input"
                  placeholder="Key (e.g. form)"
                  value={row.key}
                  onChange={(e) => updateSpec(i, "key", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Value (e.g. Injectable)"
                  value={row.value}
                  onChange={(e) => updateSpec(i, "value", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setSpecs((s) => s.filter((_, idx) => idx !== i))}
                  className="shrink-0 rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Images</label>
          <MultiImagePicker value={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={form.isFeatured} onChange={set("isFeatured")} /> Featured product
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={form.isActive} onChange={set("isActive")} /> Active (visible on site)
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary w-full justify-center sm:w-auto">
          <Save size={16} /> {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
      </form>
    </div>
  );
}
