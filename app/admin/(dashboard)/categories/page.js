"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import { adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from "@/components/admin/adminApi";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/admin/Modal";
import { ImagePicker } from "@/components/admin/ImagePicker";

const emptyForm = { name: "", description: "", image: "" };

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => adminGetCategories().then(setCategories);

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || "", image: cat.image || "" });
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await adminUpdateCategory(editing.id, form);
      else await adminCreateCategory(form);
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (cat) => {
    if (!confirm(`Delete category "${cat.name}"? Products in this category will be affected.`)) return;
    await adminDeleteCategory(cat.id);
    load();
  };

  if (!categories) return <PageSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Categories</h1>
          <p className="mt-1 text-sm text-ink-soft">Organize products into browsable categories.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={FolderTree} title="No categories yet" description="Create your first category to get started." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold text-ink">{cat.name}</h3>
                  <p className="mt-1 text-xs text-ink-soft">{cat.productCount ?? 0} products</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} className="rounded-lg p-1.5 text-ink-soft hover:bg-brand-50 hover:text-brand-700">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => onDelete(cat)} className="rounded-lg p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {cat.description && <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{cat.description}</p>}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "Add Category"}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input required className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              rows={3}
              className="input resize-none"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Image</label>
            <ImagePicker value={form.image} onChange={(image) => setForm((f) => ({ ...f, image }))} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
            {saving ? "Saving..." : editing ? "Save Changes" : "Create Category"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
