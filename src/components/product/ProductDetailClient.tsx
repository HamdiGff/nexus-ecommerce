"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  Zap,
  Wrench,
  Globe,
  Check,
  ShoppingBag,
  ArrowLeft,
  Share2,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Building2,
} from "lucide-react";
import { DigitalProduct } from "@/data/mockProducts";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";
import { useQuickAddStore } from "@/lib/store/quickAddStore";
import BundleSaveEngine from "@/components/product/BundleSaveEngine";
import WPRocketProductExperience from "@/components/product/WPRocketProductExperience";
import RankMathProductExperience from "@/components/product/RankMathProductExperience";
import ElementorProductExperience from "@/components/product/ElementorProductExperience";
import AstraProductExperience from "@/components/product/AstraProductExperience";
import GoogleAdSenseProductExperience from "@/components/product/GoogleAdSenseProductExperience";
import ProductReviewsSection from "@/components/product/ProductReviewsSection";
import { useProductStore } from "@/lib/store/productStore";

interface ProductDetailClientProps {
  product: DigitalProduct;
}

const ADSENSE_TIERS = [
  {
    id: "FRESH",
    label: "Freshly Approved Tech Blog",
    shortLabel: "Fresh Approved",
    tagline: "High-CPC tech blog, 100% active green check, GAM potential",
    badge: "ENTRY NICHE",
    badgeStyle: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
    basePrice: 189,
    baseOrigPrice: 249,
    pinText: "Ready for Postal PIN setup",
    gamText: "GAM Included where available (not guaranteed)",
  },
  {
    id: "PIN",
    label: "PIN-Verified AdSense Website",
    shortLabel: "PIN Verified",
    tagline: "Postal address PIN cleared, withdrawal-ready, zero postal wait",
    badge: "MOST POPULAR",
    badgeStyle: "bg-emerald-400 text-neutral-950 font-black shadow-sm",
    basePrice: 369,
    baseOrigPrice: 480,
    pinText: "100% Postal PIN Cleared (Instant Bank Linking)",
    gamText: "Google Ad Manager Native Support",
  },
  {
    id: "VETERAN",
    label: "5x Paid Veteran + Guaranteed GAM",
    shortLabel: "5x Paid + GAM",
    tagline: "5+ wire payouts cleared, maximum trust, guaranteed GAM 360",
    badge: "ELITE ASSET",
    badgeStyle: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    basePrice: 589,
    baseOrigPrice: 750,
    pinText: "5+ Historical Google Bank Wire Payouts Cleared",
    gamText: "Guaranteed GAM 360 / MCM Approved",
  },
] as const;

const ADSENSE_COUNTRIES = [
  {
    code: "USA",
    name: "United States",
    flag: "🇺🇸",
    currency: "USD ($)",
    modifier: 60,
    cpcText: "$0.80 - $4.50+",
  },
  {
    code: "UK",
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP (£)",
    modifier: 50,
    cpcText: "£0.65 - £3.80+",
  },
  {
    code: "CAN",
    name: "Canada",
    flag: "🇨🇦",
    currency: "CAD ($)",
    modifier: 40,
    cpcText: "$0.70 - $3.90+",
  },
  {
    code: "IND",
    name: "India",
    flag: "🇮🇳",
    currency: "INR (₹)",
    modifier: -10,
    cpcText: "₹15 - ₹180+",
  },
  {
    code: "TUR",
    name: "Turkey",
    flag: "🇹🇷",
    currency: "TRY (₺)",
    modifier: -10,
    cpcText: "₺8 - ₺65+",
  },
  {
    code: "GCC",
    name: "Middle East (GCC)",
    flag: "🇦🇪",
    currency: "USD / AED",
    modifier: 30,
    cpcText: "$0.50 - $2.80+",
  },
  {
    code: "GLOBAL",
    name: "Global / Multi-Geo",
    flag: "🌐",
    currency: "Multi-Currency",
    modifier: 0,
    cpcText: "$0.60 - $3.00+",
  },
] as const;

