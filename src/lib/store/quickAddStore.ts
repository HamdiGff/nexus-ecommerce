"use client";

import { create } from "zustand";

export interface FlyEventData {
  id: string;
  title: string;
  image: string;
  price: number;
  startX: number;
  startY: number;
}

export interface QuickAddToastData {
  id: string;
  title: string;
  image: string;
  price: number;
  variantTitle?: string;
}

interface QuickAddStore {
  flyingItems: FlyEventData[];
  toastItem: QuickAddToastData | null;
  cartBadgeBumping: boolean;
  triggerQuickAddEffect: (
    item: { id: string; title: string; image: string; price: number; variantTitle?: string },
    originElement?: HTMLElement | null
  ) => void;
  removeFlyingItem: (id: string) => void;
  setCartBadgeBumping: (bumping: boolean) => void;
  dismissToast: () => void;
}

export const useQuickAddStore = create<QuickAddStore>((set, get) => ({
  flyingItems: [],
  toastItem: null,
  cartBadgeBumping: false,

  triggerQuickAddEffect: (item, originElement) => {
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (originElement) {
      const rect = originElement.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    const flyId = `fly-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const newFlyItem: FlyEventData = {
      id: flyId,
      title: item.title,
      image: item.image,
      price: item.price,
      startX,
      startY,
    };

    // Set flying particle and toast preview
    set((state) => ({
      flyingItems: [...state.flyingItems, newFlyItem],
      toastItem: {
        id: flyId,
        title: item.title,
        image: item.image,
        price: item.price,
        variantTitle: item.variantTitle,
      },
    }));

    // Trigger subtle modern sound if supported
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        // Sweet pleasant chord chime
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      }
    } catch {
      // Audio playback silently ignored if blocked or unsupported
    }
  },

  removeFlyingItem: (id) => {
    set((state) => ({
      flyingItems: state.flyingItems.filter((i) => i.id !== id),
    }));
  },

  setCartBadgeBumping: (cartBadgeBumping) => set({ cartBadgeBumping }),

  dismissToast: () => set({ toastItem: null }),
}));
