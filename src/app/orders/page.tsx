"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Key,
  ShieldCheck,
  Zap,
  Wrench,
  Globe,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function OrderLookupPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanOrder = orderNumber.trim().toUpperCase();

    if (!cleanOrder) {
      setError("Please enter your order number (e.g. NEX-948210).");
      return;
    }

    router.push(`/orders/${cleanOrder}`);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-500/20 to-amber-500/5 border border-amber-500/20 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Key className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white font-sans tracking-tight">
            Digital Asset Vault & Order Lookup
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Retrieve your purchased license keys, check WordPress plugin installation progress,
            or access your delivered AdSense account credentials anytime.
          </p>
        </div>

        {/* Lookup Card */}
        <div className="bg-[#10121a]/95 rounded-3xl border border-white/[0.08] p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Order Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. NEX-948210"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden uppercase"
                />
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Billing Email Address (Optional for verification)
              </label>
              <input
                type="email"
                placeholder="youremail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-indigo-600/25"
            >
              <span>Unlock Digital Assets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Sample quick demo buttons */}
          <div className="pt-4 border-t border-white/[0.08] space-y-2">
            <span className="text-[10px] font-semibold text-neutral-400 block uppercase tracking-wider">
              Quick Test Orders (Click to Try):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOrderNumber("NEX-772910")}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-xs font-mono text-blue-300 border border-blue-500/30 font-semibold"
              >
                NEX-772910 (Alex Mercer — WP Rocket)
              </button>
              <button
                type="button"
                onClick={() => setOrderNumber("NEX-883102")}
                className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-neutral-300 border border-white/[0.08]"
              >
                NEX-883102 (Astra Theme Setup)
              </button>
              <button
                type="button"
                onClick={() => setOrderNumber("NEX-554219")}
                className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-xs font-mono text-purple-300 border border-purple-500/30"
              >
                NEX-554219 (ChatGPT Plus AI Account)
              </button>
              <button
                type="button"
                onClick={() => setOrderNumber("NEX-442198")}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-mono text-emerald-300 border border-emerald-500/30"
              >
                NEX-442198 (Steam $50 Gift Code)
              </button>
              <button
                type="button"
                onClick={() => setOrderNumber("NEX-331905")}
                className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-neutral-300 border border-white/[0.08]"
              >
                NEX-331905 (Windows 11 Pro Key)
              </button>
              <button
                type="button"
                onClick={() => setOrderNumber("NEX-948208")}
                className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-neutral-300 border border-white/[0.08]"
              >
                NEX-948208 (AdSense Site Transfer)
              </button>
            </div>
          </div>
        </div>

        {/* Security & Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-[#10121a]/80 border border-white/[0.08]">
            <Zap className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-bold text-xs text-white">Instant Key Access</h4>
            <p className="text-[11px] text-neutral-400 mt-1">Copy serials anytime</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#10121a]/80 border border-white/[0.08]">
            <Wrench className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <h4 className="font-bold text-xs text-white">Live Status Tracker</h4>
            <p className="text-[11px] text-neutral-400 mt-1">Track WP activation progress</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#10121a]/80 border border-white/[0.08]">
            <ShieldCheck className="w-5 h-5 text-purple-400 mx-auto mb-2" />
            <h4 className="font-bold text-xs text-white">Encrypted Handoffs</h4>
            <p className="text-[11px] text-neutral-400 mt-1">Direct account transfers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
