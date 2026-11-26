"use client";

import { useId, useState } from "react";
import { CheckCircle2, Send, Upload, X } from "lucide-react";

const EXPERIENCE = ["Fresher", "Less than 1 year", "1 - 3 years", "3 - 5 years", "5 - 10 years", "10+ years"];

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  location: "",
  experience: "",
  qualification: "",
  message: "",
  interest: "", // enquiry form only: the role they are asking about
  website: "", // honeypot - people never see it, bots fill it in
};

// The job application form: the basic details HR needs and an optional resume.
// Submitting posts to /api/applications, which emails HR and keeps a copy in
// Admin > Enquiries.
//
// Two uses, one form:
//   - Apply for a poster (JobApplyButton): `job` is that poster's title.
//   - Ask about vacancies (`enquiry`, shown on the Careers page when no job is
//     posted): there is no job yet, so there is a field for the role they are
//     interested in, and the application goes in as a vacancy enquiry.
//
// `onClose`, when given, adds a Close button to the confirmation (the pop-up
// uses it); `className` sets the form's padding for where it sits.
export default function JobApplicationForm({ job, enquiry = false, onClose, className = "px-6 py-6 sm:px-8" }) {
  const uid = useId();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [error, setError] = useState("");
  const [resume, setResume] = useState(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // The chosen resume is checked here so a wrong file is caught at once; the
  // server checks it again.
  const chooseResume = (e) => {
    const file = e.target.files?.[0] || null;
    setError("");
    if (file && !/\.(pdf|docx?)$/i.test(file.name)) {
      setError("Please attach your resume as a PDF or Word document.");
      e.target.value = "";
      return setResume(null);
    }
    if (file && file.size > MAX_RESUME_BYTES) {
      setError("The resume is too large - please keep it under 5 MB.");
      e.target.value = "";
      return setResume(null);
    }
    setResume(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const { interest, ...fields } = form;
      const position = enquiry
        ? interest.trim()
          ? `Vacancy enquiry: ${interest.trim()}`
          : "Vacancy enquiry (any role)"
        : job || "General application";
      // Multipart, so the resume can travel with the details.
      const data = new FormData();
      Object.entries({ ...fields, job: position }).forEach(([key, value]) => data.append(key, value));
      if (resume) data.append("resume", resume);
      const res = await fetch("/api/applications", { method: "POST", body: data });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Request failed");
      }
      setStatus("success");
      setForm(emptyForm);
      setResume(null);
    } catch (err) {
      setStatus("idle");
      setError(
        err.message && err.message !== "Request failed" ? err.message : "Something went wrong. Please try again in a moment."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center px-6 py-12 text-center sm:px-8">
        <CheckCircle2 size={44} className="text-accent-500" aria-hidden="true" />
        <h3 className="mt-4 font-display text-xl font-semibold text-ink">{enquiry ? "Enquiry sent" : "Application sent"}</h3>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          {enquiry
            ? "Thank you for getting in touch. Our HR team has your details and will reply about any suitable vacancy."
            : "Thank you for applying. Our HR team has your details and will get in touch if your profile matches the role."}
        </p>
        {onClose ? (
          <button type="button" onClick={onClose} className="btn-primary mt-6">
            Close
          </button>
        ) : (
          <button type="button" onClick={() => setStatus("idle")} className="btn-outline mt-6">
            Send another enquiry
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`relative space-y-4 ${className}`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className="label">
            Full name
          </label>
          <input id={`${uid}-name`} required autoComplete="name" className="input" value={form.name} onChange={update("name")} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className="label">
            Phone
          </label>
          <input id={`${uid}-phone`} required type="tel" autoComplete="tel" className="input" value={form.phone} onChange={update("phone")} placeholder="+91 98765 43210" />
        </div>
      </div>
      <div>
        <label htmlFor={`${uid}-email`} className="label">
          Email
        </label>
        <input id={`${uid}-email`} required type="email" autoComplete="email" className="input" value={form.email} onChange={update("email")} placeholder="you@example.com" />
      </div>
      {enquiry && (
        <div>
          <label htmlFor={`${uid}-interest`} className="label">
            Role you are interested in (optional)
          </label>
          <input id={`${uid}-interest`} className="input" value={form.interest} onChange={update("interest")} placeholder="e.g. Sales, Laboratory, Technical service" />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-location`} className="label">
            Current location
          </label>
          <input id={`${uid}-location`} autoComplete="address-level2" className="input" value={form.location} onChange={update("location")} placeholder="City" />
        </div>
        <div>
          <label htmlFor={`${uid}-experience`} className="label">
            Experience
          </label>
          <select id={`${uid}-experience`} className="input" value={form.experience} onChange={update("experience")}>
            <option value="">Select</option>
            {EXPERIENCE.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor={`${uid}-qualification`} className="label">
          Highest qualification
        </label>
        <input id={`${uid}-qualification`} className="input" value={form.qualification} onChange={update("qualification")} placeholder="e.g. M.Sc Microbiology" />
      </div>
      <div>
        <label htmlFor={`${uid}-resume`} className="label">
          Resume (optional)
        </label>
        <label
          htmlFor={`${uid}-resume`}
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-brand-200 bg-brand-50/60 px-4 py-3 transition hover:border-accent-500 hover:bg-white focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-100"
        >
          <Upload size={18} aria-hidden="true" className="shrink-0 text-accent-500" />
          <span className="min-w-0 flex-1 text-sm">
            {resume ? (
              <span className="block truncate font-medium text-ink">{resume.name}</span>
            ) : (
              <span className="text-ink-soft">Choose a PDF or Word file (up to 5 MB)</span>
            )}
          </span>
          {resume && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setResume(null);
                document.getElementById(`${uid}-resume`).value = "";
              }}
              aria-label="Remove the chosen resume"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-soft transition hover:bg-white hover:text-ink"
            >
              <X size={15} />
            </button>
          )}
          <input
            id={`${uid}-resume`}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={chooseResume}
            className="sr-only"
          />
        </label>
      </div>
      <div>
        <label htmlFor={`${uid}-message`} className="label">
          {enquiry ? "Your message (optional)" : "A few words about you (optional)"}
        </label>
        <textarea
          id={`${uid}-message`}
          rows={3}
          className="input resize-none"
          value={form.message}
          onChange={update("message")}
          placeholder={enquiry ? "Tell us about yourself and the kind of role you are looking for" : "Your background, and why this role"}
        />
      </div>

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full">
        <Send size={16} aria-hidden="true" />{" "}
        {status === "submitting" ? "Sending..." : enquiry ? "Send enquiry" : "Submit application"}
      </button>
    </form>
  );
}
