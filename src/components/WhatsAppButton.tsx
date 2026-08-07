"use client";

import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

// Number arrives as a prop, already fetched server-side — editable anytime
// from Admin → Store Settings, with no client-side fetch delay.
export default function WhatsAppButton({ whatsappNumber }: { whatsappNumber: string }) {
  const digits = whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <motion.a
      href={`https://wa.me/${digits}?text=${encodeURIComponent("Hi! I'd like to order from HN Ice Cream 🍦")}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-glass-lg"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7" />
    </motion.a>
  );
}
