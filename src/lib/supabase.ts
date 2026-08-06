import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

// Client-side Supabase instance — used for Storage (product images, gallery, logo uploads)
// and can optionally be used for Supabase Auth instead of the custom JWT flow below.
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const PRODUCT_IMAGES_BUCKET = "product-images";
export const GALLERY_BUCKET = "gallery";
export const BRANDING_BUCKET = "branding"; // logo, favicon, homepage banners

// Server-only client — uses the Service Role key so uploads work even with
// Storage security rules on. NEVER import this file into client components;
// it must only ever run inside API routes (server code).
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "image/x-icon"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
