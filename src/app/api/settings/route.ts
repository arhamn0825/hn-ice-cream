import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "store_settings" } });
    return NextResponse.json(settings);
  } catch {
    // DB not connected yet — return sensible defaults so the UI still works
    return NextResponse.json({
      whatsappNumber: "+92300000000",
      deliveryCharge: 100,
      storeName: "HN Ice Cream",
    });
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const updated = await prisma.settings.upsert({
    where: { id: "store_settings" },
    update: body,
    create: { id: "store_settings", ...body },
  });
  return NextResponse.json(updated);
}
