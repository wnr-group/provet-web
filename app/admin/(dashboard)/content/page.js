"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Save, FileText, Plus, ExternalLink, AlertCircle } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import {
  adminGetContent,
  adminUpdateContent,
  adminGetPage,
  adminUpdatePage,
  adminGetCategories,
} from "@/components/admin/adminApi";
import { PageSpinner } from "@/components/ui/Spinner";
import SectionEditor from "@/components/admin/SectionEditor";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { contentPages } from "@/lib/navigation";
import { DEFAULT_SECTION_TYPE, parseSectionConfig } from "@/lib/sectionTypes";
import { toSlug } from "@/lib/slug";
import { CONTACT_SECTIONS, withContactDefaults } from "@/lib/contactContent";
import { HOME_SECTIONS, withHomeDefaults } from "@/lib/homeContent";
import { isBuiltInSection, addedSections } from "@/lib/fixedPages";

const PAGES = contentPages();

// Fixed pages whose blocks have built-in defaults. For these the editor shows
// every block even before one has been saved, plus a per-block hint - the
// generic type hints ("One card per line") don't say what the contact
// page actually does with each block.
//
// `reorderable`: the page's built-in blocks can be moved, and their order is
// the order they appear on the page (the homepage). Elsewhere the layout fixes
// where each built-in block goes, so only added sections move.
const FIXED_PAGE_DEFAULTS = {
  contact: {
    merge: withContactDefaults,
    meta: Object.fromEntries(CONTACT_SECTIONS.map((s) => [s.key, { hint: s.hint, hideConfig: s.hideConfig }])),
  },
  home: {
    merge: withHomeDefaults,
    meta: Object.fromEntries(HOME_SECTIONS.map((s) => [s.key, { hint: s.hint, hideConfig: s.hideConfig }])),
    reorderable: true,
  },
};

const emptySettings = { title: "", description: "", heroImage: "", seoTitle: "", seoDescription: "" };

// Both endpoints return sections in the same shape; this just guarantees the
// fields the editor binds to are present even on older rows.
function normalizeSection(section) {
  const type = section.type || DEFAULT_SECTION_TYPE;
  return {
    key: section.key,
    type,
    title: section.title || "",
    body: section.body || "",
    image: section.image || "",
    config: parseSectionConfig(type, section.config),
    isVisible: section.isVisible !== false,
  };
}

