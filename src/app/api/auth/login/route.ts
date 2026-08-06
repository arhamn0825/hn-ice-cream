import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { email, password } = parsed.data;
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !(await verifyPassword(password, customer.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = signSession({ id: customer.id, email: customer.email, name: customer.name });
  await setSessionCookie(token);

  return NextResponse.json({ id: customer.id, name: customer.name, email: customer.email });
}
