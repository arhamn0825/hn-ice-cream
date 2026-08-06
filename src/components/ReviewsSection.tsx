import { prisma } from "@/lib/prisma";
import { FiStar } from "react-icons/fi";

export default async function ReviewsSection() {
  let reviews: { id: string; name: string; rating: number; comment: string }[] = [];
  try {
    reviews = await prisma.review.findMany({
      where: { isApproved: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    reviews = [];
  }

  if (reviews.length === 0) return null;

  return (
    <section className="py-16 bg-blush-50/50">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <p className="section-eyebrow text-center">What People Say</p>
        <h2 className="section-title text-center mb-10">Loved by Our Customers</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="glass-card p-6">
              <div className="flex gap-1 text-blush-400 mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <FiStar key={i} className="fill-current" />
                ))}
              </div>
              <p className="text-ink/70 text-sm mb-4">&ldquo;{r.comment}&rdquo;</p>
              <p className="font-medium text-ink">{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
