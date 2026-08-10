import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AccountForm from "./AccountForm";

export default async function AdminAccountPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const admin = await prisma.admin.findUnique({ where: { id: session.id } });

  return (
    <div>
      <h1 className="font-display text-3xl mb-2">My Account</h1>
      <p className="text-ink/50 text-sm mb-8">Change your admin login username or password anytime.</p>
      <AccountForm currentUsername={admin?.username ?? ""} />
    </div>
  );
}