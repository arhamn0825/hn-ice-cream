"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import Link from "next/link";

type Category = { id: string; name: string; slug: string; _count?: { products: number } };

export default function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setCategories((prev) => [...prev, { ...data, _count: { products: 0 } }]);
      setNewName("");
      toast.success("Category added");
    } else {
      toast.error(data.error || "Failed to add category");
    }
  };

  const handleRename = async (id: string) => {
    if (!editingName.trim()) return;
    const res = await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName.trim() }),
    });
    if (res.ok) {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name: editingName.trim() } : c)));
      setEditingId(null);
      toast.success("Category renamed");
    } else {
      toast.error("Failed to rename category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } else {
      toast.error(data.error || "Failed to delete category");
    }
  };

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-grape-600 underline mb-4 inline-block">← Back to Products</Link>

      <form onSubmit={handleAdd} className="glass-card p-5 flex gap-3 mb-8">
        <input
          placeholder="New category name (e.g. Sundaes, Cakes)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-ink/10"
        />
        <button className="btn-primary shrink-0"><FiPlus /> Add Category</button>
      </form>

      <div className="glass-card divide-y divide-ink/5">
        {categories.map((c) => (
          <div key={c.id} className="p-4 flex items-center justify-between gap-3">
            {editingId === c.id ? (
              <input
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-ink/10 text-sm"
              />
            ) : (
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-ink/40">{c._count?.products ?? 0} product(s)</p>
              </div>
            )}
            <div className="flex gap-2">
              {editingId === c.id ? (
                <>
                  <button onClick={() => handleRename(c.id)} className="p-2 rounded-lg hover:bg-blush-50 text-green-600"><FiCheck size={16} /></button>
                  <button onClick={() => setEditingId(null)} className="p-2 rounded-lg hover:bg-blush-50 text-ink/40"><FiX size={16} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => { setEditingId(c.id); setEditingName(c.name); }} className="p-2 rounded-lg hover:bg-blush-50 text-grape-600"><FiEdit2 size={16} /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-blush-50 text-blush-500"><FiTrash2 size={16} /></button>
                </>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="p-8 text-center text-ink/40">No categories yet — add your first one above.</p>}
      </div>
    </div>
  );
}
