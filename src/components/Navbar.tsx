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
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [storeName, setStoreName] = useState("HN Ice Cream");
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.logoUrl) setLogoUrl(data.logoUrl);
        if (data?.storeName) setStoreName(data.storeName);
      })
      .catch(() => {});
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-glass" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image src={logoUrl} alt={storeName} width={40} height={40} className="rounded-full object-cover h-10 w-10" />
          ) : (
            <span className="font-display text-2xl font-semibold bg-grape-blush bg-clip-text text-transparent">
              {storeName}
            </span>
          )}
        </Link>

        <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-ink/80">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-grape-500 transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="hidden sm:flex p-2 rounded-full hover:bg-blush-50 transition-colors" aria-label="Account">
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
          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="lg:hidden glass px-5 pb-5 flex flex-col gap-3"
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
