// HN Ice Cream — official menu. Names & prices exactly as provided.
// Do not alter names or prices here — edit via the Admin Dashboard once the
// database is connected. This file is also used by prisma/seed.ts.

export type SeedProduct = {
  name: string;
  slug: string;
  price: number;
  category: "Ice Cream" | "Premium Shakes" | "Add-ons";
  isBestSeller?: boolean;
};

export const seedProducts: SeedProduct[] = [
  // Ice Cream — Rs 260 base, premium flavors Rs 270–290
  { name: "Vanilla", slug: "vanilla-ice-cream", price: 260, category: "Ice Cream" },
  { name: "Chocolate", slug: "chocolate-ice-cream", price: 260, category: "Ice Cream", isBestSeller: true },
  { name: "Mango", slug: "mango-ice-cream", price: 260, category: "Ice Cream" },
  { name: "Pistachio", slug: "pistachio-ice-cream", price: 260, category: "Ice Cream" },
  { name: "Caramel Crunch", slug: "caramel-crunch-ice-cream", price: 270, category: "Ice Cream" },
  { name: "Cotton Candy", slug: "cotton-candy-ice-cream", price: 270, category: "Ice Cream" },
  { name: "Strawberry Cheesecake", slug: "strawberry-cheesecake-ice-cream", price: 290, category: "Ice Cream", isBestSeller: true },
  { name: "Butterscotch", slug: "butterscotch-ice-cream", price: 290, category: "Ice Cream" },

  // Premium Shakes — Rs 430 base, premium flavors Rs 450–480
  { name: "Vanilla Cloud", slug: "vanilla-cloud-shake", price: 430, category: "Premium Shakes" },
  { name: "Chocolate Rush", slug: "chocolate-rush-shake", price: 430, category: "Premium Shakes", isBestSeller: true },
  { name: "Mango Bliss", slug: "mango-bliss-shake", price: 430, category: "Premium Shakes" },
  { name: "Pistachio Dream", slug: "pistachio-dream-shake", price: 430, category: "Premium Shakes" },
  { name: "Caramel Drizzle", slug: "caramel-drizzle-shake", price: 450, category: "Premium Shakes" },
  { name: "Cloud Pop", slug: "cloud-pop-shake", price: 450, category: "Premium Shakes" },
  { name: "Strawberry Cheesecake", slug: "strawberry-cheesecake-shake", price: 480, category: "Premium Shakes", isBestSeller: true },
  { name: "Butterscotch Bliss", slug: "butterscotch-bliss-shake", price: 480, category: "Premium Shakes" },

  // Special Add-ons
  { name: "Waffle Cone", slug: "waffle-cone", price: 60, category: "Add-ons" },
  { name: "Waffle Bowl", slug: "waffle-bowl", price: 60, category: "Add-ons" },
];
