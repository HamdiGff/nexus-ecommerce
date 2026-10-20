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
import BundleSaveEngine from "@/components/product/BundleSaveEngine";
import WPRocketProductExperience from "@/components/product/WPRocketProductExperience";
import RankMathProductExperience from "@/components/product/RankMathProductExperience";
import ElementorProductExperience from "@/components/product/ElementorProductExperience";
import ProductReviewsSection from "@/components/product/ProductReviewsSection";
import { useProductStore } from "@/lib/store/productStore";

interface ProductDetailClientProps {
  product: DigitalProduct;
}

export default function ProductDetailClient({ product: initialProduct }: ProductDetailClientProps) {
  const storeProduct = useProductStore((state) =>
    state.products.find((p) => p.id === initialProduct.id || p.slug === initialProduct.slug)
  );
  const product = storeProduct || initialProduct;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : { id: "default", sku: "DEFAULT", title: "Standard License", price: product.price || 0, stockQuantity: 99 }
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
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
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
          <Link
            href="/#catalog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Digital Marketplace</span>
          </Link>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Product link copied to clipboard!");
              }
            }}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors"
            title="Share Product"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Product Main Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
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
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Transferred to Left Column: Overview Description & Included Features Card */}
            <div className="pt-4 space-y-6">
              {/* Product In-Depth Description */}
              <div className="p-6 rounded-3xl bg-[#10121a]/90 border border-white/[0.08] backdrop-blur-xl space-y-3">
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
                <div className="p-6 rounded-3xl bg-[#10121a]/90 border border-white/[0.08] backdrop-blur-xl space-y-4">
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
              <div className="flex items-center gap-2">
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

              {/* Tiered License Options Section */}
              {product.variants.length > 1 && (
                <div className="pt-2 border-t border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        Choose License Tier
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-medium">
                      {product.variants.length} options available
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant.id === variant.id;
                      const varOrigPrice = variant.originalPrice || (product.originalPrice ? product.originalPrice * (variant.licenseCount || 1) : undefined);

                      return (
                        <div
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`cursor-pointer rounded-2xl p-4 transition-all relative border text-left ${
                            isSelected
                              ? "border-blue-500 bg-blue-600/[0.08] ring-1 ring-blue-500/40 shadow-xl shadow-blue-500/10"
                              : "border-white/[0.08] bg-[#12141e]/70 hover:border-white/20 hover:bg-[#12141e]"
                          }`}
                        >
                          {/* Top Row: Radio, Title, Badge, Price */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
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
                                  <span className="font-bold text-sm text-white">{variant.title}</span>
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

                                {variant.tierName && (
                                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-1">
                                    {variant.licenseCount && variant.licenseCount >= 999 ? (
                                      <>
                                        <Building2 className="w-3 h-3 text-purple-400" />
                                        <span className="text-purple-300 font-medium">Unlimited Multi-Client Capacity</span>
                                      </>
                                    ) : variant.licenseCount && variant.licenseCount > 1 ? (
                                      <>
                                        <Globe className="w-3 h-3 text-blue-400" />
                                        <span className="text-blue-300 font-medium">{variant.licenseCount} Installations / Sites</span>
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle2 className="w-3 h-3 text-neutral-400" />
                                        <span>Single Installation License</span>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Price Column */}
                            <div className="text-right flex-shrink-0">
                              <div className="text-base font-extrabold text-white font-mono">
                                {formatPrice(variant.price)}
                              </div>
                              {varOrigPrice && varOrigPrice > variant.price && (
                                <div className="text-[11px] text-neutral-500 line-through font-mono">
                                  {formatPrice(varOrigPrice)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Perks Bullet Points */}
                          {variant.perks && variant.perks.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {variant.perks.map((perk, pIdx) => (
                                <div key={pIdx} className="flex items-center gap-1.5 text-[11px] text-neutral-300">
                                  <Check className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? "text-emerald-400" : "text-neutral-500"}`} />
                                  <span className="leading-tight">{perk}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="pt-2 space-y-3">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:brightness-110 shadow-indigo-600/25"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Bag!</span>
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
        <div className="mt-12 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-neutral-900/80 via-[#10121a] to-neutral-900/80 border border-white/[0.08] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/5 blur-[100px] pointer-events-none -z-10" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-400 border border-blue-500/20">
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
