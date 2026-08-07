"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiMapPin } from "react-icons/fi";

type Branch = { id: string; name: string; address: string | null; mapEmbedUrl: string };

const emptyForm = { name: "", address: "", mapEmbedUrl: "" };

export default function BranchesManager({ initialBranches }: { initialBranches: Branch[] }) {
  const [branches, setBranches] = useState(initialBranches);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setBranches((prev) => [...prev, data]);
      setForm(emptyForm);
      setShowForm(false);
      toast.success("Branch added");
    } else {
      toast.error(data.error || "Failed to add branch");
    }
  };

  const startEdit = (b: Branch) => {
    setEditingId(b.id);
    setForm({ name: b.name, address: b.address ?? "", mapEmbedUrl: b.mapEmbedUrl });
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/branches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setBranches((prev) => prev.map((b) => (b.id === id ? { ...b, ...form } : b)));
      setEditingId(null);
      toast.success("Branch updated");
    } else {
      toast.error("Failed to update branch");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this branch?")) return;
    const res = await fetch(`/api/branches/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBranches((prev) => prev.filter((b) => b.id !== id));
      toast.success("Branch deleted");
    } else {
      toast.error("Failed to delete branch");
    }
  };

  return (
    <div>
      <div className="glass-card p-5 mb-6 text-sm text-ink/60 leading-relaxed">
        <p className="font-medium text-ink mb-2">How to get a map link for a branch:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Go to Google Maps and search your branch address</li>
          <li>Click <strong>Share</strong> → <strong>Embed a map</strong> tab</li>
          <li>Copy the link inside <code>src=&quot;...&quot;</code> (just that link, not the whole code box)</li>
          <li>Paste it into &quot;Map Link&quot; below</li>
        </ol>
      </div>

      {!showForm && (
        <button onClick={() => { setForm(emptyForm); setShowForm(true); }} className="btn-primary mb-6">
          <FiPlus /> Add Branch
        </button>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="glass-card p-5 space-y-3 mb-6">
          <input required placeholder="Branch name (e.g. Rahat Commercial Branch)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-ink/10" />
          <input placeholder="Address (optional, shown under the name)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-ink/10" />
          <input required placeholder="Google Maps embed link" value={form.mapEmbedUrl} onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-ink/10" />
          <div className="flex gap-2">
            <button className="btn-primary">Save Branch</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {branches.map((b) => (
          <div key={b.id} className="glass-card p-5">
            {editingId === b.id ? (
              <div className="space-y-3">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-ink/10" />
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-ink/10" placeholder="Address" />
                <input value={form.mapEmbedUrl} onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-ink/10" placeholder="Map link" />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(b.id)} className="p-2 rounded-lg hover:bg-blush-50 text-green-600"><FiCheck size={16} /></button>
                  <button onClick={() => setEditingId(null)} className="p-2 rounded-lg hover:bg-blush-50 text-ink/40"><FiX size={16} /></button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-grape-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-medium">{b.name}</p>
                    {b.address && <p className="text-sm text-ink/50">{b.address}</p>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(b)} className="p-2 rounded-lg hover:bg-blush-50 text-grape-600"><FiEdit2 size={16} /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-2 rounded-lg hover:bg-blush-50 text-blush-500"><FiTrash2 size={16} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {branches.length === 0 && <p className="text-center text-ink/40 py-10">No branches added yet.</p>}
      </div>
    </div>
  );
}
