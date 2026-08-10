"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AccountForm({ currentUsername }: { currentUsername: string }) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Enter your current password to confirm changes");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername !== currentUsername ? newUsername : undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update account");

      toast.success("Account updated! Please log in again with your new details.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 max-w-md space-y-4">
      <div>
        <label className="text-sm font-medium text-ink/70 block mb-1">New Username</label>
        <input
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink/70 block mb-1">New Password (leave blank to keep current)</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Min. 6 characters"
          className="w-full px-4 py-2.5 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300"
        />
      </div>

      {newPassword && (
        <div>
          <label className="text-sm font-medium text-ink/70 block mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300"
          />
        </div>
      )}

      <div className="pt-2 border-t border-ink/10">
        <label className="text-sm font-medium text-ink/70 block mb-1 mt-4">Current Password (required to save)</label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-ink/10 focus:outline-none focus:ring-2 focus:ring-grape-300"
        />
      </div>

      <button disabled={loading} className="btn-primary w-full">
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
