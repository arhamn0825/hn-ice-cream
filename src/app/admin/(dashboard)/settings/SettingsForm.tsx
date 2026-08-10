"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import ImageUploader from "@/components/ImageUploader";

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [form, setForm] = useState(initialSettings);
  const [loading, setLoading] = useState(false);

  const set = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, deliveryCharge: Number(form.deliveryCharge) }),
    });
    setLoading(false);
    if (res.ok) toast.success("Settings saved");
    else toast.error("Failed to save settings");
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 max-w-2xl space-y-5">
      <div>
        <h3 className="font-display text-lg mb-3">Branding</h3>
        <div className="flex flex-wrap gap-6">
          <ImageUploader bucket="branding" value={form.logoUrl ?? ""} onChange={(v) => set("logoUrl", v)} label="Logo (shown in header)" />
          <ImageUploader bucket="branding" value={form.faviconUrl ?? ""} onChange={(v) => set("faviconUrl", v)} label="Favicon (browser tab icon)" />
        </div>
      </div>

      <div>
        <ImageUploader bucket="branding" value={form.heroImageUrl ?? ""} onChange={(v) => set("heroImageUrl", v)} label="Homepage Hero Picture" shape="wide" />
      </div>

      <Field label="Store Name" value={form.storeName} onChange={(v) => set("storeName", v)} />
      <Field label="WhatsApp Number (with country code)" value={form.whatsappNumber} onChange={(v) => set("whatsappNumber", v)} />
      <div>
        <Field label="Order Notification Email (where you get alerted about new orders)" value={form.orderNotificationEmail ?? ""} onChange={(v) => set("orderNotificationEmail", v)} />
        <p className="text-xs text-ink/40 mt-1">This is private — only used to notify you, never shown to customers.</p>
      </div>
      <Field label="Delivery Charge (Rs)" type="number" value={form.deliveryCharge} onChange={(v) => set("deliveryCharge", v)} />
      <Field label="Contact Email" value={form.contactEmail ?? ""} onChange={(v) => set("contactEmail", v)} />
      <Field label="Contact Phone" value={form.contactPhone ?? ""} onChange={(v) => set("contactPhone", v)} />
      <Field label="Contact Address" value={form.contactAddress ?? ""} onChange={(v) => set("contactAddress", v)} />
      <Field label="Google Maps Embed URL" value={form.mapEmbedUrl ?? ""} onChange={(v) => set("mapEmbedUrl", v)} />
      <Field label="Homepage Hero Headline" value={form.heroHeadline ?? ""} onChange={(v) => set("heroHeadline", v)} />
      <Field label="Homepage Hero Subtext" value={form.heroSubtext ?? ""} onChange={(v) => set("heroSubtext", v)} />
      <Field label="Instagram URL" value={form.instagramUrl ?? ""} onChange={(v) => set("instagramUrl", v)} />
      <Field label="Facebook URL" value={form.facebookUrl ?? ""} onChange={(v) => set("facebookUrl", v)} />
      <button disabled={loading} className="btn-primary">{loading ? "Saving..." : "Save Settings"}</button>
    </form>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink/70 block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300"
      />
    </div>
  );
}
