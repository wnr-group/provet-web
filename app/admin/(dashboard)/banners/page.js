"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon, GripVertical } from "lucide-react";
import { adminGetBanners, adminCreateBanner, adminUpdateBanner, adminDeleteBanner } from "@/components/admin/adminApi";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/admin/Modal";
import { ImagePicker } from "@/components/admin/ImagePicker";

const emptyForm = { title: "", subtitle: "", image: "", ctaText: "Explore Products", ctaLink: "/products", order: 0, isActive: true };

export default function BannersAdmin() {
  const [banners, setBanners] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => adminGetBanners().then(setBanners);

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: banners?.length || 0 });
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle || "",
      image: b.image || "",
      ctaText: b.ctaText || "",
      ctaLink: b.ctaLink || "",
      order: b.order,
      isActive: b.isActive,
    });
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await adminUpdateBanner(editing.id, form);
      else await adminCreateBanner(form);
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (b) => {
    if (!confirm(`Delete banner "${b.title}"?`)) return;
    await adminDeleteBanner(b.id);
    load();
  };

  const toggleActive = async (b) => {
    await adminUpdateBanner(b.id, { ...b, isActive: !b.isActive });
    load();
  };

  if (!banners) return <PageSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Homepage Banners</h1>
          <p className="mt-1 text-sm text-ink-soft">Manage the rotating hero banners shown on your homepage.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={ImageIcon} title="No banners yet" description="Add a banner to feature it on your homepage." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {banners
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((b) => (
              <div key={b.id} className="card flex items-center gap-4 p-4">
                <GripVertical size={16} className="hidden shrink-0 text-ink-soft sm:block" />
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-mist-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {b.image && <img src={b.image} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{b.title}</p>
                  <p className="truncate text-sm text-ink-soft">{b.subtitle}</p>
                </div>
                <button
                  onClick={() => toggleActive(b)}
                  className={`badge shrink-0 ${b.isActive ? "bg-accent-100 text-accent-700" : "bg-brand-50 text-ink-soft"}`}
                >
                  {b.isActive ? "Active" : "Inactive"}
                </button>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => openEdit(b)} className="rounded-lg p-1.5 text-ink-soft hover:bg-brand-50 hover:text-brand-700">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => onDelete(b)} className="rounded-lg p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Banner" : "Add Banner"}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input required className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Subtitle</label>
            <textarea
              rows={2}
              className="input resize-none"
              value={form.subtitle}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Image</label>
            <ImagePicker value={form.image} onChange={(image) => setForm((f) => ({ ...f, image }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">CTA Text</label>
              <input className="input" value={form.ctaText} onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))} />
            </div>
            <div>
              <label className="label">CTA Link</label>
              <input className="input" value={form.ctaLink} onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Order</label>
              <input
                type="number"
                className="input"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
              />
            </div>
            <label className="mt-6 flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Active
            </label>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
            {saving ? "Saving..." : editing ? "Save Changes" : "Create Banner"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
