"use client";

import { useEffect, useState } from "react";
import { Mail, ChevronDown, ChevronUp, Phone } from "lucide-react";
import { adminGetEnquiries, adminUpdateEnquiryStatus } from "@/components/admin/adminApi";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import clsx from "clsx";

const TABS = [
  { key: "", label: "All" },
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "resolved", label: "Resolved" },
];

const STATUS_STYLES = {
  new: "bg-orange-100 text-orange-700",
  read: "bg-mist-100 text-brand-700",
  resolved: "bg-accent-100 text-accent-700",
};

const LIMIT = 10;

export default function EnquiriesAdmin() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = () => adminGetEnquiries({ status: status || undefined, page, limit: LIMIT }).then(setResult);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: flip the loading flag immediately when the filter/page changes, before the fetch resolves.
    setLoading(true);
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  const updateStatus = async (id, newStatus) => {
    await adminUpdateEnquiryStatus(id, newStatus);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Enquiries</h1>
      <p className="mt-1 text-sm text-ink-soft">Messages submitted through the website contact form.</p>

      <div className="mt-5 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setStatus(t.key);
              setPage(1);
            }}
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              status === t.key ? "bg-brand-600 text-white" : "bg-white text-ink-soft hover:bg-brand-50"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {!result ? (
          <PageSpinner />
        ) : result.items.length === 0 ? (
          <EmptyState icon={Mail} title="No enquiries" description="Nothing here yet for this filter." />
        ) : (
          <div className={clsx("transition-opacity", loading && "opacity-50")}>
            <div className="space-y-3">
              {result.items.map((enq) => {
                const isOpen = expanded === enq.id;
                return (
                  <div key={enq.id} className="card p-4">
                    <button
                      className="flex w-full items-center justify-between gap-3 text-left"
                      onClick={() => setExpanded(isOpen ? null : enq.id)}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-ink">{enq.name}</p>
                          <span className={clsx("badge", STATUS_STYLES[enq.status])}>{enq.status}</span>
                        </div>
                        <p className="mt-0.5 truncate text-sm text-ink-soft">{enq.subject}</p>
                      </div>
                      <span className="shrink-0 text-xs text-ink-soft">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                      {isOpen ? <ChevronUp size={18} className="text-ink-soft" /> : <ChevronDown size={18} className="text-ink-soft" />}
                    </button>

                    {isOpen && (
                      <div className="mt-4 border-t border-brand-100 pt-4">
                        <p className="text-sm leading-relaxed text-ink-soft whitespace-pre-line">{enq.message}</p>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-soft">
                          <a href={`mailto:${enq.email}`} className="flex items-center gap-1.5 hover:text-brand-700">
                            <Mail size={14} /> {enq.email}
                          </a>
                          {enq.phone && (
                            <a href={`tel:${enq.phone}`} className="flex items-center gap-1.5 hover:text-brand-700">
                              <Phone size={14} /> {enq.phone}
                            </a>
                          )}
                        </div>
                        <div className="mt-4 flex gap-2">
                          {["new", "read", "resolved"].map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(enq.id, s)}
                              disabled={enq.status === s}
                              className={clsx(
                                "rounded-full px-3 py-1 text-xs font-medium capitalize transition disabled:opacity-40",
                                s === "new" && "bg-orange-100 text-orange-700",
                                s === "read" && "bg-mist-100 text-brand-700",
                                s === "resolved" && "bg-accent-100 text-accent-700"
                              )}
                            >
                              Mark {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <Pagination page={page} totalPages={Math.max(1, Math.ceil(result.total / LIMIT))} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
