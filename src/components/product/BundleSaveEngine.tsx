"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  Check,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Layers,
  Zap,
} from "lucide-react";
import {
  DigitalProduct,
  MOCK_DIGITAL_PRODUCTS,
  MOCK_PRODUCT_BUNDLES,
  ProductBundle,
} from "@/data/mockProducts";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";

interface BundleSaveEngineProps {
  currentProduct?: DigitalProduct;
  bundleId?: string;
}

export default function BundleSaveEngine({
  currentProduct,
  bundleId,
}: BundleSaveEngineProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Find matching bundle or default
  const bundle: ProductBundle | undefined =
    (bundleId && MOCK_PRODUCT_BUNDLES.find((b) => b.id === bundleId)) ||
    (currentProduct &&
      MOCK_PRODUCT_BUNDLES.find((b) =>
        b.productIds.includes(currentProduct.id)
      )) ||
    MOCK_PRODUCT_BUNDLES[0];

  // Resolve bundle products
  const bundledProducts: DigitalProduct[] = bundle
    ? bundle.productIds
        .map((id) => MOCK_DIGITAL_PRODUCTS.find((p) => p.id === id))
        .filter((p): p is DigitalProduct => !!p)
    : [];

  // Checkbox state for each product in bundle (all checked by default)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    bundledProducts.map((p) => p.id)
  );

  const [added, setAdded] = useState(false);

  if (!bundle || bundledProducts.length === 0) {
    return null;
  }

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Calculations
  const activeProducts = bundledProducts.filter((p) =>
    selectedProductIds.includes(p.id)
  );

  const rawSubtotal = activeProducts.reduce(
    (sum, p) => sum + (p.variants[0]?.price || p.price),
    0
  );

  // Only apply bundle discount when at least 2 items are selected
  const isBundleEligible = activeProducts.length >= 2;
  const discountRate = isBundleEligible ? bundle.discountPercent / 100 : 0;
  const discountAmount = rawSubtotal * discountRate;
  const finalBundlePrice = rawSubtotal - discountAmount;

  const handleAddBundleToCart = () => {
    if (activeProducts.length === 0) return;

    activeProducts.forEach((product) => {
      const variant = product.variants[0];
      // Distribute bundle discount proportionately
      const discountedItemPrice = isBundleEligible
        ? Number((variant.price * (1 - discountRate)).toFixed(2))
        : variant.price;

      addItem(
        {
          id: `${product.id}-${variant.sku}-bundle`,
          productId: product.id,
          variantId: variant.id,
          title: `${product.title} (Bundle Save)`,
          slug: product.slug,
          image: product.images[0],
          price: discountedItemPrice,
          variantTitle: `${variant.title} • ${bundle.badge}`,
          stock: variant.stockQuantity,
          deliveryType: product.deliveryType,
        },
        1
      );
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="relative rounded-3xl bg-[#0e1017] border border-white/[0.08] p-6 sm:p-8 shadow-2xl overflow-hidden space-y-6">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Section */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-black uppercase tracking-wider shadow-sm font-sans">
              {bundle.badge}
            </span>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" /> Bundle & Save Engine
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 font-sans tracking-tight">
            {bundle.title}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            {bundle.description}
          </p>
        </div>

        {isBundleEligible && (
          <div className="sm:text-right shrink-0 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block tracking-wider">
              Instant Savings Applied
            </span>
            <span className="text-lg font-mono font-extrabold text-emerald-300">
              Save {bundle.discountPercent}% ({formatPrice(discountAmount)})
            </span>
          </div>
        )}
      </div>

      {/* 2. Full-Width Interactive Products Grid */}
      <div className="relative z-10">
        <div
          className={`grid grid-cols-1 ${
            bundledProducts.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
          } gap-4`}
        >
          {bundledProducts.map((prod, index) => {
            const isChecked = selectedProductIds.includes(prod.id);
            const isCurrent = currentProduct?.id === prod.id;

            return (
              <div
                key={prod.id}
                onClick={() => toggleProduct(prod.id)}
                className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between select-none ${
                  isChecked
                    ? "bg-[#141724]/90 hover:bg-[#181c2c] border-blue-500/50 hover:border-blue-400 shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1"
                    : "bg-white/[0.02] border-white/[0.06] opacity-45 hover:opacity-75 hover:border-white/20"
                }`}
              >
                {/* Micro Plus Connector (Desktop between cards) */}
                {index > 0 && (
                  <div className="hidden sm:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-[#0c0e15] border border-white/20 text-neutral-300 items-center justify-center shadow-lg font-bold">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="space-y-3">
                  {/* Top: Checkbox, Badge, Thumbnail */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          isChecked
                            ? "bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-600/30 scale-105"
                            : "border-neutral-600 bg-neutral-900 group-hover:border-neutral-400"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Current Item
                        </span>
                      )}
                    </div>

                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-md">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                      {prod.title}
                    </h4>
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      {prod.deliveryType === "SERVICE_SETUP"
                        ? "Official WordPress Setup"
                        : prod.deliveryType === "INSTANT_CODE"
                        ? "Instant Key Dispenser"
                        : "Turnkey Asset Transfer"}
                    </span>
                  </div>
                </div>

                {/* Bottom: Pricing */}
                <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-baseline justify-between">
                  <span className="text-[11px] text-neutral-400">Included Tier:</span>
                  <div className="flex items-baseline gap-1.5 font-mono">
                    <span className="font-bold text-sm text-white">
                      {formatPrice(prod.variants[0]?.price || prod.price)}
                    </span>
                    {prod.originalPrice && (
                      <span className="text-[11px] text-neutral-500 line-through">
                        {formatPrice(prod.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Dedicated Full-Width Checkout Summary Bar */}
      <div className="relative z-10 rounded-2xl p-5 bg-[#121522] border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-inner">
        {/* Left Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-xs text-white">
              {activeProducts.length} of {bundledProducts.length} Bundle Items Selected
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            Click on any card above to toggle items in or out of your custom package.
          </p>
        </div>

        {/* Right Financial Breakdown & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 shrink-0">
          <div className="sm:text-right">
            <div className="flex sm:justify-end items-center gap-2 text-xs text-neutral-400">
              <span>Combined Value:</span>
              <span className={`font-mono ${isBundleEligible ? "line-through text-neutral-500" : "text-white font-bold"}`}>
                {formatPrice(rawSubtotal)}
              </span>
            </div>

            <div className="flex sm:justify-end items-baseline gap-2 mt-0.5">
              {isBundleEligible && (
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Save {bundle.discountPercent}%
                </span>
              )}
              <span className="text-2xl font-extrabold text-white font-mono">
                {formatPrice(finalBundlePrice)}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddBundleToCart}
            disabled={activeProducts.length === 0}
            className={`py-3.5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl disabled:opacity-50 whitespace-nowrap ${
              added
                ? "bg-emerald-600 text-white shadow-emerald-600/30 scale-102"
                : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02]"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Bundle Added to Bag!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>
                  Add {activeProducts.length} Items to Cart • {formatPrice(finalBundlePrice)}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
