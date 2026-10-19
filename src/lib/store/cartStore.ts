import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DeliveryType } from "@/data/mockProducts";

export interface CartItem {
  id: string; // unique item id (e.g. productId-variantSku)
  productId: string;
  variantId?: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  variantTitle?: string;
  stock: number;
  deliveryType?: DeliveryType;
  submissions?: Record<string, string>;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setItemSubmission: (id: string, submissions: Record<string, string>) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === item.id);
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            const newQuantity = Math.min(currentItem.quantity + quantity, currentItem.stock);
            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: newQuantity,
            };
            return { items: updatedItems, isOpen: true };
          }
          return {
            items: [...state.items, { ...item, quantity: Math.min(quantity, item.stock) }],
            isOpen: true,
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(quantity, item.stock) } : item
          ),
        }));
      },

      setItemSubmission: (id, submissions) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, submissions: { ...item.submissions, ...submissions } } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "custom-ecommerce-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
