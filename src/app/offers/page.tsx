import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Image from "next/image";
import { FiTag } from "react-icons/fi";

export const metadata: Metadata = { title: "Offers", description: "Today's offers and deals at HN Ice Cream." };
export const revalidate = 60;

export default async function OffersPage() {
  let offers: any[] = [];
  try {
    offers = await prisma.offer.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
  } catch {
    offers = [];
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
      <p className="section-eyebrow">Limited Time</p>
      <h1 className="section-title mb-10">Today&apos;s Offers</h1>

      {offers.length === 0 ? (
        <p className="text-ink/40 py-16 text-center">
          No active offers right now — check back soon, or add one from Admin → Offers.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((o) => (
            <div key={o.id} className="glass-card overflow-hidden">
              {o.imageUrl ? (
                <div className="relative w-full aspect-video">
                  <Image src={o.imageUrl} alt={o.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-grape-blush text-white flex items-center justify-center m-6 mb-0">
                  <FiTag />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-xl mb-2">{o.title}</h3>
                <p className="text-ink/60 text-sm mb-3">{o.description}</p>
                {o.discountPct && (
                  <span className="inline-block bg-blush-100 text-blush-500 text-xs font-semibold px-3 py-1 rounded-full">
                    {o.discountPct}% OFF
                  </span>
                )}
                {o.code && <p className="text-xs text-ink/40 mt-3">Code: <span className="font-mono">{o.code}</span></p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
