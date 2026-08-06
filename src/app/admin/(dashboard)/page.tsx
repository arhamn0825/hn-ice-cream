import { prisma } from "@/lib/prisma";
import { FiDollarSign, FiPackage, FiUsers, FiShoppingBag } from "react-icons/fi";

export default async function AdminOverview() {
  let stats = { revenue: 0, orders: 0, customers: 0, products: 0, pending: 0 };
  try {
    const [orders, customers, products, pending] = await Promise.all([
      prisma.order.findMany(),
      prisma.customer.count(),
      prisma.product.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
    ]);
    stats = {
      revenue: orders.reduce((sum: number, o: (typeof orders)[number]) => sum + Number(o.total), 0),
      orders: orders.length,
      customers,
      products,
      pending,
    };
  } catch {
    // DB not connected yet
  }

  const cards = [
    { label: "Total Revenue", value: `Rs ${stats.revenue.toLocaleString()}`, icon: FiDollarSign },
    { label: "Total Orders", value: stats.orders, icon: FiPackage },
    { label: "Pending Orders", value: stats.pending, icon: FiPackage },
    { label: "Products", value: stats.products, icon: FiShoppingBag },
    { label: "Customers", value: stats.customers, icon: FiUsers },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-grape-blush text-white flex items-center justify-center text-xl">
              <Icon />
            </div>
            <div>
              <p className="text-sm text-ink/50">{label}</p>
              <p className="font-display text-2xl font-semibold">{value}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-ink/40 text-sm mt-10">
        Manage products, orders, gallery, and store settings from the sidebar — every change updates the live site instantly, no code required.
      </p>
    </div>
  );
}
