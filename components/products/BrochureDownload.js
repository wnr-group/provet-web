"use client";

import { useState } from "react";
import { Download, CheckCircle2, FileText } from "lucide-react";
import Modal from "@/components/admin/Modal";
import { brochureLeadSchema, firstFieldErrors } from "@/lib/brochureLeadSchema";

const FIELDS = [
  { name: "name", label: "Full Name", placeholder: "Jane Doe", required: true, type: "text", autoComplete: "name" },
  { name: "email", label: "Email", placeholder: "jane@clinic.com", required: true, type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", placeholder: "+91 98765 43210", required: true, type: "tel", autoComplete: "tel" },
  { name: "company", label: "Company / Organization", placeholder: "Green Valley Veterinary", required: true, type: "text", autoComplete: "organization" },
  { name: "city", label: "City / Location", placeholder: "Chennai", required: false, type: "text", autoComplete: "address-level2" },
];

const EMPTY = { name: "", email: "", phone: "", company: "", city: "" };

export default function BrochureDownload() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  // "idle" | "submitting" | "success" - also guards against double submits.
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  // Whatever the API returned; never a hardcoded path.
  const [fileUrl, setFileUrl] = useState("");

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    // Clear a field's error as soon as the user starts fixing it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const close = () => {
    if (status === "submitting") return; // don't drop a request in flight
    setOpen(false);
  };

  const openForm = () => {
    setForm(EMPTY);
    setErrors({});
    setFormError("");
    setFileUrl("");
    setStatus("idle");
    setOpen(true);
  };

  const startDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    // Same schema the server uses, so messages match exactly.
    const parsed = brochureLeadSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(firstFieldErrors(parsed.error));
      setFormError("");
      return;
    }

    setStatus("submitting");
    setErrors({});
    setFormError("");

    try {
      const res = await fetch("/api/brochure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // The server is the real gate - surface whatever it rejected.
        if (data?.fieldErrors) setErrors(data.fieldErrors);
        setFormError(data?.error || "Something went wrong. Please try again in a moment.");
        setStatus("idle");
        return;
      }

      if (!data?.file_url) {
        setFormError("The brochure is unavailable right now. Please try again in a moment.");
        setStatus("idle");
        return;
      }

      setFileUrl(data.file_url);
      setStatus("success");
      startDownload(data.file_url);
    } catch {
      setFormError("Something went wrong. Please try again in a moment.");
      setStatus("idle");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openForm}
        className="btn bg-white text-brand-700 shadow-soft hover:bg-brand-50 w-full sm:w-auto"
      >
        <Download size={16} /> Download Brochure
      </button>

      <Modal
        open={open}
        onClose={close}
        title={status === "success" ? "Your Brochure Is Ready" : "Download Our Brochure"}
      >
        {status === "success" ? (
          <div className="flex flex-col items-center py-4 text-center">
            <CheckCircle2 size={40} className="text-accent-500" />
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">Details Received</h3>
            <p className="mt-2 max-w-sm text-sm text-ink-soft">
              Thank you. Your brochure should open automatically — if it doesn&apos;t, use the button
              below.
            </p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 w-full sm:w-auto"
            >
              <Download size={16} /> Download Brochure
            </a>
            <button type="button" onClick={close} className="btn-ghost mt-2 w-full sm:w-auto">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <p className="flex items-start gap-2.5 rounded-xl bg-mist-50 p-3 text-sm text-ink-soft">
              <FileText size={16} className="mt-0.5 shrink-0 text-brand-500" />
              Tell us a little about yourself and we&apos;ll open your brochure right away.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.name} className={field.name === "company" ? "sm:col-span-2" : undefined}>
                  <label htmlFor={`brochure-${field.name}`} className="label">
                    {field.label}
                    {field.required ? (
                      <span className="text-accent-500" aria-hidden="true">
                        {" "}
                        *
                      </span>
                    ) : (
                      <span className="font-normal text-ink-soft"> (optional)</span>
                    )}
                  </label>
                  <input
                    id={`brochure-${field.name}`}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    className={`input ${errors[field.name] ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
                    value={form[field.name]}
                    onChange={update(field.name)}
                    placeholder={field.placeholder}
                    disabled={status === "submitting"}
                    aria-required={field.required}
                    aria-invalid={errors[field.name] ? "true" : undefined}
                    aria-describedby={errors[field.name] ? `brochure-${field.name}-error` : undefined}
                  />
                  {errors[field.name] && (
                    <p id={`brochure-${field.name}-error`} className="mt-1 text-xs text-red-600">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-ink-soft">
              <span className="text-accent-500">*</span> Required fields
            </p>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={close} disabled={status === "submitting"} className="btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={status === "submitting"} className="btn-primary">
                <Download size={16} />
                {status === "submitting" ? "Submitting..." : "Submit & Download"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
