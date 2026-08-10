import { prisma } from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  let settings: any = null;
  try {
    settings = await prisma.settings.findUnique({ where: { id: "store_settings" } });
  } catch {
    settings = null;
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Store Settings</h1>
      <SettingsForm
        initialSettings={
          settings
            ? { ...settings, deliveryCharge: Number(settings.deliveryCharge), freeDeliveryOver: settings.freeDeliveryOver ? Number(settings.freeDeliveryOver) : null }
            : {
                storeName: "HN Ice Cream",
                logoUrl: "",
                faviconUrl: "",
                heroImageUrl: "",
                whatsappNumber: "+92300000000",
                orderNotificationEmail: "",
                contactEmail: "",
                contactPhone: "",
                contactAddress: "",
                mapEmbedUrl: "",
                deliveryCharge: 100,
                freeDeliveryOver: null,
                heroHeadline: "Indulge in Every Scoop",
                heroSubtext: "Handcrafted ice cream & premium shakes, made fresh daily.",
                instagramUrl: "",
                facebookUrl: "",
              }
        }
      />
    </div>
  );
}
