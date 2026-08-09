import { prisma } from "@/lib/prisma";
import OffersManager from "./OffersManager";

export default async function AdminOffersPage() {
  let offers: any[] = [];
  try {
    offers = await prisma.offer.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    offers = [];
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Offers</h1>
      <p className="text-ink/50 text-sm mb-8">
        Turn an offer ON and every customer gets that discount automatically — no code needed. Only one should be ON at a time.
      </p>
      <OffersManager
        initialOffers={offers.map((o) => ({
          ...o,
          imageUrl: o.imageUrl ?? null,
          startsAt: o.startsAt ? o.startsAt.toISOString().slice(0, 10) : "",
          endsAt: o.endsAt ? o.endsAt.toISOString().slice(0, 10) : "",
        }))}
      />
    </div>
  );
}
