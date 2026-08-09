import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth";
import { isValidPKPhone } from "@/lib/phone";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().refine(isValidPKPhone, { message: "Enter a valid Pakistani phone number, e.g. 03001234567" }),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Invalid input";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { name, email, phone, password } = parsed.data;
  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const customer = await prisma.customer.create({ data: { name, email, phone, passwordHash } });

  const token = signSession({ id: customer.id, email: customer.email, name: customer.name });
  await setSessionCookie(token);

  return NextResponse.json({ id: customer.id, name: customer.name, email: customer.email }, { status: 201 });
}
