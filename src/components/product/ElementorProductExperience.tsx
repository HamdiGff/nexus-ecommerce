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
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Palette,
  MousePointer,
  FormInput,
  Repeat,
  Maximize2,
} from "lucide-react";

export default function ElementorProductExperience() {
  // Interactive Studio Tab
  const [activeBuilderTab, setActiveBuilderTab] = useState<"THEME" | "WOO" | "FORMS" | "LOOP">("THEME");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-16 pt-6">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 1. HERO BUILDER ACCELERATOR INTRO */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-red-500/10 border border-rose-500/25 text-rose-400 text-xs font-bold tracking-wide">
          <Palette className="w-4 h-4 text-rose-400" />
          <span>OFFICIAL ELEMENTOR PRO AGENCY EMPOWERMENT</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          Design Pixel-Perfect WordPress Sites with the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-red-400">
            Global Standard Visual Builder
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl mx-auto">
          Over 16,000,000+ creators and web agencies trust Elementor Pro. Craft dynamic headers, footers, custom WooCommerce stores, multi-step forms, and loop grids with zero coding needed.
        </p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 2. INTERACTIVE VISUAL BUILDER STUDIO */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#180a14] via-[#110710] to-[#0a050a] border border-rose-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/10 blur-[130px] pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
                Interactive Canvas Lab
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                Elementor Pro 3.28 Live Preview
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Test Elementor Pro Dynamic Visual Builders
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Select different building modules below to preview how Elementor Pro controls your website layout.
            </p>
          </div>

          {/* Builder Switcher Buttons */}
          <div className="flex flex-wrap p-1.5 rounded-2xl bg-neutral-950/80 border border-white/10 gap-1">
            <button
              onClick={() => setActiveBuilderTab("THEME")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeBuilderTab === "THEME"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Theme Builder</span>
            </button>

            <button
              onClick={() => setActiveBuilderTab("WOO")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeBuilderTab === "WOO"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>WooCommerce Pro</span>
            </button>

            <button
              onClick={() => setActiveBuilderTab("FORMS")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeBuilderTab === "FORMS"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <FormInput className="w-3.5 h-3.5" />
              <span>Forms &amp; Popups</span>
            </button>

            <button
              onClick={() => setActiveBuilderTab("LOOP")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeBuilderTab === "LOOP"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Loop Grid &amp; ACF</span>
            </button>
          </div>
        </div>

        {/* Live Canvas Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-center">
          {/* Main Visual Canvas Area */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0c050b] border border-white/[0.08] shadow-inner space-y-4">
            {/* Top Browser Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-full bg-neutral-900 border border-white/10 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-[11px] text-neutral-300">
                {activeBuilderTab === "THEME" && "yourdomain.com/ [Global Theme Builder Active]"}
                {activeBuilderTab === "WOO" && "yourdomain.com/shop/pro-mechanical-keyboard [WooCommerce Shop Builder]"}
                {activeBuilderTab === "FORMS" && "yourdomain.com/contact [Multi-Step Lead Generator]"}
                {activeBuilderTab === "LOOP" && "yourdomain.com/properties [ACF Dynamic Loop Grid]"}
              </span>
              <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full">
                Live Preview
              </span>
            </div>

            {/* Canvas Preview Container */}
            <div className="p-5 rounded-2xl bg-[#140713] border border-rose-500/40 shadow-xl space-y-4">
              {/* TAB 1: THEME BUILDER (HEADER, CONTENT, FOOTER) */}
              {activeBuilderTab === "THEME" && (
                <div className="space-y-3">
                  {/* Sticky Header Mock */}
                  <div className="p-3 rounded-xl bg-black/50 border border-rose-500/30 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-white tracking-wider text-sm text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                      NEXUS.STUDIO
                    </span>
                    <div className="flex gap-4 text-neutral-400 text-[11px] font-medium">
                      <span className="text-white">Services</span>
                      <span>Portfolio</span>
                      <span>Case Studies</span>
                      <span>Blog</span>
                    </div>
                    <button className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-[10px]">
                      Book Strategy Call
                    </button>
                  </div>

                  {/* Hero Section Mock */}
                  <div className="p-6 rounded-xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-black/60 border border-white/[0.06] text-center space-y-2">
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                      Single Post &amp; Archive Template
                    </span>
                    <h5 className="text-lg font-bold text-white">Bespoke Brand Strategy &amp; Digital Experience</h5>
                    <p className="text-xs text-neutral-400 max-w-md mx-auto">
                      Dynamic conditions allow you to deploy this layout across all Category Archives with 1 click.
                    </p>
                  </div>

                  {/* Footer Mock */}
                  <div className="p-3 rounded-xl bg-black/50 border border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-400">
                    <span>© 2026 Global Dynamic Footer Template</span>
                    <span className="text-rose-400">Powered by Elementor Pro Theme Builder</span>
                  </div>
                </div>
              )}

              {/* TAB 2: WOOCOMMERCE BUILDER */}
              {activeBuilderTab === "WOO" && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5 aspect-square rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-4xl">
                    🛍️
                  </div>
                  <div className="sm:col-span-7 space-y-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      WooCommerce Single Product Widget
                    </span>
                    <h5 className="font-bold text-white text-base">Apex Mechanical Wireless Keyboard</h5>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold text-white font-mono">$179.99</span>
                      <span className="text-xs text-neutral-500 line-through font-mono">$249.00</span>
                      <span className="text-[10px] text-rose-400 font-bold bg-rose-500/15 px-2 py-0.5 rounded-full">Save 28%</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Custom gallery, AJAX add-to-cart, custom variations swatches, and dynamic shipping notice.
                    </p>
                    <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30">
                      Add to Bag • Instant AJAX Checkout
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: FORMS & POPUPS */}
              {activeBuilderTab === "FORMS" && (
                <div className="space-y-3 p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Multi-Step Quote Form</span>
                    <span className="text-[10px] text-rose-400 font-mono">Step 2 of 3</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      disabled
                      placeholder="Full Name: Jane Doe"
                      className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-neutral-300"
                    />
                    <input
                      disabled
                      placeholder="Email: jane@enterprise.com"
                      className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-neutral-300"
                    />
                  </div>
                  <input
                    disabled
                    placeholder="Project Budget: $5,000 - $15,000"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-neutral-300"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" /> reCAPTCHA v3 &amp; Webhook Sync
                    </span>
                    <button className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs">
                      Submit Application &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: LOOP BUILDER & ACF */}
              {activeBuilderTab === "LOOP" && (
                <div className="space-y-2.5">
                  <span className="text-[10px] text-rose-400 font-mono font-bold">
                    Custom Post Type Dynamic Query (Real Estate Listings)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-black/40 border border-rose-500/30 space-y-1">
                      <span className="text-xs font-bold text-white">Villa Paradiso</span>
                      <p className="text-[11px] text-emerald-400 font-mono font-bold">$1,250,000 • 5 Bed / 4 Bath</p>
                      <p className="text-[10px] text-neutral-400">ACF: {`{property_location: "Beverly Hills"}`}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-rose-500/30 space-y-1">
                      <span className="text-xs font-bold text-white">Skyline Penthouse</span>
                      <p className="text-[11px] text-emerald-400 font-mono font-bold">$890,000 • 3 Bed / 2 Bath</p>
                      <p className="text-[10px] text-neutral-400">ACF: {`{property_location: "Manhattan"}`}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Statistics & Feature Highlights */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/[0.08] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Eliminates Third-Party Plugins
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-rose-400 font-mono">6-in-1</span>
                <span className="text-xs text-neutral-400">Plugin Suite</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Replace standalone form plugins (Gravity Forms), popup builders (OptinMonster), theme builder tools, and header/footer injectors with a single cohesive engine.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-950/70 border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>300+ Designer Pro Kits</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Unlock instant access to full-website template kits across tech, eCommerce, corporate, food, agency, and creative industries.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-rose-600/10 border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                <Sliders className="w-4 h-4 text-rose-400" />
                <span>Custom CSS &amp; Motion Effects</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Inject custom CSS directly on any widget or column, apply horizontal/vertical parallax scroll, 3D mouse tilt, and Lottie animations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 3. CORE PILLARS OF ELEMENTOR PRO (8 IN-DEPTH HIGHLIGHTS) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            The Complete Elementor Pro Design Architecture
          </h3>
          <p className="text-xs text-neutral-400">
            Everything you need to build award-winning WordPress websites without coding constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Feature 1 */}
          <div className="p-5 rounded-2xl bg-[#120811] border border-white/[0.08] hover:border-rose-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
              <Layout className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Complete Theme Builder</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Design global headers, footers, single post layouts, archive pages, and custom 404 error templates with conditional display rules.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 rounded-2xl bg-[#120811] border border-white/[0.08] hover:border-pink-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">WooCommerce Pro Builder</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Transform standard WooCommerce shops into bespoke stores with custom product pages, dynamic add-to-cart buttons, and checkout pages.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded-2xl bg-[#120811] border border-white/[0.08] hover:border-emerald-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <FormInput className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Advanced Form Builder</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Create multi-step forms, file uploads, date pickers, and direct webhook integrations with Zapier, Mailchimp, and Discord.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-5 rounded-2xl bg-[#120811] border border-white/[0.08] hover:border-purple-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Maximize2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Popup Builder Studio</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Target visitors with exit-intent modals, scroll triggers, promotional discount banners, and login popups with zero coding.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-5 rounded-2xl bg-[#120811] border border-white/[0.08] hover:border-amber-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Repeat className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Loop Grid &amp; Carousel</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Build custom repeater templates for blog posts, products, and custom post types (CPTs) with Advanced Custom Fields (ACF).
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-5 rounded-2xl bg-[#120811] border border-white/[0.08] hover:border-blue-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">100+ Pro Widgets</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Posts, Portfolio, Slides, Animated Headlines, Price Tables, Countdown Timers, Lottie Animations, and Media Carousels.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="p-5 rounded-2xl bg-[#120811] border border-white/[0.08] hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Motion Effects &amp; Parallax</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Add smooth mouse tracking, horizontal/vertical scroll tilt, sticky elements, and interactive animations that delight visitors.
            </p>
          </div>

          {/* Feature 8 */}
          <div className="p-5 rounded-2xl bg-[#120811] border border-white/[0.08] hover:border-cyan-500/40 transition-all space-y-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <Code className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Custom CSS &amp; Code Snippets</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Add custom CSS rules directly to individual widgets or sections. Includes global custom code injection for header/footer scripts.
            </p>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 4. HEAD-TO-HEAD COMPARISON TABLE: ELEMENTOR PRO VS DIVI & BEAVER */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#120811] border border-white/[0.08] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Elementor Pro vs Divi vs Beaver Builder vs WPBakery
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Compare visual builders to see why Elementor Pro commands 72% of modern WordPress professional design.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 self-start sm:self-auto">
            100% Genuine Agency License
          </span>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-neutral-400 font-semibold">
                <th className="py-3 px-4">Feature / Capability</th>
                <th className="py-3 px-4 text-rose-400 font-bold bg-rose-600/[0.06] rounded-t-xl">
                  Elementor Pro
                </th>
                <th className="py-3 px-4">Divi Builder</th>
                <th className="py-3 px-4">Beaver Builder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-neutral-300">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Annual Pricing</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-rose-600/[0.06]">$15.00 / year</td>
                <td className="py-3.5 px-4 text-neutral-400">$89.00 / year</td>
                <td className="py-3.5 px-4 text-neutral-400">$99.00 / year</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Full Theme Builder</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-rose-600/[0.06]">Headers, Footers, 404, Archives</td>
                <td className="py-3.5 px-4 text-neutral-400">Basic Theme Builder</td>
                <td className="py-3.5 px-4 text-rose-400">Requires $149 Themer Addon</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">WooCommerce Shop Builder</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-rose-600/[0.06]">Complete Custom Shop &amp; Checkout</td>
                <td className="py-3.5 px-4 text-neutral-400">Basic WooCommerce Modules</td>
                <td className="py-3.5 px-4 text-rose-400">Requires Extra Addons</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Loop Grid &amp; Dynamic ACF</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-rose-600/[0.06]">Native Visual Loop Builder</td>
                <td className="py-3.5 px-4 text-rose-400">Not Available</td>
                <td className="py-3.5 px-4 text-rose-400">Requires Extra Themer Addon</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Multi-Step Form Builder</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-rose-600/[0.06]">Built-in with Webhooks</td>
                <td className="py-3.5 px-4 text-neutral-400">Basic Contact Form</td>
                <td className="py-3.5 px-4 text-rose-400">Requires Gravity Forms ($59+)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Exit-Intent Popup Builder</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-rose-600/[0.06]">Full Behavioral Popup Engine</td>
                <td className="py-3.5 px-4 text-rose-400">Requires Bloom ($89)</td>
                <td className="py-3.5 px-4 text-rose-400">Requires Third-Party Plugin</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Direct 1-Click WP Updates</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-rose-600/[0.06]">Native in WP Dashboard</td>
                <td className="py-3.5 px-4 text-neutral-400">Yes</td>
                <td className="py-3.5 px-4 text-neutral-400">Yes</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Template Kits Library</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-rose-600/[0.06]">300+ Full Website Kits</td>
                <td className="py-3.5 px-4 text-neutral-400">Layout Packs</td>
                <td className="py-3.5 px-4 text-neutral-400">Basic Templates</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 5. OFFICIAL AGENCY SETUP & VERIFICATION GUARANTEE */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-950/40 via-[#120811] to-purple-950/40 border border-rose-500/25 shadow-2xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">100% Official Agency License Guarantee</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Authentic Elementor.com activation • Clean verified code • Direct repository updates
              </p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5 self-start md:self-auto">
            <Check className="w-3.5 h-3.5" /> Zero GPL or Nulled Hazards
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <span className="text-xs font-mono font-bold text-rose-400">STEP 01</span>
            <h4 className="font-bold text-sm text-white">Provide Temporary Access</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Leave your temporary WordPress admin credentials during checkout. You can create a temporary admin user and revoke access immediately after activation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <span className="text-xs font-mono font-bold text-pink-400">STEP 02</span>
            <h4 className="font-bold text-sm text-white">Agency Key Attached</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Our technician connects your domain directly to our official Elementor Agency Account. Activation typically takes 30 to 45 minutes during operational hours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <span className="text-xs font-mono font-bold text-purple-400">STEP 03</span>
            <h4 className="font-bold text-sm text-white">Enjoy Native Updates</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Elementor Pro appears as active in your dashboard. You receive official one-click updates right in your WordPress admin with full warranty protection.
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
            Clear, honest answers regarding our official Elementor Pro agency licenses.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {[
            {
              q: "Will I receive direct 1-click dashboard updates inside WordPress?",
              a: "Yes, 100%! Because your domain is authenticated directly with our official Elementor Agency Account, you receive native one-click updates directly inside your WordPress 'Plugins' screen as soon as Elementor releases new versions.",
            },
            {
              q: "Does this include the Pro Template Library & Designer Kits?",
              a: "Yes! You get full access to Elementor's Pro Template Library, including 300+ full-website designer kits, pre-designed section blocks, and single-page landing templates.",
            },
            {
              q: "Can I use Elementor Pro alongside WP Rocket and Rank Math PRO?",
              a: "Absolutely! In fact, Elementor Pro + WP Rocket + Rank Math PRO is known in the WordPress developer community as the 'Holy Trinity'. Elementor Pro handles visual design and theme architecture, WP Rocket optimizes caching and Core Web Vitals speed, and Rank Math PRO generates Schema and search engine rankings.",
            },
            {
              q: "What happens to my website designs if I don't renew next year?",
              a: "Your existing website layouts, custom headers, footers, popups, and WooCommerce product pages will continue to look and function exactly as they do. If you wish to continue receiving newly released Elementor Pro features and automatic dashboard updates, you can simply renew at our discounted rate.",
            },
            {
              q: "Is it safe to provide temporary admin login credentials?",
              a: "Yes. You can install the free 'Temporary Login Without Password' plugin or create a temporary administrator account. Once our technician completes activation and emails you, you can instantly delete the temporary account.",
            },
            {
              q: "Is this genuine code or a nulled/GPL file?",
              a: "This is 100% clean, verified, official Elementor Pro code connected directly to Elementor's authentication servers. There are zero nulled files, zero backdoors, and zero GPL risks.",
            },
          ].map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#120811] border border-white/[0.08] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="font-bold text-sm text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-rose-400 shrink-0 transition-transform duration-200 ${
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
