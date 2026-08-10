import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession, verifyPassword, hashPassword } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  currentPassword: z.string().min(1),
  newUsername: z.string().min(3).optional(),
  newPassword: z.string().min(6).optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { currentPassword, newUsername, newPassword } = parsed.data;
  if (!newUsername && !newPassword) {
    return NextResponse.json({ error: "Nothing to change" }, { status: 400 });
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.id } });
  if (!admin) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  const validPassword = await verifyPassword(currentPassword, admin.passwordHash);
  if (!validPassword) return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });

  if (newUsername && newUsername !== admin.username) {
    const existing = await prisma.admin.findUnique({ where: { username: newUsername } });
    if (existing) return NextResponse.json({ error: "That username is already taken" }, { status: 409 });
  }

  const data: Record<string, string> = {};
  if (newUsername) data.username = newUsername;
  if (newPassword) data.passwordHash = await hashPassword(newPassword);

  await prisma.admin.update({ where: { id: admin.id }, data });

  return NextResponse.json({ success: true });
}
