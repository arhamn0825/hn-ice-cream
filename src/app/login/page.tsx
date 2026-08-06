"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }
      toast.success("Welcome back!");
      router.push("/dashboard");
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
        <h1 className="font-display text-3xl mb-2 text-center">Welcome Back</h1>
        <p className="text-center text-ink/50 mb-8 text-sm">Log in to track orders & manage your wishlist.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300"
          />
          <button disabled={loading} className="btn-primary w-full">{loading ? "Logging in..." : "Log In"}</button>
        </form>
        <p className="text-center text-sm text-ink/50 mt-6">
          New here? <Link href="/register" className="text-grape-600 font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
