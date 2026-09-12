"use client";

import { useEffect, useState } from "react";
import { useDeliveryStore } from "@/lib/deliveryStore";
import { FiTruck, FiShoppingBag, FiMapPin } from "react-icons/fi";

type Area = { id: string; name: string; charge: number };
type Branch = { id: string; name: string; address: string | null };

export default function DeliverySelectModal() {
  const hasSelected = useDeliveryStore((s) => s.hasSelected);
  const setDelivery = useDeliveryStore((s) => s.setDelivery);
  const setPickup = useDeliveryStore((s) => s.setPickup);

  const [mode, setMode] = useState<"choose" | "delivery" | "pickup">("choose");
  const [areas, setAreas] = useState<Area[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/api/delivery-areas").then((r) => r.json()).then(setAreas).catch(() => {});
    fetch("/api/branches").then((r) => r.json()).then(setBranches).catch(() => {});
  }, []);

  // Don't render anything until we've checked localStorage (avoids a flash)
  if (!mounted || hasSelected) return null;

  const handleConfirmDelivery = () => {
    const area = areas.find((a) => a.id === selectedAreaId);
    if (!area) return;
    setDelivery(area);
  };

  const handleConfirmPickup = () => {
    const branch = branches.find((b) => b.id === selectedBranchId);
    if (!branch) return;
    setPickup(branch);
  };

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-[100] flex items-center justify-center p-5">
      <div className="bg-white rounded-4xl max-w-md w-full p-8 shadow-glass-lg">
        {mode === "choose" && (
          <>
            <h2 className="font-display text-2xl text-center mb-1">How would you like your order?</h2>
            <p className="text-sm text-ink/50 text-center mb-8">Choose one to continue browsing.</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode("delivery")}
                className="flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-grape-100 hover:border-grape-400 hover:bg-grape-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-grape-blush text-white flex items-center justify-center text-xl">
                  <FiTruck />
                </div>
                <span className="font-medium">Delivery</span>
              </button>
              <button
                onClick={() => setMode("pickup")}
                className="flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-grape-100 hover:border-grape-400 hover:bg-grape-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-grape-blush text-white flex items-center justify-center text-xl">
                  <FiShoppingBag />
                </div>
                <span className="font-medium">Pickup</span>
              </button>
            </div>
          </>
        )}

        {mode === "delivery" && (
          <>
            <h2 className="font-display text-2xl mb-1">Select Your Area</h2>
            <p className="text-sm text-ink/50 mb-5">Delivery charge depends on your location in Karachi.</p>
            <div className="max-h-72 overflow-y-auto space-y-2 mb-5 pr-1">
              {areas.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAreaId(a.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 text-left transition-colors ${
                    selectedAreaId === a.id ? "border-grape-500 bg-grape-50" : "border-ink/5 hover:border-grape-200"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm"><FiMapPin className="text-grape-400 shrink-0" /> {a.name}</span>
                  <span className="text-sm font-semibold text-grape-600 shrink-0">Rs {a.charge}</span>
                </button>
              ))}
              {areas.length === 0 && <p className="text-sm text-ink/40 text-center py-6">No delivery areas set up yet.</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setMode("choose")} className="btn-outline flex-1">Back</button>
              <button disabled={!selectedAreaId} onClick={handleConfirmDelivery} className="btn-primary flex-1 disabled:opacity-40">
                Confirm
              </button>
            </div>
          </>
        )}

        {mode === "pickup" && (
          <>
            <h2 className="font-display text-2xl mb-1">Select Pickup Location</h2>
            <p className="text-sm text-ink/50 mb-5">Free — no delivery charge for pickup orders.</p>
            <div className="space-y-2 mb-5">
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBranchId(b.id)}
                  className={`w-full flex flex-col items-start px-4 py-3 rounded-2xl border-2 text-left transition-colors ${
                    selectedBranchId === b.id ? "border-grape-500 bg-grape-50" : "border-ink/5 hover:border-grape-200"
                  }`}
                >
                  <span className="text-sm font-medium flex items-center gap-2"><FiMapPin className="text-grape-400" /> {b.name}</span>
                  {b.address && <span className="text-xs text-ink/50 ml-6">{b.address}</span>}
                </button>
              ))}
              {branches.length === 0 && <p className="text-sm text-ink/40 text-center py-6">No pickup branches set up yet.</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setMode("choose")} className="btn-outline flex-1">Back</button>
              <button disabled={!selectedBranchId} onClick={handleConfirmPickup} className="btn-primary flex-1 disabled:opacity-40">
                Confirm
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
