import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export const useDeliveryStore = create<DeliveryState>()(
  persist(
    (set) => ({
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
    }),
    { name: "hn-ice-cream-delivery" }
  )
);