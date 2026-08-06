import { prisma } from "@/lib/prisma";
import CategoriesManager from "./CategoriesManager";

export default async function AdminCategoriesPage() {
  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    });
  } catch {
    categories = [];
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Categories</h1>
      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
