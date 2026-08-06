import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const images = await prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { imageUrl, caption } = await req.json();
  if (!imageUrl) return NextResponse.json({ error: "imageUrl required" }, { status: 400 });

  const image = await prisma.galleryImage.create({ data: { imageUrl, caption } });
  return NextResponse.json(image, { status: 201 });
}
