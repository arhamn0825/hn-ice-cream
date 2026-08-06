import { prisma } from "@/lib/prisma";
import OrdersTable from "./OrdersTable";

export default async function AdminOrdersPage() {
  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    orders = [];
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Orders</h1>
      <OrdersTable
        initialOrders={orders.map((o) => ({
          ...o,
          subtotal: Number(o.subtotal),
          deliveryCharge: Number(o.deliveryCharge),
          total: Number(o.total),
        }))}
      />
    </div>
  );
}
