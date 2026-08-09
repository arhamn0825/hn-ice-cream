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
      
      <OrdersTable
        initialOrders={orders.map((o) => ({
          ...o,
          subtotal: Number(o.subtotal),
          discountAmount: Number(o.discountAmount),
          deliveryCharge: Number(o.deliveryCharge),
          total: Number(o.total),
          items: o.items.map((i: any) => ({ ...i, price: Number(i.price) })),
        }))}
      />
    </div>
  );
}

