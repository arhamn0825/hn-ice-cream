"use client";

import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Number is editable from Admin → Store Settings (Settings.whatsappNumber in the DB).
// This component fetches it from /api/settings so it never needs a code change.
export default function WhatsAppButton() {
  const [number, setNumber] = useState<string>("+92300000000");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => data?.whatsappNumber && setNumber(data.whatsappNumber))
      .catch(() => {});
  }, []);

  const digits = number.replace(/[^0-9]/g, "");

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