export default function ContentAdmin() {
  const [pageKey, setPageKey] = useState(PAGES[0].key);
  const [sections, setSections] = useState(null);
  const [settings, setSettings] = useState(emptySettings);
  const [categories, setCategories] = useState([]);
  // The page the loaded sections belong to. Tracking it lets the spinner be
  // derived instead of set from inside the effect, which would otherwise
  // cascade a render on every page switch.
  const [loadedKey, setLoadedKey] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef(null);
  // Which section card is expanded. One at a time keeps the page scannable;
  // a freshly added section opens itself, since you added it to fill it in.
  const [openKey, setOpenKey] = useState(null);

  const current = PAGES.find((p) => p.key === pageKey);
  // The bespoke home/about/contact layouts render a fixed set of built-in
  // blocks (lib/fixedPages.js): those can be edited but not deleted, moved or
  // retyped. Sections added on top of them are fully editable, and every page
  // can take new ones.
  const editable = !current.fixed;
  const isFixedPage = Boolean(current.fixed);
  const isLocked = (section) => isFixedPage && isBuiltInSection(pageKey, section.key);
  const loading = loadedKey !== pageKey;

  useEffect(() => {
    adminGetCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // Reads a page without touching state, so both the effect below and the
  // post-save refresh can share it.
  const fetchPage = useCallback(async () => {
    if (current.fixed) {
      const res = await adminGetContent(pageKey);
      const merge = FIXED_PAGE_DEFAULTS[pageKey]?.merge;
      const builtIn = (merge ? merge(res.sections) : res.sections).filter((s) => isBuiltInSection(pageKey, s.key));
      const added = addedSections(pageKey, res.sections);
      return { sections: [...builtIn, ...added].map(normalizeSection), settings: emptySettings };
    }
    const res = await adminGetPage(pageKey);
    return {
      sections: res.sections.map(normalizeSection),
      settings: {
        title: res.page?.title || current.label,
        description: res.page?.description || "",
        heroImage: res.page?.heroImage || "",
        seoTitle: res.page?.seoTitle || "",
        seoDescription: res.page?.seoDescription || "",
      },
    };
  }, [pageKey, current]);

  useEffect(() => {
    // `cancelled` guards against a slow response for the page the admin has
    // already navigated away from overwriting the newer one.
    let cancelled = false;
    fetchPage()
      .then((data) => {
        if (cancelled) return;
        setSections(data.sections);
        setSettings(data.settings);
        setError("");
        setLoadedKey(pageKey);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.data?.error || "Failed to load this page.");
        setSections([]);
        setLoadedKey(pageKey);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchPage, pageKey]);

  const updateSection = (index, next) => {
    setSections((secs) => secs.map((s, i) => (i === index ? next : s)));
    setSaved(false);
  };

  const moveSection = (index, delta) => {
    setSections((secs) => {
      const next = [...secs];
      const target = index + delta;
      if (target < 0 || target >= next.length) return secs;
      // Built-in blocks move only among themselves, and only on a page whose
      // layout follows their order; added sections move among themselves.
      if (isLocked(next[index]) !== isLocked(next[target])) return secs;
      if (isLocked(next[index]) && !FIXED_PAGE_DEFAULTS[pageKey]?.reorderable) return secs;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setSaved(false);
  };

  const removeSection = (index) => {
    setSections((secs) => secs.filter((_, i) => i !== index));
    setSaved(false);
  };

  const addSection = () => {
    // Keys identify a row within its page, so a new one must not collide with
    // an existing or previously-deleted-and-re-added section. Worked out here
    // rather than inside the updater: updaters have to stay pure, and this
    // one also has to hand the key to setOpenKey.
    const used = new Set(sections.map((s) => s.key));
    let n = sections.length + 1;
    let key = `section-${n}`;
    while (used.has(key)) key = `section-${++n}`;

    setSections((secs) => [...secs, normalizeSection({ key, type: DEFAULT_SECTION_TYPE, isVisible: true })]);
    setOpenKey(key);
    setSaved(false);
  };

  const onSave = async () => {
    setSaving(true);
    setError("");
    try {
      if (current.fixed) {
        await adminUpdateContent(
          pageKey,
          sections.map((s, i) => ({ ...s, order: i })),
          { replaceAdded: true }
        );
      } else {
        if (!settings.title.trim()) {
          setError("Page title is required.");
          return;
        }
        await adminUpdatePage(pageKey, {
          page: settings,
          sections: sections.map((s, i) => ({ ...s, key: toSlug(s.key), order: i })),
        });
      }
      setSaved(true);
      const refreshed = await fetchPage();
      setSections(refreshed.sections);
      setSettings(refreshed.settings);
    } catch (err) {
      setError(err.data?.error || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  // A failed save is usually noticed from far down the page (the section
  // being edited), and the reason is shown up here - bring it into view.
  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Website Content</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Edit what appears on each page of the public site. Menu structure is fixed in code.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={current.href} target="_blank" className="btn-outline text-sm">
            <ExternalLink size={15} /> View
          </Link>
          <button onClick={onSave} disabled={saving || !sections} className="btn-primary">
            <Save size={16} /> {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => {
              setPageKey(p.key);
              setSaved(false);
            }}
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              pageKey === p.key ? "bg-brand-600 text-white" : "bg-white text-ink-soft hover:bg-brand-50"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && (
        <p
          ref={errorRef}
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {loading || !sections ? (
        <PageSpinner />
      ) : (
        <div className="mt-5 space-y-4">
          {editable && (
            <div className="card space-y-4 p-5">
              <h2 className="font-display font-semibold text-ink">Page settings</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Page title</label>
                  <input
                    className="input"
                    value={settings.title}
                    onChange={(e) => setSettings((s) => ({ ...s, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">SEO title</label>
                  <input
                    className="input"
                    placeholder="Defaults to the page title"
                    value={settings.seoTitle}
                    onChange={(e) => setSettings((s) => ({ ...s, seoTitle: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="label">Intro (shown under the heading in the banner)</label>
                <textarea
                  rows={2}
                  className="input resize-none"
                  value={settings.description}
                  onChange={(e) => setSettings((s) => ({ ...s, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">SEO description</label>
                <textarea
                  rows={2}
                  className="input resize-none"
                  placeholder="Defaults to the intro above"
                  value={settings.seoDescription}
                  onChange={(e) => setSettings((s) => ({ ...s, seoDescription: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Banner image (shown on the right of the banner)</label>
                <ImagePicker
                  value={settings.heroImage}
                  onChange={(heroImage) => setSettings((s) => ({ ...s, heroImage }))}
                />
              </div>
            </div>
          )}

          {sections.length === 0 ? (
            <div className="card p-8 text-center text-ink-soft">
              <FileText size={28} className="mx-auto text-brand-300" />
              <p className="mt-3 text-sm">
                {editable ? "No sections yet - add one to start building this page." : "No content sections found."}
              </p>
            </div>
          ) : (
            sections.map((section, i) => {
              // On a fixed page, arrows and indices work within a group: the
              // built-in blocks, or the added sections.
              const locked = isLocked(section);
              const group = isFixedPage ? sections.filter((s) => isLocked(s) === locked) : sections;
              const offset = sections.indexOf(group[0]);
              const firstAdded = isFixedPage && !locked && i === offset;
              return (
                <div key={section.key}>
                  {firstAdded && (
                    <div className="mb-3 mt-8 flex items-center gap-3">
                      <span className="h-px flex-1 bg-brand-100" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                        Added sections · shown after the page&apos;s main content
                      </span>
                      <span className="h-px flex-1 bg-brand-100" />
                    </div>
                  )}
                  <SectionEditor
                    section={section}
                    index={i - offset}
                    total={group.length}
                    categories={categories}
                    editable={editable || !locked}
                    hint={FIXED_PAGE_DEFAULTS[pageKey]?.meta[section.key]?.hint}
                    hideConfig={FIXED_PAGE_DEFAULTS[pageKey]?.meta[section.key]?.hideConfig}
                    open={openKey === section.key}
                    onToggleOpen={() => setOpenKey((k) => (k === section.key ? null : section.key))}
                    onChange={(next) => updateSection(i, next)}
                    onMove={(_, delta) => moveSection(i, delta)}
                    onRemove={() => removeSection(i)}
                  />
                </div>
              );
            })
          )}

          <button onClick={addSection} className="btn-outline w-full justify-center">
            <Plus size={16} /> Add section
          </button>
          {current.fixed && (
            <p className="text-center text-xs text-ink-soft">
              New sections - videos, cards, product grids and more - appear on the page after its built-in content.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
