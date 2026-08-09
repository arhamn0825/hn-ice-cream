import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const VALID_TARGETS = ["orders", "customers", "newsletter", "reviews"] as const;
type Target = (typeof VALID_TARGETS)[number];

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { target } = (await req.json()) as { target: Target };
  if (!VALID_TARGETS.includes(target)) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  try {
    let count = 0;
    if (target === "orders") {
      const result = await prisma.order.deleteMany({});
      count = result.count;
    } else if (target === "customers") {
      const result = await prisma.customer.deleteMany({});
      count = result.count;
    } 
    else if (target === "reviews") {
      const result = await prisma.review.deleteMany({});
      count = result.count;
    }
    return NextResponse.json({ success: true, count });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to clear data" }, { status: 500 });
  }
}
