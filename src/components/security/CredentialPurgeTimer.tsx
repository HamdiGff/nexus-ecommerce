"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Clock, Trash2, CheckCircle2, Lock, AlertTriangle } from "lucide-react";

interface CredentialPurgeTimerProps {
  submittedAt?: string; // ISO date string or relative
  purgeHours?: number; // default 24 hours
  initialPurged?: boolean;
  onPurge?: () => void;
  variant?: "customer" | "admin";
}

export default function CredentialPurgeTimer({
  submittedAt,
  purgeHours = 24,
  initialPurged = false,
  onPurge,
  variant = "customer",
}: CredentialPurgeTimerProps) {
  const [isPurged, setIsPurged] = useState(initialPurged);
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    percentRemaining: number;
    totalSeconds: number;
  }>({
    hours: 23,
    minutes: 48,
    seconds: 15,
    percentRemaining: 99,
    totalSeconds: 23 * 3600 + 48 * 60 + 15,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (isPurged) return;

    // Calculate initial target based on submittedAt or default 24h window
    const totalWindowSeconds = purgeHours * 3600;
    let baseRemaining = 23 * 3600 + 48 * 60 + 15; // default simulated ~23h 48m

    if (submittedAt) {
      const parsed = new Date(submittedAt).getTime();
      if (!isNaN(parsed)) {
        const elapsedSec = Math.floor((Date.now() - parsed) / 1000);
        baseRemaining = Math.max(0, totalWindowSeconds - elapsedSec);
      }
    }

    const interval = setInterval(() => {
      baseRemaining = Math.max(0, baseRemaining - 1);

      if (baseRemaining <= 0) {
        setIsPurged(true);
        clearInterval(interval);
      }

      const h = Math.floor(baseRemaining / 3600);
      const m = Math.floor((baseRemaining % 3600) / 60);
      const s = baseRemaining % 60;
      const pct = Math.max(0, Math.min(100, (baseRemaining / totalWindowSeconds) * 100));

      setTimeLeft({
        hours: h,
        minutes: m,
        seconds: s,
        percentRemaining: pct,
        totalSeconds: baseRemaining,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [submittedAt, purgeHours, isPurged]);

  const handleManualPurge = () => {
    setIsPurged(true);
    setShowConfirmModal(false);
    if (onPurge) onPurge();
  };

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (isPurged) {
    return (
      <div className="rounded-2xl p-4 bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">Credentials Auto-Purged</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AES-256 DESTROYED
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/80 mt-0.5">
              All temporary WordPress admin usernames and passwords have been permanently expunged from memory and storage.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 shrink-0 font-semibold">
          Purged & Secure
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 bg-[#10121a] border border-white/[0.08] space-y-3.5">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">
                Dynamic Credential Auto-Purge
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Clock className="w-3 h-3" /> LIVE COUNTDOWN
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              {variant === "admin"
                ? "Technician Security Protocol: Credentials auto-erase when countdown reaches zero."
                : "Your submitted temporary login credentials will self-destruct automatically."}
            </p>
          </div>
        </div>

        {/* Live Timer Clock Display */}
        <div className="text-right shrink-0">
          <div className="font-mono text-base sm:text-lg font-extrabold text-amber-400 tracking-wider">
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
          </div>
          <span className="text-[10px] text-neutral-400 block font-sans">
            Remaining until purge
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft.hours < 4
                ? "bg-rose-500"
                : timeLeft.hours < 12
                ? "bg-amber-500"
                : "bg-gradient-to-r from-blue-500 to-emerald-400"
            }`}
            style={{ width: `${timeLeft.percentRemaining}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-neutral-400">
          <span>Submission Verified</span>
          <span>{timeLeft.hours}h {timeLeft.minutes}m remaining of {purgeHours}h window</span>
          <span className="text-emerald-400 font-semibold">100% Zero-Retention</span>
        </div>
      </div>

      {/* Actions & Immediate Purge Button */}
      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Need early removal? You can purge credentials right now.</span>
        </div>

        <button
          onClick={() => setShowConfirmModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Purge Credentials Now</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#141622] rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Purge Credentials Immediately?</h3>
                <p className="text-xs text-neutral-400">This action is irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Purging immediately will permanently wipe the temporary WordPress admin login URL, username, and password from the system. If activation is not yet complete, our technicians will not be able to log in without new credentials.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleManualPurge}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-rose-600/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Purge</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
