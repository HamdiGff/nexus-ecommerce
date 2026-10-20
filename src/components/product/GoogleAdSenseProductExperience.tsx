"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Globe,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Server,
  DollarSign,
  TrendingUp,
  Building2,
  Award,
  ChevronDown,
  Layers,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Sliders,
  Check,
  Lock,
  FileCheck,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  typicalCpc: string;
  payoutMethods: string[];
  pinStatus: string;
  gamSupport: string;
  badgeColor: string;
  notes: string;
}

const COUNTRIES: CountryConfig[] = [
  {
    code: "USA",
    name: "United States",
    flag: "🇺🇸",
    currency: "USD ($)",
    typicalCpc: "$0.80 - $4.50+",
    payoutMethods: ["ACH Direct Deposit", "US Wire Transfer", "Payoneer US Receiving Account"],
    pinStatus: "Pre-verified via US Physical Postal Address",
    gamSupport: "Guaranteed GAM 360 / MCM ready",
    badgeColor: "from-blue-500 to-indigo-600",
    notes: "Highest tier CPC worldwide. Compatible with Payoneer, Wise US ACH, or standard US bank accounts.",
  },
  {
    code: "UK",
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP (£)",
    typicalCpc: "£0.65 - £3.80+",
    payoutMethods: ["BACS Direct Credit", "UK Faster Payments", "Wise / Revolut Business"],
    pinStatus: "Pre-verified via UK Royal Mail PIN",
    gamSupport: "GAM Multiple Customer Management (MCM)",
    badgeColor: "from-purple-500 to-indigo-600",
    notes: "High demand Tier-1 Euro/UK traffic monetization. Low threshold withdrawal with zero currency conversion fees for GBP accounts.",
  },
  {
    code: "CAN",
    name: "Canada",
    flag: "🇨🇦",
    currency: "CAD ($)",
    typicalCpc: "$0.70 - $3.90+",
    payoutMethods: ["EFT Direct Deposit", "Canadian Wire", "Wise CAD Account"],
    pinStatus: "Pre-verified via Canada Post Postal PIN",
    gamSupport: "Google Ad Manager Native Support",
    badgeColor: "from-red-500 to-pink-600",
    notes: "Top-tier North American CPC monetization with clean banking integration.",
  },
  {
    code: "IND",
    name: "India",
    flag: "🇮🇳",
    currency: "INR (₹)",
    typicalCpc: "₹15 - ₹180+",
    payoutMethods: ["Direct Bank Wire (NEFT / RTGS)", "Forex Wire to Any Indian Bank"],
    pinStatus: "PIN Verified via India Post (Zero postal wait)",
    gamSupport: "Standard GAM + AdSense Integration",
    badgeColor: "from-orange-500 to-amber-600",
    notes: "Extremely popular for mass-traffic regional Hindi/English tech portals. Direct wire transfers sent directly in INR.",
  },
  {
    code: "TUR",
    name: "Turkey",
    flag: "🇹🇷",
    currency: "TRY (₺)",
    typicalCpc: "₺8 - ₺65+",
    payoutMethods: ["Turkish IBAN Wire", "Garanti / İşbank / Ziraat Bank"],
    pinStatus: "PIN Verified via PTT Postal Verification",
    gamSupport: "AdSense Auto Ads + GAM Support",
    badgeColor: "from-red-600 to-rose-700",
    notes: "Specialized for Turkish-speaking audiences and high viral news/tech publishers.",
  },
  {
    code: "GCC",
    name: "Middle East (GCC / UAE / KSA / Egypt)",
    flag: "🇦🇪",
    currency: "USD ($) / SAR / AED",
    typicalCpc: "$0.50 - $2.80+",
    payoutMethods: ["SWIFT International Wire Transfer", "Emirates NBD / Al Rajhi"],
    pinStatus: "GCC Postal P.O. Box PIN Verified",
    gamSupport: "GAM Enterprise Ready",
    badgeColor: "from-emerald-500 to-teal-600",
    notes: "High purchasing power Arabic & English bilingual niches. High eCPMs in finance, auto, and SaaS.",
  },
];

