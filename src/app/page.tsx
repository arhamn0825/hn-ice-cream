import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/lib/getSettings";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import ReviewsSection from "@/components/ReviewsSection";
import Newsletter from "@/components/Newsletter";
import InstagramStrip from "@/components/InstagramStrip";
import StoreMap from "@/components/StoreMap";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export const revalidate = 60; // ISR — homepage refreshes every 60s as admin edits products

async function getHomeData() {
  // Falls back to empty arrays gracefully if DATABASE_URL isn't configured yet,
  // so the site still renders before Supabase/Prisma is connected.
  try {
    const [bestSellers, iceCream, shakes, offers] = await Promise.all([
      prisma.product.findMany({ where: { isBestSeller: true, isAvailable: true }, take: 4 }),
      prisma.product.findMany({ where: { category: { name: "Ice Cream" }, isAvailable: true }, take: 4 }),
      prisma.product.findMany({ where: { category: { name: "Premium Shakes" }, isAvailable: true }, take: 4 }),
      prisma.offer.findMany({ where: { isActive: true }, take: 3 }),
    ]);
    return { bestSellers, iceCream, shakes, offers };
  } catch {
    return { bestSellers: [], iceCream: [], shakes: [], offers: [] };
  }
}

export default async function HomePage() {
  const [{ bestSellers, iceCream, shakes, offers }, settings] = await Promise.all([
    getHomeData(),
    getStoreSettings(),
  ]);

  return (
    <>
      <Hero heroHeadline={settings.heroHeadline} heroSubtext={settings.heroSubtext} heroImageUrl={settings.heroImageUrl} />

      {/* Today's Offers */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="section-eyebrow">Limited Time</p>
              <h2 className="section-title">Today&apos;s Offers</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((o) => (
              <div key={o.id} className="glass-card p-6">
                <h3 className="font-display text-xl mb-2">{o.title}</h3>
                <p className="text-ink/60 text-sm">{o.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ice Cream Section */}
      <SectionRow title="Signature Ice Cream" eyebrow="Classic & Crafted" href="/shop?category=ice-cream" products={iceCream} />

      {/* Premium Shakes Section */}
      <SectionRow title="Premium Shakes" eyebrow="Thick. Rich. Unforgettable." href="/shop?category=premium-shakes" products={shakes} tone="grape" />

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <SectionRow title="Best Sellers" eyebrow="Customer Favorites" href="/shop" products={bestSellers} />
      )}

      <ReviewsSection />
      <InstagramStrip />
      <Newsletter />
      <StoreMap />
    </>
  );
}

function SectionRow({
  title,
  eyebrow,
  href,
  products,
  tone = "blush",
}: {
  title: string;
  eyebrow: string;
  href: string;
  products: any[];
  tone?: "blush" | "grape";
}) {
  if (products.length === 0) return null;
  return (
    <section className={`py-16 ${tone === "grape" ? "bg-grape-50/60" : ""}`}>
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-eyebrow">{eyebrow}</p>
            <h2 className="section-title">{title}</h2>
          </div>
          <Link href={href} className="hidden sm:flex items-center gap-1 text-grape-600 font-medium hover:gap-2 transition-all">
            View all <FiArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={{ ...p, price: Number(p.price) }} />
          ))}
        </div>
      </div>
    </section>
  );
}
