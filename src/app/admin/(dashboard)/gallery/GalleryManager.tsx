"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FiTrash2, FiPlus } from "react-icons/fi";
import ImageUploader from "@/components/ImageUploader";

type GalleryImage = { id: string; imageUrl: string; caption: string | null };

export default function GalleryManager({ initialImages }: { initialImages: GalleryImage[] }) {
  const [images, setImages] = useState(initialImages);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return toast.error("Choose a photo first");
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: url, caption }),
    });
    if (res.ok) {
      const img = await res.json();
      setImages((prev) => [...prev, img]);
      setUrl("");
      setCaption("");
      toast.success("Image added to gallery");
    } else {
      toast.error("Failed to add image");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    if (res.ok) {
      setImages((prev) => prev.filter((i) => i.id !== id));
      toast.success("Image removed");
    }
  };

  return (
    <div>
      <form onSubmit={handleAdd} className="glass-card p-5 flex flex-col sm:flex-row items-start gap-4 mb-8">
        <ImageUploader bucket="gallery" value={url} onChange={setUrl} />
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
          <input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-ink/10" />
          <button className="btn-primary shrink-0"><FiPlus /> Add to Gallery</button>
        </div>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative glass-card overflow-hidden aspect-square group">
            <Image src={img.imageUrl} alt={img.caption ?? ""} fill className="object-cover" />
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-blush-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      {images.length === 0 && <p className="text-ink/40 text-center py-10">No gallery images yet.</p>}
    </div>
  );
}
