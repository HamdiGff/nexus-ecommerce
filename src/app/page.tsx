"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Zap,
  Wrench,
  Globe,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Key,
  Star,
  Check,
  Coins,
  CreditCard,
  Lock,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Flame,
} from "lucide-react";
import { CATEGORIES, DeliveryType, MOCK_PRODUCT_BUNDLES } from "@/data/mockProducts";
import ProductCard from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/authStore";
import { useProductStore } from "@/lib/store/productStore";
import { useCategoryStore } from "@/lib/store/categoryStore";
import BundleSaveEngine from "@/components/product/BundleSaveEngine";

export default function HomePage() {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const products = useProductStore((state) => state.products);
  const categories = useCategoryStore((state) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState<"ALL" | DeliveryType>("ALL");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  // Hero interactive preview card state
  const [heroActiveIndex, setHeroActiveIndex] = useState(0);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesDelivery =
        deliveryFilter === "ALL" || product.deliveryType === deliveryFilter;
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.seoKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesDelivery && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, deliveryFilter, searchQuery, sortBy]);

  const heroShowcaseItems = [
    {
      title: "WP Rocket - Caching & Core Web Vitals Accelerator",
      subtitle: "Official agency activation with automatic dashboard updates",
      price: "$15.00",
      originalPrice: "$59.00",
      type: "SERVICE_SETUP" as const,
      badge: "WordPress Performance Leader",
      icon: Flame,
      accent: "from-orange-500 to-amber-600",
      slug: "wp-rocket",
      image: "/products/wp-rocket.svg",
    },
    {
      title: "IDM 1-PC Lifetime Retail Key",
      subtitle: "Instant auto-delivery retail serial with lifetime updates",
      price: "$18.50",
      originalPrice: "$24.95",
      type: "INSTANT_CODE" as const,
      badge: "Instant Auto-Key",
      icon: Zap,
      accent: "from-emerald-500 to-teal-600",
      slug: "internet-download-manager-lifetime",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Google AdSense Tech Blog + .COM",
      subtitle: "Turnkey approved monetization website + domain auth transfer",
      price: "$349.00",
      originalPrice: "$450.00",
      type: "MANUAL_HANDOFF" as const,
      badge: "Turnkey Asset",
      icon: Globe,
      accent: "from-purple-500 to-pink-600",
      slug: "adsense-approved-tech-blog-domain",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  const activeHeroItem = heroShowcaseItems[heroActiveIndex];

  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 selection:bg-blue-600 selection:text-white">
      {/* MASSIVE MODERN HERO SECTION */}
      <section className="relative pt-10 pb-8 md:pt-16 md:pb-10 overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/4 right-10 w-[450px] h-[450px] bg-purple-600/15 blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-emerald-600/10 blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Modern Punchy Headline & Actions */}
            <div className="lg:col-span-7 space-y-5">
              {/* Shimmer Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-semibold text-neutral-300 backdrop-blur-xl shadow-lg shadow-black/40">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="tracking-wide">DIRECT AGENCY ACTIVATION &amp; INSTANT KEYS</span>
              </div>

              {/* Punchy Modern Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight font-sans leading-[1.12] text-balance">
                Official Digital Licenses.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                  Instant Auto-Delivery.
                </span>{" "}
                Wholesale Pricing.
              </h1>

              {/* Clear, High-Converting Subtitle */}
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal max-w-xl">
                Save up to 75% on genuine WordPress agency stacks, official retail serial keys, and monetization-approved AdSense portals. 100% authenticated licenses with encrypted auto-dispatch.
              </p>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-wrap gap-3 items-center">
                <a
                  href="#catalog"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all group"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>

                <Link
                  href="/orders"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] active:scale-95 text-neutral-200 font-semibold text-xs sm:text-sm border border-white/[0.1] backdrop-blur-xl transition-all"
                >
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Track Digital Order</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 px-3.5 py-3.5 rounded-xl text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Admin Hub</span>
                  </Link>
                )}
              </div>

              {/* Micro Trust Points */}
              <div className="pt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-400 border-t border-white/[0.08]">
                <div className="flex items-center gap-1.5">
                  <div className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-neutral-300 font-medium">100% Genuine Retail Keys</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="p-0.5 rounded-full bg-blue-500/10 text-blue-400">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-neutral-300 font-medium">&lt; 60s Instant Auto-Reveal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="p-0.5 rounded-full bg-purple-500/10 text-purple-400">
                    <Wrench className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-neutral-300 font-medium">45-Min WP Setup SLA</span>
                </div>
              </div>
            </div>

            {/* Right Column: Modern Live Terminal / Showcase Console */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl p-0.5 bg-gradient-to-b from-white/[0.18] via-white/[0.06] to-transparent shadow-2xl shadow-black/80">
                <div className="rounded-[15px] bg-[#10121b]/98 backdrop-blur-2xl p-5 sm:p-6 border border-white/[0.08] space-y-4">
                  {/* Console Header Bar with Window Dots */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 font-mono text-[10.5px] text-neutral-400 uppercase tracking-wider">
                        NEXUS LIVE TERMINAL
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      LIVE INVENTORY
                    </span>
                  </div>

                  {/* Selector Tabs */}
                  <div className="flex p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                    {heroShowcaseItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHeroActiveIndex(idx)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          heroActiveIndex === idx
                            ? "bg-white/[0.12] text-white shadow-sm border border-white/10"
                            : "text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        {item.type === "SERVICE_SETUP"
                          ? "Rank Math"
                          : item.type === "INSTANT_CODE"
                          ? "IDM Key"
                          : "AdSense Blog"}
                      </button>
                    ))}
                  </div>

                  {/* Interactive Visual Preview Box */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-br from-[#0b0e17] via-[#101524] to-[#07090f] border border-white/10 flex flex-col justify-between p-4 group">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between z-10">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${activeHeroItem.accent} shadow-md flex items-center gap-1.5`}
                      >
                        <activeHeroItem.icon className="w-3 h-3" />
                        {activeHeroItem.badge}
                      </span>

                      <span className="text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        100% Verified
                      </span>
                    </div>

                    {/* Dynamic Graphic Stage for Each Item */}
                    <div className="my-auto text-center z-10">
                      {heroActiveIndex === 0 && (
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 font-extrabold text-sm">
                            <span>RankMath</span>
                            <span className="bg-amber-400 text-neutral-950 text-[10px] px-1.5 py-0.2 rounded font-black">
                              PRO
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400">Content AI 2.0 • 840+ Credits • Schema</p>
                        </div>
                      )}

                      {heroActiveIndex === 1 && (
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs">
                            <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                            <span>IDM-••••-••••-NXUS</span>
                          </div>
                          <p className="text-[11px] text-neutral-400">Official Tonec 20-Digit Retail Key • 5x Speeds</p>
                        </div>
                      )}

                      {heroActiveIndex === 2 && (
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 font-mono font-bold text-xs">
                            <Globe className="w-3.5 h-3.5" />
                            <span>Approved AdSense Tech Blog</span>
                          </div>
                          <p className="text-[11px] text-neutral-400">Clean 0 Policy Strikes • Aged .COM Domain Push</p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Feature Ticker */}
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 z-10 border-t border-white/[0.06] pt-2">
                      <span>Agency Dashboard Updates</span>
                      <span className="text-emerald-400 font-mono">Immediate Handshake</span>
                    </div>

                    {/* Background Radial Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Title & Price Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-white">{activeHeroItem.title}</h3>
                        <p className="text-[11px] text-neutral-400">{activeHeroItem.subtitle}</p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-white/[0.06]">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-xl font-extrabold text-white">
                          {activeHeroItem.price}
                        </span>
                        <span className="font-mono text-xs text-neutral-500 line-through">
                          {activeHeroItem.originalPrice}
                        </span>
                        <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          BEST DEAL
                        </span>
                      </div>

                      <Link
                        href={`/products/${activeHeroItem.slug}`}
                        className="px-4 py-2 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Guaranteed Metrics Bar */}
                  <div className="pt-2.5 border-t border-white/[0.06] grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-neutral-500 text-[9.5px] block font-mono">Fulfillment SLA</span>
                      <span className="text-emerald-400 font-bold text-[11px] mt-0.5 block">
                        {activeHeroItem.type === "INSTANT_CODE" ? "Immediate Screen Reveal" : "Guaranteed within 45 min"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-neutral-500 text-[9.5px] block font-mono">Authenticity</span>
                      <span className="text-blue-400 font-bold text-[11px] mt-0.5 block">
                        100% Agency &amp; Retail
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glassmorphic Trust & Performance Stats Capsule */}
          <div className="mt-12 rounded-2xl bg-gradient-to-b from-[#131624]/90 via-[#0e1019]/95 to-[#0a0c13]/98 border border-white/[0.08] backdrop-blur-xl p-5 sm:p-6 shadow-2xl shadow-black/60">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-white/[0.08] text-center">
              <div className="lg:px-4 flex flex-col items-center">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mb-2 border border-emerald-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  12,850+
                </div>
                <span className="text-xs font-semibold text-neutral-200 mt-1">Verified Digital Licenses</span>
                <span className="text-[10px] text-neutral-500 mt-0.5">100% Zero-Revocation SLA</span>
              </div>

              <div className="lg:px-4 flex flex-col items-center">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 mb-2 border border-amber-500/20">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-1">
                  <span>4.9</span>
                  <span className="text-amber-400 text-lg">★</span>
                </div>
                <span className="text-xs font-semibold text-neutral-200 mt-1">1,400+ Verified Reviews</span>
                <span className="text-[10px] text-neutral-500 mt-0.5">TrustScore 99.4% Positive</span>
              </div>

              <div className="lg:px-4 flex flex-col items-center">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 mb-2 border border-blue-500/20">
                  <Zap className="w-5 h-5 fill-blue-400" />
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  &lt; 60s
                </div>
                <span className="text-xs font-semibold text-neutral-200 mt-1">Instant Key Dispatch</span>
                <span className="text-[10px] text-neutral-500 mt-0.5">Automated Screen Reveal</span>
              </div>

              <div className="lg:px-4 flex flex-col items-center">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 mb-2 border border-purple-500/20">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  24 / 7
                </div>
                <span className="text-xs font-semibold text-neutral-200 mt-1">Live Technician SLA</span>
                <span className="text-[10px] text-neutral-500 mt-0.5">WhatsApp &amp; Live Chat Desk</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG SECTION */}
      <section id="catalog" className="pt-8 pb-16 bg-[#07080c] border-t border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live Digital Inventory
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-sans tracking-tight">
                Explore Software, Keys &amp; Assets
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 max-w-lg leading-relaxed">
                Choose your license tier. Every product is backed by instant auto-delivery or direct technician installation.
              </p>
            </div>

            {/* Quick Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2 px-3.5 bg-neutral-900 border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="featured">Featured First</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Search & Delivery Type Filter Bar */}
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/[0.08] backdrop-blur-xl mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search Rank Math Pro, WP Rocket, IDM, Steam, AdSense..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              {/* Delivery Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setDeliveryFilter("ALL")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    deliveryFilter === "ALL"
                      ? "bg-white text-neutral-950"
                      : "bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08]"
                  }`}
                >
                  All Methods
                </button>
                <button
                  onClick={() => setDeliveryFilter("INSTANT_CODE")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                    deliveryFilter === "INSTANT_CODE"
                      ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                      : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" /> Instant Key
                </button>
                <button
                  onClick={() => setDeliveryFilter("SERVICE_SETUP")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                    deliveryFilter === "SERVICE_SETUP"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" /> WP Setup
                </button>
                <button
                  onClick={() => setDeliveryFilter("MANUAL_HANDOFF")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                    deliveryFilter === "MANUAL_HANDOFF"
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                      : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> Website Handoff
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/[0.06] scrollbar-none">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 border border-blue-400/30"
                    : "bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.07] border border-transparent"
                }`}
              >
                <span>All Products</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    selectedCategory === "all"
                      ? "bg-white/20 text-white font-bold"
                      : "bg-white/[0.06] text-neutral-400"
                  }`}
                >
                  {products.length}
                </span>
              </button>

              {categories.map((cat) => {
                const count = products.filter(
                  (p) => p.category === cat.slug || p.category === cat.id
                ).length;

                return (
                  <div key={cat.id} className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        selectedCategory === cat.slug || selectedCategory === cat.id
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 border border-blue-400/30"
                          : "bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.07] border border-transparent"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          selectedCategory === cat.slug || selectedCategory === cat.id
                            ? "bg-white/20 text-white font-bold"
                            : "bg-white/[0.06] text-neutral-400"
                        }`}
                      >
                        {count}
                      </span>
                    </button>

                    <Link
                      href={`/category/${cat.slug}`}
                      title={`Go to ${cat.name} dedicated page`}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-400 hover:bg-white/[0.05] transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Inventory Count & Reset Tag Bar */}
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-6 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                {filteredProducts.length}
              </span>
              <span>
                {filteredProducts.length === 1 ? "product available" : "products available"}
              </span>
              {(selectedCategory !== "all" || deliveryFilter !== "ALL" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setDeliveryFilter("ALL");
                    setSearchQuery("");
                  }}
                  className="ml-2 text-[11px] text-blue-400 hover:text-blue-300 underline underline-offset-4"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-5 rounded-3xl bg-neutral-900/40 border border-white/[0.08] backdrop-blur-xl max-w-3xl mx-auto p-8 shadow-xl shadow-black/40">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 shadow-md shadow-blue-500/10">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-sans">
                  Catalog Cleaned &amp; Ready for Products
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mt-1.5 leading-relaxed">
                  All temporary mock items have been removed. Explore your dedicated category pages below or open the backend manager to add your first real digital products.
                </p>
              </div>

              {/* Dedicated Category Page Shortcuts */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 border border-white/10 text-xs font-semibold text-neutral-200 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <span>{cat.name}</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                  </Link>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Open Merchant Backend to Add Products</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-4.5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BUNDLE & SAVE ENGINE SHOWCASE SECTION (Visible when bundles are configured) */}
      {MOCK_PRODUCT_BUNDLES.length > 0 && (
        <section className="py-20 bg-[#080a10] border-t border-white/[0.08] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                High-Value Digital Combos
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
                Bundle &amp; Save Engine
              </h2>
              <p className="text-sm text-neutral-400 mt-2 max-w-xl">
                Combine top-tier WordPress optimization licenses or essential software packages with automated tiered bundle savings.
              </p>
            </div>

            <div className="space-y-8">
              <BundleSaveEngine bundleId="bundle-wp-trifecta" />
              <BundleSaveEngine bundleId="bundle-software-power" />
            </div>
          </div>
        </section>
      )}

      {/* WHY CHOOSE US CALLOUT BANNER */}
      <section className="py-20 border-t border-white/[0.08] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-white/10 relative overflow-hidden">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">
                The Security Difference
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                Official Agency Allocations. Zero GPL Bloat. Zero Risk.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Unlike questionable download sites offering cracked or nulled files containing malware,
                NEXUS provides 100% genuine agency activations directly connected to official vendor
                servers for automatic WordPress dashboard updates.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/#catalog"
                  className="px-5 py-3 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 transition-colors"
                >
                  Browse Verified Catalog
                </Link>
                <Link
                  href="/support"
                  className="px-5 py-3 rounded-xl bg-white/[0.08] text-white font-semibold text-xs border border-white/10 hover:bg-white/[0.12] transition-colors"
                >
                  Ask Technical Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
