"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import ImageUploader from "@/components/ImageUploader";

type Offer = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  discountPct: number | null;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
};

const emptyForm = { title: "", description: "", imageUrl: "", discountPct: "", startsAt: "", endsAt: "" };

export default function OffersManager({ initialOffers }: { initialOffers: Offer[] }) {
  const [offers, setOffers] = useState(initialOffers);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, isActive: false }),
    });
    const data = await res.json();
    if (res.ok) {
      setOffers((prev) => [{ ...data, startsAt: form.startsAt, endsAt: form.endsAt }, ...prev]);
      setForm(emptyForm);
      setShowForm(false);
      toast.success("Offer added — turn it ON when you're ready to run it");
    } else {
      toast.error(data.error || "Failed to add offer");
    }
  };

  const startEdit = (o: Offer) => {
    setEditingId(o.id);
    setForm({
      title: o.title,
      description: o.description ?? "",
      imageUrl: o.imageUrl ?? "",
      discountPct: String(o.discountPct ?? ""),
      startsAt: o.startsAt,
      endsAt: o.endsAt,
    });
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...form, discountPct: Number(form.discountPct) } : o)));
      setEditingId(null);
      toast.success("Offer updated");
    } else {
      toast.error("Failed to update offer");
    }
  };

  const toggleActive = async (o: Offer) => {
    const res = await fetch(`/api/offers/${o.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !o.isActive }),
    });
    if (res.ok) {
      setOffers((prev) => prev.map((x) => (x.id === o.id ? { ...x, isActive: !x.isActive } : x)));
      toast.success(!o.isActive ? `"${o.title}" is now LIVE — customers get this discount automatically` : `"${o.title}" turned off`);
    } else {
      toast.error("Failed to update offer");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this offer?")) return;
    const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
    if (res.ok) {
      setOffers((prev) => prev.filter((o) => o.id !== id));
      toast.success("Offer deleted");
    } else {
      toast.error("Failed to delete offer");
    }
  };

  return (
    <div>
      {!showForm && (
        <button onClick={() => { setForm(emptyForm); setShowForm(true); }} className="btn-primary mb-6">
          <FiPlus /> Add Offer
        </button>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="glass-card p-5 space-y-3 mb-6">
          <ImageUploader bucket="branding" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} label="Banner Image (optional)" shape="wide" />
          <input required placeholder="Offer title (e.g. Eid Sale)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-ink/10" />
          <input placeholder="Description (optional, shown on the Offers page)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-ink/10" />
          <input required type="number" min="1" max="100" placeholder="Discount % (e.g. 25)" value={form.discountPct} onChange={(e) => setForm({ ...form, discountPct: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-ink/10" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-ink/50 block mb-1">Starts (optional)</label>
              <input type="date" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-ink/10" />
            </div>
            <div>
              <label className="text-xs text-ink/50 block mb-1">Ends (optional)</label>
              <input type="date" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-ink/10" />
            </div>
          </div>
          <p className="text-xs text-ink/40">Leave dates blank to control it manually with the ON/OFF switch instead.</p>
          <div className="flex gap-2">
            <button className="btn-primary">Save Offer</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {offers.map((o) => (
          <div key={o.id} className="glass-card p-5">
            {editingId === o.id ? (
              <div className="space-y-3">
                <ImageUploader bucket="branding" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} label="Banner Image" shape="wide" />
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-ink/10" />
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-ink/10" placeholder="Description" />
                <input type="number" value={form.discountPct} onChange={(e) => setForm({ ...form, discountPct: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-ink/10" placeholder="Discount %" />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(o.id)} className="p-2 rounded-lg hover:bg-blush-50 text-green-600"><FiCheck size={16} /></button>
                  <button onClick={() => setEditingId(null)} className="p-2 rounded-lg hover:bg-blush-50 text-ink/40"><FiX size={16} /></button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  {o.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={o.imageUrl} alt={o.title} className="w-20 h-14 object-cover rounded-lg shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{o.title}</p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blush-100 text-blush-500">{o.discountPct}% OFF</span>
                    </div>
                    {o.description && <p className="text-sm text-ink/50 mt-1">{o.description}</p>}
                    {(o.startsAt || o.endsAt) && (
                      <p className="text-xs text-ink/40 mt-1">{o.startsAt || "no start"} → {o.endsAt || "no end"}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => toggleActive(o)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                      o.isActive ? "bg-green-500 text-white" : "bg-ink/10 text-ink/50"
                    }`}
                  >
                    {o.isActive ? "LIVE — Turn Off" : "Turn ON"}
                  </button>
                  <button onClick={() => startEdit(o)} className="p-2 rounded-lg hover:bg-blush-50 text-grape-600"><FiEdit2 size={16} /></button>
                  <button onClick={() => handleDelete(o.id)} className="p-2 rounded-lg hover:bg-blush-50 text-blush-500"><FiTrash2 size={16} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {offers.length === 0 && <p className="text-center text-ink/40 py-10">No offers yet — add your first one above.</p>}
      </div>
    </div>
  );
}
