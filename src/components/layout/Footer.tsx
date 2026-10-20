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
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Do not render consumer storefront footer on admin panel
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#050608] text-neutral-300 pt-20 pb-12 border-t border-white/[0.08] relative overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-blue-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Value Proposition Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-16 border-b border-white/[0.08]">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-4 hover:border-white/[0.12] transition-colors">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Instant Auto-Delivery</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Dispensed on screen in &lt; 60 seconds</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-4 hover:border-white/[0.12] transition-colors">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">WordPress Setup SLA</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Official activations within 30-45 mins</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-4 hover:border-white/[0.12] transition-colors">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Multi-Currency & Crypto</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">BTC, ETH, USDT, Card & PayPal</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-4 hover:border-white/[0.12] transition-colors">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Zero Risk Guarantee</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">100% Genuine retail & agency keys</p>
            </div>
          </div>
        </div>

        {/* Links & Newsletter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-16 pb-16 border-b border-white/[0.08]">
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/20 flex items-center justify-center font-bold text-white text-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-white">
                  N
                </span>
              </div>
              <span className="font-extrabold tracking-tight text-xl text-white font-sans">
                NEXUS DIGITAL
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              The premier digital software and assets marketplace. Official WordPress agency licenses, instant retail serials, and verified Google AdSense monetized assets.
            </p>

            {/* Newsletter Subscription Box */}
            <form onSubmit={handleSubscribe} className="space-y-2 max-w-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 block">
                Exclusive Deals & Serial Drops
              </span>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
                >
                  {subscribed ? <Check className="w-4 h-4 text-emerald-300" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{subscribed ? "Joined!" : "Join"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Links Column 1: Products */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider">WordPress Tools</h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/products/elementor-pro" className="hover:text-white transition-colors">
                  Elementor Pro Builder
                </Link>
              </li>
              <li>
                <Link href="/products/rank-math-pro" className="hover:text-white transition-colors">
                  Rank Math PRO (Just PRO)
                </Link>
              </li>
              <li>
                <Link href="/products/wp-rocket" className="hover:text-white transition-colors">
                  WP Rocket Caching
                </Link>
              </li>
              <li>
                <Link href="/products/astra-pro-theme-agency" className="hover:text-white transition-colors">
                  Astra Pro Theme
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  View All Plugins &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Software & Keys */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider">Instant Keys</h5>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/products/internet-download-manager-lifetime" className="hover:text-white transition-colors">
                  IDM Lifetime Key
                </Link>
              </li>
              <li>
                <Link href="/products/steam-50-usd-gift-card" className="hover:text-white transition-colors">
                  Steam $50 Gift Card
                </Link>
              </li>
              <li>
                <Link href="/products/adsense-approved-tech-blog-domain" className="hover:text-white transition-colors">
                  AdSense Tech Blog
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                  Track Order Vault &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Platform & Support */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider">Operations & Escrow</h5>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-neutral-300">
                Stripe Elements
              </span>
              <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-neutral-300">
                PayPal Smart
              </span>
              <span className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-400">
                BTC Native
              </span>
              <span className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-400">
                ETH Mainnet
              </span>
              <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                USDT Polygon
              </span>
            </div>

            <div className="pt-2">
              <Link
                href="/support"
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3.5 py-2 rounded-xl transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                <span>24/7 Dedicated Support Desk</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 NEXUS Digital Commerce Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <Link href="/support" className="hover:text-neutral-300">Terms of Service</Link>
            <Link href="/support" className="hover:text-neutral-300">Privacy & Data Purge Policy</Link>
            <Link href="/orders" className="hover:text-neutral-300">Credential Security Protocol</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
