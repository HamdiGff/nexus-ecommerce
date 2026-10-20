"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DigitalProduct, MOCK_DIGITAL_PRODUCTS } from "@/data/mockProducts";

interface ProductStoreState {
  products: DigitalProduct[];
  updateProduct: (id: string, updates: Partial<DigitalProduct>) => void;
  addProduct: (product: Omit<DigitalProduct, "id"> & { id?: string }) => DigitalProduct;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => DigitalProduct | null;
  resetToDefaults: () => void;
  updatePrice: (id: string, price: number, originalPrice?: number) => void;
  updateImages: (id: string, images: string[]) => void;
  updateStock: (id: string, stock: number) => void;
  getProductById: (id: string) => DigitalProduct | undefined;
  getProductBySlug: (slug: string) => DigitalProduct | undefined;
}

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set, get) => ({
      products: MOCK_DIGITAL_PRODUCTS,

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const updated = { ...p, ...updates };
            // Ensure first variant or base price stays consistent
            if (updates.price !== undefined && updated.variants && updated.variants.length > 0) {
              updated.variants = updated.variants.map((v, idx) =>
                idx === 0 ? { ...v, price: updates.price! } : v
              );
            }
            return updated;
          }),
        }));
      },

      addProduct: (newProdData) => {
        const id = newProdData.id || `prod-custom-${Date.now()}`;
        const slug =
          newProdData.slug ||
          newProdData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        const newProduct: DigitalProduct = {
          id,
          title: newProdData.title,
          slug,
          category: newProdData.category || "wordpress",
          deliveryType: newProdData.deliveryType || "INSTANT_CODE",
          isInstantDelivery: newProdData.deliveryType === "INSTANT_CODE",
          shortDescription: newProdData.shortDescription || "",
          description: newProdData.description || "",
          price: Number(newProdData.price) || 19.99,
          originalPrice: newProdData.originalPrice ? Number(newProdData.originalPrice) : undefined,
          rating: newProdData.rating || 5.0,
          reviewsCount: newProdData.reviewsCount || 1,
          images: newProdData.images && newProdData.images.length > 0 ? newProdData.images : ["/products/rank-math-pro.svg"],
          variants:
            newProdData.variants && newProdData.variants.length > 0
              ? newProdData.variants
              : [
                  {
                    id: `var-${id}-1`,
                    sku: `${slug.toUpperCase()}-STD`,
                    title: "Standard License",
                    tierName: "Standard",
                    price: Number(newProdData.price) || 19.99,
                    originalPrice: newProdData.originalPrice ? Number(newProdData.originalPrice) : undefined,
                    stockQuantity: 99,
                    licenseCount: 1,
                    perks: ["Full Genuine License", "Standard Updates Included"],
                  },
                ],
          features:
            newProdData.features && newProdData.features.length > 0
              ? newProdData.features
              : ["100% Genuine Verified Digital License", "Instant or Fast Technician SLA"],
          requirements: newProdData.requirements || [],
          isFeatured: newProdData.isFeatured ?? true,
          isNewArrival: newProdData.isNewArrival ?? true,
          instantStockCount: newProdData.deliveryType === "INSTANT_CODE" ? 50 : undefined,
          seoKeywords: newProdData.seoKeywords || [slug, "buy license", "instant code"],
        };

        set((state) => ({
          products: [newProduct, ...state.products],
        }));

        return newProduct;
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      duplicateProduct: (id) => {
        const existing = get().products.find((p) => p.id === id);
        if (!existing) return null;

        const newId = `prod-${Date.now()}`;
        const newTitle = `${existing.title} (Copy)`;
        const newSlug = `${existing.slug}-copy-${Math.floor(Math.random() * 900 + 100)}`;

        const copy: DigitalProduct = {
          ...existing,
          id: newId,
          title: newTitle,
          slug: newSlug,
          variants: existing.variants.map((v) => ({
            ...v,
            id: `var-${newId}-${Math.random().toString(36).substring(2, 6)}`,
          })),
        };

        set((state) => ({
          products: [copy, ...state.products],
        }));

        return copy;
      },

      updatePrice: (id, price, originalPrice) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  price,
                  originalPrice: originalPrice !== undefined ? originalPrice : p.originalPrice,
                  variants: p.variants.map((v, i) => (i === 0 ? { ...v, price } : v)),
                }
              : p
          ),
        }));
      },

      updateImages: (id, images) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, images } : p)),
        }));
      },

      updateStock: (id, stock) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  instantStockCount: stock,
                  variants: p.variants.map((v) => ({ ...v, stockQuantity: stock })),
                }
              : p
          ),
        }));
      },

      resetToDefaults: () => {
        set({ products: MOCK_DIGITAL_PRODUCTS });
      },

      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },

      getProductBySlug: (slug) => {
        const clean = slug.toLowerCase();
        return get().products.find(
          (p) =>
            p.slug.toLowerCase() === clean ||
            (clean.startsWith("rank-math") && p.slug.startsWith("rank-math")) ||
            (clean.startsWith("elementor") && p.slug.startsWith("elementor")) ||
            (clean.startsWith("astra") && p.slug.startsWith("astra"))
        );
      },
    }),
    {
      name: "nexus-admin-products-storage",
      version: 11,
      migrate: (persistedState: any) => {
        const existingProducts: DigitalProduct[] = persistedState?.products || [];
        const mockMap = new Map<string, DigitalProduct>(MOCK_DIGITAL_PRODUCTS.map((p) => [p.id, p]));
        existingProducts.forEach((p) => {
          if (!mockMap.has(p.id)) {
            mockMap.set(p.id, p);
          }
        });
        return {
          products: Array.from(mockMap.values()),
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const currentIds = new Set(state.products.map((p) => p.id));
        const missing = MOCK_DIGITAL_PRODUCTS.filter((p) => !currentIds.has(p.id));
        if (missing.length > 0) {
          state.products = [...state.products, ...missing];
        }
        // Always sync images
        MOCK_DIGITAL_PRODUCTS.forEach((dp) => {
          const idx = state.products.findIndex((p) => p.id === dp.id);
          if (idx !== -1 && dp.images.length > 0) {
            state.products[idx].images = dp.images;
          }
        });
      },
    }
  )
);
