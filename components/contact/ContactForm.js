"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

const initialForm = (productName) => ({
  name: "",
  email: "",
  phone: "",
  subject: productName ? `Enquiry: ${productName}` : "",
  message: productName ? `I'd like more information about ${productName}.` : "",
});

export default function ContactForm({ productName = "" }) {
  const [form, setForm] = useState(initialForm(productName));
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm(initialForm());
    } catch {
      setStatus("idle");
      setError("Something went wrong. Please try again in a moment.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <CheckCircle2 size={40} className="text-accent-500" />
        <h2 className="mt-4 font-display text-xl font-semibold text-ink">Enquiry Sent</h2>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          Thank you for reaching out. Our team will get back to you shortly.
        </p>
        <button className="btn-outline mt-6" onClick={() => setStatus("idle")}>
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label">Full Name</label>
          <input required className="input" value={form.name} onChange={update("name")} placeholder="Jane Doe" />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            required
            type="email"
            className="input"
            value={form.email}
            onChange={update("email")}
            placeholder="jane@clinic.com"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label">Phone (optional)</label>
          <input className="input" value={form.phone} onChange={update("phone")} placeholder="+91 98765 43210" />
        </div>
        <div>
          <label className="label">Subject</label>
          <input
            required
            className="input"
            value={form.subject}
            onChange={update("subject")}
            placeholder="Product enquiry"
          />
        </div>
      </div>
      <div>
        <label className="label">Message</label>
        <textarea
          required
          rows={5}
          className="input resize-none"
          value={form.message}
          onChange={update("message")}
          placeholder="Tell us what you need..."
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full sm:w-auto">
        <Send size={16} /> {status === "submitting" ? "Sending..." : "Send Enquiry"}
      </button>
    </form>
  );
}
