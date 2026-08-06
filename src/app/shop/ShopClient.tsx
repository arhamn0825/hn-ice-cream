"use client";

import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import ProductCard, { ProductCardData } from "@/components/ProductCard";

export default function ShopClient({
  products,
  categories,
}: {
  products: (ProductCardData & { category: { name: string } })[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sort, setSort] = useState<"default" | "low" | "high">("default");

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (activeCategory !== "All") list = list.filter((p) => p.category.name === activeCategory);
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, query, activeCategory, sort]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search flavors..."
            className="w-full pl-11 pr-4 py-3 rounded-full glass focus:outline-none focus:ring-2 focus:ring-grape-300"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="px-4 py-3 rounded-full glass focus:outline-none focus:ring-2 focus:ring-grape-300"
        >
          <option value="default">Sort: Featured</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === c ? "bg-grape-blush text-white" : "glass text-ink/70 hover:text-grape-600"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-ink/40 py-20">
          No products yet — add some from Admin → Products, or run <code>npm run db:seed</code>.
        </p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
