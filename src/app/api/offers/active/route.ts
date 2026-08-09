import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// "Automatic" means no code required — it's an offer with no `code` set.
// If more than one is active, the biggest discount wins. Respects
// startsAt/endsAt so a scheduled offer switches on/off by itself too.
export async function GET() {
  const now = new Date();
  const offers = await prisma.offer.findMany({
    where: {
      isActive: true,
      code: null,
      discountPct: { not: null },
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    orderBy: { discountPct: "desc" },
    take: 1,
  });

  return NextResponse.json(offers[0] ?? null);
}
