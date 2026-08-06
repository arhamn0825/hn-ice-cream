"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Wire this up to /api/contact + email provider (e.g. Resend) once you're ready.
    setTimeout(() => {
      toast.success("Message sent! We'll reply within 24 hours.");
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
      <input required placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300" />
      <input required type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300" />
      <textarea required placeholder="Your Message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300" />
      <button disabled={loading} className="btn-primary w-full">{loading ? "Sending..." : "Send Message"}</button>
    </form>
  );
}
