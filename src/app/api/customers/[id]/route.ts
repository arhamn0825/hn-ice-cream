import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { name, email, phone } = await req.json();

  if (email) {
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Another customer already uses this email" }, { status: 409 });
    }
  }

  const updated = await prisma.customer.update({
    where: { id },
    data: { name, email, phone },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  // Their past orders/reviews are kept for your records — only the account
  // itself is removed (Order.customerId and Review.customerId are set to
  // null automatically, guest name/phone on old orders stays intact).
  await prisma.customer.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
