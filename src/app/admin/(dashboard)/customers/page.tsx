import { prisma } from "@/lib/prisma";

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
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 border-b border-ink/10">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-ink/5 last:border-0">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 text-ink/60">{c.email}</td>
                <td className="p-4 text-ink/60">{c.phone ?? "—"}</td>
                <td className="p-4">{c._count.orders}</td>
                <td className="p-4 text-ink/40 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p className="p-8 text-center text-ink/40">No customers yet.</p>}
      </div>
    </div>
  );
}
