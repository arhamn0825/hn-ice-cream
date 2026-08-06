import { prisma } from "@/lib/prisma";

export default async function StoreMap() {
  let mapEmbedUrl = "https://www.google.com/maps?q=Karachi,Pakistan&output=embed";
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "store_settings" } });
    if (settings?.mapEmbedUrl) mapEmbedUrl = settings.mapEmbedUrl;
  } catch {
    // DB not connected yet — use default
  }

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
      <p className="section-eyebrow text-center">Visit Us</p>
      <h2 className="section-title text-center mb-8">Find Our Store</h2>
      <div className="rounded-4xl overflow-hidden glass h-[400px]">
        <iframe src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="HN Ice Cream location" />
      </div>
    </section>
  );
}
