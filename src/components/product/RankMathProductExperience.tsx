"use client";

import { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Layers,
  ChevronDown,
  ArrowRight,
  Database,
  Code,
  FileCode,
  Globe,
  Star,
  Zap,
  ShoppingBag,
  HelpCircle,
  Eye,
  BarChart3,
  ExternalLink,
  Sliders,
  Check,
  Lock,
  MessageSquare,
  AlertCircle,
  Image as ImageIcon,
  Compass,
} from "lucide-react";

export default function RankMathProductExperience() {
  // Interactive Rich Snippet Simulator State
  const [activeSchemaTab, setActiveSchemaTab] = useState<"PRODUCT" | "FAQ" | "ARTICLE" | "RECIPE">("PRODUCT");
  const [activeComparisonTab, setActiveComparisonTab] = useState<"CORE" | "FEATURES" | "VALUE">("CORE");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-16 pt-6">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 1. HERO SEO ACCELERATOR BADGE & INTRO */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold tracking-wide">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span>OFFICIAL RANK MATH PRO AGENCY ACCELERATION</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          Dominate Google SERPs with the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            Swiss Army Knife of WordPress SEO
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl mx-auto">
          Rank Math PRO is engineered for modern search algorithms. Unlock automated JSON-LD Schema markup, built-in keyword rank tracking, Google Search Console analytics, and automated image SEO with zero database bloat.
        </p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 2. INTERACTIVE GOOGLE RICH SNIPPET SIMULATOR */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#111728] via-[#0d121f] to-[#080b13] border border-blue-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[130px] pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                Interactive SERP Lab
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                Google Schema.org 2026 Ready
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Google Rich Snippet Live Preview Studio
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Select different structured data types below to preview how Rank Math PRO transforms plain search results into high-converting visual snippets.
            </p>
          </div>

          {/* Schema Type Switcher Buttons */}
          <div className="flex flex-wrap p-1.5 rounded-2xl bg-neutral-950/80 border border-white/10 gap-1">
            <button
              onClick={() => setActiveSchemaTab("PRODUCT")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSchemaTab === "PRODUCT"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Product & Review</span>
            </button>

            <button
              onClick={() => setActiveSchemaTab("FAQ")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSchemaTab === "FAQ"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ Accordion</span>
            </button>

            <button
              onClick={() => setActiveSchemaTab("ARTICLE")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSchemaTab === "ARTICLE"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Article & How-To</span>
            </button>

            <button
              onClick={() => setActiveSchemaTab("RECIPE")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSchemaTab === "RECIPE"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Local & Recipe</span>
            </button>
          </div>
        </div>

        {/* Live SERP Mockup Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-center">
          {/* Visual Google Search Preview Box */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0a0e17] border border-white/[0.08] shadow-inner space-y-4">
            {/* Google Search Bar Mockup */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-neutral-900 border border-white/10 text-xs text-neutral-400">
              <Search className="w-4 h-4 text-neutral-500" />
              <span className="font-sans text-neutral-200 truncate">
                {activeSchemaTab === "PRODUCT" && "best mechanical keyboard for coding and gaming"}
                {activeSchemaTab === "FAQ" && "how to setup rank math pro agency license"}
                {activeSchemaTab === "ARTICLE" && "ultimate guide to wordpress core web vitals 2026"}
                {activeSchemaTab === "RECIPE" && "best authentic italian sourdough pizza recipe"}
              </span>
            </div>

            {/* Rich Snippet Preview Card */}
            <div className="p-5 rounded-2xl bg-[#0d1424] border border-blue-500/40 shadow-xl space-y-3">
              {/* Site URL & Breadcrumb */}
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-bold">
                  ✓
                </span>
                <span className="truncate">https://yourstore.com &gt; catalog &gt; reviews</span>
                <span className="ml-auto text-[10px] text-blue-400 font-sans font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  Rank Math JSON-LD Active
                </span>
              </div>

              {/* Title Link */}
              <h4 className="text-base sm:text-lg font-bold text-blue-400 hover:underline cursor-pointer leading-tight">
                {activeSchemaTab === "PRODUCT" && "Apex Pro Wireless Mechanical Keyboard [Full In-Depth Benchmark]"}
                {activeSchemaTab === "FAQ" && "Rank Math PRO Agency License Setup & 1-Click Update Guide"}
                {activeSchemaTab === "ARTICLE" && "Pass Google Core Web Vitals with 99+ Score: Complete 2026 Blueprint"}
                {activeSchemaTab === "RECIPE" && "Authentic 72-Hour Fermented Neapolitan Sourdough Pizza"}
              </h4>

              {/* DYNAMIC SCHEMA EXTENSIONS */}
              {activeSchemaTab === "PRODUCT" && (
                <div className="flex flex-wrap items-center gap-3 py-1 text-xs">
                  <div className="flex text-amber-400 items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-white text-xs">4.9</span>
                  </div>
                  <span className="text-neutral-400 font-sans text-xs">• 1,248 reviews</span>
                  <span className="text-neutral-300 font-mono font-bold">$179.99</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    In stock
                  </span>
                </div>
              )}

              {activeSchemaTab === "FAQ" && (
                <div className="space-y-2 py-1">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
                    <p className="font-semibold text-neutral-200">Q: Does Rank Math PRO support 1-click dashboard updates?</p>
                    <p className="text-neutral-400 text-[11px] mt-0.5">A: Yes, official agency licenses receive direct updates right in your WordPress plugins screen.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
                    <p className="font-semibold text-neutral-200">Q: Can I import my existing settings from Yoast SEO?</p>
                    <p className="text-neutral-400 text-[11px] mt-0.5">A: Rank Math includes a 1-click seamless importer for all Yoast, AIOSEO, and SEOPress data.</p>
                  </div>
                </div>
              )}

              {activeSchemaTab === "ARTICLE" && (
                <div className="flex items-center gap-3 text-xs text-neutral-400 py-1">
                  <span className="text-neutral-300">By Marcus Vance</span>
                  <span>•</span>
                  <span>Updated 2 days ago</span>
                  <span>•</span>
                  <span className="text-blue-300 font-semibold">12 min read</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px]">How-To Schema</span>
                </div>
              )}

              {activeSchemaTab === "RECIPE" && (
                <div className="flex flex-wrap items-center gap-3 py-1 text-xs text-neutral-300">
                  <div className="flex text-amber-400 items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="font-bold text-white ml-1">5.0</span>
                  </div>
                  <span>• Prep: 20 min</span>
                  <span>• Cook: 90 sec</span>
                  <span>• 320 Cal</span>
                  <span className="text-purple-300 font-medium">Recipe Schema Verified</span>
                </div>
              )}

              {/* Snippet Description */}
              <p className="text-xs text-neutral-300 leading-relaxed">
                {activeSchemaTab === "PRODUCT" && "Experience zero latency Hall Effect switches with up to 40-hour wireless battery life. Includes custom keycap puller, magnetic wrist rest, and full 2-year warranty coverage."}
                {activeSchemaTab === "FAQ" && "Everything you need to know about activating and maintaining your Rank Math PRO agency license on your personal or business WordPress installation with zero downtime."}
                {activeSchemaTab === "ARTICLE" && "Step-by-step masterclass on passing Google Core Web Vitals (LCP, INP, CLS) in 2026. Discover how structured Schema markup and modern caching maximize organic rankings."}
                {activeSchemaTab === "RECIPE" && "Step-by-step guide to crafting authentic Italian high-hydration pizza with crunchy crust and pillowy air pockets using simple household pantry ingredients."}
              </p>
            </div>
          </div>

          {/* Right Statistics & Uplift Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/[0.08] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                SERP Click-Through Impact
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">+285%</span>
                <span className="text-xs text-neutral-400">CTR Growth</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Websites featuring rich snippets with star ratings, pricing, and FAQ accordions capture significantly more visual space on mobile and desktop search screens.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Google Structured Data Tested</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Rank Math PRO outputs 100% compliant JSON-LD syntax that passes Google Structured Data Validator and Rich Results Test without code errors.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-600/10 border border-blue-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>Custom Schema Builder</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Design custom structured data schemas using intuitive condition logic (e.g., apply Product Schema only to specific WooCommerce categories).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 3. CORE PILLARS OF RANK MATH PRO (8 IN-DEPTH HIGHLIGHTS) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Why WordPress Professionals Choose Rank Math PRO
          </h3>
          <p className="text-xs text-neutral-400">
            A complete arsenal of enterprise-grade search engine optimization features packed into a clean, lightweight plugin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Feature 1 */}
          <div className="p-5 rounded-2xl bg-[#10131e] border border-white/[0.08] hover:border-blue-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Advanced Schema Generator</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Generate 20+ types of Schema markup with a few clicks. Supports Multi-Schema per post and custom conditional rule sets.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 rounded-2xl bg-[#10131e] border border-white/[0.08] hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Google Search Console Sync</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              View your top search impressions, keyword clicks, average CTR, and indexing status directly within your WP dashboard.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded-2xl bg-[#10131e] border border-white/[0.08] hover:border-emerald-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Automated Rank Tracker</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Track up to 500 target keyword rankings over time. Monitor position changes, winning keywords, and losing URLs automatically.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-5 rounded-2xl bg-[#10131e] border border-white/[0.08] hover:border-purple-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Automated Image SEO</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Automatically add missing ALT attributes, Title tags, and caption metadata on the fly without cluttering your media database.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-5 rounded-2xl bg-[#10131e] border border-white/[0.08] hover:border-amber-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">WooCommerce Pro SEO</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Clean up product URLs, remove shop bases, auto-generate OpenGraph product tags, and provide rich Schema markup for eCommerce.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-5 rounded-2xl bg-[#10131e] border border-white/[0.08] hover:border-rose-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Redirection & 404 Monitor</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Catch broken links in real time and automatically redirect them with 301, 302, 307, or 410 status codes to preserve link juice.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="p-5 rounded-2xl bg-[#10131e] border border-white/[0.08] hover:border-cyan-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">News & Video Sitemaps</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Generate Google News compatible XML sitemaps and video sitemaps that automatically ping search engines when you hit publish.
            </p>
          </div>

          {/* Feature 8 */}
          <div className="p-5 rounded-2xl bg-[#10131e] border border-white/[0.08] hover:border-teal-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Ultra-Lightweight Architecture</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Modular architecture allows you to toggle only the modules you need. Uses 35% fewer database queries than older SEO plugins.
            </p>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 4. HEAD-TO-HEAD COMPARISON TABLE: RANK MATH PRO VS COMPETITORS */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#10131e] border border-white/[0.08] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Rank Math PRO vs Yoast SEO Premium vs AIOSEO
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Compare features, pricing, and performance to see why Rank Math PRO is the #1 choice.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 self-start sm:self-auto">
            100% Genuine Agency License
          </span>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-neutral-400 font-semibold">
                <th className="py-3 px-4">Feature / Capability</th>
                <th className="py-3 px-4 text-blue-400 font-bold bg-blue-600/[0.06] rounded-t-xl">
                  Rank Math PRO (Just PRO)
                </th>
                <th className="py-3 px-4">Yoast SEO Premium</th>
                <th className="py-3 px-4">All-in-One SEO (AIOSEO)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-neutral-300">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Annual Pricing</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-blue-600/[0.06]">$14.00 / year</td>
                <td className="py-3.5 px-4 text-neutral-400">$99.00 / year</td>
                <td className="py-3.5 px-4 text-neutral-400">$124.00 / year</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Built-in Schema Types</td>
                <td className="py-3.5 px-4 font-bold text-white bg-blue-600/[0.06]">20+ Types (JSON-LD)</td>
                <td className="py-3.5 px-4 text-neutral-400">Limited (Requires addons)</td>
                <td className="py-3.5 px-4 text-neutral-400">Basic Types Only</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Keyword Rank Tracker</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-blue-600/[0.06]">Included (500 Keywords)</td>
                <td className="py-3.5 px-4 text-rose-400">Extra $19/mo (Wincher)</td>
                <td className="py-3.5 px-4 text-rose-400">Requires MonsterInsights</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Automated Image SEO</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-blue-600/[0.06]">Included (Auto ALT/Title)</td>
                <td className="py-3.5 px-4 text-rose-400">Not Available</td>
                <td className="py-3.5 px-4 text-neutral-400">Requires Pro Tier ($199+)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">WooCommerce Advanced SEO</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-blue-600/[0.06]">Fully Included</td>
                <td className="py-3.5 px-4 text-rose-400">Extra $79/yr (WooCommerce Addon)</td>
                <td className="py-3.5 px-4 text-neutral-400">Requires Pro Tier ($199+)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Google Search Console Sync</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-blue-600/[0.06]">Direct Dashboard Widget</td>
                <td className="py-3.5 px-4 text-neutral-400">Basic Integrations</td>
                <td className="py-3.5 px-4 text-neutral-400">Basic Integrations</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Direct 1-Click WP Updates</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-blue-600/[0.06]">Native in WP Dashboard</td>
                <td className="py-3.5 px-4 text-neutral-400">Yes</td>
                <td className="py-3.5 px-4 text-neutral-400">Yes</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Database Footprint</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-blue-600/[0.06]">Modular & Ultra-Light</td>
                <td className="py-3.5 px-4 text-neutral-400">Heavy Table Overhead</td>
                <td className="py-3.5 px-4 text-neutral-400">Moderate Bloat</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 5. OFFICIAL AGENCY SETUP & VERIFICATION GUARANTEE */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-950/40 via-[#10131e] to-purple-950/40 border border-blue-500/25 shadow-2xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">100% Official Agency License Guarantee</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Authentic RankMath.com activation • Clean verified code • Direct repository updates
              </p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5 self-start md:self-auto">
            <Check className="w-3.5 h-3.5" /> Zero GPL or Nulled Hazards
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <span className="text-xs font-mono font-bold text-blue-400">STEP 01</span>
            <h4 className="font-bold text-sm text-white">Provide Temporary Access</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Leave your temporary WordPress admin credentials during checkout. You can create a temporary admin user and revoke access immediately after activation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-400">STEP 02</span>
            <h4 className="font-bold text-sm text-white">Agency Key Attached</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Our technician connects your domain directly to our official Rank Math Agency Account. Activation typically takes 30 to 45 minutes during operational hours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <span className="text-xs font-mono font-bold text-purple-400">STEP 03</span>
            <h4 className="font-bold text-sm text-white">Enjoy Native Updates</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Rank Math PRO appears as active in your dashboard. You receive official one-click updates right in your WordPress admin with full warranty protection.
            </p>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 6. EXTENSIVE HUMAN-WRITTEN FAQ ACCORDION */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-neutral-400">
            Clear, honest answers regarding our Rank Math PRO (Just PRO plan) agency licenses.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {[
            {
              q: "What exactly is the 'Just PRO' plan license?",
              a: "Rank Math officially provides PRO, Business, and Agency tiers. Our 'Just PRO' license provides complete access to all Rank Math PRO features—including the 20+ Schema Generator types, Google Search Console sync, automated Image SEO, rank tracking, and WooCommerce SEO modules—without paying for redundant agency multi-client management features.",
            },
            {
              q: "Will I receive direct 1-click updates in my WordPress dashboard?",
              a: "Yes! Because this is an authentic agency activation directly connected to our Rank Math repository account, you receive official updates directly inside your WordPress 'Plugins' screen just like you would if you purchased directly from Rank Math.",
            },
            {
              q: "Can I safely import my existing SEO settings from Yoast or All-in-One SEO?",
              a: "Yes, 100%! Rank Math includes an automated 1-click import wizard. It imports all your existing meta titles, meta descriptions, OpenGraph social cards, redirects, and robots directives without losing a single ranking or breaking your URLs.",
            },
            {
              q: "Is it safe to share temporary WordPress admin credentials?",
              a: "Yes. We recommend installing the free 'Temporary Login Without Password' plugin or creating a fresh administrator account named 'nexus-setup'. Once our technician finishes activation and notifies you, you can instantly delete the account. We never store passwords or access your customer data.",
            },
            {
              q: "What happens after the 1-year activation period expires?",
              a: "Your website and Schema structured data will continue to function normally and your rankings will remain intact. If you wish to continue receiving new feature updates and rank tracker sync, you can simply renew your license with us at our discounted renewal rate.",
            },
            {
              q: "Can I use Rank Math PRO alongside WP Rocket?",
              a: "Absolutely! WP Rocket and Rank Math PRO are designed to complement each other. WP Rocket handles caching, CSS/JS minification, and Google Core Web Vitals speed, while Rank Math PRO handles Schema markup, XML sitemaps, and search engine rankings. Check out our bundle discount to save 15% on both!",
            },
          ].map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#10131e] border border-white/[0.08] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="font-bold text-sm text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-blue-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-neutral-400 leading-relaxed border-t border-white/[0.04] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
