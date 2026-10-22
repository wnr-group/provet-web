"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Layers,
  Type,
  BarChart3,
  ArrowRight,
  Video,
} from "lucide-react";
import { adminGetBanners, adminCreateBanner, adminUpdateBanner, adminDeleteBanner } from "@/components/admin/adminApi";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/admin/Modal";
import { ImagePicker, VideoPicker } from "@/components/admin/ImagePicker";

// `media` is the editor's own choice - "photo" or "video" - and is not saved:
// a slide is a video slide when it has a video (Banner.video).
const emptyForm = {
  title: "",
  subtitle: "",
  media: "photo",
  image: "",
  video: "",
  ctaText: "Explore Products",
  ctaLink: "/products",
  order: 0,
  isActive: true,
};

// The video shipped with the site (public/content/hero/CREDITS.md), offered
// as a one-click choice for a video slide.
const PROVET_VIDEO = "/content/hero/provet-hero-1280.mp4";
const PROVET_VIDEO_POSTER = "/content/hero/provet-hero-poster.jpg";

// What the hero shows of each field (components/home/Hero.js clamps the
// headline to three lines and the text to two) - used for the counters.
const HEADLINE_SOFT_MAX = 50;
const TEXT_SOFT_MAX = 140;

// The homepage hero's slides. Each one has a background - a photo or a
// video - with a headline, text and button over it, and they take turns.
export default function BannersAdmin() {
  const [banners, setBanners] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = () => adminGetBanners().then(setBanners);

  useEffect(() => {
    load();
  }, []);

  const sorted = (banners || []).slice().sort((a, b) => a.order - b.order);
  const shownCount = sorted.filter((b) => b.isActive).length;
  const videoCount = sorted.filter((b) => b.video).length;

  const openCreate = () => {
    setEditing(null);
    setFormError("");
    setForm({ ...emptyForm, order: sorted.length ? sorted[sorted.length - 1].order + 1 : 0 });
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setFormError("");
    setForm({
      title: b.title,
      subtitle: b.subtitle || "",
      media: b.video ? "video" : "photo",
      image: b.image || "",
      video: b.video || "",
      ctaText: b.ctaText || "",
      ctaLink: b.ctaLink || "",
      order: b.order,
      isActive: b.isActive,
    });
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const isVideo = form.media === "video";
    if (isVideo && !form.video) {
      setFormError("Choose a video for this slide, or switch its background to Photo.");
      return;
    }
    if (!form.image) {
      setFormError(isVideo ? "Add a poster image for the video." : "Add a photo for this slide.");
      return;
    }
    // A photo slide saves no video, so switching back to Photo really does
    // take the video off the homepage.
    const { media: _media, ...fields } = form;
    const payload = { ...fields, video: isVideo ? form.video : "" };
    setSaving(true);
    setFormError("");
    try {
      if (editing) await adminUpdateBanner(editing.id, payload);
      else await adminCreateBanner(payload);
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err.data?.error || err.message || "Could not save the slide.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (b) => {
    if (!confirm(`Delete the slide "${b.title}"? This can't be undone.`)) return;
    await adminDeleteBanner(b.id);
    load();
  };

  const toggleActive = async (b) => {
    await adminUpdateBanner(b.id, { ...b, isActive: !b.isActive });
    load();
  };

  // Swaps a slide with its neighbour, then renumbers every slide whose order
  // changed - older slides may share an order number, so a plain swap of the
  // two numbers wouldn't always move anything.
  const move = async (index, delta) => {
    const next = sorted.slice();
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    await Promise.all(next.map((b, i) => (b.order === i ? null : adminUpdateBanner(b.id, { ...b, order: i }))));
    load();
  };

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  if (!banners) return <PageSpinner />;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Homepage Banner</h1>
          <p className="mt-1 text-sm text-ink-soft">The large area at the very top of your homepage.</p>
        </div>
        <Link href="/" target="_blank" className="btn-outline text-sm">
          <ExternalLink size={15} /> View on website
        </Link>
      </div>

      {/* How the banner is put together, so each control below has a place. */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <HowItWorks
          step="1"
          icon={Layers}
          title="Slides take turns"
          text="A photo slide shows for 6 seconds; a video slide until its video ends."
        />
        <HowItWorks
          step="2"
          icon={Type}
          title="Each slide"
          text="A photo or a video in the background, with a headline, text and button over it."
        />
        <HowItWorks
          step="3"
          icon={BarChart3}
          title="Badge & figures"
          text={
            <>
              Shown on every slide. Edited in{" "}
              <Link href="/admin/content" className="font-semibold text-brand-700 hover:underline">
                Website Content &gt; Homepage
              </Link>
              .
            </>
          }
        />
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Slides</h2>
          <p className="mt-1 text-sm text-ink-soft">
            {sorted.length === 0
              ? "No slides yet."
              : `${shownCount} of ${sorted.length} shown, in this order. ${videoCount} with a video, ${sorted.length - videoCount} with a photo.`}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Add slide
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={ImageIcon} title="No slides yet" description="Add a slide to give the banner its headline and button." />
        </div>
      ) : (
        <ol className="mt-4 space-y-3">
          {sorted.map((b, i) => (
            <li
              key={b.id}
              className={clsx("card flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap", !b.isActive && "bg-mist-50/60")}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                {i + 1}
              </span>
              <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-mist-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {b.image && <img src={b.image} alt="" className="h-full w-full object-cover" />}
                <span className="absolute left-1 top-1 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {b.video ? (
                    <>
                      <Video size={10} /> Video
                    </>
                  ) : (
                    <>
                      <ImageIcon size={10} /> Photo
                    </>
                  )}
                </span>
              </div>
              <div className={clsx("min-w-0 flex-1", !b.isActive && "opacity-60")}>
                <p className="truncate font-semibold text-ink">{b.title}</p>
                <p className="truncate text-sm text-ink-soft">{b.subtitle || "No text under the headline"}</p>
                {b.ctaText && (
                  <p className="mt-1 inline-flex max-w-full items-center gap-1 truncate rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700">
                    Button: {b.ctaText} <ArrowRight size={11} /> {b.ctaLink || "/products"}
                  </p>
                )}
              </div>

              <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm text-ink-soft">
                <Switch checked={b.isActive} onChange={() => toggleActive(b)} label={`Show slide ${i + 1} on the homepage`} />
                <span className="w-12">{b.isActive ? "Shown" : "Hidden"}</span>
              </label>

              <div className="flex shrink-0 items-center gap-0.5">
                <IconButton label={`Move slide ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                  <ChevronUp size={16} />
                </IconButton>
                <IconButton label={`Move slide ${i + 1} down`} disabled={i === sorted.length - 1} onClick={() => move(i, 1)}>
                  <ChevronDown size={16} />
                </IconButton>
                <button onClick={() => openEdit(b)} className="btn-ghost ml-1 text-sm">
                  <Pencil size={14} /> Edit
                </button>
                <IconButton label={`Delete slide ${i + 1}`} danger onClick={() => onDelete(b)}>
                  <Trash2 size={15} />
                </IconButton>
              </div>
            </li>
          ))}
        </ol>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="xl"
        title={editing ? "Edit slide" : "Add a slide"}
        subtitle="The preview shows how it will look at the top of the homepage."
      >
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="space-y-5">
            <Field label="Headline" required count={form.title.length} max={HEADLINE_SOFT_MAX} hint="Short and clear - it shows on up to three lines.">
              <input required className="input" value={form.title} onChange={(e) => set({ title: e.target.value })} />
            </Field>
            <Field label="Text under the headline" count={form.subtitle.length} max={TEXT_SOFT_MAX} hint="One or two sentences.">
              <textarea rows={2} className="input resize-none" value={form.subtitle} onChange={(e) => set({ subtitle: e.target.value })} />
            </Field>
            <div className="rounded-xl border border-brand-100 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="label mb-0">Background</p>
                <div className="inline-flex rounded-xl bg-mist-100 p-1" role="radiogroup" aria-label="Slide background">
                  {[
                    { value: "photo", label: "Photo", icon: ImageIcon },
                    { value: "video", label: "Video", icon: Video },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={form.media === value}
                      onClick={() => set({ media: value })}
                      className={clsx(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition",
                        form.media === value ? "bg-white text-brand-700 shadow-soft" : "text-ink-soft hover:text-ink"
                      )}
                    >
                      <Icon size={15} /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {form.media === "video" ? (
                <div className="mt-4 space-y-5">
                  <Field label="Video" required hint="Plays silently on a loop behind the words. No sound, no controls.">
                    <VideoPicker label="Video" value={form.video} onChange={(video) => set({ video })} />
                    {form.video !== PROVET_VIDEO && (
                      <button
                        type="button"
                        // Its poster is the video's first frame, so the
                        // switch from poster to video is seamless.
                        onClick={() => set({ video: PROVET_VIDEO, image: PROVET_VIDEO_POSTER })}
                        className="mt-2 text-xs font-semibold text-brand-700 hover:underline"
                      >
                        Use the ready-made Provet video (poultry, cattle, shrimp and fish farming)
                      </button>
                    )}
                  </Field>
                  <Field
                    label="Poster image"
                    required
                    hint="Shown while the video loads, and instead of it for visitors who prefer less motion."
                  >
                    <ImagePicker value={form.image} onChange={(image) => set({ image })} />
                  </Field>
                </div>
              ) : (
                <div className="mt-4">
                  <Field
                    label="Photo"
                    required
                    hint="A wide landscape photo, at least 1920 x 1080. The left side sits under the text."
                  >
                    <ImagePicker value={form.image} onChange={(image) => set({ image })} />
                  </Field>
                </div>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button text" hint="The words on the pink button.">
                <input className="input" value={form.ctaText} onChange={(e) => set({ ctaText: e.target.value })} />
              </Field>
              <Field label="Button opens" hint="A page on this site, e.g. /products or /contact.">
                <input className="input" value={form.ctaLink} onChange={(e) => set({ ctaLink: e.target.value })} />
              </Field>
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-100 px-4 py-3">
              <Switch checked={form.isActive} onChange={() => set({ isActive: !form.isActive })} label="Show this slide on the homepage" />
              <span className="text-sm">
                <span className="font-medium text-ink">Show on the homepage</span>
                <span className="block text-xs text-ink-soft">Turn off to keep the slide without showing it.</span>
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <SlidePreview form={form} />
            {formError && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
                {formError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : editing ? "Save slide" : "Add slide"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function HowItWorks({ step, icon: Icon, title, text }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-brand-100 bg-white p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">
          <span className="text-ink-soft">{step}.</span> {title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{text}</p>
      </div>
    </div>
  );
}

function Field({ label, required, hint, count, max, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label className="label">
          {label} {required && <span className="text-accent-600">*</span>}
        </label>
        {max && (
          <span className={clsx("text-xs tabular-nums", count > max ? "font-semibold text-amber-700" : "text-ink-soft")}>
            {count}/{max}
          </span>
        )}
      </div>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

// A small, faithful sketch of the hero: the background with the same dark
// wash, the headline, text and the two buttons, left-aligned as on the site.
function SlidePreview({ form }) {
  const isVideo = form.media === "video" && form.video;
  return (
    <div>
      <p className="label">Preview</p>
      <div className="relative isolate aspect-[16/9] overflow-hidden rounded-xl bg-brand-900 text-white ring-1 ring-brand-100">
        {form.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        )}
        {isVideo && <PreviewVideo src={form.video} />}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(21,18,48,0.94),rgba(21,18,48,0.78)_45%,rgba(21,18,48,0.30))]" />
        <div className="flex h-full max-w-[75%] flex-col justify-center p-5">
          <p className="line-clamp-3 font-display text-xl font-extrabold leading-tight">
            {form.title || <span className="text-white/40">Your headline</span>}
          </p>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-brand-100">{form.subtitle}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-3 py-1 text-[11px] font-semibold">
              {form.ctaText || "Explore Products"} <ArrowRight size={11} />
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold">Talk to Our Team</span>
          </div>
        </div>
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium">
          {isVideo ? <Video size={10} /> : <ImageIcon size={10} />} {isVideo ? "Video" : "Photo"} background
        </span>
        {!form.isActive && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/60 text-sm font-semibold text-ink">
            Hidden - not on the homepage
          </span>
        )}
      </div>
    </div>
  );
}

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={clsx(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-brand-600" : "bg-mist-300"
      )}
    >
      <span
        className={clsx(
          "inline-block h-5 w-5 rounded-full bg-white shadow-soft transition-transform",
          checked ? "translate-x-[1.375rem]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function IconButton({ label, onClick, disabled, danger, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "rounded-lg p-1.5 text-ink-soft transition disabled:opacity-25",
        danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-brand-50 hover:text-brand-700"
      )}
    >
      {children}
    </button>
  );
}

// The slide's video, playing muted behind the preview's words. Muted and
// started from here because React doesn't render `muted` as an attribute,
// which browsers need before they autoplay.
function PreviewVideo({ src }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.play().catch(() => {});
  }, [src]);
  return (
    <video
      key={src}
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      className="absolute inset-0 -z-10 h-full w-full object-cover"
    />
  );
}
