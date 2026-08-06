import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedProducts } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
  // Categories
  const categories = ["Ice Cream", "Premium Shakes", "Add-ons"];
  const categoryMap: Record<string, string> = {};

  for (const [i, name] of categories.entries()) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/\s+/g, "-"), sortOrder: i },
    });
    categoryMap[name] = cat.id;
  }

  // Products
  for (const p of seedProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { price: p.price },
      create: {
        name: p.name,
        slug: p.slug,
        price: p.price,
        categoryId: categoryMap[p.category],
        isBestSeller: !!p.isBestSeller,
        isAvailable: true,
      },
    });
  }

  // Admin (username: admin / password from ADMIN_SEED_PASSWORD env var)
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "hnicecream46";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", passwordHash },
  });

  // Store settings
  await prisma.settings.upsert({
    where: { id: "store_settings" },
    update: {},
    create: {
      id: "store_settings",
      storeName: "HN Ice Cream",
      whatsappNumber: "+92300000000",
      deliveryCharge: 100,
      heroHeadline: "Indulge in Every Scoop",
      heroSubtext: "Handcrafted ice cream & premium shakes, made fresh daily.",
    },
  });

  console.log("✅ Seed complete:", seedProducts.length, "products,", categories.length, "categories, 1 admin.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
