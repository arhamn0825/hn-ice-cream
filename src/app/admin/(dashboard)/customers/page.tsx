import { prisma } from "@/lib/prisma";
import CustomersTable from "./CustomersTable";

export default async function AdminCustomersPage() {
  let customers: any[] = [];
  try {
    customers = await prisma.customer.findMany({
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    customers = [];
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Customers</h1>
      <CustomersTable
        initialCustomers={customers.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          orderCount: c._count.orders,
          createdAt: c.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
