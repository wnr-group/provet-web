"use client";

import { useState } from "react";
import { CheckCircle2, Send, Star } from "lucide-react";
import clsx from "clsx";

// Renders whatever fields the admin has defined. Client-side checks here are
// UX only - app/api/feedback/route.js rebuilds the same rules from the stored
// field definitions and is the real gate.

const MULTI_TYPES = new Set(["checkbox"]);

const emptyValue = (field) => (MULTI_TYPES.has(field.type) ? [] : "");

const buildInitialForm = (fields) =>
  Object.fromEntries(fields.map((field) => [field.key, emptyValue(field)]));

const MAXLENGTH = { text: 500, textarea: 2000, email: 200, tel: 40 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isBlank(value) {
  if (Array.isArray(value)) return value.length === 0;
  return String(value ?? "").trim() === "";
}

export default function FeedbackForm({ fields = [] }) {
  const [form, setForm] = useState(() => buildInitialForm(fields));
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const setValue = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };

  const toggleInList = (key, option, checked) =>
    setForm((f) => {
      const current = Array.isArray(f[key]) ? f[key] : [];
      return { ...f, [key]: checked ? [...current, option] : current.filter((v) => v !== option) };
    });

  // Mirrors the server rules so the common mistakes don't need a round trip.
  const validate = () => {
    for (const field of fields) {
      const value = form[field.key];
      if (field.isRequired && isBlank(value)) return `${field.label} is required.`;
      if (isBlank(value)) continue;
      if (field.type === "email" && !EMAIL_RE.test(String(value).trim())) {
        return `${field.label} must be a valid email address.`;
      }
      if (field.type === "number" && !Number.isFinite(Number(value))) {
        return `${field.label} must be a number.`;
      }
    }
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        // Surface the server's own message - it's already written for the visitor.
        setError(data?.error || "Something went wrong. Please try again in a moment.");
        setStatus("idle");
        return;
      }
      setForm(buildInitialForm(fields));
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again in a moment.");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <CheckCircle2 size={40} className="text-accent-500" />
        <h3 className="mt-4 font-display text-xl font-semibold text-ink">Thank You</h3>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          Your feedback has been received. We appreciate you taking the time to share it.
        </p>
        <button className="btn-outline mt-6" onClick={() => setStatus("idle")}>
          Send More Feedback
        </button>
      </div>
    );
  }

  if (fields.length === 0) {
    return <p className="py-6 text-center text-sm text-ink-soft">This form isn&apos;t accepting submissions yet.</p>;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {fields.map((field) => (
        <Field
          key={field.key}
          field={field}
          value={form[field.key]}
          onChange={(v) => setValue(field.key, v)}
          onToggle={(option, checked) => toggleInList(field.key, option, checked)}
        />
      ))}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full sm:w-auto">
        <Send size={16} /> {status === "submitting" ? "Sending..." : "Submit Feedback"}
      </button>
    </form>
  );
}

function Field({ field, value, onChange, onToggle }) {
  const id = `feedback-${field.key}`;
  const label = (
    <label className="label" htmlFor={id}>
      {field.label}{" "}
      {!field.isRequired && <span className="font-normal text-ink-soft">(optional)</span>}
    </label>
  );
  const help = field.helpText && <p className="mt-1.5 text-xs text-ink-soft">{field.helpText}</p>;

  switch (field.type) {
    case "textarea":
      return (
        <div>
          {label}
          <textarea
            id={id}
            rows={5}
            maxLength={MAXLENGTH.textarea}
            className="input resize-none"
            placeholder={field.placeholder || ""}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </div>
      );

    case "select":
      return (
        <div>
          {label}
          <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">Select an option…</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {help}
        </div>
      );

    case "radio":
      return (
        <fieldset>
          <legend className="label">
            {field.label} {!field.isRequired && <span className="font-normal text-ink-soft">(optional)</span>}
          </legend>
          <div className="mt-1 space-y-2">
            {field.options.map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="radio"
                  name={id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                />
                {option}
              </label>
            ))}
          </div>
          {help}
        </fieldset>
      );

    case "checkbox":
      return (
        <fieldset>
          <legend className="label">
            {field.label} {!field.isRequired && <span className="font-normal text-ink-soft">(optional)</span>}
          </legend>
          <div className="mt-1 space-y-2">
            {field.options.map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => onToggle(option, e.target.checked)}
                />
                {option}
              </label>
            ))}
          </div>
          {help}
        </fieldset>
      );

    case "rating":
      return (
        <div>
          <span className="label block">
            {field.label} {!field.isRequired && <span className="font-normal text-ink-soft">(optional)</span>}
          </span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChange(Number(value) === n ? "" : n)}
                aria-label={`${n} out of 5`}
                aria-pressed={Number(value) === n}
                className="rounded-lg p-1 transition hover:scale-110"
              >
                <Star
                  size={24}
                  className={clsx(
                    Number(value) >= n ? "fill-accent-400 text-accent-400" : "text-brand-200"
                  )}
                />
              </button>
            ))}
          </div>
          {help}
        </div>
      );

    case "number":
      return (
        <div>
          {label}
          <input
            id={id}
            type="number"
            className="input"
            placeholder={field.placeholder || ""}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </div>
      );

    default:
      return (
        <div>
          {label}
          <input
            id={id}
            type={field.type === "email" ? "email" : field.type === "tel" ? "tel" : "text"}
            maxLength={MAXLENGTH[field.type] || MAXLENGTH.text}
            className="input"
            placeholder={field.placeholder || ""}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </div>
      );
  }
}
