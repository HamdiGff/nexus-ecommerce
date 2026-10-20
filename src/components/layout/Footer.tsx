"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Zap,
  RotateCcw,
  Coins,
  Check,
  Send,
  Wrench,
  Globe,
  Key,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Lock,
  ChevronRight,
  ExternalLink,
  Cpu,
  BadgeCheck,
  Clock,
  X,
  FileText,
  ShieldAlert,
  HelpCircle,
  Flame,
  CheckCircle2,
  Gamepad2,
  Server,
  Layers,
  CreditCard,
} from "lucide-react";

type ModalType = "terms" | "privacy" | "adsense-guarantee" | null;

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Do not render consumer storefront footer on admin panel
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3500);
      setEmail("");
    }
  };

  return (
    <>
      <footer className="bg-[#05070B] text-neutral-300 pt-12 sm:pt-20 pb-8 sm:pb-12 border-t border-white/[0.08] relative overflow-hidden">
        {/* Glow Effects & Ambient Mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent pointer-events-none" />
        <div className="absolute -top-32 left-1/4 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[300px] bg-purple-600/[0.07] rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[250px] bg-gradient-to-t from-emerald-500/[0.05] via-blue-500/[0.05] to-transparent blur-3xl pointer-events-none" />

        {/* Subtle geometric dot grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }} 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* ========================================================= */}
          {/* VALUE PROPOSITION STRIP: Compact 2x2 on Mobile, 4-col Desktop */}
          {/* ========================================================= */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pb-10 sm:pb-16 border-b border-white/[0.08]">
            
            {/* Value 1: Instant Auto-Delivery */}
            <div className="group relative p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-neutral-900/40 border border-white/[0.06] hover:border-emerald-500/40 hover:bg-white/[0.03] transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-emerald-500/10">
              <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4">
                <div className="p-2 sm:p-3 bg-emerald-500/10 text-emerald-400 rounded-lg sm:rounded-xl border border-emerald-500/20 group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all shrink-0">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                    <h4 className="text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider">Instant Delivery</h4>
                    <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      &lt;60s
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                    Automated code dispenser on screen & email receipt in &lt;60s.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 2: WordPress White-Glove SLA */}
            <div className="group relative p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-neutral-900/40 border border-white/[0.06] hover:border-blue-500/40 hover:bg-white/[0.03] transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-blue-500/10">
              <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4">
                <div className="p-2 sm:p-3 bg-blue-500/10 text-blue-400 rounded-lg sm:rounded-xl border border-blue-500/20 group-hover:scale-105 group-hover:bg-blue-500/20 transition-all shrink-0">
                  <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                    <h4 className="text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider">Agency SLA Setup</h4>
                    <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      30-45M
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                    Official technician activations for Elementor, WP Rocket & Astra.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 3: AdSense Escrow & Security */}
            <div className="group relative p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-neutral-900/40 border border-white/[0.06] hover:border-amber-500/40 hover:bg-white/[0.03] transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-amber-500/10">
              <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4">
                <div className="p-2 sm:p-3 bg-amber-500/10 text-amber-400 rounded-lg sm:rounded-xl border border-amber-500/20 group-hover:scale-105 group-hover:bg-amber-500/20 transition-all shrink-0">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                    <h4 className="text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider">AdSense Transfer</h4>
                    <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      14D SLA
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                    Clean Gmail, free domain push, backup SQL & zero violation guarantee.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 4: Zero Risk Guarantee & Crypto */}
            <div className="group relative p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-neutral-900/40 border border-white/[0.06] hover:border-purple-500/40 hover:bg-white/[0.03] transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-purple-500/10">
              <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4">
                <div className="p-2 sm:p-3 bg-purple-500/10 text-purple-400 rounded-lg sm:rounded-xl border border-purple-500/20 group-hover:scale-105 group-hover:bg-purple-500/20 transition-all shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                    <h4 className="text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider">Escrow Security</h4>
                    <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      ENCRYPTED
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                    256-bit checkout, Stripe, PayPal, Crypto with auto-purge guarantee.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* MAIN FOOTER NAVIGATION & NEWSLETTER GRID */}
          {/* ========================================================= */}
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mt-10 sm:mt-12 pb-10 sm:pb-12 border-b border-white/[0.08] items-start">
            
            {/* BRAND COLUMN (Full width on mobile/tablet, 4 cols on lg) */}
            <div className="col-span-2 lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-950 border border-white/20 flex items-center justify-center font-bold text-white text-lg shadow-inner shadow-white/10">
                  <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 via-indigo-300 to-white">
                    N
                  </span>
                </div>
                <div>
                  <span className="font-extrabold tracking-tight text-xl text-white font-sans block leading-none">
                    NEXUS<span className="text-blue-500 font-light">DIGITAL</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">
                    Premium Digital Assets &amp; Escrow
                  </span>
                </div>
              </div>

              {/* System Operational Pulse Pill */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>99.98% System Uptime • Auto-Dispenser Online</span>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
                Authentic WordPress agency activations and turnkey Google AdSense assets delivered with verified credentials and escrow protection.
              </p>

              {/* Quick Utility Links */}
              <div className="flex items-center gap-3 pt-1 text-xs font-mono">
                <Link
                  href="/orders"
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group text-[11px]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Order Vault</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <span className="text-white/20">•</span>
                <Link
                  href="/support"
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                  <span>24/7 Support Desk</span>
                </Link>
              </div>
            </div>

            {/* COLUMN 1: WordPress Agency Tools (Side-by-side on mobile: col-span-1) */}
            <div className="col-span-1 lg:col-span-2 space-y-3.5">
              <div className="flex items-center gap-1.5 pb-1 border-b border-white/[0.05]">
                <Wrench className="w-3.5 h-3.5 text-blue-400" />
                <h5 className="text-white font-bold text-xs uppercase tracking-wider">
                  WP Licenses
                </h5>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <Link
                    href="/products/elementor-pro"
                    className="group flex items-center justify-between hover:text-white transition-colors"
                  >
                    <span className="truncate pr-1">Elementor Pro</span>
                    <span className="hidden sm:inline-block text-[9px] px-1 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono group-hover:border-blue-400">
                      PRO
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/rank-math-pro"
                    className="group flex items-center justify-between hover:text-white transition-colors"
                  >
                    <span className="truncate pr-1">Rank Math PRO</span>
                    <span className="hidden sm:inline-block text-[9px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono group-hover:border-amber-400">
                      SEO
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/wp-rocket"
                    className="group flex items-center justify-between hover:text-white transition-colors"
                  >
                    <span className="truncate pr-1">WP Rocket</span>
                    <span className="hidden sm:inline-block text-[9px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono group-hover:border-emerald-400">
                      CACHE
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/astra-pro-theme"
                    className="group flex items-center justify-between hover:text-white transition-colors"
                  >
                    <span className="truncate pr-1">Astra Pro</span>
                    <span className="hidden sm:inline-block text-[9px] px-1 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono group-hover:border-purple-400">
                      AGENCY
                    </span>
                  </Link>
                </li>
                <li className="pt-1.5">
                  <Link
                    href="/category/wordpress"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors group"
                  >
                    <span>All Licenses</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 2: Google AdSense Websites (Side-by-side on mobile: col-span-1) */}
            <div className="col-span-1 lg:col-span-2 space-y-3.5">
              <div className="flex items-center gap-1.5 pb-1 border-b border-white/[0.05]">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <h5 className="text-white font-bold text-xs uppercase tracking-wider">
                  AdSense Sites
                </h5>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <Link
                    href="/products/google-adsense-approved-websites"
                    className="group flex items-center justify-between hover:text-white transition-colors"
                  >
                    <span className="truncate pr-1">Fresh Tech Blogs</span>
                    <span className="hidden sm:inline-block text-[9px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono group-hover:border-emerald-400">
                      HOT
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/google-adsense-approved-websites"
                    className="group flex items-center justify-between hover:text-white transition-colors"
                  >
                    <span className="truncate pr-1">PIN-Verified</span>
                    <span className="hidden sm:inline-block text-[9px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono group-hover:border-amber-400">
                      READY
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/google-adsense-approved-websites"
                    className="group flex items-center justify-between hover:text-white transition-colors"
                  >
                    <span className="truncate pr-1">5+ Payouts &amp; GAM</span>
                    <span className="hidden sm:inline-block text-[9px] px-1 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono group-hover:border-blue-400">
                      VIP
                    </span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("adsense-guarantee")}
                    className="hover:text-amber-300 text-left transition-colors flex items-center gap-1"
                  >
                    <span className="truncate">Guarantee</span>
                    <ExternalLink className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  </button>
                </li>
                <li className="pt-1.5">
                  <Link
                    href="/category/adsense-websites"
                    className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors group"
                  >
                    <span>Browse All</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: NOTIFY ME & RESTOCK DROPS (Full width on mobile/tablet, 4 cols on lg) */}
            <div className="col-span-2 lg:col-span-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3 shadow-lg shadow-black/20 hover:border-white/15 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Serial Drops &amp; Restock Alerts
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">No Spam</span>
                </div>

                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Get instant notifications when newly approved AdSense sites or agency keys drop.
                </p>

                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-neutral-900/70 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500/60 focus:border-blue-500/40 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={subscribed}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 shadow-md shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {subscribed ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Joined!</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Notify Me</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-mono pt-0.5">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Instant Drops
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-400" /> 20% Vouchers
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-purple-400" /> Zero Junk
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* FLOATING PAYMENT RAILS & SECURITY SEALS DOCK BAR */}
          {/* ========================================================= */}
          <div className="py-4 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 border-b border-white/[0.06]">
            
            {/* Floating Dock: All Logos Unified Side-by-Side */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                <CreditCard className="w-3 h-3 text-blue-400" />
                <span>Accepted Rails:</span>
              </span>

              {/* The Floating Capsule Bar (Wraps smoothly on mobile) */}
              <div className="inline-flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl sm:rounded-full bg-neutral-900/80 border border-white/10 backdrop-blur-md shadow-lg shadow-black/40 hover:border-white/20 transition-all duration-300">
                {/* Stripe */}
                <div 
                  className="h-6 px-2 rounded-md bg-white flex items-center justify-center shadow-xs hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 cursor-default shrink-0" 
                  title="Stripe 256-Bit SSL Checkout"
                >
                  <img src="/payments/stripe.svg" alt="Stripe" className="h-3 w-auto object-contain" />
                </div>

                {/* PayPal */}
                <div 
                  className="h-6 px-2 rounded-md bg-white flex items-center justify-center shadow-xs hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 cursor-default shrink-0" 
                  title="PayPal Smart Payment"
                >
                  <img src="/payments/paypal.svg" alt="PayPal" className="h-3 w-auto object-contain" />
                </div>

                {/* Visa */}
                <div 
                  className="h-6 px-1.5 rounded-md bg-white flex items-center justify-center shadow-xs hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 cursor-default shrink-0" 
                  title="Visa Debit & Credit"
                >
                  <img src="/payments/visa.svg" alt="Visa" className="h-2 w-auto object-contain" />
                </div>

                {/* Mastercard */}
                <div 
                  className="h-6 px-1.5 rounded-md bg-white flex items-center justify-center shadow-xs hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 cursor-default shrink-0" 
                  title="Mastercard Worldwide"
                >
                  <img src="/payments/mastercard.svg" alt="Mastercard" className="h-3.5 w-auto object-contain" />
                </div>

                {/* Apple Pay */}
                <div 
                  className="h-6 px-2 rounded-md bg-white flex items-center justify-center shadow-xs hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 cursor-default shrink-0" 
                  title="Apple Pay Instant Token"
                >
                  <img src="/payments/apple-pay.svg" alt="Apple Pay" className="h-3 w-auto object-contain" />
                </div>

                {/* Google Pay */}
                <div 
                  className="h-6 px-2 rounded-md bg-white flex items-center justify-center shadow-xs hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 cursor-default shrink-0" 
                  title="Google Pay Quick Wallet"
                >
                  <img src="/payments/google-pay.svg" alt="Google Pay" className="h-3 w-auto object-contain" />
                </div>

                {/* Micro vertical divider */}
                <div className="h-3.5 w-[1px] bg-white/15 mx-0.5 hidden xs:block" />

                {/* Bitcoin */}
                <div 
                  className="h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center hover:-translate-y-0.5 hover:border-amber-400 hover:scale-105 transition-all duration-200 cursor-default shrink-0" 
                  title="Bitcoin (BTC Native SegWit)"
                >
                  <img src="/payments/bitcoin.svg" alt="Bitcoin" className="w-3.5 h-3.5 object-contain rounded-full" />
                </div>

                {/* Ethereum */}
                <div 
                  className="h-6 w-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center hover:-translate-y-0.5 hover:border-cyan-400 hover:scale-105 transition-all duration-200 cursor-default shrink-0" 
                  title="Ethereum (ETH ERC-20)"
                >
                  <img src="/payments/ethereum.svg" alt="Ethereum" className="w-3.5 h-3.5 object-contain rounded-full" />
                </div>

                {/* Tether USDT */}
                <div 
                  className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center hover:-translate-y-0.5 hover:border-emerald-400 hover:scale-105 transition-all duration-200 cursor-default shrink-0" 
                  title="Tether (USDT Polygon & TRC-20)"
                >
                  <img src="/payments/tether.svg" alt="USDT" className="w-3.5 h-3.5 object-contain rounded-full" />
                </div>

                {/* Solana */}
                <div 
                  className="h-6 w-6 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center hover:-translate-y-0.5 hover:border-purple-400 hover:scale-105 transition-all duration-200 cursor-default shrink-0" 
                  title="Solana (SOL)"
                >
                  <img src="/payments/solana.svg" alt="Solana" className="w-3.5 h-3.5 object-contain rounded-full" />
                </div>
              </div>
            </div>

            {/* Escrow & Security Trust Badges */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 font-mono shrink-0">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-neutral-300 hover:border-emerald-500/30 transition-all cursor-default">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>256-Bit SSL</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-neutral-300 hover:border-blue-500/30 transition-all cursor-default">
                <BadgeCheck className="w-3 h-3 text-blue-400" />
                <span>100% Genuine</span>
              </span>
            </div>

          </div>

          {/* ========================================================= */}
          {/* BOTTOM COPYRIGHT & LEGAL MODAL TRIGGERS */}
          {/* ========================================================= */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3 sm:gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <p className="text-[11px] sm:text-xs">© 2026 NEXUS DIGITAL COMMERCE INC. ALL RIGHTS RESERVED.</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6 text-[11px]">
              <button
                onClick={() => setActiveModal("terms")}
                className="hover:text-neutral-300 transition-colors underline-offset-4 hover:underline"
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActiveModal("privacy")}
                className="hover:text-neutral-300 transition-colors underline-offset-4 hover:underline"
              >
                Privacy &amp; Data Purge
              </button>
              <button
                onClick={() => setActiveModal("adsense-guarantee")}
                className="hover:text-neutral-300 transition-colors underline-offset-4 hover:underline text-amber-400/80 hover:text-amber-300"
              >
                AdSense Warranty
              </button>
              <Link
                href="/support"
                className="hover:text-neutral-300 transition-colors underline-offset-4 hover:underline"
              >
                Support Desk
              </Link>
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================= */}
      {/* INTERACTIVE LEGAL MODALS */}
      {/* ========================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#090D14] border border-white/10 rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto text-neutral-300">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal 1: Terms of Service */}
            {activeModal === "terms" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Terms of Service</h3>
                    <p className="text-xs text-neutral-400 font-mono">Last Updated: October 2026</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">1. Digital Good Dispensation</h4>
                  <p>
                    All instant digital products (including software retail keys, serial tokens, and gift card pins) are dispensed on-screen and archived within your customer vault upon payment confirmation.
                  </p>

                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">2. WordPress Agency Setup SLA</h4>
                  <p>
                    Official agency activations require administrative WP credentials submitted via our 256-bit encrypted intake system. Activations are performed by certified technicians within 30 to 45 minutes during standard operational hours.
                  </p>

                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">3. Refunds &amp; Replacement</h4>
                  <p>
                    Defective or invalidated serials qualify for instantaneous automated replacement via the Order Vault or live technician resolution within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {/* Modal 2: Privacy & Data Purge Policy */}
            {activeModal === "privacy" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Privacy &amp; Data Purge Protocol</h3>
                    <p className="text-xs text-neutral-400 font-mono">Zero-Knowledge Storage Policy</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
                  <p className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200">
                    🛡️ <strong>Automated Purge Guarantee:</strong> All buyer domain registrar usernames, temporary setup passwords, and WordPress access credentials are encrypted at rest and automatically purged from our servers 48 hours after delivery confirmation.
                  </p>

                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Encrypted Transit &amp; Isolation</h4>
                  <p>
                    All communications between customer checkout and the Admin Dispatch Console are encrypted via TLS 1.3 / AES-256. Staff members never store credentials locally.
                  </p>

                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">No Third-Party Sharing</h4>
                  <p>
                    Your email and transactional details are strictly used for order handoff and account recovery. We will never sell, lease, or share your data with advertisers.
                  </p>
                </div>
              </div>
            )}

            {/* Modal 3: AdSense Compliance Warranty */}
            {activeModal === "adsense-guarantee" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Google AdSense Safety &amp; Transfer Warranty</h3>
                    <p className="text-xs text-amber-400 font-mono">14-Day Replacement SLA &amp; Clean History Pledge</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
                    <div className="p-3 rounded-xl bg-neutral-900 border border-white/10">
                      <span className="font-bold text-emerald-400 block mb-1">✓ Zero Active Violations</span>
                      <p className="text-[11px] text-neutral-400">
                        100% policy-compliant AdSense accounts with clean standing, no policy strikes, and zero ad-limit flags.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-white/10">
                      <span className="font-bold text-emerald-400 block mb-1">✓ Organic Traffic Only</span>
                      <p className="text-[11px] text-neutral-400">
                        Never subjected to artificial traffic generation, bot clicks, or invalid traffic loading schemes.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-white/10">
                      <span className="font-bold text-emerald-400 block mb-1">✓ Free Domain Push</span>
                      <p className="text-[11px] text-neutral-400">
                        Internal account-to-account push to your Namecheap, Hostinger, or Dynadot account at $0 transfer fee.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-white/10">
                      <span className="font-bold text-emerald-400 block mb-1">✓ 14-Day Guarantee</span>
                      <p className="text-[11px] text-neutral-400">
                        Full warranty coverage against transfer failure, initial login invalidation, or pre-existing account lock.
                      </p>
                    </div>
                  </div>

                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Step-by-Step Security Handoff</h4>
                  <p>
                    Every AdSense asset includes primary Gmail account ownership, 2FA backup codes, domain transfer authorization, and full WordPress database and file archives.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Dismiss Button */}
            <div className="pt-4 mt-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}