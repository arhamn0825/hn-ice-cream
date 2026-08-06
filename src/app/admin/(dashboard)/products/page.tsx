import { prisma } from "@/lib/prisma";
import ProductsTable from "./ProductsTable";

export default async function AdminProductsPage() {
  let products: any[] = [];
  let categories: any[] = [];
  try {
    [products, categories] = await Promise.all([
      prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
      prisma.category.findMany(),
    ]);
  } catch {
    // DB not connected yet
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Products</h1>
      <ProductsTable
        initialProducts={products.map((p) => ({ ...p, price: Number(p.price) }))}
        categories={categories}
      />
    </div>
  );
}
