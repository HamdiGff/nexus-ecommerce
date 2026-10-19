"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Flame, Clock, Copy, Check, X, Sparkles } from "lucide-react";
import { useCouponStore } from "@/lib/store/couponStore";

export default function FlashSaleBanner() {
  const pathname = usePathname();
  const { flashSaleActive, flashSaleCode, flashSaleEndsInSeconds, applyCoupon } =
    useCouponStore();
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(
    flashSaleEndsInSeconds || 15480
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!flashSaleActive || dismissed || pathname?.startsWith("/admin")) return null;

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(flashSaleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gradient-to-r from-amber-600 via-rose-600 to-purple-700 text-white text-xs py-2 px-4 shadow-md z-40 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs text-[10px] text-amber-300 border border-amber-300/30">
            <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
            Limited Flash Sale
          </span>

          <span className="font-semibold text-white/95">
            Use code <strong className="underline underline-offset-2 tracking-wider text-amber-200">{flashSaleCode}</strong> for 25% OFF licenses & bundles!
          </span>

          {/* Countdown Clock */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-black/40 font-mono text-[11px] font-bold text-white border border-white/10">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>
              {pad(hours)}:{pad(minutes)}:{pad(seconds)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/30 hover:bg-black/50 text-[11px] font-bold text-white border border-white/20 transition-all shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Code Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-white/70 hover:text-white rounded-md hover:bg-black/20 transition-colors"
            title="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
