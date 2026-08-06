import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ContactForm from "./ContactForm";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";

export const metadata: Metadata = { title: "Contact Us", description: "Get in touch with HN Ice Cream." };

export default async function ContactPage() {
  let settings: any = null;
  try {
    settings = await prisma.settings.findUnique({ where: { id: "store_settings" } });
  } catch {
    settings = null;
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-16 grid md:grid-cols-2 gap-12">
      <div>
        <p className="section-eyebrow">Get in Touch</p>
        <h1 className="section-title mb-6">Contact Us</h1>
        <p className="text-ink/60 mb-8">Questions, bulk orders, or feedback — we&apos;d love to hear from you.</p>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-ink/70"><FiMapPin className="text-grape-500" /> {settings?.contactAddress ?? "Karachi, Pakistan"}</div>
          <div className="flex items-center gap-3 text-ink/70"><FiPhone className="text-grape-500" /> {settings?.contactPhone ?? "+92 300 0000000"}</div>
          <div className="flex items-center gap-3 text-ink/70"><FiMail className="text-grape-500" /> {settings?.contactEmail ?? "hello@hnicecream.com"}</div>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
