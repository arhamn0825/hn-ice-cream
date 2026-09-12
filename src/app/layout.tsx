import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Toaster } from "react-hot-toast";
import DeliverySelectModal from "@/components/DeliverySelectModal";
import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/lib/getSettings";

// Reads Settings from the database so the browser-tab icon (favicon) and
// store name update automatically when changed from Admin → Store Settings —
// no code edit or redeploy needed.
export async function generateMetadata(): Promise<Metadata> {
  let storeName = "HN Ice Cream";
  let faviconUrl: string | undefined;
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "store_settings" } });
    if (settings?.storeName) storeName = settings.storeName;
    if (settings?.faviconUrl) faviconUrl = settings.faviconUrl;
  } catch {
    // DB not connected yet — fall back to defaults
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hnicecream.com"),
    title: {
      default: storeName,
      template: `%s | ${storeName}`,
    },
    description:
      "Indulge in handcrafted ice cream and premium shakes made fresh daily. Order online for delivery.",
    keywords: ["ice cream", "premium shakes", storeName, "dessert delivery"],
    openGraph: {
      title: storeName,
      description: "Handcrafted ice cream & premium shakes, made fresh daily.",
      type: "website",
    },
    manifest: "/manifest.json",
    icons: faviconUrl
      ? { icon: faviconUrl, apple: faviconUrl }
      : { icon: "/favicon.ico" },
  };
}

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  width: "device-width",
  initialScale: 1,
};

// Settings (logo, store name, WhatsApp number) are fetched once here, on the
// server, before anything is sent to the browser — so the real logo and
// WhatsApp button appear instantly, with no placeholder flash.
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getStoreSettings();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-cream text-ink antialiased scroll-smooth">
      <DeliverySelectModal />
        <Navbar logoUrl={settings.logoUrl} storeName={settings.storeName} />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton whatsappNumber={settings.whatsappNumber} />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
