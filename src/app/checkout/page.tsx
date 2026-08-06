"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cartStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const router = useRouter();
  const [deliveryCharge, setDeliveryCharge] = useState(100);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", notes: "" });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => d?.deliveryCharge && setDeliveryCharge(Number(d.deliveryCharge)))
      .catch(() => {});
  }, []);

  const total = subtotal() + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          subtotal: subtotal(),
          deliveryCharge,
          total,
          guestName: form.name,
          guestPhone: form.phone,
          guestEmail: form.email,
          deliveryAddress: form.address,
          city: form.city,
          phone: form.phone,
          notes: form.notes,
          paymentMethod: "COD",
        }),
      });
      if (!res.ok) throw new Error("Order failed");
      const order = await res.json();
      clearCart();
      toast.success("Order placed! We'll call you to confirm.");
      router.push(`/dashboard?order=${order.orderNumber}`);
    } catch {
      toast.error("Something went wrong placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <div className="max-w-2xl mx-auto px-5 py-24 text-center text-ink/50">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-16">
      <h1 className="section-title mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-4 glass-card p-6">
          <h2 className="font-display text-xl mb-2">Delivery Details</h2>
          <Input label="Full Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Phone Number *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Input label="Email (optional)" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Input label="Delivery Address *" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          <Input label="City *" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          <Input label="Order Notes (optional)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />

          <div className="pt-2">
            <p className="text-sm font-medium mb-2">Payment Method</p>
            <div className="glass rounded-2xl p-4 flex items-center gap-3">
              <input type="radio" checked readOnly />
              <span>Cash on Delivery</span>
            </div>
          </div>

          <button disabled={loading} className="btn-primary w-full mt-4">
            {loading ? "Placing Order..." : `Place Order — Rs ${total}`}
          </button>
        </form>

        <div className="glass-card p-6 h-fit">
          <h2 className="font-display text-xl mb-4">Order Summary</h2>
          {items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm py-2 border-b border-ink/5">
              <span>{i.name} × {i.quantity}</span>
              <span>Rs {i.price * i.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm pt-3">
            <span className="text-ink/60">Subtotal</span>
            <span>Rs {subtotal()}</span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span className="text-ink/60">Delivery</span>
            <span>Rs {deliveryCharge}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-3 border-t border-ink/10 mt-2">
            <span>Total</span>
            <span>Rs {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink/70 block mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300"
      />
    </div>
  );
}