export default function GoogleAdSenseProductExperience() {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("USA");
  const [activeTierTab, setActiveTierTab] = useState<"TIER1" | "TIER2" | "TIER3">("TIER2");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Live Traffic & Revenue Calculator State
  const [monthlyPageviews, setMonthlyPageviews] = useState<number>(35000);
  const [nicheCpcMultiplier, setNicheCpcMultiplier] = useState<number>(1.8); // 1.8 = Tech & SaaS
  const [adClickRate, setAdClickRate] = useState<number>(2.0); // 2.0% CTR

  const activeCountry = COUNTRIES.find((c) => c.code === selectedCountryCode) || COUNTRIES[0];

  // Calculated estimates
  const estimatedClicks = Math.round((monthlyPageviews * (adClickRate / 100)));
  const baseAvgCpc = selectedCountryCode === "USA" ? 1.65 : selectedCountryCode === "UK" ? 1.45 : selectedCountryCode === "IND" ? 0.35 : 1.1;
  const estimatedMonthlyRevenue = Math.round(estimatedClicks * baseAvgCpc * (nicheCpcMultiplier / 1.5));
  const estimatedRpm = ((estimatedMonthlyRevenue / monthlyPageviews) * 1000).toFixed(2);
  const estimatedCarriedBalance = Math.min(Math.round(estimatedMonthlyRevenue * 0.18), 185);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-16 pt-4">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 1. HERO PRODUCT AUTHORITY HEADER */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/15 via-emerald-500/15 to-amber-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide shadow-lg shadow-emerald-500/10">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>OFFICIAL GOOGLE ADSENSE &amp; AD MANAGER ASSET VAULT</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-sans leading-tight">
          Turnkey Google AdSense Approved Websites{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
            With Zero Rejection Hassle
          </span>
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl mx-auto">
          Skip Google’s notoriously strict 95% rejection rate, months of manual policy reviews, and postal PIN delays. Acquire a 100% compliant, established digital asset complete with <strong>primary Master Gmail</strong>, <strong>full WordPress archive</strong>, and <strong>free domain authorization push</strong> at your trusted registrar.
        </p>

        {/* 4 Trust Highlights Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 0 Active TOS Violations
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Strict Anti-Ad Loading Policy
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Never Limited / Zero Invalid Clicks
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 14-Day Escrow &amp; Replacement Warranty
          </span>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 2. INTERACTIVE COUNTRY & GEO-TARGETED ASSET SELECTOR */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#111728] via-[#0d1322] to-[#080b13] border border-blue-500/25 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 blur-[130px] pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                Geo-Targeting Console
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                Multi-Country Available
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
              Select Your Target Payout Country &amp; Banking Ecosystem
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Each AdSense asset is provisioned with country-specific compliance and currency routing. Choose where you intend to withdraw funds.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.06]">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Active Region: {activeCountry.name}</span>
          </div>
        </div>

        {/* Country Selector Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-6">
          {COUNTRIES.map((country) => {
            const isSelected = selectedCountryCode === country.code;
            return (
              <button
                key={country.code}
                onClick={() => setSelectedCountryCode(country.code)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                  isSelected
                    ? "bg-blue-600/20 border-blue-400/80 ring-1 ring-blue-500/50 shadow-lg shadow-blue-500/20"
                    : "bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                <div className="text-2xl mb-1.5">{country.flag}</div>
                <div className="font-bold text-xs text-white group-hover:text-blue-300 transition-colors">
                  {country.name}
                </div>
                <div className="text-[10.5px] font-mono text-neutral-400 mt-0.5">
                  {country.currency}
                </div>
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Detail Card for Selected Country */}
        <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-neutral-900/90 border border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">
              Typical Page CPC &amp; Yield
            </span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-white">
              {activeCountry.typicalCpc}
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {activeCountry.notes}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">
              Supported Bank &amp; Wire Payouts
            </span>
            <ul className="space-y-1 text-xs text-neutral-300">
              {activeCountry.payoutMethods.map((method, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{method}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">
              PIN &amp; GAM Verification Status
            </span>
            <div className="space-y-1.5 text-xs text-neutral-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium text-white">{activeCountry.pinStatus}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-neutral-300">{activeCountry.gamSupport}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 3. THREE CORE PRODUCT CATEGORIES / TIERS MATRIX */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>ACCOUNT MATURITY &amp; TRUST TIERS</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-extrabold text-white">
            Choose the Perfect Tier for Your Growth Ambition
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400">
            From freshly approved entry blogs to veteran publisher accounts that have cleared 5+ verified payments with Google Ad Manager MCM approval.
          </p>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TIER 1: Freshly Approved */}
          <div className="rounded-3xl p-6 bg-gradient-to-b from-[#131622] to-[#0c0e17] border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-6 relative group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-bold text-xs uppercase tracking-wider">
                  Tier 1 • Fresh
                </span>
                <span className="text-xs font-mono text-neutral-400">Entry Niche Blog</span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                  Freshly Approved Tech Blog
                </h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Brand new approved AdSense site built on clean WordPress architecture in high-demand technology &amp; software blogging niches.
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.06] space-y-2 text-xs text-neutral-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>100% Active Approval:</strong> Verified green checkmark in AdSense dashboard.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Google Ad Manager:</strong> May include GAM access (Included when available, but not guaranteed).</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Primary Gmail:</strong> 100% clean, fresh master email delivered with 2FA transfer.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Free Domain Push:</strong> Namecheap, GoDaddy, or Porkbun push included at no extra cost.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 font-mono block">Starting At</span>
                <span className="text-xl font-mono font-extrabold text-white">$189.00</span>
              </div>
              <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                Standard Turnkey
              </span>
            </div>
          </div>

          {/* TIER 2: PIN-Verified & Withdrawal-Ready (POPULAR) */}
          <div className="rounded-3xl p-6 bg-gradient-to-b from-[#151c2e] via-[#101626] to-[#0a0d18] border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/10 flex flex-col justify-between space-y-6 relative group">
            {/* Best Value Pill */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-neutral-950 font-black text-[10px] uppercase tracking-wider shadow-md">
              MOST POPULAR • ZERO POSTAL WAIT
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  Tier 2 • PIN Verified
                </span>
                <span className="text-xs font-mono text-emerald-400">Withdrawal Ready</span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  PIN-Verified AdSense Website
                </h4>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  Address verification completed via official Google postal mail. Identity and address hurdles already cleared—simply attach your bank account.
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.08] space-y-2 text-xs text-neutral-200">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Postal Delay:</strong> Skip the 3-6 week postal envelope wait completely.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Instant Bank Linking:</strong> Add your ACH, IBAN, or Wire details for instant cashouts.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Higher Resilience:</strong> PIN-verified accounts enjoy enhanced trust from Google algorithm.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Live Carried Balance:</strong> Existing organic traffic earnings included free.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 font-mono block">Starting At</span>
                <span className="text-xl font-mono font-extrabold text-emerald-400">$369.00</span>
              </div>
              <span className="text-[11px] font-bold text-neutral-950 bg-emerald-400 px-3 py-1 rounded-lg">
                High Demand
              </span>
            </div>
          </div>

          {/* TIER 3: Veteran 5+ Times Paid + Guaranteed GAM Approved */}
          <div className="rounded-3xl p-6 bg-gradient-to-b from-[#181528] to-[#0d0a17] border border-purple-500/40 hover:border-purple-400/70 transition-all flex flex-col justify-between space-y-6 relative group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-xs uppercase tracking-wider">
                  Tier 3 • Veteran Elite
                </span>
                <span className="text-xs font-mono text-amber-400">★ 5x Payments Cleared</span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  5x Paid Veteran + Guaranteed GAM
                </h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  The holy grail of publisher assets. Aged publisher profile with at least 5 previous bank payouts and guaranteed Google Ad Manager (GAM 360) approval.
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.06] space-y-2 text-xs text-neutral-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Guaranteed GAM 360 Approved:</strong> Full MCM delegation and programmatic video/header bidding.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>5+ Historical Bank Wires:</strong> Proven payment history with zero disputes or chargebacks.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Immune to Initial Scrutiny:</strong> Highest algorithm authority score, lowest risk of automated ad limits.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Full Escrow Handshake:</strong> Dedicated specialist handles account transfer live.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 font-mono block">Starting At</span>
                <span className="text-xl font-mono font-extrabold text-purple-300">$589.00</span>
              </div>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                Enterprise Asset
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 4. INTERACTIVE LIVE TRAFFIC, REVENUE & BALANCE SIMULATOR */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c121e] via-[#101728] to-[#080d17] border border-white/[0.1] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Revenue Forecasting Calculator
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                Live Simulator
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-white mt-1">
              Estimate Your Organic Monthly Yield &amp; Carried Balance
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              Adjust your projected monthly traffic, niche, and target country to see expected earnings and discover how much existing organic balance is typically carried over.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <div>
              <span className="text-[10px] text-neutral-400 block font-mono">Target Payout Geo</span>
              <span className="text-xs font-bold text-white">{activeCountry.flag} {activeCountry.name}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Slider 1: Monthly Visitors */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" /> Monthly Pageviews
                </span>
                <span className="font-mono font-bold text-white text-sm bg-white/[0.06] px-3 py-1 rounded-lg">
                  {monthlyPageviews.toLocaleString()} visits/mo
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="250000"
                step="5000"
                value={monthlyPageviews}
                onChange={(e) => setMonthlyPageviews(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>5K (Starter)</span>
                <span>50K (Growing)</span>
                <span>150K (Authority)</span>
                <span>250K+ (High Scale)</span>
              </div>
            </div>

            {/* Selector: Niche Selection */}
            <div className="space-y-2">
              <span className="text-xs text-neutral-300 font-semibold block">
                Target Website Content Niche (CPC Weight)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { name: "Tech & Cloud SaaS", mult: 1.8, badge: "High CPC" },
                  { name: "Finance & Crypto", mult: 2.4, badge: "Highest CPC" },
                  { name: "Health & Wellness", mult: 1.4, badge: "Solid CPC" },
                  { name: "General News / Blog", mult: 0.9, badge: "Mass Traffic" },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setNicheCpcMultiplier(item.mult)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      nicheCpcMultiplier === item.mult
                        ? "bg-emerald-500/15 border-emerald-400 text-white"
                        : "bg-white/[0.02] border-white/[0.08] text-neutral-400 hover:text-white"
                    }`}
                  >
                    <span className="text-[11px] font-bold block">{item.name}</span>
                    <span className="text-[9.5px] text-emerald-400 font-mono mt-0.5 block">{item.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 2: Click-Through Rate (CTR) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-semibold">
                  Estimated Ad CTR (Click-Through Rate)
                </span>
                <span className="font-mono font-bold text-white text-sm bg-white/[0.06] px-3 py-1 rounded-lg">
                  {adClickRate.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="4.5"
                step="0.1"
                value={adClickRate}
                onChange={(e) => setAdClickRate(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-neutral-500">
                Conservative estimate based on optimized Google Auto Ads placement in WordPress headers, in-article inserts, and anchor units.
              </p>
            </div>
          </div>

          {/* Results Display Panel */}
          <div className="lg:col-span-5 rounded-2xl bg-[#090d17] border border-white/[0.08] p-5 sm:p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block pb-2 border-b border-white/[0.06]">
                Simulated AdSense Revenue Output
              </span>

              {/* Big Stat */}
              <div>
                <span className="text-xs text-neutral-400 block font-medium">Estimated Monthly Earnings</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono mt-0.5">
                  ${estimatedMonthlyRevenue.toLocaleString()} <span className="text-sm font-sans text-neutral-400">/ mo</span>
                </div>
              </div>

              {/* Sub Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-neutral-500 font-mono block">Estimated Page RPM</span>
                  <span className="text-sm font-mono font-bold text-white mt-0.5 block">${estimatedRpm}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-neutral-500 font-mono block">Monthly Paid Clicks</span>
                  <span className="text-sm font-mono font-bold text-white mt-0.5 block">{estimatedClicks.toLocaleString()}</span>
                </div>
              </div>

              {/* Carried Balance Highlight */}
              <div className="p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/20 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-blue-400" /> Typical Carried Balance
                  </span>
                  <span className="font-mono font-extrabold text-white text-xs">
                    +${estimatedCarriedBalance} USD
                  </span>
                </div>
                <p className="text-[10.5px] text-neutral-400 leading-tight">
                  Many live sites carry existing organic revenue earned from recent impressions. This balance remains inside the account and is 100% yours to withdraw upon bank verification!
                </p>
              </div>
            </div>

            <div className="pt-2 text-[10.5px] text-neutral-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Figures based on real Google AdSense historical yields for {activeCountry.name}.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 5. STRICT COMPLIANCE, SAFETY & ZERO-RISK ESCROW POLICY */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0b0e17] border border-emerald-500/30 shadow-2xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>COMPLIANCE &amp; ESCROW PROTOCOL</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Zero Tolerance for Blackhat Tactics or Artificial Loading
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 block">
              14-Day Full Replacement Warranty
            </span>
          </div>
        </div>

        {/* 4 Security Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h4 className="font-bold text-sm text-white">Zero Active TOS Violations</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every site has a clean Policy Center with 0 warnings, 0 copyright strikes, and 100% adherence to Google Webmaster &amp; Publisher guidelines.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h4 className="font-bold text-sm text-white">No Bot / Ad Loading History</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We never utilize traffic bots, click farms, VPN loading, or artificial impression scripts. Sites have strictly genuine organic search visits.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h4 className="font-bold text-sm text-white">Never Ad-Limited</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No lingering "Ad serving has been limited" flags or invalid traffic deductions. Ads render dynamically on every live page load.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h4 className="font-bold text-sm text-white">14-Day Protection Warranty</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              If an account experiences a pre-existing approval revocation within 14 days, our escrow policy guarantees a free replacement or full store credit.
            </p>
          </div>
        </div>

        {/* Detailed Handover Walkthrough Strip */}
        <div className="pt-4 border-t border-white/[0.08]">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Step-by-Step Secure Delivery &amp; Handshake Protocol</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-neutral-300">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="font-mono text-emerald-400 font-bold block mb-1">STAGE 1: Master Gmail</span>
              <p className="text-neutral-400">Receive credentials for the primary original Google account. Update recovery phone, email, and 2-step verification.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="font-mono text-blue-400 font-bold block mb-1">STAGE 2: Free Domain Push</span>
              <p className="text-neutral-400">Domain is pushed directly to your account at Namecheap, GoDaddy, Porkbun, or Dynadot with zero transfer fees.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="font-mono text-amber-400 font-bold block mb-1">STAGE 3: WordPress Archive</span>
              <p className="text-neutral-400">Download the complete SQL database and wp-content archive. Restore it to your preferred web host in 5 minutes.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="font-mono text-purple-400 font-bold block mb-1">STAGE 4: Live Verification</span>
              <p className="text-neutral-400">Verify your live ad units, review policy center, link your personal bank details, and enjoy complete ownership.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 6. EXTENSIVE FREQUENTLY ASKED QUESTIONS (FAQ) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="text-center space-y-1 mb-6">
          <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
            Customer FAQ &amp; Guidance
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Everything You Need to Know Before Purchasing
          </h3>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Does the package include the original primary Gmail account?",
              a: "Yes, 100%! All AdSense websites include the primary Master Google / Gmail account under which the application was originally approved. We never sell delegated user permissions or temporary invites. You will be guided to change the password, bind your personal phone number, and enable your own two-factor authentication (2FA) immediately upon delivery.",
            },
            {
              q: "How does the domain transfer work? Is there any extra fee?",
              a: "Domain transfer is 100% free via an internal registrar push (such as Namecheap to Namecheap, GoDaddy to GoDaddy, or Porkbun to Porkbun). There are no ICANN transfer fees. Alternatively, if your domain registrar requires an EPP authorization code, we supply the code instantly without any hidden surcharges.",
            },
            {
              q: "Is web hosting included, or do I need my own hosting?",
              a: "Hosting is not included. You receive the full WordPress website backup (SQL database export, theme files, plugins, and uploaded media). You can easily deploy this archive on any web hosting provider (such as Hostinger, Cloudways, Namecheap, or cPanel) using 1-click tools like All-in-One WP Migration or Duplicator.",
            },
            {
              q: "What is the difference between Freshly Approved, PIN-Verified, and 5+ Times Paid?",
              a: "• Freshly Approved sites are brand-new approvals in high-CPC tech blogging niches. They may include Google Ad Manager (GAM) but GAM is not guaranteed.\n• PIN-Verified sites have already cleared physical postal address verification. This means you do not have to wait 3 to 6 weeks for a postal PIN envelope to arrive—you can connect your bank account and withdraw funds immediately.\n• 5+ Times Paid accounts are veteran publisher profiles that have received at least 5 previous bank wire payouts from Google. They feature the highest trust score in Google's automated algorithm and come with guaranteed Google Ad Manager (GAM 360) approval.",
            },
            {
              q: "Can I change the Payee Name and Bank Account details in the AdSense account?",
              a: "Yes. Once the Master Gmail account is transferred to you, you have full administrative control. In PIN-verified and veteran accounts, you can add your legal personal or company name, update your tax information (W-8BEN for non-US or W-9 for US), and connect your local bank account, ACH transfer, or wire details.",
            },
            {
              q: "What is your policy regarding Ad Limits and Invalid Clicks?",
              a: "None of our websites have ever engaged in blackhat ad loading, automated bot traffic, or artificial click generation. Every site has a 100% clean policy dashboard with zero active ad limits. We provide a 14-day replacement warranty covering any pre-existing policy defect at the time of delivery.",
            },
            {
              q: "What happens if there is an existing balance in the AdSense account?",
              a: "Depending on recent organic traffic, the AdSense dashboard may already contain a verified balance (typically between $15 and $150+ USD). We never deduct or retain this balance. It remains inside the account and belongs 100% to you as the new owner to cash out upon reaching the standard payout threshold.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/[0.08] bg-neutral-900/60 overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] cursor-pointer"
              >
                <span className="font-bold text-xs sm:text-sm text-white">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${
                    openFaqIndex === idx ? "rotate-180 text-blue-400" : ""
                  }`}
                />
              </button>
              {openFaqIndex === idx && (
                <div className="p-4 sm:p-5 pt-0 text-xs text-neutral-300 leading-relaxed border-t border-white/[0.04] whitespace-pre-line">
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
