"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email");
    toast.success("Subscribed! Sweet updates coming your way 🍦");
    setEmail("");
  };

  return (
    <section className="py-20 bg-grape-blush relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-5 text-center relative z-10">
        <h2 className="font-display text-3xl md:text-4xl text-white font-semibold mb-3">
          Get Sweet Deals in Your Inbox
        </h2>
        <p className="text-white/80 mb-8">Subscribe for exclusive offers, new flavors, and more.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-full px-5 py-3 text-ink focus:outline-none focus:ring-4 focus:ring-white/30"
          />
          <button type="submit" className="rounded-full bg-white text-grape-600 font-semibold px-6 py-3 hover:scale-105 transition-transform">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
