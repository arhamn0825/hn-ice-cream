import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name || !name.trim()) return NextResponse.json({ error: "Category name is required" }, { status: 400 });

  const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  const count = await prisma.category.count();
  const category = await prisma.category.create({
    data: { name: name.trim(), slug, sortOrder: count },
  });
  return NextResponse.json(category, { status: 201 });
}
