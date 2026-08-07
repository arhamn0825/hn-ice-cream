import Link from "next/link";
import { FiInstagram, FiFacebook, FiMapPin, FiPhone, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left">
        <div>
          <h3 className="font-display text-2xl mb-3 bg-grape-blush bg-clip-text text-transparent">HN Ice Cream</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Handcrafted ice cream & premium shakes, made fresh daily. Delivered with love.
          </p>
          <div className="flex gap-3 mt-4 justify-center sm:justify-start">
            <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-white/10 hover:bg-blush-400 transition-colors"><FiInstagram /></a>
            <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-white/10 hover:bg-blush-400 transition-colors"><FiFacebook /></a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/70">Explore</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/shop" className="hover:text-white">Menu</Link></li>
            <li><Link href="/offers" className="hover:text-white">Offers</Link></li>
            <li><Link href="/gallery" className="hover:text-white">Gallery</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/70">Support</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="/dashboard" className="hover:text-white">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/70">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-center justify-center sm:justify-start gap-2"><FiMapPin /> Karachi, Pakistan</li>
            <li className="flex items-center justify-center sm:justify-start gap-2"><FiPhone /> +92 300 0000000</li>
            <li className="flex items-center justify-center sm:justify-start gap-2"><FiMail /> hello@hnicecream.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} HN Ice Cream. All rights reserved.
      </div>
    </footer>
  );
}
