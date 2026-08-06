"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cartStore";
import toast from "react-hot-toast";
import { FiMinus, FiPlus } from "react-icons/fi";
import Link from "next/link";

export default function AddToCartPanel({
  product,
}: {
  product: { id: string; name: string; price: number; imageUrl: string | null };
}) {
  const [qty, setQty] = useState(1);
  const [addOns, setAddOns] = useState<string[]>([]);
  const addItem = useCartStore((s) => s.addItem);

  const toggleAddOn = (name: string) => {
    setAddOns((prev) => (prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]));
  };

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl ?? undefined,
      quantity: qty,
      addOns,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="mt-8">
      <p className="text-sm font-medium text-ink/70 mb-3">Add-ons</p>
      <div className="flex gap-2 mb-6">
        {["Waffle Cone", "Waffle Bowl"].map((a) => (
          <button
            key={a}
            onClick={() => toggleAddOn(a)}
            className={`px-4 py-2 rounded-full text-sm border-2 transition-colors ${
              addOns.includes(a) ? "bg-grape-500 border-grape-500 text-white" : "border-grape-200 text-ink/60"
            }`}
          >
            {a} (+Rs 60)
          </button>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 glass rounded-full px-4 py-2">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><FiMinus /></button>
          <span className="w-6 text-center">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity"><FiPlus /></button>
        </div>
        <button onClick={handleAdd} className="btn-primary flex-1">Add to Cart</button>
      </div>

      <Link href="/cart" className="block text-center mt-4 text-sm text-grape-600 underline">
        View Cart
      </Link>
    </div>
  );
}
