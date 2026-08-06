"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FiUpload, FiX, FiLoader } from "react-icons/fi";

export default function ImageUploader({
  bucket,
  value,
  onChange,
  label,
  shape = "square",
}: {
  bucket: "product-images" | "gallery" | "branding";
  value: string;
  onChange: (url: string) => void;
  label?: string;
  shape?: "square" | "wide";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {label && <label className="text-sm font-medium text-ink/70 block mb-1">{label}</label>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {value ? (
        <div className={`relative ${shape === "wide" ? "aspect-video" : "aspect-square w-32"} rounded-2xl overflow-hidden border border-ink/10 group`}>
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => inputRef.current?.click()} className="bg-white p-2 rounded-full text-grape-600" title="Replace image">
              <FiUpload size={14} />
            </button>
            <button type="button" onClick={() => onChange("")} className="bg-white p-2 rounded-full text-blush-500" title="Remove image">
              <FiX size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-grape-200 text-ink/40 hover:border-grape-400 hover:text-grape-500 transition-colors ${
            shape === "wide" ? "aspect-video w-full" : "aspect-square w-32"
          }`}
        >
          {loading ? <FiLoader className="animate-spin" /> : <FiUpload />}
          <span className="text-xs">{loading ? "Uploading..." : "Choose Image"}</span>
        </button>
      )}
    </div>
  );
}
