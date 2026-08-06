import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { FiInstagram } from "react-icons/fi";

export default async function InstagramStrip() {
  let images: { id: string; imageUrl: string; caption: string | null }[] = [];
  try {
    images = await prisma.galleryImage.findMany({ take: 6, orderBy: { sortOrder: "asc" } });
  } catch {
    images = [];
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <FiInstagram className="text-grape-500" />
          <h2 className="section-title text-center">@hnicecream</h2>
        </div>
        {images.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden glass">
                <Image src={img.imageUrl} alt={img.caption ?? "HN Ice Cream"} fill className="object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-ink/40 text-sm">Gallery images can be added from Admin → Gallery.</p>
        )}
      </div>
    </section>
  );
}
