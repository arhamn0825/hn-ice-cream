"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle, FiLock } from "react-icons/fi";
import { useRouter } from "next/navigation";

const options = [
  {
    target: "orders",
    title: "Clear All Orders",
    description: "Deletes every order and its sales history. Total sales, order counts, and everything on the Orders page will reset to zero.",
  },
  {
    target: "customers",
    title: "Clear All Customer Accounts",
    description: "Deletes every registered customer account. Their past orders stay on record, just no longer linked to an account.",
  },
  {
    target: "reviews",
    title: "Clear All Reviews",
    description: "Deletes every customer review shown on your homepage.",
  },
];

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify-reset-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Incorrect PIN");
      sessionStorage.setItem("reset_unlocked", "true");
      onUnlock();
    } catch (err: any) {
      toast.error(err.message);
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 text-center">
      <div className="w-14 h-14 rounded-full bg-ink/5 flex items-center justify-center mx-auto mb-4">
        <FiLock className="text-2xl text-ink/40" />
      </div>
      <h1 className="font-display text-2xl mb-2">Enter Your Secret PIN</h1>
      <p className="text-sm text-ink/50 mb-6">This area is extra-locked. Only you know this code.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="password"
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-ink/10 text-center tracking-widest"
          placeholder="••••••"
        />
        <button disabled={loading} className="btn-primary shrink-0">Unlock</button>
      </form>
    </div>
  );
}

export default function DangerZonePage() {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("reset_unlocked") === "true"
  );
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  if (!unlocked) {
    return <PinGate onUnlock={() => setUnlocked(true)} />;
  }

  const handleClear = async (target: string) => {
    if (confirmText !== "DELETE") {
      toast.error('Type "DELETE" exactly to confirm');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to clear data");
      toast.success(`Cleared ${data.count} record(s)`);
      setConfirmTarget(null);
      setConfirmText("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <FiAlertTriangle className="text-red-500 text-2xl" />
        <h1 className="font-display text-3xl">Sweet Reset</h1>
      </div>
      <p className="text-ink/50 text-sm mb-8">
        These actions permanently delete data and can&apos;t be undone.
      </p>

      <div className="space-y-4">
        {options.map((o) => (
          <div key={o.target} className="glass-card p-5 border border-red-100">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">{o.title}</h3>
                <p className="text-sm text-ink/50 mt-1">{o.description}</p>
              </div>
              {confirmTarget !== o.target ? (
                <button
                  onClick={() => { setConfirmTarget(o.target); setConfirmText(""); }}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors shrink-0"
                >
                  Clear
                </button>
              ) : null}
            </div>

            {confirmTarget === o.target && (
              <div className="mt-4 pt-4 border-t border-red-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <p className="text-sm text-ink/60">
                  Type <span className="font-mono font-semibold">DELETE</span> to confirm:
                </p>
                <input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-red-200 text-sm w-32"
                  placeholder="DELETE"
                />
                <button
                  disabled={loading}
                  onClick={() => handleClear(o.target)}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "Clearing..." : "Confirm Delete"}
                </button>
                <button
                  onClick={() => { setConfirmTarget(null); setConfirmText(""); }}
                  className="px-4 py-2 rounded-full text-sm font-medium text-ink/50 hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

