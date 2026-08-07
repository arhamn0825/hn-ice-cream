"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  orderCount: number;
  createdAt: string;
};

export default function CustomersTable({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const startEdit = (c: Customer) => {
    setEditingId(c.id);
    setForm({ name: c.name, email: c.email, phone: c.phone ?? "" });
  };

  const handleSave = async (id: string) => {
    const res = await fetch(`/api/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...form } : c)));
      setEditingId(null);
      toast.success("Customer updated");
    } else {
      toast.error(data.error || "Failed to update customer");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}'s account? Their past orders are kept for your records, but they'll need to sign up again to order.`)) return;
    const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      toast.success("Customer deleted");
    } else {
      toast.error("Failed to delete customer");
    }
  };

  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink/50 border-b border-ink/10">
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Orders</th>
            <th className="p-4">Joined</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-b border-ink/5 last:border-0">
              {editingId === c.id ? (
                <>
                  <td className="p-3"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-2 py-1.5 rounded-lg border border-ink/10" /></td>
                  <td className="p-3"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-2 py-1.5 rounded-lg border border-ink/10" /></td>
                  <td className="p-3"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-2 py-1.5 rounded-lg border border-ink/10" /></td>
                  <td className="p-4">{c.orderCount}</td>
                  <td className="p-4 text-ink/40 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleSave(c.id)} className="p-2 rounded-lg hover:bg-blush-50 text-green-600"><FiCheck size={16} /></button>
                    <button onClick={() => setEditingId(null)} className="p-2 rounded-lg hover:bg-blush-50 text-ink/40"><FiX size={16} /></button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4 text-ink/60">{c.email}</td>
                  <td className="p-4 text-ink/60">{c.phone ?? "—"}</td>
                  <td className="p-4">{c.orderCount}</td>
                  <td className="p-4 text-ink/40 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => startEdit(c)} className="p-2 rounded-lg hover:bg-blush-50 text-grape-600" title="Edit customer"><FiEdit2 size={16} /></button>
                    <button onClick={() => handleDelete(c.id, c.name)} className="p-2 rounded-lg hover:bg-blush-50 text-blush-500" title="Delete customer"><FiTrash2 size={16} /></button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {customers.length === 0 && <p className="p-8 text-center text-ink/40">No customers yet.</p>}
    </div>
  );
}
