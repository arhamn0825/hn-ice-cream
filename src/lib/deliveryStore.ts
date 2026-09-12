import { create } from "zustand";

type DeliveryState = {
  hasSelected: boolean;
  orderType: "DELIVERY" | "PICKUP";
  areaId: string | null;
  areaName: string | null;
  areaCharge: number;
  branchId: string | null;
  branchName: string | null;
  branchAddress: string | null;
  setDelivery: (area: { id: string; name: string; charge: number }) => void;
  setPickup: (branch: { id: string; name: string; address: string | null }) => void;
  reset: () => void;
};

// Deliberately NOT saved to localStorage — this resets every time the
// browser is reloaded, so the Delivery/Pickup question is asked fresh each
// visit, while still remembering the choice while someone is actively
// browsing between pages (Home → Shop → Cart) without a full reload.
export const useDeliveryStore = create<DeliveryState>()((set) => ({
  hasSelected: false,
  orderType: "DELIVERY",
  areaId: null,
  areaName: null,
  areaCharge: 0,
  branchId: null,
  branchName: null,
  branchAddress: null,
  setDelivery: (area) =>
    set({
      hasSelected: true,
      orderType: "DELIVERY",
      areaId: area.id,
      areaName: area.name,
      areaCharge: area.charge,
      branchId: null,
      branchName: null,
      branchAddress: null,
    }),
  setPickup: (branch) =>
    set({
      hasSelected: true,
      orderType: "PICKUP",
      branchId: branch.id,
      branchName: branch.name,
      branchAddress: branch.address,
      areaId: null,
      areaName: null,
      areaCharge: 0,
    }),
  reset: () => set({ hasSelected: false }),
}));