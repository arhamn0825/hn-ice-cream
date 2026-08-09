"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";

// heroHeadline/heroSubtext/heroImageUrl arrive as props, fetched server-side
// by the homepage before it's sent to the browser — no client-side fetch, no
// placeholder flash before your real picture shows up.
export default function Hero({
  heroHeadline,
  heroSubtext,
  heroImageUrl,
}: {
  heroHeadline: string;
  heroSubtext: string;
  heroImageUrl: string | null;
}) {
  const [headlineFirst, ...headlineRest] = heroHeadline.split(" ");
  const headlineEnd = headlineRest.join(" ");

  return (
    <section className="relative overflow-hidden bg-soft-glow pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Ambient floating blobs */}
      <div className="hidden md:block absolute -top-20 -left-20 w-72 h-72 bg-blush-200/50 rounded-full blur-3xl animate-float" />
      <div className="hidden md:block absolute top-40 -right-10 w-96 h-96 bg-grape-200/50 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-eyebrow mb-4">Handcrafted Daily · Delivered Fresh</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] text-ink">
            {headlineFirst}
            {headlineEnd && <span className="block italic bg-grape-blush bg-clip-text text-transparent">{headlineEnd}</span>}
          </h1>
          <p className="mt-6 text-ink/60 text-lg max-w-md">{heroSubtext}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/shop" className="btn-primary">
              Order Now <FiArrowRight />
            </Link>
            <Link href="/about" className="btn-outline">
              Our Story
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {heroImageUrl ? (
            <div className="glass-card aspect-square max-w-xl mx-auto relative overflow-hidden animate-float">
              <Image src={heroImageUrl} alt="HN Ice Cream" fill className="object-cover" priority />
            </div>
          ) : (
            <>
              <div className="glass-card aspect-square max-w-md mx-auto flex items-center justify-center text-[10rem] animate-float">
                🍦
              </div>
              <p className="text-center text-xs text-ink/40 mt-3">
                Add your own photo via Admin → Store Settings → Homepage Hero Picture
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
