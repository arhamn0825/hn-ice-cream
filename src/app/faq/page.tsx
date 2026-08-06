import type { Metadata } from "next";
import FaqAccordion from "./FaqAccordion";

export const metadata: Metadata = { title: "FAQ", description: "Frequently asked questions about HN Ice Cream." };

const faqs = [
  { q: "What areas do you deliver to?", a: "We currently deliver across the city — enter your address at checkout to confirm coverage." },
  { q: "What payment methods do you accept?", a: "We currently accept Cash on Delivery (COD). Online payment options are coming soon." },
  { q: "How long does delivery take?", a: "Most orders arrive within 45–60 minutes, depending on your location and order volume." },
  { q: "Can I customize my order?", a: "Yes — add a Waffle Cone or Waffle Bowl to any ice cream, and leave notes at checkout for special requests." },
  { q: "Do you offer bulk or party orders?", a: "Absolutely — reach out via WhatsApp or our contact form for bulk and event pricing." },
  { q: "How do I track my order?", a: "Log in to your account and visit your Dashboard to see live order status." },
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-16">
      <p className="section-eyebrow">Need Help?</p>
      <h1 className="section-title mb-10">Frequently Asked Questions</h1>
      <FaqAccordion faqs={faqs} />
    </div>
  );
}
