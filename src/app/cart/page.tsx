"use client";

import { useCartStore } from "@/lib/cartStore";
import Link from "next/link";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h1 className="font-display text-3xl mb-3">Your cart is empty</h1>
        <p className="text-ink/50 mb-8">Looks like you haven&apos;t added any sweetness yet.</p>
        <Link href="/shop" className="btn-primary">Browse the Menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-16">
      <h1 className="section-title mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="glass-card flex items-center gap-4 p-4">
              <div className="w-20 h-20 rounded-2xl bg-blush-50 flex items-center justify-center text-3xl shrink-0">🍦</div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                {item.addOns && item.addOns.length > 0 && (
                  <p className="text-xs text-ink/50">+ {item.addOns.join(", ")}</p>
                )}
                <p className="text-grape-600 font-semibold mt-1">Rs {item.price}</p>
              </div>
              <div className="flex items-center gap-3 glass rounded-full px-3 py-1.5">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease"><FiMinus size={14} /></button>
                <span className="w-5 text-center text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase"><FiPlus size={14} /></button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-blush-500 p-2" aria-label="Remove item">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 h-fit sticky top-24">
          <h2 className="font-display text-xl mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm text-ink/60 mb-2">
            <span>Subtotal</span>
            <span>Rs {subtotal()}</span>
          </div>
          <div className="flex justify-between text-sm text-ink/60 mb-4">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="border-t border-ink/10 pt-4 flex justify-between font-semibold text-lg mb-6">
            <span>Total</span>
            <span>Rs {subtotal()}+</span>
          </div>
          <Link href="/checkout" className="btn-primary w-full">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
}
