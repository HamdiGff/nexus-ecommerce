"use client";

import { useEffect, useState } from "react";
import { useQuickAddStore, FlyEventData } from "@/lib/store/quickAddStore";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, ArrowRight, Check, X, Sparkles } from "lucide-react";

interface ActiveFlyingParticleProps {
  item: FlyEventData;
  onComplete: (id: string) => void;
}

function ActiveFlyingParticle({ item, onComplete }: ActiveFlyingParticleProps) {
  const [style, setStyle] = useState<React.CSSProperties>({
    position: "fixed",
    left: `${item.startX}px`,
    top: `${item.startY}px`,
    transform: "translate(-50%, -50%) scale(1)",
    opacity: 1,
    zIndex: 9999,
    pointerEvents: "none",
    transition: "all 0.65s cubic-bezier(0.2, 0.8, 0.25, 1)",
  });

  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    // 1. Target coordinate lookup
    const cartBtn = document.getElementById("navbar-cart-btn");
    let targetX = window.innerWidth - 60;
    let targetY = 32;

    if (cartBtn) {
      const rect = cartBtn.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    // 2. Animate to target in next animation frame
    const rafId = requestAnimationFrame(() => {
      setStyle({
        position: "fixed",
        left: `${targetX}px`,
        top: `${targetY}px`,
        transform: "translate(-50%, -50%) scale(0.2) rotate(25deg)",
        opacity: 0.9,
        zIndex: 9999,
        pointerEvents: "none",
        transition: "all 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
      });
    });

    // 3. Complete and trigger cart bounce
    const timer = setTimeout(() => {
      setExploded(true);
      const store = useQuickAddStore.getState();
      store.setCartBadgeBumping(true);
      setTimeout(() => store.setCartBadgeBumping(false), 600);
      onComplete(item.id);
    }, 650);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [item, onComplete]);

  return (
    <div style={style}>
      {/* Holographic Glowing Orb */}
      <div className="relative">
        {/* Pulsing Aura Rings */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 blur-md opacity-80 animate-pulse" />
        
        {/* Main Flying Mini Card */}
        <div className="relative w-12 h-12 rounded-xl bg-neutral-950 border-2 border-blue-400/90 shadow-2xl shadow-blue-500/50 overflow-hidden flex items-center justify-center p-0.5">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/products/wp-rocket.svg";
            }}
          />
        </div>

        {/* Trail Sparkles */}
        <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-blue-400 blur-[1px] animate-ping" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-400 blur-[1px] animate-ping" />
      </div>
    </div>
  );
}

export default function QuickAddFeedbackEngine() {
  const { flyingItems, toastItem, removeFlyingItem, dismissToast } = useQuickAddStore();
  const openCart = useCartStore((state) => state.openCart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [progress, setProgress] = useState(100);

  // Auto-dismiss countdown bar for toast
  useEffect(() => {
    if (!toastItem) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const intervalTime = 30; // ms
    const totalDuration = 3200; // ms
    const decrement = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          dismissToast();
          return 0;
        }
        return prev - decrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toastItem, dismissToast]);

  return (
    <>
      {/* 1. FLYING PARTICLES LAYER */}
      {flyingItems.map((item) => (
        <ActiveFlyingParticle key={item.id} item={item} onComplete={removeFlyingItem} />
      ))}

      {/* 2. SLICK FLOATING TOAST / MINI-BAG PEEK */}
      {toastItem && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="relative rounded-2xl bg-[#0c0e17]/95 border border-blue-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Top Laser Accent */}
            <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500" />

            <div className="p-4 flex items-center gap-3.5">
              {/* Product Thumbnail with Success Badge */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/10 overflow-hidden shadow-inner">
                  <img
                    src={toastItem.image}
                    alt={toastItem.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/products/wp-rocket.svg";
                    }}
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              </div>

              {/* Title & Price Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                    ADDED TO VAULT
                  </span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                  {toastItem.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-extrabold text-blue-400 font-mono">
                    {formatPrice(toastItem.price)}
                  </span>
                  {toastItem.variantTitle && (
                    <span className="text-[10px] text-neutral-400 truncate max-w-[120px]">
                      • {toastItem.variantTitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={dismissToast}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Footer */}
            <div className="px-4 pb-3 pt-1 flex items-center justify-between gap-2 border-t border-white/[0.06] bg-black/20">
              <span className="text-[11px] text-neutral-400">
                Bag contains <strong className="text-white">{totalItems} {totalItems === 1 ? "item" : "items"}</strong>
              </span>

              <button
                onClick={() => {
                  dismissToast();
                  openCart();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>View Bag</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Countdown Progress Bar */}
            <div className="h-1 w-full bg-white/[0.04]">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
