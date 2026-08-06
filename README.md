# HN Ice Cream — Full-Stack E-Commerce Website

A luxury ice cream & shakes e-commerce site built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and Supabase.

## What's included

- Customer site: Home, Shop, Product Details, Offers, About, Gallery, Contact, FAQ, Cart, Checkout (COD), Login/Register, Dashboard
- Admin panel (`/admin`): Products, Orders, Gallery, Customers, Store Settings — all database-driven, no code changes needed
- Floating WhatsApp button with an admin-editable number
- Your exact menu & prices, pre-seeded (see `src/data/products.ts`)

---

## 1. Run it locally

```bash
cd hn-ice-cream
npm install
cp .env.example .env      # then fill in the values (steps below)
npm run db:push           # creates tables in your Supabase database
npm run db:seed           # loads your menu + creates the admin account
npm run dev
```

Visit `http://localhost:3000` for the site, and `http://localhost:3000/admin/login` for the admin panel
(username `admin`, password from `ADMIN_SEED_PASSWORD` in your `.env`, default `hnicecream46`).

---

## 2. Create a free Supabase project

1. Go to [supabase.com](https://supabase.com) → **Start your project** → sign in with GitHub.
2. Click **New Project**. Pick an organization, name it (e.g. `hn-ice-cream`), set a strong database password (save it), pick the region closest to your customers, and click **Create new project**.
3. Wait ~2 minutes for it to provision.

---

## 3. Connect Supabase to the project

**Database (Prisma):**
1. In Supabase, go to **Project Settings → Database → Connection string**.
2. Copy the **Transaction pooler** URI into `DATABASE_URL` in your `.env`, and the **Session pooler** (or direct) URI into `DIRECT_URL`.
3. Replace `[PASSWORD]` in both with the database password you set in step 2.

**Storage & API (product images, gallery, logo, favicon):**
1. Go to **Project Settings → API**.
2. Copy the **Project URL** into `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy the **anon public** key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copy the **service_role** key (also on this page, click "Reveal" to see it) into `SUPABASE_SERVICE_ROLE_KEY`. This one is secret — it's what lets the admin panel's "Choose Image" buttons actually upload files. Never share this key or put it in a public repo without `.env` being gitignored (it already is).
5. In the left sidebar, click **Storage**. Create three buckets — click **New bucket** for each, and toggle **Public bucket** ON for all three:
   - `product-images`
   - `gallery`
   - `branding`

That's it — once these env vars are set, every "Choose Image" button in the admin panel (Products, Gallery, Store Settings) uploads directly to the matching bucket automatically.

Then run:
```bash
npm run db:push
npm run db:seed
```

---

## 4. Deploy on Vercel

1. Push this project to a GitHub repository (create one at github.com/new, then `git init && git add . && git commit -m "Initial commit" && git remote add origin <your-repo-url> && git push -u origin main`).
2. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **Add New → Project** → select your repo.
3. In **Environment Variables**, paste in everything from your `.env` file (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `JWT_SECRET`, `ADMIN_SEED_PASSWORD`, `NEXT_PUBLIC_SITE_URL` — set this to your future domain, e.g. `https://hnicecream.com`).
4. Click **Deploy**. Vercel builds and gives you a live `*.vercel.app` URL.

---

## 5. Connect your GoDaddy domain

1. In Vercel, open your project → **Settings → Domains** → enter `hnicecream.com` (and `www.hnicecream.com`) → **Add**.
2. Vercel shows DNS records to add (usually an `A` record for the root domain, and a `CNAME` for `www`).
3. Log in to **GoDaddy → My Products → DNS** for your domain.
4. Add/edit the records to match exactly what Vercel showed you (delete any conflicting default `A`/`CNAME` records first).
5. Wait 10 minutes–48 hours for DNS to propagate. Vercel automatically issues an SSL certificate once it detects the domain is pointed correctly.

---

## 6. Manage everything from the Admin Panel

Once deployed, go to `https://yourdomain.com/admin/login` and log in.

- **Products**: Add, edit, or delete products; click "Choose Image" to upload a photo straight from your computer; toggle availability and "Best Seller"; change prices — updates the live site instantly.
- **Categories**: Add your own categories (e.g. "Sundaes", "Cakes"), rename or delete them. New categories immediately appear in the dropdown when adding a product.
- **Orders**: See every order, update status (Pending → Confirmed → Preparing → Out for Delivery → Delivered).
- **Gallery**: Upload photos shown on the Gallery page and homepage Instagram strip — click, choose a file, done.
- **Customers**: View everyone who's created an account.
- **Store Settings**: Upload your **logo** (shown in the header) and **favicon** (the little icon in the browser tab), upload a **homepage hero picture**, and change the WhatsApp number, delivery charge, contact details, Google Maps link, and homepage headline text — all without touching code.

All image uploads go straight into your Supabase Storage buckets and appear on the live site within seconds — no copying links, no code changes.

---

## Notes on what's scaffolded vs. fully built

- **Online payments** aren't included — only Cash on Delivery, as requested. Adding a gateway (e.g. Stripe or a local Pakistani processor) is a future step.
- **Contact form** shows a success message but isn't yet wired to an email provider — connect it to Resend, SendGrid, or similar in `src/app/contact/ContactForm.tsx`.
- Run `npm run db:studio` any time to view/edit your database visually.
