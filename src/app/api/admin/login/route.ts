import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signAdminSession, setAdminSessionCookie } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({ username: z.string().min(1), password: z.string().min(1) });

// Admin credentials are never hardcoded here — they're hashed and stored in the
// Admin table (seeded via prisma/seed.ts from ADMIN_SEED_PASSWORD in .env).
export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { username, password } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signAdminSession({ id: admin.id, username: admin.username });
  await setAdminSessionCookie(token);

  return NextResponse.json({ success: true });
}
