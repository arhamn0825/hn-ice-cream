import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = { ...body };
  if ("discountPct" in data) data.discountPct = Number(data.discountPct);
  if ("startsAt" in data) data.startsAt = data.startsAt ? new Date(data.startsAt as string) : null;
  if ("endsAt" in data) data.endsAt = data.endsAt ? new Date(data.endsAt as string) : null;

  const updated = await prisma.offer.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.offer.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
