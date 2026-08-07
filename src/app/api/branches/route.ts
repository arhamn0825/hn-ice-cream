import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const branches = await prisma.branch.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(branches);
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, address, mapEmbedUrl } = await req.json();
  if (!name?.trim() || !mapEmbedUrl?.trim()) {
    return NextResponse.json({ error: "Branch name and map link are required" }, { status: 400 });
  }

  const count = await prisma.branch.count();
  const branch = await prisma.branch.create({
    data: { name: name.trim(), address: address?.trim() || null, mapEmbedUrl: mapEmbedUrl.trim(), sortOrder: count },
  });
  return NextResponse.json(branch, { status: 201 });
}
