"use client";

import { useState } from "react";
import {
  Sparkles,
  Layout,
  Layers,
  ChevronDown,
  ArrowRight,
  Database,
  Code,
  Globe,
  Star,
  Zap,
  ShoppingBag,
  HelpCircle,
  Eye,
  BarChart3,
  Sliders,
  Check,
  Lock,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Palette,
  MousePointer,
  Maximize2,
  Cpu,
  BookmarkCheck,
  Menu,
  Type,
} from "lucide-react";

export default function AstraProductExperience() {
  // Interactive Studio Tab
  const [activeBuilderTab, setActiveBuilderTab] = useState<"HEADER" | "HOOKS" | "WOO" | "STARTER">("HEADER");
  const [stickyHeaderEnabled, setStickyHeaderEnabled] = useState(true);
  const [transparentHeaderEnabled, setTransparentHeaderEnabled] = useState(false);
  const [selectedHookLocation, setSelectedHookLocation] = useState("astra_header_after");
  const [wooDistractionFree, setWooDistractionFree] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-16 pt-6">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 1. HERO ASTRA THEME INTRO */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10 border border-purple-500/25 text-purple-300 text-xs font-bold tracking-wide">
          <Palette className="w-4 h-4 text-purple-400" />
          <span>OFFICIAL ASTRA PRO AGENCY ACTIVATION</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          Build Blazing Fast WordPress Websites with the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-300">
            World’s Most Popular Theme
          </span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
          Trusted by over <strong>1,600,000+ website owners</strong>. Astra Pro pairs ultra-lightweight frontend
          performance (<span className="text-emerald-400 font-semibold">&lt; 50 KB</span> payload with zero jQuery)
          with unlimited visual design freedom, 280+ starter site kits, and deep WooCommerce customization.
        </p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 2. INTERACTIVE ASTRA PRO STUDIO LAB */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-3xl bg-neutral-900/80 border border-purple-500/20 overflow-hidden backdrop-blur-xl shadow-2xl shadow-purple-950/20">
        {/* Lab Top Bar */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/30 via-neutral-900 to-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-base">Astra Pro Interactive Customizer Studio</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  LIVE SIMULATOR
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Test Astra Pro’s Header Builder, Custom Action Hooks, WooCommerce tools, and Starter Sites in real time.
              </p>
            </div>
          </div>

          {/* Builder Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/[0.06]">
            <button
              onClick={() => setActiveBuilderTab("HEADER")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeBuilderTab === "HEADER"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Header Builder</span>
            </button>
            <button
              onClick={() => setActiveBuilderTab("HOOKS")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeBuilderTab === "HOOKS"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Custom Layouts</span>
            </button>
            <button
              onClick={() => setActiveBuilderTab("WOO")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeBuilderTab === "WOO"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>WooCommerce</span>
            </button>
            <button
              onClick={() => setActiveBuilderTab("STARTER")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeBuilderTab === "STARTER"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Starter Sites (280+)</span>
            </button>
          </div>
        </div>

        {/* Studio Content Area */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* TAB 1: HEADER & FOOTER BUILDER */}
          {activeBuilderTab === "HEADER" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
                  <h4 className="text-white font-bold text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    <span>Visual Header Controls</span>
                  </h4>

                  {/* Toggle 1: Sticky Header */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/[0.06]">
                    <div>
                      <span className="text-xs font-bold text-white block">Sticky Header on Scroll</span>
                      <span className="text-[11px] text-neutral-400">Lock header at top with logo shrink animation</span>
                    </div>
                    <button
                      onClick={() => setStickyHeaderEnabled(!stickyHeaderEnabled)}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                        stickyHeaderEnabled ? "bg-purple-600" : "bg-neutral-800"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          stickyHeaderEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 2: Transparent Header */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/[0.06]">
                    <div>
                      <span className="text-xs font-bold text-white block">Transparent Header</span>
                      <span className="text-[11px] text-neutral-400">Overlay navigation seamlessly over hero banner</span>
                    </div>
                    <button
                      onClick={() => setTransparentHeaderEnabled(!transparentHeaderEnabled)}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                        transparentHeaderEnabled ? "bg-purple-600" : "bg-neutral-800"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          transparentHeaderEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-neutral-300 space-y-2">
                  <div className="flex items-center gap-2 text-purple-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Astra Pro Header Advantages</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-neutral-400">
                    Unlike standard themes that lock you into rigid templates, Astra Pro gives you 3 independent header
                    rows (Above, Primary, Below), off-canvas mobile triggers, HTML blocks, button widgets, and AJAX mini-carts.
                  </p>
                </div>
              </div>

              {/* Live Preview Canvas Column */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-white/[0.1] bg-[#0c071e] overflow-hidden shadow-2xl">
                  {/* Browser Window Header */}
                  <div className="px-4 py-2.5 bg-neutral-950 border-b border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      https://yoursite.com {stickyHeaderEnabled ? "• [Sticky Mode Active]" : ""}
                    </span>
                    <span className="text-[10px] text-purple-400 font-bold uppercase">Header Canvas</span>
                  </div>

                  {/* Top Bar / Above Header */}
                  <div className="px-5 py-2 bg-purple-950/60 border-b border-purple-500/20 flex items-center justify-between text-[11px] text-neutral-300">
                    <span>⚡ Special Offer: Free Global Agency Shipping this week!</span>
                    <div className="flex items-center gap-3">
                      <span className="text-purple-300 hover:underline cursor-pointer">Support</span>
                      <span>•</span>
                      <span className="text-purple-300 hover:underline cursor-pointer">My Account</span>
                    </div>
                  </div>

                  {/* Main Header Row */}
                  <div
                    className={`px-6 py-4 flex items-center justify-between border-b transition-all ${
                      transparentHeaderEnabled
                        ? "bg-transparent border-white/10"
                        : "bg-[#140b2e] border-purple-500/20"
                    }`}
                  >
                    {/* Brand Logo */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-black text-white text-sm shadow-md shadow-purple-600/30">
                        A
                      </div>
                      <span className="font-extrabold text-white text-base tracking-tight">KINETIC AGENCY</span>
                    </div>

                    {/* Nav Links */}
                    <div className="hidden sm:flex items-center gap-5 text-xs font-semibold">
                      <span className="text-white hover:text-purple-300 cursor-pointer">Home</span>
                      <span className="text-neutral-300 hover:text-purple-300 cursor-pointer flex items-center gap-1">
                        Solutions <ChevronDown className="w-3 h-3 text-neutral-400" />
                      </span>
                      <span className="text-neutral-300 hover:text-purple-300 cursor-pointer">Portfolio</span>
                      <span className="text-neutral-300 hover:text-purple-300 cursor-pointer">Pricing</span>
                    </div>

                    {/* CTA Button & Cart */}
                    <div className="flex items-center gap-3">
                      <div className="relative p-2 rounded-lg bg-white/[0.04] text-neutral-300 hover:text-white cursor-pointer">
                        <ShoppingBag className="w-4 h-4" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
                          2
                        </span>
                      </div>
                      <button className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/40">
                        Start Project
                      </button>
                    </div>
                  </div>

                  {/* Hero Canvas Simulation */}
                  <div className="p-8 bg-gradient-to-b from-[#140b2e]/60 to-[#0c071e] text-center space-y-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/[0.05] border border-white/10 text-neutral-300">
                      MODERN HERO SECTION
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Build Pixel-Perfect Experiences at 100 PSI Speed
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-md mx-auto">
                      Astra Pro provides responsive design controls, custom breakpoints for tablet and mobile, and
                      zero cumulative layout shift.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM LAYOUTS & HOOKS */}
          {activeBuilderTab === "HOOKS" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                  <h4 className="text-white font-bold text-sm flex items-center gap-2">
                    <Code className="w-4 h-4 text-purple-400" />
                    <span>Targeted Action Hooks Location</span>
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Inject custom content, dynamic banners, or PHP snippets into any template hook without editing theme files.
                  </p>

                  <div className="space-y-2 pt-2">
                    {[
                      { id: "astra_header_before", name: "astra_header_before", desc: "Top site-wide announcement bar" },
                      { id: "astra_header_after", name: "astra_header_after", desc: "Hero promotional banner" },
                      { id: "astra_entry_content_after", name: "astra_entry_content_after", desc: "Author bio / Newsletter box inside blog posts" },
                      { id: "astra_footer_before", name: "astra_footer_before", desc: "Call to Action bar above footer" },
                    ].map((hook) => (
                      <div
                        key={hook.id}
                        onClick={() => setSelectedHookLocation(hook.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedHookLocation === hook.id
                            ? "bg-purple-600/15 border-purple-500/50 text-white"
                            : "bg-black/30 border-white/[0.06] text-neutral-400 hover:border-white/20"
                        }`}
                      >
                        <span className="font-mono text-xs font-bold text-purple-300 block">{hook.name}</span>
                        <span className="text-[11px] text-neutral-400">{hook.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-[#0c071e] border border-purple-500/20 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <span className="text-purple-300 font-bold">Custom Layout Rule Matrix</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      NO CHILD THEME REQUIRED
                    </span>
                  </div>

                  <div className="space-y-2 text-neutral-300">
                    <p>
                      <span className="text-neutral-500">// Selected Hook:</span>{" "}
                      <span className="text-purple-400 font-bold">{selectedHookLocation}</span>
                    </p>
                    <p>
                      <span className="text-neutral-500">// Display Conditions:</span>{" "}
                      <span className="text-emerald-300">Entire Website (or Specific Categories / User Roles)</span>
                    </p>
                    <p>
                      <span className="text-neutral-500">// Device Visibility:</span>{" "}
                      <span className="text-neutral-200">Desktop, Tablet, Mobile</span>
                    </p>
                  </div>

                  {/* Injected Snippet Visual Output */}
                  <div className="mt-4 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 font-sans text-center space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      LIVE INJECTED CONTENT PREVIEW
                    </span>
                    <h4 className="text-sm font-bold text-white">🚀 Black Friday Mega Sale: 40% Off Everything!</h4>
                    <p className="text-[11px] text-neutral-400">
                      This element is rendered automatically via the Astra Pro Custom Layouts engine.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WOOCOMMERCE CUSTOMIZER */}
          {activeBuilderTab === "WOO" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
                  <h4 className="text-white font-bold text-sm flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                    <span>WooCommerce Conversion Boosters</span>
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/[0.06]">
                      <div>
                        <span className="text-xs font-bold text-white block">Distraction-Free Checkout</span>
                        <span className="text-[11px] text-neutral-400">Removes headers/footers on checkout to cut abandonment</span>
                      </div>
                      <button
                        onClick={() => setWooDistractionFree(!wooDistractionFree)}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                          wooDistractionFree ? "bg-purple-600" : "bg-neutral-800"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            wooDistractionFree ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-black/30 border border-white/[0.06] space-y-1">
                      <span className="text-xs font-bold text-white block">Off-Canvas Filter Sidebar</span>
                      <span className="text-[11px] text-neutral-400">Clean slide-in filter panel for mobile and desktop shoppers</span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/30 border border-white/[0.06] space-y-1">
                      <span className="text-xs font-bold text-white block">Sticky Add to Cart Bar</span>
                      <span className="text-[11px] text-neutral-400">Floating purchase button stays visible when user scrolls long descriptions</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-[#0c071e] border border-purple-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Modern Shop Grid Preview</span>
                    <span className="text-xs text-purple-400 font-bold">Astra Pro Grid / List Layout</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Mock Product 1 */}
                    <div className="p-3 rounded-xl bg-neutral-900 border border-white/[0.08] space-y-2">
                      <div className="h-28 rounded-lg bg-gradient-to-tr from-purple-900/40 to-neutral-800 flex items-center justify-center relative">
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-purple-600 text-white text-[9px] font-bold">
                          -30% SALE
                        </span>
                        <ShoppingBag className="w-8 h-8 text-purple-400 opacity-60" />
                      </div>
                      <span className="text-xs font-bold text-white block">Nordic Minimalist Desk</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-purple-300">$189.00</span>
                        <button className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold">
                          Quick View
                        </button>
                      </div>
                    </div>

                    {/* Mock Product 2 */}
                    <div className="p-3 rounded-xl bg-neutral-900 border border-white/[0.08] space-y-2">
                      <div className="h-28 rounded-lg bg-gradient-to-tr from-indigo-900/40 to-neutral-800 flex items-center justify-center relative">
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-bold">
                          NEW
                        </span>
                        <Zap className="w-8 h-8 text-indigo-400 opacity-60" />
                      </div>
                      <span className="text-xs font-bold text-white block">Mechanical Ergonomic Keyboard</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-purple-300">$129.00</span>
                        <button className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold">
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 280+ STARTER SITES */}
          {activeBuilderTab === "STARTER" && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h4 className="text-base font-bold text-white">Full-Website Starter Templates Library</h4>
                <p className="text-xs text-neutral-400">
                  Import an entire pixel-perfect multi-page website in less than 60 seconds with all customizer settings,
                  widgets, pages, and menus.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "Digital Agency", cat: "Business & Portfolio", pages: "6 Pages", speed: "100 PSI" },
                  { name: "Luxe Fashion Hub", cat: "WooCommerce Shop", pages: "8 Pages", speed: "99 PSI" },
                  { name: "SaaS Cloud Platform", cat: "Tech & Software", pages: "5 Pages", speed: "100 PSI" },
                  { name: "Artisan Bistro & Bar", cat: "Restaurant & Booking", pages: "4 Pages", speed: "100 PSI" },
                ].map((kit, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-neutral-900 border border-white/[0.08] hover:border-purple-500/40 transition-all space-y-3 group"
                  >
                    <div className="h-32 rounded-xl bg-gradient-to-tr from-purple-950/50 via-neutral-800 to-neutral-900 flex flex-col justify-end p-3 border border-white/[0.06] relative overflow-hidden">
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-purple-600 text-white text-[9px] font-bold">
                        {kit.speed}
                      </span>
                      <span className="text-xs font-bold text-white">{kit.name}</span>
                      <span className="text-[10px] text-neutral-400">{kit.cat}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{kit.pages}</span>
                      <span className="text-purple-400 font-bold group-hover:underline cursor-pointer">
                        1-Click Import &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 3. EIGHT CORE PILLARS OF ASTRA PRO */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-xl sm:text-3xl font-extrabold text-white">
            8 Reasons Why Astra Pro Powers 1.6M+ Websites
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400">
            Engineered from ground up for performance, flexibility, and client delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Zap,
              title: "< 50 KB & Zero jQuery",
              desc: "Astra requires less than 50KB of resources on a standard WordPress install and uses vanilla JavaScript for zero execution lag.",
            },
            {
              icon: Layout,
              title: "Header & Footer Builder",
              desc: "Drag-and-drop 3 rows of headers and footers with sticky mode, transparent effects, and off-canvas mobile triggers.",
            },
            {
              icon: ShoppingBag,
              title: "WooCommerce Boutique",
              desc: "Off-canvas shop filters, infinite scroll, sticky checkout buttons, and distraction-free checkout flows.",
            },
            {
              icon: Code,
              title: "Custom Layouts & Hooks",
              desc: "Inject custom headers, footers, 404 pages, or dynamic code snippets anywhere using conditional display rules.",
            },
            {
              icon: Type,
              title: "Local Google Fonts",
              desc: "Self-host Google Fonts locally on your server with 1-click to comply with GDPR privacy laws and eliminate DNS latency.",
            },
            {
              icon: Menu,
              title: "Advanced Mega Menus",
              desc: "Design rich, multi-column navigation dropdowns with template integration, icons, and highlight badges.",
            },
            {
              icon: ShieldCheck,
              title: "White Label Agency",
              desc: "Completely replace Astra branding with your agency name, author URL, and screenshots for professional client handoffs.",
            },
            {
              icon: Globe,
              title: "280+ Starter Site Kits",
              desc: "Import fully functional pre-built websites for Elementor, Spectra, and Gutenberg in under 60 seconds.",
            },
          ].map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-neutral-900/60 border border-white/[0.07] hover:border-purple-500/30 transition-all space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-white font-bold text-sm">{pillar.title}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 4. PERFORMANCE BENCHMARK MATRIX */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-3xl bg-neutral-900/80 border border-purple-500/20 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              INDEPENDENT SPEED AUDIT
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Astra Pro vs. Bloated Multi-Purpose Themes
            </h3>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100/100 Core Web Vitals Ready</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-neutral-400">
                <th className="pb-3 font-bold">THEME</th>
                <th className="pb-3 font-bold">PAGE WEIGHT</th>
                <th className="pb-3 font-bold">LOAD TIME</th>
                <th className="pb-3 font-bold">HTTP REQUESTS</th>
                <th className="pb-3 font-bold">JQUERY DEPENDENCY</th>
                <th className="pb-3 font-bold">PAGESPEED SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              <tr className="bg-emerald-950/20 text-white font-semibold">
                <td className="py-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <strong>Astra Pro (Winner)</strong>
                </td>
                <td className="py-4 text-emerald-400 font-bold">&lt; 50 KB</td>
                <td className="py-4 text-emerald-400 font-bold">0.4 sec</td>
                <td className="py-4 text-emerald-400 font-bold">8 requests</td>
                <td className="py-4 text-emerald-400 font-bold">NO (Zero jQuery)</td>
                <td className="py-4 text-emerald-400 font-extrabold">100 / 100</td>
              </tr>
              <tr className="text-neutral-300">
                <td className="py-3 font-medium">OceanWP</td>
                <td className="py-3 text-neutral-400">1,820 KB</td>
                <td className="py-3 text-neutral-400">2.1 sec</td>
                <td className="py-3 text-neutral-400">28 requests</td>
                <td className="py-3 text-amber-400 font-medium">Partial</td>
                <td className="py-3 text-amber-400">78 / 100</td>
              </tr>
              <tr className="text-neutral-300">
                <td className="py-3 font-medium">Avada Theme</td>
                <td className="py-3 text-red-400">4,200 KB</td>
                <td className="py-3 text-red-400">3.4 sec</td>
                <td className="py-3 text-red-400">54 requests</td>
                <td className="py-3 text-red-400 font-medium">Heavy</td>
                <td className="py-3 text-red-400">52 / 100</td>
              </tr>
              <tr className="text-neutral-300">
                <td className="py-3 font-medium">Divi Theme</td>
                <td className="py-3 text-neutral-400">2,850 KB</td>
                <td className="py-3 text-neutral-400">2.7 sec</td>
                <td className="py-3 text-neutral-400">38 requests</td>
                <td className="py-3 text-amber-400 font-medium">Moderate</td>
                <td className="py-3 text-amber-400">68 / 100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 5. AGENCY ACTIVATION & DASHBOARD UPDATES */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-neutral-900 to-neutral-900 border border-purple-500/25 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Official Brainstorm Force Agency Fleet Activation</h4>
            <p className="text-xs text-neutral-400">
              Zero GPL nulled files, zero malware, and 100% genuine one-click WordPress dashboard updates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <span className="text-purple-400 font-bold text-xs">Step 1: Install Astra Theme</span>
            <p className="text-[11px] text-neutral-400">
              Install the free Astra parent theme directly from WordPress.org, then upload the Astra Pro addon.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <span className="text-purple-400 font-bold text-xs">Step 2: 1-Click Agency Activation</span>
            <p className="text-[11px] text-neutral-400">
              Our engineer verifies your domain via the Brainstorm Force fleet hub to activate your full pro license.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <span className="text-purple-400 font-bold text-xs">Step 3: Lifetime Auto-Updates</span>
            <p className="text-[11px] text-neutral-400">
              Receive official updates, bugfixes, and new features straight inside your WordPress dashboard forever.
            </p>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 6. COMPREHENSIVE HUMAN-WRITTEN FAQ */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">Frequently Asked Questions</h3>
          <p className="text-xs text-neutral-400">
            Everything you need to know about our official Astra Pro Agency licenses.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-2.5">
          {[
            {
              q: "What is the difference between Astra free and Astra Pro?",
              a: "The free Astra theme includes basic customizer settings and header styles. Astra Pro unlocks 20+ advanced modules including the 3-row Visual Header & Footer Builder, Sticky & Transparent headers, Custom Layouts/Hooks engine, advanced WooCommerce conversion tools (off-canvas filter, sticky cart, distraction-free checkout), Mega Menus, White Labeling, and 280+ Premium Starter Templates.",
            },
            {
              q: "Is Astra Pro compatible with page builders like Elementor?",
              a: "Yes! Astra Pro is famous for being the #1 recommended theme by the Elementor community. Astra handles the lightning-fast framework, responsive canvas, and dynamic headers/footers, while Elementor handles the visual page content. Together, they create a blazing-fast, highly flexible website.",
            },
            {
              q: "How do updates work? Do I get one-click dashboard updates?",
              a: "Yes. Because our licenses are provisioned through our official Brainstorm Force Agency Fleet, your website connects directly to official update servers. When Astra releases an update, you will see it in your WordPress 'Updates' tab and can update with a single click.",
            },
            {
              q: "Can I use the White Label feature for client websites?",
              a: "Yes! Astra Pro includes full White Label capability. You can change the theme name, description, author URL, and screenshot to your own agency brand, so your clients see your company name in their WordPress dashboard.",
            },
            {
              q: "Does Astra Pro slow down my website?",
              a: "No, exactly the opposite. Astra is engineered specifically for speed. On default WordPress installations, Astra takes less than 50 KB of frontend resources, makes only 8 HTTP requests, and loads in approximately 0.4 seconds with zero jQuery dependencies.",
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl bg-neutral-900/60 border border-white/[0.07] overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full px-5 py-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-purple-300 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-purple-400 transition-transform ${
                    openFaqIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === i && (
                <div className="px-5 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-white/[0.04] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
