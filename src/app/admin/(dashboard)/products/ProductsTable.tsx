"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import ImageUploader from "@/components/ImageUploader";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  isBestSeller: boolean;
  category: { id: string; name: string };
};

export default function ProductsTable({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: { id: string; name: string }[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } else {
      toast.error("Failed to delete");
    }
  };

  const handleToggle = async (p: Product, field: "isAvailable" | "isBestSeller") => {
    const res = await fetch(`/api/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !p[field] }),
    });
    if (res.ok) {
      setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, [field]: !x[field] } : x)));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Link href="/admin/categories" className="text-sm text-grape-600 underline">Manage Categories</Link>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 border-b border-ink/10">
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price (Rs)</th>
              <th className="p-4">Available</th>
              <th className="p-4">Best Seller</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-ink/5 last:border-0">
                <td className="p-4">
                  <div className="w-12 h-12 rounded-xl bg-blush-50 overflow-hidden flex items-center justify-center text-xl">
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : "🍦"}
                  </div>
                </td>
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 text-ink/60">{p.category?.name}</td>
                <td className="p-4">{p.price}</td>
                <td className="p-4">
                  <input type="checkbox" checked={p.isAvailable} onChange={() => handleToggle(p, "isAvailable")} />
                </td>
                <td className="p-4">
                  <input type="checkbox" checked={p.isBestSeller} onChange={() => handleToggle(p, "isBestSeller")} />
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-2 rounded-lg hover:bg-blush-50 text-grape-600"><FiEdit2 size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-blush-50 text-blush-500"><FiTrash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-ink/40">
            No products yet. Add one, or run <code>npm run db:seed</code> to load the full HN Ice Cream menu.
          </p>
        )}
      </div>

      {showForm && (
        <ProductForm
          product={editing}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSaved={(saved, isNew) => {
            setProducts((prev) => (isNew ? [saved, ...prev] : prev.map((p) => (p.id === saved.id ? saved : p))));
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function ProductForm({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: Product | null;
  categories: { id: string; name: string }[];
  onClose: () => void;
  onSaved: (p: Product, isNew: boolean) => void;
}) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    price: product?.price ?? 0,
    categoryId: product?.category?.id ?? categories[0]?.id ?? "",
    imageUrl: product?.imageUrl ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.name.toLowerCase().trim().replace(/\s+/g, "-");
    const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug, price: Number(form.price) }),
    });
    if (res.ok) {
      const saved = await res.json();
      const category = categories.find((c) => c.id === form.categoryId)!;
      onSaved({ ...saved, price: Number(saved.price), category }, !product);
      toast.success(product ? "Product updated" : "Product added");
    } else {
      toast.error("Failed to save product");
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-5">
      <div className="glass-card bg-white/95 p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl">{product ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose}><FiX /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <ImageUploader bucket="product-images" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} label="Product Photo" />
          <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-ink/10" />
          <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full px-4 py-2.5 rounded-xl border border-ink/10" />
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-ink/10">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="btn-primary w-full">{product ? "Save Changes" : "Add Product"}</button>
        </form>
      </div>
    </div>
  );
}
