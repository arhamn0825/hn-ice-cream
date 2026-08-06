import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wishlist = await prisma.wishlist.findMany({
    where: { customerId: session.id },
    include: { product: true },
  });
  return NextResponse.json(wishlist);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  const item = await prisma.wishlist.upsert({
    where: { customerId_productId: { customerId: session.id, productId } },
    update: {},
    create: { customerId: session.id, productId },
  });
  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  await prisma.wishlist.delete({
    where: { customerId_productId: { customerId: session.id, productId } },
  });
  return NextResponse.json({ success: true });
}
