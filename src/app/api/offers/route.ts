import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const offers = await prisma.offer.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(offers);
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.title?.trim() || !body.discountPct) {
    return NextResponse.json({ error: "Title and discount % are required" }, { status: 400 });
  }

  const offer = await prisma.offer.create({
    data: {
      title: body.title.trim(),
      description: body.description?.trim() || null,
      imageUrl: body.imageUrl?.trim() || null,
      discountPct: Number(body.discountPct),
      isActive: !!body.isActive,
      startsAt: body.startsAt ? new Date(body.startsAt) : null,
      endsAt: body.endsAt ? new Date(body.endsAt) : null,
    },
  });
  return NextResponse.json(offer, { status: 201 });
}
