import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FiGrid, FiShoppingBag, FiPackage, FiSettings, FiImage, FiUsers, FiLogOut, FiTag, FiMapPin, FiPercent, FiMail, FiUser } from "react-icons/fi";
import OrderAlert from "./OrderAlert";

const navItems = [
  { href: "/admin", label: "Overview", icon: FiGrid },
  { href: "/admin/products", label: "Products", icon: FiShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: FiTag },
  { href: "/admin/offers", label: "Offers", icon: FiPercent },
  { href: "/admin/orders", label: "Orders", icon: FiPackage },
  { href: "/admin/branches", label: "Branches", icon: FiMapPin },
  { href: "/admin/gallery", label: "Gallery", icon: FiImage },
  { href: "/admin/customers", label: "Customers", icon: FiUsers },
  { href: "/admin/newsletter", label: "Newsletter", icon: FiMail },
  { href: "/admin/settings", label: "Store Settings", icon: FiSettings },
  { href: "/admin/account", label: "My Account", icon: FiUser },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen flex bg-blush-50/40">
      <OrderAlert />
      <aside className="w-64 bg-ink text-white flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 font-display text-xl bg-grape-blush bg-clip-text text-transparent">HN Admin</div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm">
              <Icon /> {label}
            </Link>
          ))}
        </nav>
        <form action="/api/admin/logout" method="POST" className="p-3">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition-colors text-sm w-full">
            <FiLogOut /> Log Out
          </button>
        </form>
      </aside>
      <div className="flex-1 p-6 md:p-10 overflow-x-auto">{children}</div>
    </div>
  );
}
