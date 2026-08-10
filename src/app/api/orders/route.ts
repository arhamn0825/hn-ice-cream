import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, getAdminSession } from "@/lib/auth";
import { isValidPKPhone, normalizePKPhone } from "@/lib/phone";
import { sendOrderNotificationEmail } from "@/lib/email";
import { z } from "zod";

const orderSchema = z.object({
  items: z.array(
    z.object({ id: z.string(), name: z.string(), price: z.number(), quantity: z.number(), addOns: z.array(z.string()).optional() })
  ),
  subtotal: z.number(),
  deliveryCharge: z.number(),
  guestName: z.string().min(1),
  guestPhone: z.string().refine(isValidPKPhone, { message: "" }),
  guestEmail: z.string().email().optional(),
  deliveryAddress: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().refine(isValidPKPhone, { message: "" }),
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

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please log in to place an order" }, { status: 401 });

  const data = parsed.data;

  // The discount is recalculated here from whatever offer is actually live
  // right now — never trusted from the browser — so nobody can send a fake
  // discount amount and get a cheaper order.
  const now = new Date();
  const activeOffer = await prisma.offer.findFirst({
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
  });

  const discountAmount = activeOffer?.discountPct ? Math.round((data.subtotal * activeOffer.discountPct) / 100) : 0;
  const total = data.subtotal - discountAmount + data.deliveryCharge;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerId: session?.id,
      guestName: data.guestName,
      guestPhone: normalizePKPhone(data.guestPhone),
      guestEmail: data.guestEmail,
      subtotal: data.subtotal,
      discountAmount,
      offerTitle: activeOffer?.title ?? null,
      deliveryCharge: data.deliveryCharge,
      total,
      deliveryAddress: data.deliveryAddress,
      city: data.city,
      phone: normalizePKPhone(data.phone),
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

  try {
    const settings = await prisma.settings.findUnique({ where: { id: "store_settings" } });
    if (settings?.orderNotificationEmail) {
      await sendOrderNotificationEmail({
        to: settings.orderNotificationEmail,
        orderNumber: order.orderNumber,
        customerName: data.guestName,
        phone: normalizePKPhone(data.phone),
        address: data.deliveryAddress,
        city: data.city,
        total,
        items: data.items,
      });
    }
  } catch {
    // Notification is a nice-to-have, never let it affect the customer's order.
  }

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

