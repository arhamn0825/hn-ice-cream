"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { isValidPKPhone, normalizePKPhone, PHONE_HINT } from "@/lib/phone";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPKPhone(form.phone)) {
      toast.error(`Enter a valid phone number, ${PHONE_HINT}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone: normalizePKPhone(form.phone) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }
      toast.success("Account created!");
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-24">
      <div className="glass-card p-8">
        <h1 className="font-display text-3xl mb-2 text-center">Create Account</h1>
        <p className="text-center text-ink/50 mb-8 text-sm">
          {redirect === "/checkout" ? "Create an account to place your order." : "Join HN Ice Cream for faster checkout & order tracking."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300" />
        <input required type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300" />
          <input required type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300" />
          <button disabled={loading} className="btn-primary w-full">{loading ? "Creating..." : "Create Account"}</button>
        </form>
        <p className="text-center text-sm text-ink/50 mt-6">
          Already have an account? <Link href={`/login?redirect=${redirect}`} className="text-grape-600 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-5 py-24 text-center text-ink/50">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

