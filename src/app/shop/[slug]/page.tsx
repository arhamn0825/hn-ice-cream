import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import AddToCartPanel from "./AddToCartPanel";

export const revalidate = 60;

async function getProduct(slug: string) {
  try {
    return await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description ?? `${product.name} — Rs ${product.price} at HN Ice Cream.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 grid md:grid-cols-2 gap-12">
      <div className="relative aspect-square rounded-4xl overflow-hidden glass">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl">🍦</div>
        )}
      </div>
      <div>
        <p className="section-eyebrow">{product.category.name}</p>
        <h1 className="font-display text-4xl font-semibold mt-2">{product.name}</h1>
        <p className="text-2xl text-grape-600 font-semibold mt-4">Rs {Number(product.price)}</p>
        <p className="text-ink/60 mt-6 leading-relaxed">
          {product.description ?? "A handcrafted classic, made fresh daily with premium ingredients — smooth, rich, and unforgettable."}
        </p>
        <AddToCartPanel product={{ id: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl }} />
      </div>
    </div>
  );
}
