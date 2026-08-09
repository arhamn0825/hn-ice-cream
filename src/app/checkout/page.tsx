"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cartStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { isValidPKPhone, normalizePKPhone, PHONE_HINT } from "@/lib/phone";

type ActiveOffer = { id: string; title: string; discountPct: number } | null;
type Session = { id: string; name: string; email: string } | null;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const router = useRouter();
  const [deliveryCharge, setDeliveryCharge] = useState(180);
  const [activeOffer, setActiveOffer] = useState<ActiveOffer>(null);
  const [session, setSession] = useState<Session>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", notes: "" });
  const [phoneTouched, setPhoneTouched] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => d?.deliveryCharge && setDeliveryCharge(Number(d.deliveryCharge)))
      .catch(() => {});

    fetch("/api/offers/active")
      .then((r) => r.json())
      .then((offer) => setActiveOffer(offer))
      .catch(() => {});

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setSession(data);
        if (data) setForm((f) => ({ ...f, name: data.name, email: data.email }));
        else router.push("/login?redirect=/checkout");
      })
      .catch(() => router.push("/login?redirect=/checkout"))
      .finally(() => setCheckingAuth(false));
  }, [router]);

  const discountAmount = activeOffer ? Math.round((subtotal() * activeOffer.discountPct) / 100) : 0;
  const total = subtotal() - discountAmount + deliveryCharge;
  const phoneValid = isValidPKPhone(form.phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.address || !form.city) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!phoneValid) {
      setPhoneTouched(true);
      toast.error(`Please enter a valid phone number (${PHONE_HINT})`);
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
          guestName: form.name,
          guestPhone: normalizePKPhone(form.phone),
          guestEmail: form.email,
          deliveryAddress: form.address,
          city: form.city,
          phone: normalizePKPhone(form.phone),
          notes: form.notes,
          paymentMethod: "COD",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error?.formErrors?.[0] || data?.error || "Order failed");
      }
      const order = await res.json();
      clearCart();
      toast.success("Order placed! We'll call you to confirm.");
      router.push(`/dashboard?order=${order.orderNumber}`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return <div className="max-w-2xl mx-auto px-5 py-24 text-center text-ink/50">Checking your account...</div>;
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <p className="text-ink/50 mb-6">You need an account to check out.</p>
        <Link href="/login?redirect=/checkout" className="btn-primary">Log In or Sign Up</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="max-w-2xl mx-auto px-5 py-24 text-center text-ink/50">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-16">
      <h1 className="section-title mb-8">Checkout</h1>

      {activeOffer && (
        <div className="glass-card p-4 mb-6 flex items-center gap-3 bg-green-50/60 border-green-200">
          <span className="text-2xl">🎉</span>
          <p className="text-sm">
            <span className="font-semibold">{activeOffer.title}</span> is active — you&apos;re getting{" "}
            <span className="font-semibold text-green-600">{activeOffer.discountPct}% off</span> this order automatically.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-4 glass-card p-6">
          <h2 className="font-display text-xl mb-2">Delivery Details</h2>
          <Input label="Full Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />

          <div>
            <label className="text-sm font-medium text-ink/70 block mb-1">Phone Number *</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              onBlur={() => setPhoneTouched(true)}
              placeholder="Phone Number"
              className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 ${
                phoneTouched && !phoneValid ? "border-red-300 focus:ring-red-200" : "border-ink/10 focus:ring-grape-300"
              }`}
            />
            {phoneTouched && !phoneValid && (
              <p className="text-xs text-red-500 mt-1">Enter a valid number, {PHONE_HINT}</p>
            )}
          </div>

          <Input label="Email *" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <Input label="Delivery Address *" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
          <Input label="City *" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
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
          {activeOffer && (
            <div className="flex justify-between text-sm py-1 text-green-600">
              <span>{activeOffer.title} ({activeOffer.discountPct}% off)</span>
              <span>− Rs {discountAmount}</span>
            </div>
          )}
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

function Input({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink/70 block mb-1">{label}</label>
      <input
        required={required}
        type={label.toLowerCase().includes("email") ? "email" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300"
      />
    </div>
  );
}
