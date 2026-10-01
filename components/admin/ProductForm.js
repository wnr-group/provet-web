"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { ArrowLeft, Plus, Trash2, Save, Eye, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { adminGetProduct, adminCreateProduct, adminUpdateProduct, adminGetCategories } from "./adminApi";
import { PageSpinner } from "@/components/ui/Spinner";
import { MultiImagePicker } from "@/components/admin/ImagePicker";
import ProductPreview, { ListingChecklist, PLACEHOLDER_NAME } from "@/components/admin/ProductPreview";
import { buildCategoryTree } from "@/lib/categoryTree";
import { toSlug } from "@/lib/slug";

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

// The long-form fields - edited as tabs, the way the product page shows them.
// `applications` is shown on the site as "Target Species", so it is labelled
// that way here too.
const DETAIL_FIELDS = [
  { key: "composition", label: "Composition", placeholder: "e.g. Each kg contains Avilamycin 100 g." },
  { key: "uses", label: "Uses", placeholder: "Indications and benefits, one per line." },
  { key: "dosage", label: "Dosage & administration", placeholder: "e.g. 1000 g per MT of feed, mixed thoroughly before use." },
  { key: "applications", label: "Target species", placeholder: "e.g. Broilers, layers, breeders." },
];

// Common specification keys, offered as one-click rows.
const SPEC_SUGGESTIONS = [
  { key: "brand", label: "Brand" },
  { key: "withdrawalPeriod", label: "Withdrawal period" },
  { key: "storage", label: "Storage" },
  { key: "form", label: "Form" },
];

// Text boxes grow with their content (field-sizing), between these bounds, so
// long copy is readable without scrolling inside a box and short copy doesn't
// leave a tall empty one.
const GROW = "resize-none [field-sizing:content]";

