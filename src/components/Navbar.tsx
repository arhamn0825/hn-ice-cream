"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiShoppingBag, FiMenu, FiX, FiUser } from "react-icons/fi";
import { useCartStore } from "@/lib/cartStore";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Menu" },
  { href: "/offers", label: "Offers" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ logoUrl, storeName }: { logoUrl: string | null; storeName: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const Logo = ({ size }: { size: number }) =>
    logoUrl ? (
      <Image
        src={logoUrl}
        alt={storeName}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
        priority
      />
    ) : (
      <span className="font-display text-2xl font-semibold bg-grape-blush bg-clip-text text-transparent whitespace-nowrap">
        {storeName}
      </span>
    );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 shadow-glass" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-3 lg:py-4">
        {/* Mobile row: hamburger — centered logo — icons */}
        <div className="relative flex items-center justify-between lg:hidden">
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="p-2 -ml-2">
            {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <Logo size={75} />
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="p-2 rounded-full hover:bg-blush-50 transition-colors" aria-label="Account">
              <FiUser className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="relative p-2 rounded-full hover:bg-blush-50 transition-colors" aria-label="Cart">
              <FiShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-blush-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop row */}
        <div className="hidden lg:flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={80} />
          </Link>

          <ul className="flex items-center gap-8 text-lg font-medium text-ink/80">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-grape-500 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 rounded-full hover:bg-blush-50 transition-colors" aria-label="Account">
              <FiUser className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="relative p-2 rounded-full hover:bg-blush-50 transition-colors" aria-label="Cart">
              <FiShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-blush-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {open && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="lg:hidden glass px-5 pb-5 flex flex-col items-center text-center gap-3"
        >
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)} className="block py-2 text-ink/80 hover:text-grape-500">
                {l.label}
              </Link>
            </li>
          ))}
        </motion.ul>
      )}
    </header>
  );
}
