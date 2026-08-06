import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us", description: "The story behind HN Ice Cream." };

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-16">
      <p className="section-eyebrow">Our Story</p>
      <h1 className="section-title mb-8">Crafted With Passion</h1>

      <div className="prose prose-lg max-w-none text-ink/70 space-y-6 leading-relaxed">
        <p>
          HN Ice Cream started with a simple idea: dessert should feel like an occasion, not an afterthought.
          Every scoop and every shake is made fresh, using real ingredients, without shortcuts.
        </p>
        <p>
          From our signature Strawberry Cheesecake to a classic Vanilla done right, we obsess over texture,
          balance, and the little details that turn a treat into a memory.
        </p>
        <p>
          Today, HN Ice Cream delivers that same care straight to your door — because luxury doesn&apos;t need to
          wait in line.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mt-16">
        {[
          { title: "Fresh Daily", desc: "Made in small batches, every single day." },
          { title: "Real Ingredients", desc: "No shortcuts, no artificial aftertaste." },
          { title: "Delivered With Care", desc: "Packed to arrive as good as it left the store." },
        ].map((f) => (
          <div key={f.title} className="glass-card p-6 text-center">
            <h3 className="font-display text-xl mb-2">{f.title}</h3>
            <p className="text-ink/60 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
