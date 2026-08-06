import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  price: z.number().positive(),
  categoryId: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isBestSeller: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const products = await prisma.product.findMany({
    where: category ? { category: { slug: category } } : undefined,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  // Two products can share a name (e.g. "Strawberry Cheesecake" in both Ice
  // Cream and Shakes) — make sure the slug stays unique so this never crashes.
  let slug = parsed.data.slug;
  let attempt = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${parsed.data.slug}-${attempt}`;
  }

  const product = await prisma.product.create({ data: { ...parsed.data, slug } });
  return NextResponse.json(product, { status: 201 });
}
