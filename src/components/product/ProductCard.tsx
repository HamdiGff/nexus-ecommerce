"use client";

import Link from "next/link";
import { Star, ShoppingBag, Check, Zap, Wrench, Globe, ArrowUpRight, Layers, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DigitalProduct } from "@/data/mockProducts";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";
import { useQuickAddStore } from "@/lib/store/quickAddStore";

interface ProductCardProps {
  product: DigitalProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const triggerQuickAddEffect = useQuickAddStore((state) => state.triggerQuickAddEffect);

  // Determine lowest variant price for accurate "From $X" or base price
  const lowestVariant = product.variants && product.variants.length > 0
    ? product.variants.reduce((min, curr) => (curr.price < min.price ? curr : min), product.variants[0])
    : null;

  const displayPrice = lowestVariant ? lowestVariant.price : product.price;
  const displayOriginalPrice = lowestVariant?.originalPrice || product.originalPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedVariant = lowestVariant || product.variants[0];
    const targetEl = e.currentTarget as HTMLElement;

    // Trigger unique flying particle, haptic chime and toast
    triggerQuickAddEffect(
      {
        id: product.id,
        title: product.title,
        image: product.images[0],
        price: selectedVariant?.price || product.price,
        variantTitle: selectedVariant?.title,
      },
      targetEl
    );

