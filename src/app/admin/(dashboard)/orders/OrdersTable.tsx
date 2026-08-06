"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type Order = {
  id: string;
  orderNumber: string;
  guestName: string | null;
  phone: string;
  city: string;
  total: number;
  status: string;
  items: { name: string; quantity: number }[];
  createdAt: string;
};

const statuses = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export default function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success("Order status updated");
    } else {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink/50 border-b border-ink/10">
            <th className="p-4">Order #</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Items</th>
            <th className="p-4">Total</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-ink/5 last:border-0 align-top">
              <td className="p-4 font-medium whitespace-nowrap">{o.orderNumber}</td>
              <td className="p-4">
                <p>{o.guestName}</p>
                <p className="text-ink/40 text-xs">{o.phone} · {o.city}</p>
              </td>
              <td className="p-4 text-ink/60 max-w-xs">{o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}</td>
              <td className="p-4 font-medium">Rs {o.total}</td>
              <td className="p-4">
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="px-3 py-2 rounded-lg border border-ink/10 text-xs"
                >
                  {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p className="p-8 text-center text-ink/40">No orders yet.</p>}
    </div>
  );
}
