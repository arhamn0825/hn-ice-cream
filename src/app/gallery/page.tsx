import { prisma } from "@/lib/prisma";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gallery", description: "A look inside HN Ice Cream." };
export const revalidate = 60;

export default async function GalleryPage() {
  let images: any[] = [];
  try {
    images = await prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    images = [];
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
      <p className="section-eyebrow">Behind the Scoop</p>
      <h1 className="section-title mb-10">Gallery</h1>

      {images.length === 0 ? (
        <p className="text-ink/40 py-16 text-center">
          No gallery images yet — add some from Admin → Gallery.
        </p>
      ) : (
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img) => (
            <div key={img.id} className="relative rounded-3xl overflow-hidden glass break-inside-avoid">
              <Image src={img.imageUrl} alt={img.caption ?? "HN Ice Cream"} width={500} height={500} className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
