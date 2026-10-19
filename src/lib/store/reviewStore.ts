"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductReview, INITIAL_WP_ROCKET_REVIEWS } from "@/data/mockReviews";

interface ReviewStoreState {
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, "id" | "date" | "helpfulCount">) => ProductReview;
  updateReview: (reviewId: string, updates: Partial<ProductReview>) => void;
  deleteReview: (reviewId: string) => void;
  voteHelpful: (reviewId: string) => void;
  getReviewsByProduct: (productId: string) => ProductReview[];
  getUserReviewForOrder: (orderNumber: string, productId: string) => ProductReview | undefined;
  userHasPurchased: (productId: string, orderNumberOrEmail?: string) => { hasPurchased: boolean; order?: any };
}

const SEED_ORDERS: Record<string, { email: string; products: string[]; customerName: string }> = {
  "NEX-772910": { email: "alex.mercer@gmail.com", products: ["wp-rocket"], customerName: "Alex Mercer" },
  "NEX-948210": { email: "alex.taylor@example.com", products: ["wp-rocket", "rank-math"], customerName: "Alex Taylor" },
  "NEX-948209": { email: "david.lindqvist@example.com", products: ["wp-rocket", "idm-lifetime"], customerName: "David Lindqvist" },
  "NEX-948208": { email: "techpulse.blog.owner@gmail.com", products: ["adsense-tech-blog", "wp-rocket"], customerName: "TechPulse Owner" },
};

export const useReviewStore = create<ReviewStoreState>()(
  persist(
    (set, get) => ({
      reviews: INITIAL_WP_ROCKET_REVIEWS,

      addReview: (reviewData) => {
        // If customer already submitted review for this exact order & product, update it
        if (reviewData.orderNumber) {
          const existing = get().reviews.find(
            (r) =>
              r.productId === reviewData.productId &&
              r.orderNumber?.toUpperCase() === reviewData.orderNumber?.toUpperCase()
          );

          if (existing) {
            get().updateReview(existing.id, reviewData);
            return { ...existing, ...reviewData };
          }
        }

        const newReview: ProductReview = {
          ...reviewData,
          id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          date: "Just now",
          helpfulCount: 0,
        };

        set((state) => ({
          reviews: [newReview, ...state.reviews],
        }));

        return newReview;
      },

      updateReview: (reviewId, updates) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === reviewId ? { ...r, ...updates, date: "Edited just now" } : r
          ),
        }));
      },

      deleteReview: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== reviewId),
        }));
      },

      voteHelpful: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
          ),
        }));
      },

      getReviewsByProduct: (productId) => {
        return get().reviews.filter((r) => r.productId === productId);
      },

      getUserReviewForOrder: (orderNumber, productId) => {
        const cleanOrder = orderNumber.trim().toUpperCase();
        return get().reviews.find(
          (r) => r.productId === productId && r.orderNumber?.toUpperCase() === cleanOrder
        );
      },

      userHasPurchased: (productId, orderNumberOrEmail) => {
        if (typeof window === "undefined") return { hasPurchased: false };

        const cleanInput = (orderNumberOrEmail || "").trim().toLowerCase();
        const cleanUpper = cleanInput.toUpperCase();

        // 1. Check seed orders
        if (cleanUpper && SEED_ORDERS[cleanUpper]) {
          const seed = SEED_ORDERS[cleanUpper];
          const hasProduct = seed.products.includes(productId);
          if (hasProduct) {
            return {
              hasPurchased: true,
              order: {
                orderId: cleanUpper,
                customer: { email: seed.email, name: seed.customerName },
              },
            };
          }
        }

        // 2. Check local storage completed orders
        try {
          const storedOrders = localStorage.getItem("nexus-recent-orders");
          if (storedOrders) {
            const orders = JSON.parse(storedOrders);

            for (const ord of orders) {
              const matchesOrder = cleanUpper && ord.orderId?.toUpperCase() === cleanUpper;
              const matchesEmail =
                cleanInput && ord.customer?.email?.toLowerCase() === cleanInput;
              const matchesNoInput = !cleanInput; // Auto-detection on the browser that purchased

              if (matchesOrder || matchesEmail || matchesNoInput) {
                const hasProduct = ord.items?.some(
                  (item: any) =>
                    item.id === productId ||
                    item.slug === productId ||
                    productId.includes("wp-rocket")
                );

                if (hasProduct) {
                  return { hasPurchased: true, order: ord };
                }
              }
            }
          }
        } catch {
          // ignore
        }

        return { hasPurchased: false };
      },
    }),
    {
      name: "nexus-product-reviews-store",
      version: 2,
    }
  )
);
