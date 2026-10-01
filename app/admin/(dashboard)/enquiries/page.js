"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mail,
  Phone,
  Search,
  X,
  Inbox,
  CircleDot,
  CheckCircle2,
  Eye,
  Copy,
  Check,
  Reply,
  Package,
  ExternalLink,
  Pencil,
  User,
  MessageSquareText,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Clock,
  ArrowDown,
  ArrowUp,
  Layers,
} from "lucide-react";
import { adminGetEnquiries, adminUpdateEnquiryStatus } from "@/components/admin/adminApi";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { DURATION, EASE_OUT } from "@/lib/motion";

const STATUS = {
  new: { label: "New", icon: CircleDot, pill: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  read: { label: "Read", icon: Eye, pill: "bg-mist-100 text-brand-700", dot: "bg-brand-400" },
  resolved: { label: "Resolved", icon: CheckCircle2, pill: "bg-accent-100 text-accent-700", dot: "bg-accent-500" },
};

// The status filters double as the summary: each tile is a count and a filter.
const FILTERS = [
  { key: "", label: "All enquiries", countKey: "all", icon: Layers, tone: "text-brand-600 bg-brand-50" },
  { key: "new", label: "New", countKey: "new", icon: CircleDot, tone: "text-orange-600 bg-orange-50" },
  { key: "read", label: "Read", countKey: "read", icon: Eye, tone: "text-brand-600 bg-mist-100" },
  { key: "resolved", label: "Resolved", countKey: "resolved", icon: CheckCircle2, tone: "text-accent-600 bg-accent-50" },
];

// The one obvious next step for an enquiry in each status.
const NEXT_STEP = {
  new: { status: "read", label: "Mark as read", icon: Eye },
  read: { status: "resolved", label: "Mark resolved", icon: CheckCircle2 },
  resolved: { status: "new", label: "Reopen", icon: RotateCcw },
};

const LIMIT = 15;

// Enquiries as a table: one row per enquiry, scannable by customer, subject,
// product, status and date. A row opens the full enquiry in a drawer from the
// right, so the list stays in place behind it. Rows can be selected to change
// several statuses at once.
export default function EnquiriesAdmin() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // debounced `search`
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [selected, setSelected] = useState(() => new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [error, setError] = useState("");

  // Search as you type, without a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = () =>
    adminGetEnquiries({ status: status || undefined, search: query || undefined, sort, page, limit: LIMIT })
      .then((res) => {
        setResult(res);
        setError("");
      })
      .catch((err) => setError(err.message || "Could not load enquiries."));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: flip the loading flag immediately when the filter/page changes, before the fetch resolves.
    setLoading(true);
    setSelected(new Set());
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, query, sort, page]);

  const items = result?.items || [];
  const openIndex = items.findIndex((e) => e.id === openId);
  const open = openIndex >= 0 ? items[openIndex] : null;

  // Optimistic: the badge changes at once; counts refresh from the server.
  const updateStatus = async (id, newStatus) => {
    setResult((r) => r && { ...r, items: r.items.map((e) => (e.id === id ? { ...e, status: newStatus } : e)) });
    try {
      await adminUpdateEnquiryStatus(id, newStatus);
      setError("");
    } catch (err) {
      setError(err.message || "Could not update the status.");
    }
    load();
  };

  const bulkUpdate = async (newStatus) => {
    const ids = [...selected];
    setBulkBusy(true);
    const results = await Promise.allSettled(ids.map((id) => adminUpdateEnquiryStatus(id, newStatus)));
    const failed = results.filter((r) => r.status === "rejected").length;
    setError(failed ? `${failed} of ${ids.length} enquiries could not be updated.` : "");
    setSelected(new Set());
    setBulkBusy(false);
    load();
  };

  const toggleRow = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const allSelected = items.length > 0 && items.every((e) => selected.has(e.id));
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(items.map((e) => e.id)));

  const counts = result?.counts || {};
  const from = result && result.total ? (page - 1) * LIMIT + 1 : 0;
  const to = result ? Math.min(page * LIMIT, result.total) : 0;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Enquiries</h1>
          <p className="mt-1 text-sm text-ink-soft">Messages and product enquiries submitted through the website.</p>
        </div>
        {counts.new > 0 && (
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700 ring-1 ring-orange-100">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            {counts.new} awaiting a reply
          </span>
        )}
      </div>

      {/* Summary tiles, which are also the status filter */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4" role="tablist" aria-label="Filter by status">
        {FILTERS.map((f) => {
          const active = status === f.key;
          return (
            <button
              key={f.key || "all"}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setStatus(f.key);
                setPage(1);
              }}
              className={clsx(
                "flex items-center gap-3 rounded-2xl bg-white p-3.5 text-left ring-1 transition",
                active ? "ring-2 ring-brand-500 shadow-soft" : "ring-brand-100 hover:ring-brand-200"
              )}
            >
              <span className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", f.tone)}>
                <f.icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-xl font-bold tabular-nums text-ink">
                  {typeof counts[f.countKey] === "number" ? counts[f.countKey] : "–"}
                </span>
                <span className="block truncate text-xs font-medium text-ink-soft">{f.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="card mt-5 overflow-hidden p-0">
        {/* Toolbar: search, or bulk actions while rows are selected */}
        <div className="flex min-h-[64px] flex-wrap items-center justify-between gap-3 border-b border-brand-100 px-4 py-3">
          {selected.size > 0 ? (
            <div className="flex w-full flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-ink">{selected.size} selected</span>
              <span className="mx-1 h-5 w-px bg-brand-100" aria-hidden="true" />
              {Object.entries(STATUS).map(([key, meta]) => (
                <button
                  key={key}
                  type="button"
                  disabled={bulkBusy}
                  onClick={() => bulkUpdate(key)}
                  className="btn-outline px-3 py-1.5 text-xs disabled:opacity-50"
                >
                  <meta.icon size={13} /> Mark {meta.label.toLowerCase()}
                </button>
              ))}
              <button type="button" onClick={() => setSelected(new Set())} className="btn-ghost ml-auto text-xs">
                <X size={13} /> Clear
              </button>
            </div>
          ) : (
            <>
              <div className="relative w-full sm:max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input
                  className="input pl-9 pr-9"
                  placeholder="Search name, email, subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search enquiries"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-soft hover:bg-mist-100"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {result && result.total > 0 && (
                <p className="text-xs text-ink-soft">
                  <span className="font-semibold text-ink">{from}</span>–<span className="font-semibold text-ink">{to}</span> of{" "}
                  <span className="font-semibold text-ink">{result.total}</span>
                </p>
              )}
            </>
          )}
        </div>

        {error && (
          <p role="alert" className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {!result ? (
          error ? null : (
            <div className="py-10">
              <PageSpinner />
            </div>
          )
        ) : items.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={Inbox}
              title={query ? "No matching enquiries" : "No enquiries"}
              description={query ? `Nothing matches "${query}" here.` : "Nothing here yet for this filter."}
            />
          </div>
        ) : (
          <div className={clsx("transition-opacity", loading && "opacity-50")}>
            {/* Table from md up */}
            <table className="hidden w-full table-fixed text-sm md:table">
              <colgroup>
                <col className="w-11" />
                <col className="w-[30%] lg:w-[24%]" />
                <col />
                <col className="hidden lg:table-column lg:w-[20%]" />
                <col className="w-28" />
                <col className="w-32" />
                <col className="w-10" />
              </colgroup>
              <thead className="bg-mist-50/70 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                <tr>
                  <th className="w-10 py-3 pl-4">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all on this page" />
                  </th>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Enquiry</th>
                  <th className="hidden px-3 py-3 lg:table-cell">Product</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3" aria-sort={sort === "newest" ? "descending" : "ascending"}>
                    <button
                      type="button"
                      onClick={() => {
                        setSort((s) => (s === "newest" ? "oldest" : "newest"));
                        setPage(1);
                      }}
                      className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-brand-700"
                      title={sort === "newest" ? "Newest first - click for oldest first" : "Oldest first - click for newest first"}
                    >
                      Received {sort === "newest" ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
                    </button>
                  </th>
                  <th className="w-10 pr-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100/70">
                {items.map((enq) => {
                  const isNew = enq.status === "new";
                  const isOpen = enq.id === openId;
                  return (
                    <tr
                      key={enq.id}
                      onClick={() => setOpenId(enq.id)}
                      className={clsx(
                        "group cursor-pointer transition-colors",
                        isOpen ? "bg-brand-50/70" : selected.has(enq.id) ? "bg-mist-50" : "hover:bg-mist-50/60"
                      )}
                    >
                      <td className="py-3 pl-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(enq.id)}
                          onChange={() => toggleRow(enq.id)}
                          aria-label={`Select enquiry from ${enq.name}`}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={enq.name} />
                          <div className="min-w-0">
                            <p className={clsx("truncate text-ink", isNew ? "font-bold" : "font-medium")}>{enq.name}</p>
                            <p className="truncate text-xs text-ink-soft">{enq.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        {/* Keyboard access: the subject is the row's button. */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenId(enq.id);
                          }}
                          className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded"
                        >
                          <span className={clsx("block truncate text-ink", isNew ? "font-semibold" : "")}>{enq.subject}</span>
                          <span className="block truncate text-xs text-ink-soft">{enq.message}</span>
                        </button>
                      </td>
                      <td className="hidden px-3 py-3 lg:table-cell">
                        <ProductCell product={enq.product} />
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={enq.status} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-xs text-ink-soft">
                        <time dateTime={enq.createdAt} title={formatDateTime(enq.createdAt)}>
                          {relativeTime(enq.createdAt)}
                        </time>
                      </td>
                      <td className="pr-4 text-ink-soft/50">
                        <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Stacked rows on phones */}
            <ul className="divide-y divide-brand-100/70 md:hidden">
              {items.map((enq) => {
                const isNew = enq.status === "new";
                return (
                  <li key={enq.id} className={clsx("flex gap-3 px-4 py-3", selected.has(enq.id) && "bg-mist-50")}>
                    <input
                      type="checkbox"
                      className="mt-3"
                      checked={selected.has(enq.id)}
                      onChange={() => toggleRow(enq.id)}
                      aria-label={`Select enquiry from ${enq.name}`}
                    />
                    <button type="button" onClick={() => setOpenId(enq.id)} className="flex min-w-0 flex-1 gap-3 text-left">
                      <Avatar name={enq.name} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className={clsx("truncate text-sm text-ink", isNew ? "font-bold" : "font-semibold")}>{enq.name}</span>
                          <time dateTime={enq.createdAt} className="shrink-0 text-[11px] text-ink-soft">
                            {relativeTime(enq.createdAt)}
                          </time>
                        </span>
                        <span className={clsx("mt-0.5 block truncate text-sm text-ink", isNew && "font-semibold")}>{enq.subject}</span>
                        <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <StatusPill status={enq.status} />
                          {enq.product && (
                            <span className="inline-flex max-w-full items-center gap-1 truncate rounded-full bg-mist-100 px-2 py-0.5 text-[11px] font-medium text-ink-soft">
                              <Package size={11} className="shrink-0" /> <span className="truncate">{enq.product.name}</span>
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {result.total > LIMIT && (
              <div className="border-t border-brand-100 px-4 pb-4 [&>div]:mt-4">
                <Pagination page={page} totalPages={Math.ceil(result.total / LIMIT)} onChange={setPage} />
              </div>
            )}
          </div>
        )}
      </div>

      <EnquiryDrawer
        enquiry={open}
        onClose={() => setOpenId(null)}
        onStatus={updateStatus}
        onPrev={openIndex > 0 ? () => setOpenId(items[openIndex - 1].id) : null}
        onNext={openIndex >= 0 && openIndex < items.length - 1 ? () => setOpenId(items[openIndex + 1].id) : null}
        position={openIndex >= 0 ? `${openIndex + 1} of ${items.length}` : ""}
      />
    </div>
  );
}

function ProductCell({ product }) {
  if (!product) return <span className="text-xs text-ink-soft">General</span>;
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-mist-50 ring-1 ring-brand-100">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- uploaded/external URLs
          <img src={product.image} alt="" className="h-full w-full object-contain p-0.5" />
        ) : (
          <Package size={14} className="text-brand-300" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium text-ink">{product.name}</span>
        {product.subcategory && <span className="block truncate text-[11px] text-ink-soft">{product.subcategory.name}</span>}
      </span>
    </div>
  );
}

// The full enquiry, sliding in from the right over the table. Escape or the
// backdrop closes it; the arrows step through the rows on this page without
// closing it, which is how a backlog actually gets worked through.
function EnquiryDrawer({ enquiry, onClose, onStatus, onPrev, onNext, position }) {
  const closeRef = useRef(null);
  const isOpen = Boolean(enquiry);
  // Read through a ref so the effect below runs on open/close only - not on
  // every re-render (a status change), which would steal focus each time.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      // Back to the row that opened it.
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {enquiry && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-brand-900/30 backdrop-blur-[2px]"
            aria-hidden="true"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            role="dialog"
            aria-modal="true"
            aria-label={`Enquiry from ${enquiry.name}`}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-[0_0_60px_-15px_rgba(21,18,48,0.45)]"
          >
            <DrawerContent
              enquiry={enquiry}
              closeRef={closeRef}
              onClose={onClose}
              onStatus={onStatus}
              onPrev={onPrev}
              onNext={onNext}
              position={position}
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerContent({ enquiry, closeRef, onClose, onStatus, onPrev, onNext, position }) {
  const next = NEXT_STEP[enquiry.status] || NEXT_STEP.new;
  const replyHref = `mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: ${enquiry.subject}`)}`;

  return (
    <>
      {/* Header */}
      <header className="border-b border-brand-100 px-5 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onPrev || undefined}
              disabled={!onPrev}
              className="rounded-lg p-1.5 text-ink-soft hover:bg-mist-100 disabled:opacity-30"
              aria-label="Previous enquiry"
            >
              <ChevronUp size={16} />
            </button>
            <button
              type="button"
              onClick={onNext || undefined}
              disabled={!onNext}
              className="rounded-lg p-1.5 text-ink-soft hover:bg-mist-100 disabled:opacity-30"
              aria-label="Next enquiry"
            >
              <ChevronDown size={16} />
            </button>
            {position && <span className="ml-1 text-xs text-ink-soft">{position}</span>}
          </div>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="drawer-status">
              Status
            </label>
            <select
              id="drawer-status"
              value={enquiry.status}
              onChange={(e) => onStatus(enquiry.id, e.target.value)}
              className={clsx(
                "cursor-pointer rounded-full border-0 py-1 pl-3 pr-8 text-xs font-semibold ring-1 ring-inset ring-black/5 focus:ring-2 focus:ring-brand-400",
                (STATUS[enquiry.status] || STATUS.new).pill
              )}
            >
              {Object.entries(STATUS).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-ink-soft hover:bg-mist-100"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3">
          <Avatar name={enquiry.name} size="lg" />
          <div className="min-w-0">
            <h2 className="break-words font-display text-lg font-bold leading-snug text-ink">{enquiry.subject}</h2>
            <p className="mt-0.5 text-sm text-ink-soft">
              <span className="font-medium text-ink">{enquiry.name}</span> · {formatDateTime(enquiry.createdAt)}
            </p>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-mist-50/40 px-5 py-5">
        <Panel icon={MessageSquareText} title="Message">
          <p className="whitespace-pre-line break-words text-sm leading-relaxed text-ink">{enquiry.message}</p>
        </Panel>

        <Panel icon={User} title="Customer">
          <dl className="space-y-2.5 text-sm">
            <Detail label="Name" value={enquiry.name} />
            <Detail
              label="Email"
              value={
                <span className="flex items-center gap-1.5">
                  <a href={`mailto:${enquiry.email}`} className="break-all text-brand-700 hover:underline">
                    {enquiry.email}
                  </a>
                  <CopyButton text={enquiry.email} label="Copy email" />
                </span>
              }
            />
            <Detail
              label="Phone"
              value={
                enquiry.phone ? (
                  <span className="flex items-center gap-1.5">
                    <a href={`tel:${enquiry.phone}`} className="text-brand-700 hover:underline">
                      {enquiry.phone}
                    </a>
                    <CopyButton text={enquiry.phone} label="Copy phone" />
                  </span>
                ) : (
                  <span className="text-ink-soft">Not provided</span>
                )
              }
            />
          </dl>
        </Panel>

        <Panel icon={Package} title="Product">
          {enquiry.product ? (
            <div className="flex items-center gap-3">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-brand-100">
                {enquiry.product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- uploaded/external URLs
                  <img src={enquiry.product.image} alt="" className="h-full w-full object-contain p-1" />
                ) : (
                  <Package size={20} className="text-brand-300" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{enquiry.product.name}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-ink-soft">
                  {[enquiry.product.category, enquiry.product.subcategory].filter(Boolean).map((c, i) => (
                    <span key={c.id} className="inline-flex items-center gap-1">
                      {i > 0 && <ChevronRight size={11} aria-hidden="true" />}
                      {c.name}
                    </span>
                  ))}
                  {!enquiry.product.isActive && <span className="badge ml-1 bg-mist-100 text-ink-soft">Inactive</span>}
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold">
                  {enquiry.product.isActive && (
                    <a
                      href={`/products/${enquiry.product.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-brand-700 hover:underline"
                    >
                      View on site <ExternalLink size={11} />
                    </a>
                  )}
                  <Link href={`/admin/products/${enquiry.product.id}`} className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                    Edit product <Pencil size={11} />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-soft">General enquiry, not about a specific product.</p>
          )}
        </Panel>

        <Panel icon={Clock} title="Enquiry details">
          <dl className="space-y-2.5 text-sm">
            <Detail label="Received" value={formatDateTime(enquiry.createdAt)} />
            <Detail label="Type" value={enquiry.product ? "Product enquiry" : "General enquiry"} />
            <Detail label="Status" value={<StatusPill status={enquiry.status} />} />
            <Detail
              label="Reference"
              value={
                <span className="flex items-center gap-1.5">
                  <code className="truncate rounded bg-mist-100 px-1.5 py-0.5 text-xs text-ink-soft">{enquiry.id}</code>
                  <CopyButton text={enquiry.id} label="Copy reference" />
                </span>
              }
            />
          </dl>
        </Panel>
      </div>

      {/* Actions, always in reach */}
      <footer className="flex flex-wrap items-center gap-2 border-t border-brand-100 bg-white px-5 py-3">
        <a href={replyHref} className="btn-primary text-sm">
          <Reply size={15} /> Reply by email
        </a>
        {enquiry.phone && (
          <a href={`tel:${enquiry.phone}`} className="btn-outline text-sm">
            <Phone size={15} /> Call
          </a>
        )}
        <button type="button" onClick={() => onStatus(enquiry.id, next.status)} className="btn-outline ml-auto text-sm">
          <next.icon size={15} /> {next.label}
        </button>
      </footer>
    </>
  );
}

function Panel({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl bg-white p-4 ring-1 ring-brand-100/70">
      <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
        <Icon size={13} className="text-brand-500" /> {title}
      </h3>
      {children}
    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-2">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="min-w-0 text-ink">{value}</dd>
    </div>
  );
}

function StatusPill({ status }) {
  const s = STATUS[status] || STATUS.new;
  return (
    <span className={clsx("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold", s.pill)}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", s.dot)} /> {s.label}
    </span>
  );
}

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be unavailable (insecure context); the value is still selectable.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded p-1 text-ink-soft hover:bg-mist-100 hover:text-brand-700"
      aria-label={label}
      title={label}
    >
      {copied ? <Check size={13} className="text-accent-600" /> : <Copy size={13} />}
    </button>
  );
}

const AVATAR_TONES = ["bg-brand-100 text-brand-700", "bg-accent-100 text-accent-700", "bg-mist-200 text-brand-800", "bg-orange-100 text-orange-700"];

function Avatar({ name, size = "sm" }) {
  const initials = String(name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  // Stable colour per name, so the same customer is recognisable across the list.
  const tone = AVATAR_TONES[[...String(name)].reduce((h, c) => h + c.charCodeAt(0), 0) % AVATAR_TONES.length];
  return (
    <span
      aria-hidden="true"
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full font-display font-bold",
        size === "lg" ? "h-11 w-11 text-sm" : "h-9 w-9 text-xs",
        tone
      )}
    >
      {initials || <Mail size={14} />}
    </span>
  );
}

function formatDateTime(value) {
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

// "5m ago", "3h ago", "2d ago", then a plain date.
function relativeTime(value) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
