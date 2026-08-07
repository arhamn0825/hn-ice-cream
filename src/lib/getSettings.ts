import { prisma } from "@/lib/prisma";

export type StoreSettings = {
  storeName: string;
  logoUrl: string | null;
  whatsappNumber: string;
  heroHeadline: string;
  heroSubtext: string;
  heroImageUrl: string | null;
};

const DEFAULTS: StoreSettings = {
  storeName: "HN Ice Cream",
  logoUrl: null,
  whatsappNumber: "+92300000000",
  heroHeadline: "Indulge in Every Scoop",
  heroSubtext: "Premium ice cream and shakes crafted with real ingredients — a little luxury delivered to your door.",
  heroImageUrl: null,
};

// Fetched once on the server and passed down as props, so the logo, hero
// picture, and WhatsApp number are already baked into the page's first
// render — no "flash of placeholder before the real image pops in."
export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "store_settings" } });
    if (!settings) return DEFAULTS;
    return {
      storeName: settings.storeName || DEFAULTS.storeName,
      logoUrl: settings.logoUrl || null,
      whatsappNumber: settings.whatsappNumber || DEFAULTS.whatsappNumber,
      heroHeadline: settings.heroHeadline || DEFAULTS.heroHeadline,
      heroSubtext: settings.heroSubtext || DEFAULTS.heroSubtext,
      heroImageUrl: settings.heroImageUrl || null,
    };
  } catch {
    return DEFAULTS;
  }
}
