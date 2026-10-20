"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Zap, Wrench, Globe } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const pathname = usePathname();
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } = useCartStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen || pathname?.startsWith("/admin")) return null;

  const total = getSubtotal();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-3 sm:pl-10">
        <div className="w-screen max-w-md bg-[#0f1118] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white">Digital Vault Bag</h2>
              <span className="text-[11px] bg-white/[0.06] text-neutral-300 font-mono font-bold px-2 py-0.5 rounded-full border border-white/[0.08]">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-white/[0.06]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-500 mb-4">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-white">Your digital bag is empty</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  Discover official WordPress agency activations, instant IDM serials, and turnkey AdSense blogs.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-5 py-2.5 bg-white text-neutral-950 rounded-xl text-xs font-bold hover:bg-neutral-200 transition-colors"
                >
                  Explore Marketplace
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <div className="w-16 h-16 bg-neutral-900 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="font-bold text-white text-xs hover:text-blue-400 transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-white/[0.06] text-neutral-300">
                          {item.deliveryType === "SERVICE_SETUP"
                            ? "WP Setup"
                            : item.deliveryType === "INSTANT_CODE"
                            ? "Instant Key"
                            : "Turnkey Asset"}
                        </span>
                        {item.variantTitle && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 truncate max-w-[140px]">
                            {item.variantTitle}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-white/10 rounded-lg bg-white/[0.02]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white/[0.06] text-neutral-400 hover:text-white rounded-l-lg"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white/[0.06] text-neutral-400 hover:text-white rounded-r-lg"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-xs font-bold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-[#0a0c12] border-t border-white/[0.08] space-y-4">
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-white">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Digital Delivery & Handling</span>
                  <span className="font-mono font-bold text-emerald-400">FREE (0.00)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/[0.08]">
                  <span>Total Due</span>
                  <span className="font-mono text-base text-white">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-indigo-600/25 group"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
