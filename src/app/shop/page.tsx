import { prisma } from "@/lib/prisma";
import ShopClient from "./ShopClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse handcrafted ice cream and premium shakes at HN Ice Cream.",
};

export const revalidate = 60;

async function getShopData() {
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({ where: { isAvailable: true }, include: { category: true } }),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
    return {
      products: products.map((p) => ({ ...p, price: Number(p.price) })),
      categories,
    };
  } catch {
    return { products: [], categories: [] };
  }
}

export default async function ShopPage() {
  const { products, categories } = await getShopData();
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">
      <p className="section-eyebrow">Full Menu</p>
      <h1 className="section-title mb-8">Shop</h1>
      <ShopClient products={products} categories={categories.map((c) => c.name)} />
    </div>
  );
}