export default function ProductForm({ id }) {
  const isEdit = Boolean(id);
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  // The top-level category picked in the first dropdown. Only the
  // subcategory (form.categoryId) is saved - the product's category is its
  // subcategory's parent - so this just narrows the second dropdown.
  const [parentId, setParentId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [specs, setSpecs] = useState([]);
  const [detailTab, setDetailTab] = useState(DETAIL_FIELDS[0].key);
  const [savedSlug, setSavedSlug] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const nameRef = useRef(null);
  const categoryRef = useRef(null);
  const subcategoryRef = useRef(null);

  useEffect(() => {
    adminGetCategories()
      .then(setCategories)
      .catch(() => setError("Could not load categories."));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    adminGetProduct(id)
      .then((p) => {
        // Filed under a subcategory: preselect both. A product still filed
        // directly on a top-level category preselects that and asks for a
        // subcategory.
        setParentId(p.category?.id || "");
        setSavedSlug(p.isActive ? p.slug : null);
        setForm({
          name: p.name,
          sku: p.sku || "",
          categoryId: p.subcategory?.id || "",
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
      })
      .catch((err) => setError(err.status === 404 ? "This product no longer exists." : "Could not load the product."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const parent = tree.find((c) => c.id === parentId) || null;
  const subcategories = parent?.children || [];
  const subcategory = subcategories.find((c) => c.id === form.categoryId) || null;

  const specifications = useMemo(
    () => Object.fromEntries(specs.filter((s) => s.key.trim()).map((s) => [s.key.trim(), s.value])),
    [specs]
  );

  // The form's current state in the public product shape, for the preview.
  const preview = {
    id: id || "preview",
    slug: toSlug(form.name || "product"),
    name: form.name.trim() || PLACEHOLDER_NAME,
    sku: form.sku,
    shortDescription: form.shortDescription,
    composition: form.composition,
    uses: form.uses,
    dosage: form.dosage,
    applications: form.applications,
    packSize: form.packSize,
    images: form.images,
    specifications,
    isFeatured: form.isFeatured,
    isActive: form.isActive,
    category: parent ? { id: parent.id, name: parent.name, slug: parent.slug } : null,
    subcategory: subcategory ? { id: subcategory.id, name: subcategory.name, slug: subcategory.slug } : null,
  };

  const clearFieldError = (field) =>
    setFieldErrors((errs) => {
      if (!errs[field]) return errs;
      const next = { ...errs };
      delete next[field];
      return next;
    });

  const set = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    clearFieldError(field);
  };

  const onParentChange = (e) => {
    setParentId(e.target.value);
    setForm((f) => ({ ...f, categoryId: "" }));
    clearFieldError("parentId");
  };

  const updateSpec = (i, field, value) => {
    setSpecs((s) => s.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));
  };
  const usedSpecKeys = new Set(specs.map((s) => s.key.trim()));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Enter the product name.";
    if (!parentId) errs.parentId = "Choose a category.";
    else if (!form.categoryId)
      errs.categoryId = subcategories.length ? "Choose a subcategory." : "This category has no subcategories yet.";
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length) {
      setError("");
      // Take the admin to the first problem.
      const first = errs.name ? nameRef : errs.parentId ? categoryRef : subcategoryRef;
      first.current?.focus();
      first.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSaving(true);
    setError("");
    const payload = { ...form, specifications };
    try {
      if (isEdit) await adminUpdateProduct(id, payload);
      else await adminCreateProduct(payload);
      router.push("/admin/products");
    } catch (err) {
      setError(err.data?.error || "Failed to save product.");
      setSaving(false);
    }
  };

  if (loading) return <PageSpinner />;

  const errorCount = Object.keys(fieldErrors).length;
  const activeDetail = DETAIL_FIELDS.find((f) => f.key === detailTab) || DETAIL_FIELDS[0];

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto max-w-7xl">
      {/* Title and actions, pinned to the top so Save is always in reach. */}
      <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-brand-100 bg-mist-50/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/admin/products"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-ink-soft ring-1 ring-brand-100 hover:text-brand-700"
              aria-label="Back to Products"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate font-display text-xl font-bold text-ink">
                {isEdit ? form.name || "Edit Product" : "Add Product"}
              </h1>
              <p className={clsx("text-xs", errorCount ? "font-medium text-red-600" : "text-ink-soft")}>
                {errorCount
                  ? `${errorCount} required ${errorCount === 1 ? "field needs" : "fields need"} attention`
                  : isEdit
                    ? "Changes go live as soon as you save"
                    : "Fields marked * are required"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="#product-preview" className="btn-ghost text-sm xl:hidden">
              <Eye size={15} /> Preview
            </a>
            {isEdit && savedSlug && (
              <a href={`/products/${savedSlug}`} target="_blank" rel="noreferrer" className="btn-ghost hidden text-sm sm:inline-flex">
                View on site <ExternalLink size={14} />
              </a>
            )}
            <Link href="/admin/products" className="btn-outline text-sm">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="btn-primary text-sm">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? "Saving..." : isEdit ? "Save" : "Create"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          {error && (
            <p role="alert" className="flex items-start gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
            </p>
          )}

          <Card title="General">
            <Field label="Product name" required error={fieldErrors.name} htmlFor="product-name">
              <input
                id="product-name"
                ref={nameRef}
                className={clsx(inputClass(fieldErrors.name), "text-base font-medium")}
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. AVILOMAX 100"
                aria-invalid={Boolean(fieldErrors.name)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" required error={fieldErrors.parentId} htmlFor="product-category">
                <select
                  id="product-category"
                  ref={categoryRef}
                  className={inputClass(fieldErrors.parentId)}
                  value={parentId}
                  onChange={onParentChange}
                  aria-invalid={Boolean(fieldErrors.parentId)}
                >
                  <option value="">Select a category</option>
                  {tree.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Subcategory"
                required
                error={fieldErrors.categoryId}
                htmlFor="product-subcategory"
                hint={
                  parent && subcategories.length === 0 ? (
                    <>
                      {parent.name} has none yet.{" "}
                      <Link href="/admin/categories" className="font-semibold text-brand-700 link-underline">
                        Add one
                      </Link>
                    </>
                  ) : null
                }
              >
                <select
                  id="product-subcategory"
                  ref={subcategoryRef}
                  className={clsx(inputClass(fieldErrors.categoryId), "disabled:cursor-not-allowed disabled:bg-mist-50 disabled:opacity-70")}
                  value={form.categoryId}
                  onChange={set("categoryId")}
                  disabled={!parentId || subcategories.length === 0}
                  aria-invalid={Boolean(fieldErrors.categoryId)}
                >
                  <option value="">{!parentId ? "Choose a category first" : "Select a subcategory"}</option>
                  {subcategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="SKU" htmlFor="product-sku">
                <input id="product-sku" className="input" value={form.sku} onChange={set("sku")} placeholder="e.g. AVN-0100" />
              </Field>
              <Field label="Pack size" htmlFor="product-pack">
                <input id="product-pack" className="input" value={form.packSize} onChange={set("packSize")} placeholder="e.g. 1 kg, 5 L" />
              </Field>
            </div>

            <Field
              label="Short description"
              htmlFor="product-short"
              hint="Shown on product cards and at the top of the product page."
              aside={form.shortDescription ? `${form.shortDescription.length} characters` : null}
            >
              <textarea
                id="product-short"
                className={clsx("input min-h-[5.5rem] max-h-72", GROW)}
                value={form.shortDescription}
                onChange={set("shortDescription")}
                placeholder="What the product is and what it does, in a sentence or two."
              />
            </Field>
          </Card>

          <Card title="Images" description="The first image is the cover, used on cards and in search.">
            <MultiImagePicker value={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} />
          </Card>

          <Card title="Product information" description="Each filled tab appears on the product page; empty ones are left out.">
            <div className="flex flex-wrap gap-x-1 border-b border-brand-100" role="tablist" aria-label="Product information">
              {DETAIL_FIELDS.map((f) => {
                const active = f.key === activeDetail.key;
                const filled = Boolean(form[f.key]?.trim());
                return (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    id={`detail-tab-${f.key}`}
                    aria-selected={active}
                    aria-controls="detail-panel"
                    onClick={() => setDetailTab(f.key)}
                    className={clsx(
                      "relative -mb-px inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition",
                      active ? "border-brand-600 text-brand-700" : "border-transparent text-ink-soft hover:text-ink"
                    )}
                  >
                    {f.label}
                    <span
                      aria-label={filled ? "filled" : "empty"}
                      className={clsx("h-1.5 w-1.5 rounded-full", filled ? "bg-accent-500" : "bg-mist-300")}
                    />
                  </button>
                );
              })}
            </div>
            <div id="detail-panel" role="tabpanel" aria-labelledby={`detail-tab-${activeDetail.key}`}>
              <label htmlFor={`product-${activeDetail.key}`} className="sr-only">
                {activeDetail.label}
              </label>
              <textarea
                key={activeDetail.key}
                id={`product-${activeDetail.key}`}
                className={clsx("input min-h-40 max-h-[28rem] leading-relaxed", GROW)}
                value={form[activeDetail.key]}
                onChange={set(activeDetail.key)}
                placeholder={activeDetail.placeholder}
              />
            </div>
          </Card>

          <Card title="Specifications" description="Extra facts for the product page's Key details, such as brand or withdrawal period.">
            {specs.length > 0 && (
              <div className="divide-y divide-brand-100 overflow-hidden rounded-xl ring-1 ring-brand-100">
                {specs.map((row, i) => (
                  <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 bg-white p-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto]">
                    <input
                      className="input border-transparent bg-mist-50/70 font-medium"
                      placeholder="Name, e.g. brand"
                      aria-label={`Specification ${i + 1} name`}
                      value={row.key}
                      onChange={(e) => updateSpec(i, "key", e.target.value)}
                    />
                    {/* Grows for long values such as a withdrawal period. */}
                    <textarea
                      rows={1}
                      className={clsx("input col-start-1 max-h-40 border-transparent sm:col-start-auto", GROW)}
                      placeholder="Value, e.g. Avinova"
                      aria-label={`Specification ${i + 1} value`}
                      value={row.value}
                      onChange={(e) => updateSpec(i, "value", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setSpecs((s) => s.filter((_, idx) => idx !== i))}
                      className="row-span-2 rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600 sm:row-span-1"
                      aria-label={`Remove specification ${i + 1}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setSpecs((s) => [...s, { key: "", value: "" }])} className="btn-ghost text-xs">
                <Plus size={14} /> Add specification
              </button>
              {SPEC_SUGGESTIONS.filter((s) => !usedSpecKeys.has(s.key)).map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSpecs((rows) => [...rows, { key: s.key, value: "" }])}
                  className="rounded-full bg-mist-100 px-3 py-1 text-xs font-medium text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
                >
                  + {s.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Side column: visibility, then the live preview. Pinned beside the
            form on wide screens; after it on smaller ones. */}
        <aside id="product-preview" className="scroll-mt-24 space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="card divide-y divide-brand-100 p-0">
            <Switch
              checked={form.isActive}
              onChange={set("isActive")}
              title="Active"
              description={form.isActive ? "Visible on the website" : "Hidden from the website"}
            />
            <Switch
              checked={form.isFeatured}
              onChange={set("isFeatured")}
              title="Featured"
              description="Highlighted on the home page and catalogue"
            />
          </div>
          <ProductPreview product={preview} />
          <ListingChecklist product={preview} />
        </aside>
      </div>
    </form>
  );
}

const inputClass = (error) => clsx("input", error && "border-red-300 ring-2 ring-red-100 focus:border-red-400");

function Card({ title, description, children }) {
  return (
    <section className="card p-5 sm:p-6">
      <header className="mb-4">
        <h2 className="font-display text-base font-bold text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-ink-soft">{description}</p>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, required = false, hint, error, htmlFor, aside, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
          {required ? (
            <span className="ml-0.5 text-red-600" aria-hidden="true">
              *
            </span>
          ) : (
            <span className="ml-1.5 text-xs font-normal text-ink-soft/80">optional</span>
          )}
        </label>
        {aside && <span className="text-xs tabular-nums text-ink-soft">{aside}</span>}
      </div>
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600" role="alert">
          <AlertCircle size={12} /> {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-ink-soft">{hint}</p>
      )}
    </div>
  );
}

function Switch({ checked, onChange, title, description }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3.5">
      <span>
        <span className="block text-sm font-semibold text-ink">{title}</span>
        <span className="block text-xs text-ink-soft">{description}</span>
      </span>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span
        aria-hidden="true"
        className={clsx(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-400 peer-focus-visible:ring-offset-2",
          checked ? "bg-brand-600" : "bg-mist-300"
        )}
      >
        <span
          className={clsx(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </span>
    </label>
  );
}
