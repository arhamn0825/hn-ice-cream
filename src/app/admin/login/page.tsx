"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Invalid admin credentials");
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-5">
      <div className="glass-card p-8 max-w-sm w-full bg-white/95">
        <h1 className="font-display text-2xl text-center mb-1">HN Ice Cream</h1>
        <p className="text-center text-ink/50 text-sm mb-8">Admin Dashboard</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300" />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300" />
          <button disabled={loading} className="btn-primary w-full">{loading ? "Signing in..." : "Sign In"}</button>
        </form>
      </div>
    </div>
  );
}
