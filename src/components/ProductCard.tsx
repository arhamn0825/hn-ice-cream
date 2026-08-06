"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiPlus, FiHeart } from "react-icons/fi";
import { useCartStore } from "@/lib/cartStore";
import toast from "react-hot-toast";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string | null;
  isBestSeller?: boolean;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id: product.id, name: product.name, price: product.price, image: product.imageUrl ?? undefined, quantity: 1 });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card group overflow-hidden"
    >
      <Link href={`/shop/${product.slug}`}>
        <div className="relative aspect-square bg-blush-50 overflow-hidden rounded-t-4xl">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🍦</div>
          )}
          {product.isBestSeller && (
            <span className="absolute top-3 left-3 bg-grape-blush text-white text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full">
              Best Seller
            </span>
          )}
          <button
            className="absolute top-3 right-3 bg-white/80 backdrop-blur p-2 rounded-full text-blush-500 hover:bg-white transition-colors"
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
          >
            <FiHeart className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-medium text-ink">{product.name}</h3>
          <div className="flex items-center justify-between mt-3">
            <span className="text-grape-600 font-semibold">Rs {product.price}</span>
            <button
              onClick={handleAdd}
              className="w-9 h-9 rounded-full bg-grape-blush text-white flex items-center justify-center hover:scale-110 transition-transform"
              aria-label={`Add ${product.name} to cart`}
            >
              <FiPlus />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
