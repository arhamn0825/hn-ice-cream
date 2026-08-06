/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" }, // Supabase Storage images
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
