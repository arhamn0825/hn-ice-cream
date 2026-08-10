export async function sendOrderNotificationEmail({
  to,
  orderNumber,
  customerName,
  phone,
  address,
  city,
  total,
  items,
}: {
  to: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  total: number;
  items: { name: string; quantity: number }[];
}) {
  if (!process.env.RESEND_API_KEY || !to) return;

  try {
    const itemsHtml = items.map((i) => `<li>${i.name} × ${i.quantity}</li>`).join("");

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "HN Ice Cream <onboarding@resend.dev>",
        to: [to],
        subject: `🍦 New Order ${orderNumber} — Rs ${total}`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px;">
            <h2 style="margin-bottom: 4px;">New Order Received!</h2>
            <p style="color: #666; margin-top: 0;">Order #${orderNumber}</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr><td style="padding: 4px 0; color: #666;">Customer</td><td style="padding: 4px 0; font-weight: 600;">${customerName}</td></tr>
              <tr><td style="padding: 4px 0; color: #666;">Phone</td><td style="padding: 4px 0; font-weight: 600;">${phone}</td></tr>
              <tr><td style="padding: 4px 0; color: #666;">Address</td><td style="padding: 4px 0; font-weight: 600;">${address}, ${city}</td></tr>
              <tr><td style="padding: 4px 0; color: #666;">Total</td><td style="padding: 4px 0; font-weight: 600;">Rs ${total}</td></tr>
            </table>
            <p style="color: #666; margin-bottom: 4px;">Items:</p>
            <ul style="margin-top: 0;">${itemsHtml}</ul>
          </div>
        `,
      }),
    });
  } catch {
    // Swallow any error — notification failures must never affect the order.
  }
}