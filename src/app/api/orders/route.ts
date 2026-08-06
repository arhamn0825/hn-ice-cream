import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, getAdminSession } from "@/lib/auth";
import { z } from "zod";

const orderSchema = z.object({
  items: z.array(
    z.object({ id: z.string(), name: z.string(), price: z.number(), quantity: z.number(), addOns: z.array(z.string()).optional() })
  ),
  subtotal: z.number(),
  deliveryCharge: z.number(),
  total: z.number(),
  guestName: z.string().min(1),
  guestPhone: z.string().min(1),
  guestEmail: z.string().optional(),
  deliveryAddress: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().min(1),
  notes: z.string().optional(),
  paymentMethod: z.literal("COD"),
});

function generateOrderNumber() {
  return `HN-${Date.now().toString().slice(-8)}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const session = await getSession(); // attaches order to logged-in customer if present
  const data = parsed.data;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerId: session?.id,
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      guestEmail: data.guestEmail,
      subtotal: data.subtotal,
      deliveryCharge: data.deliveryCharge,
      total: data.total,
      deliveryAddress: data.deliveryAddress,
      city: data.city,
      phone: data.phone,
      notes: data.notes,
      paymentMethod: "COD",
      items: {
        create: data.items.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          addOns: i.addOns ?? [],
        })),
      },
    },
    include: { items: true },
  });

  return NextResponse.json(order, { status: 201 });
}

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    include: { items: true, customer: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}
