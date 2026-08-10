import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { customerId: session.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PREPARING: "bg-purple-100 text-purple-700",
    OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-eyebrow">My Account</p>
          <h1 className="section-title">Hi, {session.name.split(" ")[0]}</h1>
        </div>
        <LogoutButton />
      </div>

      <h2 className="font-display text-xl mb-4">Order History</h2>
      {orders.length === 0 ? (
        <p className="text-ink/50">No orders yet — go treat yourself!</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">{o.orderNumber}</p>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[o.status]}`}>
                  {o.status.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-sm text-ink/50 mb-2">{o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}</p>
              <p className="font-semibold text-grape-600">Rs {Number(o.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
