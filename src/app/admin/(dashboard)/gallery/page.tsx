import { prisma } from "@/lib/prisma";
import GalleryManager from "./GalleryManager";

export default async function AdminGalleryPage() {
  let images: any[] = [];
  try {
    images = await prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    images = [];
  }
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Gallery</h1>
      <GalleryManager initialImages={images} />
    </div>
  );
}