    addItem(
      {
        id: `${product.id}-${selectedVariant?.sku || "default"}`,
        productId: product.id,
        variantId: selectedVariant?.id,
        title: product.title,
        slug: product.slug,
        image: product.images[0],
        price: selectedVariant?.price || product.price,
        variantTitle: selectedVariant?.title,
        stock: selectedVariant?.stockQuantity || 99,
        deliveryType: product.deliveryType,
      },
      1,
      false // Smooth quick-add without interrupting with the drawer
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const discountPercent = displayOriginalPrice && displayOriginalPrice > displayPrice
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
    : 0;

  // Category label formatter
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "wordpress":
        return "WordPress";
      case "software-licenses":
        return "Software";
      case "gift-cards":
        return "Gaming";
      case "turnkey-websites":
        return "Turnkey";
      default:
        return "Digital";
    }
  };

  return (
    <div className="group relative rounded-2xl bg-gradient-to-b from-[#121420]/95 via-[#0e1019]/95 to-[#090b12]/98 backdrop-blur-xl border border-white/[0.08] hover:border-blue-500/40 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(37,99,235,0.15)] flex flex-col justify-between overflow-hidden">
      {/* Top Laser Shimmer Beam on Hover */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none" />

      {/* Top Floating Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
        {/* Delivery Type Badge */}
        <div>
          {product.deliveryType === "INSTANT_CODE" && (
            <span className="bg-[#0b1c14]/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-black/60">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <Zap className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />
              Instant
            </span>
          )}
          {product.deliveryType === "SERVICE_SETUP" && (
            <span className="bg-[#0b1528]/90 backdrop-blur-md border border-blue-500/40 text-blue-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-black/60">
              <Wrench className="w-2.5 h-2.5 text-blue-400" />
              Setup
            </span>
          )}
          {product.deliveryType === "MANUAL_HANDOFF" && (
            <span className="bg-[#1c0f2b]/90 backdrop-blur-md border border-purple-500/40 text-purple-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-black/60">
              <Globe className="w-2.5 h-2.5 text-purple-400" />
              Asset
            </span>
          )}
        </div>

        {/* Discount Tag */}
        {discountPercent > 0 && (
          <span className="bg-rose-500/20 backdrop-blur-md border border-rose-500/30 text-rose-300 text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full shadow-md">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Sleek Aspect Ratio Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-[16/10] bg-[#0c0d14] overflow-hidden rounded-t-2xl border-b border-white/[0.06]"
      >
        {!imgError ? (
          <img
            src={
              (product.images && product.images[0]) ||
              (product.slug.includes("rank-math") ? "/products/rank-math-pro.svg" : "/products/wp-rocket.svg")
            }
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-indigo-950/40 to-neutral-950 flex flex-col items-center justify-center p-3 text-center">
            <ShieldCheck className="w-8 h-8 text-blue-400/40 mb-1" />
            <span className="text-[11px] font-semibold text-neutral-400">{product.title}</span>
          </div>
        )}

        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121420] via-transparent to-black/20 opacity-60 group-hover:opacity-30 transition-opacity duration-300" />

        {/* Stock or Delivery SLA Pill on Image Bottom */}
        <div className="absolute bottom-2 right-2 z-10">
          {product.instantStockCount ? (
            <span className="text-[9.5px] font-bold text-emerald-300 bg-black/75 backdrop-blur-md border border-emerald-500/30 px-1.5 py-0.2 rounded-full">
              {product.instantStockCount} in stock
            </span>
          ) : product.deliveryType === "SERVICE_SETUP" ? (
            <span className="text-[9.5px] font-bold text-blue-300 bg-black/75 backdrop-blur-md border border-blue-500/30 px-1.5 py-0.2 rounded-full">
              45m SLA
            </span>
          ) : (
            <span className="text-[9.5px] font-bold text-purple-300 bg-black/75 backdrop-blur-md border border-purple-500/30 px-1.5 py-0.2 rounded-full">
              Handoff
            </span>
          )}
        </div>
      </Link>

      {/* Compact Card Body Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category Tag & Rating Row */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9.5px] font-bold tracking-wider uppercase text-blue-400/90 font-mono">
              {getCategoryLabel(product.category)}
            </span>

            <div className="flex items-center gap-1 bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/[0.05]">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-white font-mono">{product.rating}</span>
              <span className="text-[9.5px] text-neutral-500 font-mono">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title with Uniform Min-Height (2 Lines) */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-white text-[13.5px] leading-snug line-clamp-2 min-h-[2.4rem] group-hover:text-blue-400 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Key Feature Highlight Tag */}
          <div className="mt-1.5 flex items-center gap-1 overflow-hidden">
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] text-neutral-300 truncate font-medium">
              <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
              <span className="truncate">
                {product.features && product.features[0] ? product.features[0].replace(/^[^\w\s]+/, "").trim() : "Verified Digital License"}
              </span>
            </div>
          </div>

          {/* Description Snippet: Clean 1-Line for Compact Appearance */}
          <p className="text-[11px] text-neutral-400 mt-1.5 line-clamp-1 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* License Tier Preview */}
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-neutral-400">
            {product.variants.length > 1 ? (
              <span className="inline-flex items-center gap-1 text-indigo-300 font-medium bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                <Layers className="w-2.5 h-2.5" />
                {product.variants.length} Tiers
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-300 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                <ShieldCheck className="w-2.5 h-2.5" />
                Lifetime
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Compact Action Row */}
        <div className="mt-3.5 pt-3 border-t border-white/[0.07] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              {product.variants.length > 1 && (
                <span className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider">From</span>
              )}
              <span className="text-[15px] font-extrabold text-white font-mono tracking-tight">
                {formatPrice(displayPrice)}
              </span>
              {displayOriginalPrice && (
                <span className="text-[10px] text-neutral-500 line-through font-mono">
                  {formatPrice(displayOriginalPrice)}
                </span>
              )}
            </div>
            <span className="text-[9px] text-neutral-500 block font-medium">
              Verified License
            </span>
          </div>

          <div className="flex items-center gap-1.5 relative">
            {/* Quick Add To Bag Button with Unique Floating + Ripple Feedback */}
            <button
              onClick={handleAddToCart}
              className={`relative p-2 rounded-lg font-bold transition-all duration-300 active:scale-90 flex items-center justify-center shadow-sm ${
                added
                  ? "bg-emerald-500 text-neutral-950 shadow-emerald-500/40 scale-105"
                  : "bg-white text-neutral-950 hover:bg-neutral-200"
              }`}
              title="Quick Add to Bag"
              aria-label="Add to cart"
            >
              {/* Expanding Ripple Ring on Click */}
              {added && (
                <span className="absolute -inset-2 rounded-xl border-2 border-emerald-400 animate-ping pointer-events-none" />
              )}

              {/* Floating +1 Pill Badge */}
              {added && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-500 text-neutral-950 font-black text-[10px] tracking-tight shadow-lg shadow-emerald-500/50 animate-bounce pointer-events-none whitespace-nowrap">
                  +1 Added
                </span>
              )}

              {added ? (
                <Check className="w-3.5 h-3.5 stroke-[3] animate-in zoom-in-75 duration-200 text-neutral-950" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5" />
              )}
            </button>

            {/* View Product Details Link */}
            <Link
              href={`/products/${product.slug}`}
              className="p-2 rounded-lg border border-white/10 hover:border-blue-400/50 bg-white/[0.03] hover:bg-blue-500/10 text-neutral-300 hover:text-blue-300 transition-all active:scale-95 flex items-center justify-center"
              title="View Product Page"
              aria-label="View product details"
            >
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