export default function ProductDetailClient({ product: initialProduct }: ProductDetailClientProps) {
  const storeProduct = useProductStore((state) =>
    state.products.find((p) => p.id === initialProduct.id || p.slug === initialProduct.slug)
  );
  const product = storeProduct || initialProduct;

  const isAdSense = product.slug === "google-adsense-approved-websites" || product.slug.includes("adsense");
  const [adSenseTier, setAdSenseTier] = useState<"FRESH" | "PIN" | "VETERAN">("PIN");
  const [adSenseCountry, setAdSenseCountry] = useState<string>("USA");

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(() => {
    if (isAdSense) {
      const t = ADSENSE_TIERS[1];
      const c = ADSENSE_COUNTRIES[0];
      return {
        id: `adsense-${t.id.toLowerCase()}-${c.code.toLowerCase()}`,
        sku: `ADS-${t.id}-${c.code}`,
        title: `${t.label} — ${c.name} (${c.currency})`,
        tierName: t.label,
        price: t.basePrice + c.modifier,
        originalPrice: t.baseOrigPrice + c.modifier,
        stockQuantity: 3,
        perks: [
          `Target Region: ${c.flag} ${c.name} (${c.currency})`,
          "Original Master Gmail Account with 2FA Handshake",
          "Full WordPress Website Backup (Files + SQL Database)",
          "Free Domain Authorization Push at Namecheap/GoDaddy/Porkbun",
          t.pinText,
          t.gamText,
          "Strict Anti-Ad Loading Policy (Zero Bot / Artificial Traffic)",
          "0 Active TOS Violations • Never Ad-Limited",
          "14-Day Escrow Replacement Warranty",
        ],
      };
    }
    return product.variants && product.variants.length > 0
      ? product.variants[0]
      : { id: "default", sku: "DEFAULT", title: "Standard License", price: product.price || 0, stockQuantity: 99 };
  });

  const handleAdSenseConfigChange = (newTierId: "FRESH" | "PIN" | "VETERAN", newCountryCode: string) => {
    setAdSenseTier(newTierId);
    setAdSenseCountry(newCountryCode);

    const t = ADSENSE_TIERS.find((x) => x.id === newTierId) || ADSENSE_TIERS[1];
    const c = ADSENSE_COUNTRIES.find((x) => x.code === newCountryCode) || ADSENSE_COUNTRIES[0];
    const price = t.basePrice + c.modifier;
    const origPrice = t.baseOrigPrice + c.modifier;

    setSelectedVariant({
      id: `adsense-${t.id.toLowerCase()}-${c.code.toLowerCase()}`,
      sku: `ADS-${t.id}-${c.code}`,
      title: `${t.label} — ${c.name} (${c.currency})`,
      tierName: t.label,
      price,
      originalPrice: origPrice,
      stockQuantity: 3,
      perks: [
        `Target Region: ${c.flag} ${c.name} (${c.currency})`,
        "Original Master Gmail Account with 2FA Handshake",
        "Full WordPress Website Backup (Files + SQL Database)",
        "Free Domain Authorization Push at Namecheap/GoDaddy/Porkbun",
        t.pinText,
        t.gamText,
        "Strict Anti-Ad Loading Policy (Zero Bot / Artificial Traffic)",
        "0 Active TOS Violations • Never Ad-Limited",
        "14-Day Escrow Replacement Warranty",
      ],
    });
  };
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const triggerQuickAddEffect = useQuickAddStore((state) => state.triggerQuickAddEffect);

  const inCartItem = cartItems.find((i) => i.productId === product.id || i.slug === product.slug);
  const inCartQty = inCartItem?.quantity || 0;

  const handleAddToCart = (e?: React.MouseEvent) => {
    const targetEl = e?.currentTarget as HTMLElement | undefined;
    triggerQuickAddEffect(
      {
        id: product.id,
        title: product.title,
        image: product.images[selectedImage] || product.images[0],
        price: selectedVariant.price,
        variantTitle: selectedVariant.title,
      },
      targetEl
    );

    addItem(
      {
        id: `${product.id}-${selectedVariant.sku}`,
        productId: product.id,
        variantId: selectedVariant.id,
        title: product.title,
        slug: product.slug,
        image: product.images[selectedImage] || product.images[0],
        price: selectedVariant.price,
        variantTitle: selectedVariant.title,
        stock: selectedVariant.stockQuantity,
        deliveryType: product.deliveryType,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Semantic Breadcrumbs Navigation Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-between mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-white/[0.08] text-xs">
          <ol className="flex items-center gap-2 text-neutral-400 overflow-x-auto">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/category/${product.category || "wordpress"}`} className="hover:text-white transition-colors capitalize">
                {product.category?.replace(/-/g, " ") || "WordPress"}
              </Link>
            </li>
            <li>/</li>
            <li className="text-white font-medium truncate max-w-[160px] xs:max-w-[220px] sm:max-w-md" aria-current="page">
              {product.title}
            </li>
          </ol>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Product link copied to clipboard!");
              }
            }}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors shrink-0"
            title="Share Product"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </nav>

        {/* Product Main Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
          {/* Media Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-video bg-[#10121a] rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl">
              <img
                src={
                  (product.images && product.images[selectedImage]) ||
                  (product.images && product.images[0]) ||
                  (product.slug.includes("rank-math") ? "/products/rank-math-pro.svg" : "/products/wp-rocket.svg")
                }
                alt={product.title}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("rank-math-schema-rich-snippets")) {
                    target.src = "/products/rank-math-schema-rich-snippets.svg";
                  }
                }}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-24 h-16 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === idx
                        ? "border-blue-500 scale-105 shadow-lg shadow-blue-500/20"
                        : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} preview screenshot ${idx + 1}`}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes("rank-math-schema-rich-snippets")) {
                          target.src = "/products/rank-math-schema-rich-snippets.svg";
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Transferred to Left Column: Overview Description & Included Features Card */}
            <div className="pt-4 space-y-4 sm:space-y-6">
              {/* Product In-Depth Description */}
              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#10121a]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white">
                    Product Overview & Specifications
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Features Checklist */}
              {product.features && product.features.length > 0 && (
                <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#10121a]/90 border border-white/[0.08] backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Included with Your Purchase</span>
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                      {product.features.length} Features Included
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {product.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details & Actions Column (Right Column: Clean, Compact & Action-Focused) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="space-y-6">
              {/* Delivery Type Header Pill */}
              <div className="flex items-center gap-2 flex-wrap">
                {isAdSense ? (
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Turnkey Escrow Handshake</span>
                    <span className="hidden sm:inline">• Master Gmail Included</span>
                  </span>
                ) : (
                  <>
                    {product.deliveryType === "SERVICE_SETUP" && (
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5" />
                        WP Activation Service
                      </span>
                    )}
                    {product.deliveryType === "INSTANT_CODE" && (
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        Instant Key Dispenser
                      </span>
                    )}
                    {product.deliveryType === "MANUAL_HANDOFF" && (
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        Turnkey Asset Transfer
                      </span>
                    )}
                  </>
                )}

                {product.isFeatured && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    FEATURED
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans leading-tight">
                {product.title}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">{product.rating}</span>
                <span className="text-xs text-neutral-400">
                  ({product.reviewsCount} verified buyers)
                </span>
              </div>

              {/* Pricing Display */}
              {(() => {
                const activeOriginalPrice = selectedVariant.originalPrice || product.originalPrice;
                const savingsAmount = activeOriginalPrice && activeOriginalPrice > selectedVariant.price ? activeOriginalPrice - selectedVariant.price : 0;
                const savingsPercent = activeOriginalPrice && activeOriginalPrice > selectedVariant.price ? Math.round((savingsAmount / activeOriginalPrice) * 100) : 0;

                return (
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      {formatPrice(selectedVariant.price)}
                    </span>
                    {activeOriginalPrice && activeOriginalPrice > selectedVariant.price && (
                      <span className="text-base text-neutral-500 line-through font-mono">
                        {formatPrice(activeOriginalPrice)}
                      </span>
                    )}
                    {savingsPercent > 0 && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Save {savingsPercent}% ({formatPrice(savingsAmount)})
                      </span>
                    )}
                  </div>
                );
              })()}

              {/* Short Summary Teaser */}
              <p className="text-xs text-neutral-300 leading-relaxed">
                {product.shortDescription || "Select your preferred license tier below and receive direct updates & official support."}
              </p>

              {/* DEDICATED GOOGLE ADSENSE ASSET CONFIGURATOR */}
              {isAdSense ? (
                <div className="pt-2 border-t border-white/[0.08] space-y-4">
                  {/* Step 1: Account Maturity Tier */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white">
                          Step 1: Choose Account Maturity Tier
                        </span>
                      </div>
                      <span className="text-[10.5px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        3 Verified Tiers
                      </span>
                    </div>

                    <div className="space-y-2">
                      {ADSENSE_TIERS.map((tier) => {
                        const isSelected = adSenseTier === tier.id;
                        const matchingCountry = ADSENSE_COUNTRIES.find((c) => c.code === adSenseCountry) || ADSENSE_COUNTRIES[0];
                        const tierPrice = tier.basePrice + matchingCountry.modifier;
                        const tierOrigPrice = tier.baseOrigPrice + matchingCountry.modifier;

                        return (
                          <div
                            key={tier.id}
                            onClick={() => handleAdSenseConfigChange(tier.id, adSenseCountry)}
                            className={`cursor-pointer rounded-2xl p-3 sm:p-3.5 transition-all border text-left ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-600/[0.08] ring-1 ring-emerald-500/50 shadow-xl shadow-emerald-500/10"
                                : "border-white/[0.08] bg-[#12141e]/70 hover:border-white/20 hover:bg-[#12141e]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2.5">
                                <div className="mt-0.5">
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? "border-emerald-400 bg-emerald-500"
                                        : "border-neutral-600 bg-neutral-900"
                                    }`}
                                  >
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-neutral-950 font-bold" />}
                                  </div>
                                </div>

                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-xs sm:text-sm text-white">{tier.label}</span>
                                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${tier.badgeStyle}`}>
                                      {tier.badge}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-neutral-400 leading-snug">{tier.tagline}</p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <div className="text-sm sm:text-base font-extrabold text-white font-mono">
                                  {formatPrice(tierPrice)}
                                </div>
                                <div className="text-[10px] text-neutral-500 line-through font-mono">
                                  {formatPrice(tierOrigPrice)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Target Country & Payout Region */}
                  <div className="pt-2 border-t border-white/[0.08] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white">
                          Step 2: Choose Target Payout Country
                        </span>
                      </div>
                      <span className="text-[10.5px] text-neutral-400 font-mono">
                        7 Regions
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {ADSENSE_COUNTRIES.map((country) => {
                        const isSelected = adSenseCountry === country.code;
                        const activeTierData = ADSENSE_TIERS.find((t) => t.id === adSenseTier) || ADSENSE_TIERS[1];
                        const totalCountryPrice = activeTierData.basePrice + country.modifier;

                        return (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleAdSenseConfigChange(adSenseTier, country.code)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? "bg-emerald-500/15 border-emerald-400 text-white ring-1 ring-emerald-500/40 shadow-md shadow-emerald-500/10"
                                : "bg-white/[0.02] border-white/[0.08] text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-base">{country.flag}</span>
                              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                {formatPrice(totalCountryPrice)}
                              </span>
                            </div>
                            <div className="font-bold text-[11px] text-white mt-1 truncate">{country.name}</div>
                            <div className="text-[9.5px] text-neutral-400 font-mono">{country.currency}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Delivery System & Handshake Card */}
                  <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-white/[0.08] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Delivery System &amp; Inclusions</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Manual Escrow Handshake
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
                      <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-neutral-500 text-[9.5px] block font-mono">Fulfillment SLA</span>
                        <span className="font-bold text-white text-[11px] mt-0.5 block">24 – 48 Hours Handover</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-neutral-500 text-[9.5px] block font-mono">Domain Transfer</span>
                        <span className="font-bold text-emerald-400 text-[11px] mt-0.5 block">Free Registrar Push</span>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-white/[0.06] space-y-1 text-[11px] text-neutral-300">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>Master Gmail Account:</strong> Clean original email with 2FA &amp; recovery phone transferred</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>Full Website Archive:</strong> Complete WordPress SQL database + source files export</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>Clean Compliance:</strong> 0 active TOS violations • Never ad-limited • No bot ad loading</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>14-Day Escrow Warranty:</strong> Zero-risk replacement guarantee against pre-existing defects</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* STREAMLINED COMPACT LICENSE PLAN SELECTOR (FOR WORDPRESS / OTHER PRODUCTS) */
                product.variants.length > 1 && (
                  <div className="pt-2 border-t border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white">
                          Choose License Plan
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {product.variants.length} options available
                      </span>
                    </div>

                    {/* Compact Variant Selector Cards */}
                    <div className="space-y-2">
                      {product.variants.map((variant) => {
                        const isSelected = selectedVariant.id === variant.id;
                        const varOrigPrice = variant.originalPrice || (product.originalPrice ? product.originalPrice * (variant.licenseCount || 1) : undefined);

                        return (
                          <div
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            className={`cursor-pointer rounded-2xl p-3 sm:p-3.5 transition-all border text-left ${
                              isSelected
                                ? "border-blue-500 bg-blue-600/[0.08] ring-1 ring-blue-500/40 shadow-lg shadow-blue-500/10"
                                : "border-white/[0.08] bg-[#12141e]/70 hover:border-white/20 hover:bg-[#12141e]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2.5">
                                <div className="mt-0.5">
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? "border-blue-400 bg-blue-500"
                                        : "border-neutral-600 bg-neutral-900"
                                    }`}
                                  >
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </div>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-xs sm:text-sm text-white">{variant.title}</span>
                                    {variant.badge && (
                                      <span
                                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                          variant.badge.includes("POPULAR")
                                            ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-sm"
                                            : variant.badge.includes("VALUE") || variant.badge.includes("SAVE")
                                            ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-sm"
                                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                        }`}
                                      >
                                        {variant.badge}
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-[11px] text-neutral-400 mt-0.5">
                                    {variant.licenseCount && variant.licenseCount >= 999 ? (
                                      <span className="text-purple-300 font-medium">Unlimited Multi-Client Capacity</span>
                                    ) : variant.licenseCount && variant.licenseCount > 1 ? (
                                      <span className="text-blue-300 font-medium">{variant.licenseCount} Websites Official Activation</span>
                                    ) : product.deliveryType === "SERVICE_SETUP" ? (
                                      <span>1 Website Agency Activation (Dashboard Updates)</span>
                                    ) : product.deliveryType === "INSTANT_CODE" ? (
                                      <span>1 PC Official Retail Serial Key</span>
                                    ) : (
                                      <span>Turnkey Asset Handover</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <div className="text-sm sm:text-base font-extrabold text-white font-mono">
                                  {formatPrice(variant.price)}
                                </div>
                                {varOrigPrice && varOrigPrice > variant.price && (
                                  <div className="text-[10px] text-neutral-500 line-through font-mono">
                                    {formatPrice(varOrigPrice)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Consolidated Selected Plan Perks Box */}
                    {selectedVariant.perks && selectedVariant.perks.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-[#0e1017] border border-white/[0.06] space-y-2">
                        <span className="text-[10.5px] font-bold uppercase tracking-wider text-neutral-400 block font-mono">
                          Selected Plan Inclusions &amp; Delivery SLA:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {selectedVariant.perks.map((perk, pIdx) => (
                            <div key={pIdx} className="flex items-center gap-1.5 text-[11px] text-neutral-300">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="leading-tight">{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}

              {/* CTAs */}
              <div className="pt-2 space-y-3">
                <button
                  onClick={handleAddToCart}
                  className={`relative w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl overflow-hidden cursor-pointer ${
                    added
                      ? "bg-emerald-600 text-white shadow-emerald-500/30 scale-[1.01]"
                      : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:brightness-110 shadow-indigo-600/25"
                  }`}
                >
                  {added && (
                    <span className="absolute -inset-2 rounded-2xl border-2 border-emerald-300 animate-ping pointer-events-none" />
                  )}
                  {added ? (
                    <>
                      <Check className="w-5 h-5 stroke-[2.5] animate-in zoom-in-75 duration-200" />
                      <span>Added to Bag!</span>
                    </>
                  ) : inCartQty > 0 ? (
                    <>
                      <Check className="w-5 h-5 stroke-[2.5] text-emerald-300" />
                      <span>Add More ({inCartQty} in Bag) • {formatPrice(selectedVariant.price * quantity)}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Cart • {formatPrice(selectedVariant.price * quantity)}</span>
                    </>
                  )}
                </button>

                <Link
                  href="/checkout"
                  onClick={() => {
                    handleAddToCart();
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl font-semibold text-xs border border-white/10 hover:bg-white/[0.05] text-neutral-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Instant Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Security Pill */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3 text-xs text-neutral-400">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Protected with 256-bit encryption. Crypto, Card, and PayPal supported with instant receipt dispatch.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Seamless Bridge: How Activation & Delivery Works */}
        <div className="mt-8 sm:mt-12 rounded-2xl sm:rounded-3xl p-4 sm:p-8 bg-gradient-to-r from-neutral-900/80 via-[#10121a] to-neutral-900/80 border border-white/[0.08] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/5 blur-[100px] pointer-events-none -z-10" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-400 border border-blue-500/20">
                {product.deliveryType === "SERVICE_SETUP" && <Wrench className="w-5 h-5" />}
                {product.deliveryType === "INSTANT_CODE" && <Zap className="w-5 h-5 text-emerald-400" />}
                {product.deliveryType === "MANUAL_HANDOFF" && <Globe className="w-5 h-5 text-purple-400" />}
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {product.deliveryType === "SERVICE_SETUP" && "How WordPress Setup & Activation Works"}
                  {product.deliveryType === "INSTANT_CODE" && "Instant Key Dispenser & Auto-Delivery"}
                  {product.deliveryType === "MANUAL_HANDOFF" && "Asset & Account Ownership Transfer Process"}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  100% Guaranteed Setup • Safe & Verified • Full Warranty Protection
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Agency Delivery
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {product.deliveryType === "SERVICE_SETUP" && (
              <>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 transition-all space-y-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-500/15 text-blue-400 font-bold font-mono text-xs flex items-center justify-center">
                    01
                  </div>
                  <h4 className="font-bold text-sm text-white">Temporary Credentials</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    During checkout, submit your WordPress login URL and a temporary technician admin password via our encrypted portal.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 transition-all space-y-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-500/15 text-blue-400 font-bold font-mono text-xs flex items-center justify-center">
                    02
                  </div>
                  <h4 className="font-bold text-sm text-white">Official Dashboard Activation</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Our certified engineer connects your domain to our genuine agency license dashboard in 30 - 45 minutes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 transition-all space-y-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold font-mono text-xs flex items-center justify-center">
                    03
                  </div>
                  <h4 className="font-bold text-sm text-white">1-Click Updates & Security</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Updates arrive automatically in your WP dashboard for 1 full year. You can safely remove the temporary admin account immediately.
                  </p>
                </div>
              </>
            )}

            {product.deliveryType === "INSTANT_CODE" && (
              <>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-all space-y-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold font-mono text-xs flex items-center justify-center">
                    01
                  </div>
                  <h4 className="font-bold text-sm text-white">Instant Payment Verification</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Automated gateway confirms your crypto, card, or PayPal payment in sub-seconds.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-all space-y-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold font-mono text-xs flex items-center justify-center">
                    02
                  </div>
                  <h4 className="font-bold text-sm text-white">Key Revealed Instantly</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Your unique 20-digit retail license key or redeemable digital code appears on your screen in real time.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-all space-y-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold font-mono text-xs flex items-center justify-center">
                    03
                  </div>
                  <h4 className="font-bold text-sm text-white">Vault & Email Backup</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Receive an encrypted PDF invoice and permanent access to your serial keys inside your Customer Account Order Vault.
                  </p>
                </div>
              </>
            )}

            {product.deliveryType === "MANUAL_HANDOFF" && (
              <>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 transition-all space-y-2">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/15 text-purple-400 font-bold font-mono text-xs flex items-center justify-center">
                    01
                  </div>
                  <h4 className="font-bold text-sm text-white">Escrow & Verification</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Your funds are held securely while domain ownership and AdSense verification checks are initiated.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 transition-all space-y-2">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/15 text-purple-400 font-bold font-mono text-xs flex items-center justify-center">
                    02
                  </div>
                  <h4 className="font-bold text-sm text-white">Domain & Account Handover</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Domain EPP auth code and primary Google AdSense credentials are transferred directly to your email vault.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 transition-all space-y-2">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/15 text-purple-400 font-bold font-mono text-xs flex items-center justify-center">
                    03
                  </div>
                  <h4 className="font-bold text-sm text-white">Full Handshake Complete</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Enjoy 100% full legal asset ownership with 30-day ticket warranty support.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dedicated Tailored Plugin Experience */}
        {product.slug === "wp-rocket" && (
          <div className="mt-12">
            <WPRocketProductExperience />
          </div>
        )}

        {(product.slug === "rank-math-pro" || product.slug.startsWith("rank-math")) && (
          <div className="mt-12">
            <RankMathProductExperience />
          </div>
        )}

        {(product.slug === "elementor-pro" || product.slug.startsWith("elementor")) && (
          <div className="mt-12">
            <ElementorProductExperience />
          </div>
        )}

        {(product.slug === "astra-pro-theme" || product.slug.startsWith("astra")) && (
          <div className="mt-12">
            <AstraProductExperience />
          </div>
        )}

        {(product.slug === "google-adsense-approved-websites" || product.slug.includes("adsense")) && (
          <div className="mt-12">
            <GoogleAdSenseProductExperience />
          </div>
        )}

        {/* ChatGPT Plus — Validity Guarantee & Plan Breakdown */}
        {product.slug.includes("chatgpt") && (
          <div className="mt-8 sm:mt-12 space-y-6">
            {/* Guarantee Banner */}
            <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-[#071a12] via-[#0a1c16] to-[#08121a]">
              <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/6 blur-[100px] pointer-events-none -z-10" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                    <h3 className="font-extrabold text-lg sm:text-xl text-white">100% Validity Guarantee</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl">
                    Every ChatGPT Plus subscription is backed by our <strong className="text-white">full-period validity guarantee</strong>. If your access is interrupted or expires before your plan ends for any reason, we replace your subscription immediately — completely free, zero questions asked.
                  </p>
                </div>
                <div className="flex-shrink-0 grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: "1 Month", sub: "Flexible", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/8" },
                    { label: "6 Months", sub: "Popular", color: "text-emerald-400", border: "border-emerald-400/50", bg: "bg-emerald-500/15" },
                    { label: "1 Year", sub: "Best Value", color: "text-purple-400", border: "border-purple-500/40", bg: "bg-purple-500/10" },
                  ].map((plan) => (
                    <div key={plan.label} className={`px-3 py-3 rounded-2xl border ${plan.border} ${plan.bg} flex flex-col items-center gap-1`}>
                      <span className={`font-extrabold text-sm ${plan.color}`}>{plan.label}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{plan.sub}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* What You Get Grid */}
            <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/[0.08] bg-[#0d1118]/80">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-white">What's Included with ChatGPT Plus</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { icon: "🤖", title: "GPT-4o Model", desc: "Flagship multimodal AI with vision, voice, and advanced reasoning." },
                  { icon: "🎨", title: "DALL·E 3 Images", desc: "Generate photorealistic images, art, and mockups via text prompts." },
                  { icon: "💻", title: "Code Interpreter", desc: "Execute Python, analyze data, debug code, and create charts." },
                  { icon: "🌐", title: "Web Browsing", desc: "Real-time live search for current news, research, and market data." },
                  { icon: "🧩", title: "Custom GPTs", desc: "Build and use personal AI agents trained on your own documents." },
                  { icon: "⚡", title: "Priority Access", desc: "Always fast — never throttled or queued during peak demand." },
                ].map((item, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-all space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-bold text-xs text-white">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Process */}
            <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/[0.08] bg-gradient-to-r from-neutral-900/60 via-[#0d1020] to-neutral-900/60">
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-5 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                How ChatGPT Plus Delivery Works
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { step: "01", title: "Select Your Plan", desc: "Choose 1 Month, 6 Month, or 1 Year. Complete checkout via Card, PayPal, or Crypto.", color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/20" },
                  { step: "02", title: "Instant Delivery", desc: "ChatGPT Plus credentials are delivered to your email and saved in your Order Vault.", color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/20" },
                  { step: "03", title: "Validity Protected", desc: "If access drops before your plan ends, we replace it free — no questions asked.", color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/20" },
                ].map((step) => (
                  <div key={step.step} className={`p-4 rounded-2xl bg-white/[0.02] border ${step.border} space-y-2`}>
                    <div className={`w-7 h-7 rounded-xl ${step.bg} font-bold font-mono text-xs flex items-center justify-center ${step.color}`}>{step.step}</div>
                    <h4 className="font-bold text-sm text-white">{step.title}</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 100% Verified Customer Reviews & Audits */}
        <div className="mt-12">
          <ProductReviewsSection
            productId={product.id}
            productTitle={product.title}
            rating={product.rating}
            reviewsCount={product.reviewsCount}
          />
        </div>

        {/* Bundle & Save Engine Recommendation */}
        <div className="mt-12">
          <BundleSaveEngine currentProduct={product} />
        </div>
      </div>
    </div>
  );
}
