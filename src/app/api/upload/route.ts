import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { supabaseAdmin, ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/supabase";

const ALLOWED_BUCKETS = ["product-images", "gallery", "branding"];

// Handles image uploads from the Admin Panel (product photos, gallery photos,
// homepage banner, logo, favicon). The file goes straight into Supabase
// Storage and this route returns the public URL to save on the record.
export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const bucket = formData.get("bucket") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
    return NextResponse.json({ error: "Invalid upload destination" }, { status: 400 });
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only image files are allowed (PNG, JPG, WEBP, GIF, SVG, ICO)" }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image must be smaller than 5MB" }, { status: 400 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json(
      { error: "Supabase is not connected yet. Add SUPABASE_SERVICE_ROLE_KEY to your .env file — see README." },
      { status: 500 }
    );
  }

  const supabase = supabaseAdmin();
  const ext = file.name.split(".").pop() || "png";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return NextResponse.json({ url: data.publicUrl });
}
