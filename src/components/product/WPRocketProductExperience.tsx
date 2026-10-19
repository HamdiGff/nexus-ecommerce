"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  Gauge,
  Flame,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Sparkles,
  Layers,
  ChevronDown,
  ArrowRight,
  Database,
  Code,
  FileCode,
  Clock,
  Smartphone,
  Laptop,
  Check,
  HelpCircle,
  Sliders,
  Server,
  Cpu,
  RefreshCw,
  ShoppingBag,
  Plus,
  Minus,
  MessageSquare,
  Shield,
  LifeBuoy,
} from "lucide-react";

export default function WPRocketProductExperience() {
  // Speed Simulator State
  const [activeSpeedMode, setActiveSpeedMode] = useState<"AFTER" | "BEFORE">("AFTER");
  const [activeCwvTab, setActiveCwvTab] = useState<"LCP" | "INP" | "CLS" | "TTFB">("LCP");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-12 pt-4">
      {/* 1. HERO ACCELERATOR BADGE & HEADLINE */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-bold tracking-wide">
          <Flame className="w-4 h-4 fill-orange-400 text-orange-400" />
          <span>OFFICIAL WP ROCKET AGENCY ACCELERATOR</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          Turn Sluggish WordPress Sites into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
            99+ PageSpeed Rockets
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl mx-auto">
          Over 4,300,000+ websites worldwide rely on WP Rocket. Experience instant caching, cloud-powered Remove Unused CSS, and smart script deferral with zero coding needed.
        </p>
      </div>

      {/* 2. INTERACTIVE GOOGLE PAGESPEED SIMULATOR */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#151120] via-[#0f0c18] to-[#0a0812] border border-orange-500/20 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 blur-[120px] pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 font-mono">
                Live Interactive Lab
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                Core Web Vitals 2026 Audit
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Test the WP Rocket Speed Impact
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Toggle between standard default WordPress and WP Rocket Pro optimization to compare simulated Lighthouse audits.
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex p-1 rounded-2xl bg-neutral-950/80 border border-white/10 shrink-0">
            <button
              onClick={() => setActiveSpeedMode("BEFORE")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSpeedMode === "BEFORE"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Before (Default WP)</span>
            </button>
            <button
              onClick={() => setActiveSpeedMode("AFTER")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSpeedMode === "AFTER"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-black text-black" />
              <span>With WP Rocket Pro</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8 items-center">
          {/* Main Speed Score Gauge */}
          <div className="md:col-span-5 p-6 rounded-2xl bg-neutral-950/60 border border-white/[0.08] flex flex-col items-center text-center">
            <div className="relative w-36 h-36 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="#262626"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke={activeSpeedMode === "AFTER" ? "#22c55e" : "#ef4444"}
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={activeSpeedMode === "AFTER" ? "6" : "165"}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span
                  className={`font-mono text-4xl font-black ${
                    activeSpeedMode === "AFTER" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {activeSpeedMode === "AFTER" ? "99" : "38"}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">/ 100</span>
              </div>
            </div>

            <div className="mt-2 space-y-1">
              <span
                className={`text-xs font-extrabold uppercase tracking-wide block ${
                  activeSpeedMode === "AFTER" ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {activeSpeedMode === "AFTER" ? "Google Mobile Score: PASSED" : "Google Mobile Score: POOR"}
              </span>
              <p className="text-[11px] text-neutral-400 max-w-xs">
                {activeSpeedMode === "AFTER"
                  ? "Meets Google Core Web Vitals criteria with zero render-blocking files."
                  : "Excessive render-blocking CSS, unoptimized scripts, and heavy DOM payload."}
              </p>
            </div>
          </div>

          {/* Core Web Vitals Breakdown Table */}
          <div className="md:col-span-7 grid grid-cols-2 gap-3.5">
            {/* LCP */}
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/[0.08] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-400 font-medium">Largest Contentful Paint</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${activeSpeedMode === "AFTER" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                  {activeSpeedMode === "AFTER" ? "GOOD" : "POOR"}
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {activeSpeedMode === "AFTER" ? "0.78s" : "4.62s"}
              </div>
              <span className="text-[10px] text-neutral-500 block">
                {activeSpeedMode === "AFTER" ? "Cloud RUCSS generated" : "Render-blocking stylesheet delay"}
              </span>
            </div>

            {/* INP */}
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/[0.08] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-400 font-medium">Interaction to Next Paint</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${activeSpeedMode === "AFTER" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                  {activeSpeedMode === "AFTER" ? "GOOD" : "POOR"}
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {activeSpeedMode === "AFTER" ? "42ms" : "480ms"}
              </div>
              <span className="text-[10px] text-neutral-500 block">
                {activeSpeedMode === "AFTER" ? "Delayed JavaScript execution" : "Main thread blocked by heavy JS"}
              </span>
            </div>

            {/* TTFB */}
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/[0.08] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-400 font-medium">Time to First Byte</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${activeSpeedMode === "AFTER" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                  {activeSpeedMode === "AFTER" ? "FAST" : "SLOW"}
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {activeSpeedMode === "AFTER" ? "0.18s" : "1.95s"}
              </div>
              <span className="text-[10px] text-neutral-500 block">
                {activeSpeedMode === "AFTER" ? "Instant static HTML disk cache" : "Heavy PHP/MySQL database queries"}
              </span>
            </div>

            {/* CLS */}
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/[0.08] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-400 font-medium">Cumulative Layout Shift</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${activeSpeedMode === "AFTER" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                  {activeSpeedMode === "AFTER" ? "PASSED" : "FAILED"}
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {activeSpeedMode === "AFTER" ? "0.005" : "0.312"}
              </div>
              <span className="text-[10px] text-neutral-500 block">
                {activeSpeedMode === "AFTER" ? "Image dimensions preserved" : "Unreserved banners & shifted fonts"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CORE WEB VITALS OPTIMIZATION DEEP-DIVE TABS */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 font-mono">
            How WP Rocket Fixes Your Site
          </span>
          <h3 className="text-2xl font-extrabold text-white mt-1">
            Engineered for Google&apos;s Core Web Vitals Ranking Factor
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Google uses Core Web Vitals as a direct SEO ranking signal. Click each metric below to learn how WP Rocket automates full compliance.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "LCP", title: "LCP (Largest Contentful Paint)", metric: "Target: < 2.5s" },
            { id: "INP", title: "INP (Interaction to Next Paint)", metric: "Target: < 200ms" },
            { id: "CLS", title: "CLS (Cumulative Layout Shift)", metric: "Target: < 0.1" },
            { id: "TTFB", title: "TTFB (Server Response Time)", metric: "Target: < 0.8s" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCwvTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeCwvTab === tab.id
                  ? "bg-orange-500/15 border-orange-500/40 text-orange-300 shadow-md shadow-orange-500/10"
                  : "bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white"
              }`}
            >
              <span>{tab.title}</span>
              <span className="ml-2 text-[10px] font-mono opacity-60">({tab.metric})</span>
            </button>
          ))}
        </div>

        {/* Tab Content Cards */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0f111a] border border-white/[0.08] space-y-4">
          {activeCwvTab === "LCP" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  CRITICAL CSS & RENDER-BLOCKING ELIMINATION
                </span>
                <h4 className="text-xl font-bold text-white">
                  Remove Unused CSS (Cloud RUCSS) on Autopilot
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  The primary cause of poor LCP is render-blocking stylesheets from themes and plugins. WP Rocket connects to high-speed cloud nodes that analyze each page, extract only the CSS necessary for above-the-fold content, and inlines it directly in the HTML.
                </p>
                <ul className="space-y-2 text-xs text-neutral-300 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Reduces stylesheet payload by up to 85%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Eliminates Google Lighthouse &quot;Eliminate render-blocking resources&quot; warning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Automatic background cloud regeneration when pages are updated</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-[#090a0f] border border-white/10 font-mono text-xs space-y-2 text-neutral-300">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] text-neutral-500">
                  <span>Cloud RUCSS Worker</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>
                <div className="text-neutral-500">// Before WP Rocket</div>
                <div className="text-rose-400 line-through">&lt;link rel=&quot;stylesheet&quot; href=&quot;elementor-heavy.css&quot;&gt; (340 KB)</div>
                <div className="text-neutral-500 pt-2">// After WP Rocket Cloud Inlining</div>
                <div className="text-emerald-300 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  &lt;style id=&quot;wpr-critical-css&quot;&gt;/* Inlined 12KB critical path */&lt;/style&gt;
                </div>
                <div className="text-[11px] text-neutral-400 pt-1">
                  Remaining 328 KB asynchronously loaded in background with zero main-thread blockage.
                </div>
              </div>
            </div>
          )}

          {activeCwvTab === "INP" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  INTERACTION TO NEXT PAINT (INP) DEFENDER
                </span>
                <h4 className="text-xl font-bold text-white">
                  Delay JavaScript Execution Until User Interaction
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Heavy scripts like Google Tag Manager, Facebook Pixel, live chats, and ad networks overwhelm the mobile browser&apos;s main thread. WP Rocket intelligently freezes script execution until the user scrolls, moves their mouse, or touches the screen.
                </p>
                <ul className="space-y-2 text-xs text-neutral-300 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Instant initial paint without frozen mobile browsers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Passed Google&apos;s strict new INP metric introduced in 2024–2026</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Pre-configured safe exclusion list for WooCommerce carts and menu toggles</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-[#090a0f] border border-white/10 font-mono text-xs space-y-2 text-neutral-300">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] text-neutral-500">
                  <span>JS Execution Pipeline</span>
                  <span className="text-amber-400">OPTIMIZED</span>
                </div>
                <div className="text-neutral-400">Total Blocking Time (TBT): <span className="text-emerald-400 font-bold">0 ms</span> (was 1,240 ms)</div>
                <div className="text-neutral-400">Deferred Analytics: <span className="text-white">gtag.js, fbevents.js, hotjar.js</span></div>
                <div className="text-neutral-400">Trigger: <span className="text-orange-400">touch / scroll / keydown event</span></div>
                <div className="p-3 bg-white/[0.02] rounded-xl border border-white/10 text-[11px] text-neutral-300 mt-2">
                  &quot;Resulted in an immediate +42 point jump on Google Lighthouse Mobile audit within 60 seconds of enabling.&quot;
                </div>
              </div>
            </div>
          )}

          {activeCwvTab === "CLS" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  LAYOUT STABILITY ENGINE
                </span>
                <h4 className="text-xl font-bold text-white">
                  Eliminate Visual Layout Shifts with Dimension Injection
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  When images and embedded videos load without explicit width and height dimensions, text jolts down the screen, frustrating users and failing Google CLS. WP Rocket automatically scans your media and injects exact dimensions on the fly.
                </p>
                <ul className="space-y-2 text-xs text-neutral-300 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Automatic missing image dimension attributes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>YouTube iframe placeholder facade saves 600KB+ per video</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Self-hosts Google Fonts locally to prevent font swap layout shifts</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-[#090a0f] border border-white/10 font-mono text-xs space-y-3 text-neutral-300">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] text-neutral-500">
                  <span>CLS Score Monitor</span>
                  <span className="text-emerald-400">0.002 (EXCELLENT)</span>
                </div>
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300">
                  ✔ Image Aspect Ratio Pre-Allocated
                </div>
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300">
                  ✔ Font-Display: Swap Normalized
                </div>
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300">
                  ✔ Responsive Iframe Box Preserved
                </div>
              </div>
            </div>
          )}

          {activeCwvTab === "TTFB" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  HIGH-SPEED STATIC CACHING
                </span>
                <h4 className="text-xl font-bold text-white">
                  Ultra-Fast Server Caching with Sitemap Preloading
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Instead of forcing Apache or Nginx to execute hundreds of PHP scripts and MySQL database queries every time a visitor arrives, WP Rocket generates static HTML files. The server serves these cached files in under 200 milliseconds.
                </p>
                <ul className="space-y-2 text-xs text-neutral-300 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Reduces server CPU and memory usage by over 70%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Automatic cache preloading from XML sitemaps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Separate dedicated caching for mobile devices</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-[#090a0f] border border-white/10 font-mono text-xs space-y-2 text-neutral-300">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] text-neutral-500">
                  <span>Response Time Benchmark</span>
                  <span className="text-emerald-400">&lt; 180 ms</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Without WP Rocket (PHP/DB Exec)</span>
                    <span className="text-rose-400 font-bold">1,950 ms</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[95%]" />
                  </div>
                </div>
                <div className="space-y-1.5 pt-3">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">With WP Rocket Static HTML</span>
                    <span className="text-emerald-400 font-bold">180 ms</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[9%]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. COMPARISON MATRIX: WP ROCKET VS FREE CACHING */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 font-mono">
            Direct Plugin Comparison
          </span>
          <h3 className="text-2xl font-extrabold text-white mt-1">
            Why WP Rocket Outperforms Free Caching Plugins
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Free plugins often require hours of confusing configuration and frequently break page styling. Here is how WP Rocket compares.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/[0.08] bg-[#0c0e15]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="p-4 sm:p-5 font-bold text-white">Performance Feature</th>
                <th className="p-4 sm:p-5 font-extrabold text-orange-400 bg-orange-500/10 border-x border-orange-500/20">
                  🚀 WP Rocket Pro
                </th>
                <th className="p-4 sm:p-5 font-bold text-neutral-400">W3 Total Cache</th>
                <th className="p-4 sm:p-5 font-bold text-neutral-400">WP Super Cache</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-neutral-300">
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-white">Cloud Remove Unused CSS (RUCSS)</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-orange-500/[0.04] border-x border-orange-500/20">
                  ✔ Automated via Cloud Nodes
                </td>
                <td className="p-4 sm:p-5 text-neutral-500">❌ Not Available</td>
                <td className="p-4 sm:p-5 text-neutral-500">❌ Not Available</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-white">Delay JavaScript Execution (Fix INP)</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-orange-500/[0.04] border-x border-orange-500/20">
                  ✔ Built-in Safe Delay
                </td>
                <td className="p-4 sm:p-5 text-neutral-500">❌ Requires Complex Addons</td>
                <td className="p-4 sm:p-5 text-neutral-500">❌ Not Available</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-white">Automatic Sitemap Cache Preload</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-orange-500/[0.04] border-x border-orange-500/20">
                  ✔ 1-Click Sitemap Sync
                </td>
                <td className="p-4 sm:p-5 text-neutral-400">⚠️ Manual Cron Required</td>
                <td className="p-4 sm:p-5 text-neutral-400">⚠️ Basic Preload Only</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-white">YouTube &amp; Iframe Lazy Load Preview</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-orange-500/[0.04] border-x border-orange-500/20">
                  ✔ Saves 600KB+ per embed
                </td>
                <td className="p-4 sm:p-5 text-neutral-500">❌ Not Available</td>
                <td className="p-4 sm:p-5 text-neutral-500">❌ Not Available</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-white">Automatic Database Maintenance</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-orange-500/[0.04] border-x border-orange-500/20">
                  ✔ Scheduled Auto-Purge
                </td>
                <td className="p-4 sm:p-5 text-neutral-500">❌ Requires Separate Plugin</td>
                <td className="p-4 sm:p-5 text-neutral-500">❌ Not Available</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-white">Zero-Configuration Setup Time</td>
                <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-orange-500/[0.04] border-x border-orange-500/20">
                  ✔ Under 3 Minutes
                </td>
                <td className="p-4 sm:p-5 text-neutral-400">⚠️ 45+ min complex settings</td>
                <td className="p-4 sm:p-5 text-neutral-400">⚠️ Moderate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. HOSTING & PAGE BUILDER COMPATIBILITY GRID */}
      <div className="rounded-3xl p-6 sm:p-8 bg-neutral-900/40 border border-white/[0.08] space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 font-mono">
            Compatibility Verified
          </span>
          <h3 className="text-xl font-bold text-white mt-1">
            Works Harmoniously with Your Hosting Stack &amp; Page Builder
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-lg">
            Tested and certified across all major WordPress hosting infrastructures and modern visual page builders.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
            <span className="text-orange-400 font-bold block">Page Builders</span>
            <span className="text-neutral-300 block">Elementor, Divi, Bricks, Astra, GeneratePress, Oxygen</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
            <span className="text-emerald-400 font-bold block">Hosting Providers</span>
            <span className="text-neutral-300 block">Cloudways, SiteGround, Hostinger, Kinsta, WP Engine, cPanel</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
            <span className="text-blue-400 font-bold block">eCommerce</span>
            <span className="text-neutral-300 block">WooCommerce, Easy Digital Downloads, CartFlows</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
            <span className="text-purple-400 font-bold block">PHP &amp; Environment</span>
            <span className="text-neutral-300 block">PHP 7.4 through 8.3+, Apache, Nginx &amp; LiteSpeed</span>
          </div>
        </div>
      </div>

      {/* 6. HOW ACTIVATION WORKS */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-orange-950/20 via-neutral-900/40 to-amber-950/20 border border-orange-500/20 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Official Agency Activation &amp; Automatic Updates
            </h3>
            <p className="text-xs text-neutral-400">
              100% Genuine Official License • Clean Code Guaranteed • Zero Risk of Site Compromise
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-white/10 space-y-2">
            <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 font-bold font-mono flex items-center justify-center text-xs">1</span>
            <h4 className="font-bold text-white">Choose Your Site Tier</h4>
            <p className="text-neutral-400 leading-relaxed">
              Select 1 Website ($15), 3 Websites ($32), or 5 Websites ($49) and proceed through checkout.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-white/10 space-y-2">
            <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 font-bold font-mono flex items-center justify-center text-xs">2</span>
            <h4 className="font-bold text-white">Provide Temporary Admin Link</h4>
            <p className="text-neutral-400 leading-relaxed">
              Input your WordPress wp-admin URL and a temporary technician password inside your secure order portal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-white/10 space-y-2">
            <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 font-bold font-mono flex items-center justify-center text-xs">3</span>
            <h4 className="font-bold text-white">Automatic Dashboard Updates</h4>
            <p className="text-neutral-400 leading-relaxed">
              Our automated system activates the official license on your domain. Updates appear natively in your WP dashboard for 1 full year.
            </p>
          </div>
        </div>
      </div>

      {/* 7. FREQUENTLY ASKED QUESTIONS — REDESIGNED & MODERN */}
      <div className="space-y-8 pt-4">
        {/* Section Header with Stats & Live Support Chip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold tracking-wide border border-orange-500/20">
              <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Everything You Need to Know
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
              Clear answers regarding licensing authenticity, updates, compatibility, and multi-domain activation.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link
              href="/support"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-neutral-200 hover:text-white transition-all shadow-sm"
            >
              <LifeBuoy className="w-4 h-4 text-orange-400" />
              <span>Have More Questions?</span>
            </Link>
          </div>
        </div>

        {/* Modern Interactive FAQ Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              category: "AUTHENTICITY & SAFETY",
              catColor: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
              q: "Is this a genuine official license or GPL / nulled?",
              a: "100% genuine agency license procured through official developer channels. It is NEVER nulled, cracked, or modified. You receive authentic domain authorization with direct, native 1-click updates inside your WordPress dashboard.",
              highlight: "Zero security risk • Full developer code integrity",
            },
            {
              category: "DASHBOARD UPDATES",
              catColor: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
              q: "How do updates work for the 1-year duration?",
              a: "Whenever WP Rocket releases an update (e.g. version 3.16 to 3.17), notification prompts appear natively in your WordPress admin panel under Plugins. Click 'Update Now' just like any direct retail license—no manual file downloads or re-uploading needed.",
              highlight: "Native WordPress 1-click update flow",
            },
            {
              category: "STABILITY & THEMES",
              catColor: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
              q: "Will WP Rocket break my website styling or layout?",
              a: "WP Rocket is renowned for industry-leading stability. If any complex third-party JavaScript interacts unpredictably with 'Delay JS Execution', WP Rocket features built-in 1-click exclusions so you can bypass specific scripts while keeping 99+ speed intact.",
              highlight: "Built-in 1-click safe exclusion list",
            },
            {
              category: "MULTI-SITE TIERS",
              catColor: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
              q: "How does the 3x or 5x Websites pack work?",
              a: "Purchasing a 3-site or 5-site tier allows you to activate WP Rocket on multiple distinct domain names or client projects. You can activate them all together or spread activations out throughout the entire year as you build new client websites.",
              highlight: "Spread activations out anytime across 1 year",
            },
            {
              category: "ECOMMERCE OPTIMIZED",
              catColor: "from-teal-500/20 to-cyan-500/20 text-teal-400 border-teal-500/30",
              q: "Is WP Rocket fully compatible with WooCommerce?",
              a: "Yes! WP Rocket includes native WooCommerce detection. Critical customer routes like Cart, Checkout, and My Account are automatically excluded from static caching to ensure shopping sessions, cart items, and transactions never experience glitches.",
              highlight: "Automatic WooCommerce & checkout exclusions",
            },
            {
              category: "SETUP ASSISTANCE",
              catColor: "from-orange-500/20 to-rose-500/20 text-orange-400 border-orange-500/30",
              q: "What if I need help configuring WP Rocket for maximum speed?",
              a: "Our speed optimization specialists are available via live ticket desk. We can analyze your current theme (Elementor, Divi, Bricks, Astra) and fine-tune your WP Rocket settings for peak PageSpeed 95+ scores at no additional cost.",
              highlight: "Free complimentary configuration tuning included",
            },
          ].map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => toggleFaq(idx)}
                className={`group cursor-pointer rounded-3xl p-6 transition-all duration-200 border text-left relative overflow-hidden flex flex-col justify-between ${
                  isOpen
                    ? "bg-gradient-to-b from-[#161426] via-[#100f1c] to-[#0c0b15] border-orange-500/40 shadow-xl shadow-orange-500/5 ring-1 ring-orange-500/20"
                    : "bg-[#0d0e16]/80 hover:bg-[#121422] border-white/[0.07] hover:border-white/15"
                }`}
              >
                {/* Glow pill behind active card */}
                {isOpen && (
                  <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 blur-3xl pointer-events-none -z-10" />
                )}

                <div>
                  {/* Category Pill + Toggle Button */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span
                      className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border bg-gradient-to-r ${faq.catColor}`}
                    >
                      {faq.category}
                    </span>

                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        isOpen
                          ? "bg-orange-500 text-white shadow-md shadow-orange-500/30 rotate-180"
                          : "bg-white/[0.04] text-neutral-400 group-hover:text-white group-hover:bg-white/[0.08]"
                      }`}
                    >
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {/* Question */}
                  <h4
                    className={`font-bold text-sm sm:text-base leading-snug transition-colors ${
                      isOpen ? "text-white" : "text-neutral-200 group-hover:text-white"
                    }`}
                  >
                    {faq.q}
                  </h4>

                  {/* Answer (Expands smoothly) */}
                  {isOpen && (
                    <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                        {faq.a}
                      </p>

                      {/* Highlight Badge */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[11px] font-medium text-orange-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>{faq.highlight}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer preview state when collapsed */}
                {!isOpen && (
                  <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="truncate">{faq.highlight}</span>
                    <span className="text-orange-400 font-semibold text-[10px] uppercase tracking-wider shrink-0 ml-2">
                      Click to expand
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Trust & Guarantee Banner beneath FAQ */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-purple-500/5 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                30-Day Happiness &amp; Activation Guarantee
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                If your site cannot be activated or WP Rocket does not improve your PageSpeed, our support team will resolve it or refund your payment.
              </p>
            </div>
          </div>

          <Link
            href="/checkout"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-xs hover:brightness-110 transition-all shrink-0 shadow-lg shadow-orange-500/20"
          >
            Get WP Rocket for $15
          </Link>
        </div>
      </div>
    </div>
  );
}
