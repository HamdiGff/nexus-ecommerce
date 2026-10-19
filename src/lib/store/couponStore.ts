"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number; // e.g. 20 for 20% or 10 for $10
  minOrder?: number;
  description: string;
  usageCount: number;
  maxUses?: number;
  isActive: boolean;
  expiresAt?: string;
  requiresCrypto?: boolean;
}

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: "coup-1",
    code: "SAVE20",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minOrder: 15,
    description: "20% off all digital items & licenses",
    usageCount: 142,
    maxUses: 500,
    isActive: true,
  },
  {
    id: "coup-2",
    code: "CRYPTO15",
    discountType: "PERCENTAGE",
    discountValue: 15,
    minOrder: 20,
    description: "15% off Web3 Crypto Checkout (BTC, ETH, USDT)",
    usageCount: 89,
    maxUses: 1000,
    isActive: true,
    requiresCrypto: true,
  },
  {
    id: "coup-3",
    code: "FLASH25",
    discountType: "PERCENTAGE",
    discountValue: 25,
    minOrder: 25,
    description: "Flash Sale: 25% off high-tier licenses & bundles",
    usageCount: 230,
    maxUses: 300,
    isActive: true,
    expiresAt: "Ends in 4 hours",
  },
  {
    id: "coup-4",
    code: "WELCOME10",
    discountType: "FIXED",
    discountValue: 10,
    minOrder: 35,
    description: "$10 flat discount for first-time orders over $35",
    usageCount: 64,
    isActive: true,
  },
];

interface CouponStore {
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  flashSaleActive: boolean;
  flashSaleCode: string;
  flashSaleEndsInSeconds: number;

  applyCoupon: (
    code: string,
    currentSubtotal: number,
    paymentMethod?: string
  ) => { success: boolean; message: string };
  removeAppliedCoupon: () => void;
  calculateDiscount: (subtotal: number) => number;

  // Admin Management Actions
  createCoupon: (coupon: Omit<Coupon, "id" | "usageCount">) => void;
  toggleCouponActive: (id: string) => void;
  deleteCoupon: (id: string) => void;
  toggleFlashSale: (active: boolean) => void;
}

export const useCouponStore = create<CouponStore>()(
  persist(
    (set, get) => ({
      coupons: DEFAULT_COUPONS,
      appliedCoupon: null,
      flashSaleActive: true,
      flashSaleCode: "FLASH25",
      flashSaleEndsInSeconds: 4 * 3600 + 18 * 60 + 35, // ~4h 18m

      applyCoupon: (code, currentSubtotal, paymentMethod) => {
        const clean = code.trim().toUpperCase();
        const found = get().coupons.find((c) => c.code.toUpperCase() === clean);

        if (!found) {
          return {
            success: false,
            message: `Coupon code "${code}" is invalid or does not exist.`,
          };
        }

        if (!found.isActive) {
          return {
            success: false,
            message: `Coupon code "${clean}" has been paused or expired.`,
          };
        }

        if (found.minOrder && currentSubtotal < found.minOrder) {
          return {
            success: false,
            message: `Minimum order of $${found.minOrder.toFixed(2)} required for "${clean}".`,
          };
        }

        if (found.requiresCrypto && paymentMethod !== "crypto") {
          return {
            success: false,
            message: `Coupon "${clean}" is exclusively valid for Crypto (BTC/ETH/USDT) payments.`,
          };
        }

        if (found.maxUses && found.usageCount >= found.maxUses) {
          return {
            success: false,
            message: `Coupon "${clean}" has reached its maximum global redemptions.`,
          };
        }

        set({ appliedCoupon: found });
        return {
          success: true,
          message: `Coupon "${found.code}" applied! (${found.description})`,
        };
      },

      removeAppliedCoupon: () => set({ appliedCoupon: null }),

      calculateDiscount: (subtotal) => {
        const { appliedCoupon } = get();
        if (!appliedCoupon) return 0;

        if (appliedCoupon.discountType === "PERCENTAGE") {
          return Number(((subtotal * appliedCoupon.discountValue) / 100).toFixed(2));
        }

        if (appliedCoupon.discountType === "FIXED") {
          return Math.min(subtotal, appliedCoupon.discountValue);
        }

        return 0;
      },

      createCoupon: (newCoupon) => {
        const coupon: Coupon = {
          ...newCoupon,
          id: `coup-${Date.now()}`,
          code: newCoupon.code.toUpperCase().trim(),
          usageCount: 0,
        };
        set((state) => ({ coupons: [coupon, ...state.coupons] }));
      },

      toggleCouponActive: (id) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        }));
      },

      deleteCoupon: (id) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id),
          appliedCoupon:
            state.appliedCoupon?.id === id ? null : state.appliedCoupon,
        }));
      },

      toggleFlashSale: (active) => set({ flashSaleActive: active }),
    }),
    {
      name: "nexus-coupons-storage",
    }
  )
);
