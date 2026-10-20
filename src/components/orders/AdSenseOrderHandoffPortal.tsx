"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Eye,
  EyeOff,
  Download,
  Send,
  MessageSquare,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  FileCheck,
  Server,
  ExternalLink,
  ChevronRight,
  Shield,
  FileText,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CandidateDomain {
  domain: string;
  niche: string;
  isSelected: boolean;
}

interface ChatMessage {
  id: string;
  sender: "customer" | "admin";
  senderName: string;
  text: string;
  time: string;
}

interface AdSenseFulfillmentData {
  stage: number; // 1 to 4
  candidateDomains?: CandidateDomain[];
  selectedDomain?: string;
  domainRegistrar?: string;
  registrarAccount?: string;
  domainPushStatus?: "PENDING_SELECTION" | "PUSH_INITIATED" | "PUSH_CONFIRMED";
  domainPushNotes?: string;
  domainEppCode?: string;
  masterGmail?: {
    email: string;
    password?: string;
    backupCodes?: string[];
    recoveryPhone?: string;
    recoveryInstructions?: string;
    isConfirmed?: boolean;
  };
  websiteBackup?: {
    backupDownloadUrl?: string;
    sqlDownloadUrl?: string;
    restoreGuideUrl?: string;
    isDownloaded?: boolean;
  };
  warranty?: {
    isActive: boolean;
    validUntil: string;
    certificateId: string;
  };
  chatMessages?: ChatMessage[];
}

interface AdSenseOrderHandoffPortalProps {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  initialFulfillment?: AdSenseFulfillmentData;
  orderSubmissions?: any;
}

export default function AdSenseOrderHandoffPortal({
  orderId,
  orderNumber,
  customerName,
  customerEmail,
  initialFulfillment,
  orderSubmissions,
}: AdSenseOrderHandoffPortalProps) {
  const [fulfillment, setFulfillment] = useState<AdSenseFulfillmentData>(() => {
    return (
      initialFulfillment || {
        stage: 1,
        candidateDomains: [
          { domain: "techpulse-cloud.com", niche: "Tech & SaaS Reviews (High CPC)", isSelected: true },
          { domain: "nextgen-cyber.io", niche: "AI & Cybersecurity Portal", isSelected: false },
          { domain: "cloudgrowth-hub.com", niche: "Cloud Infrastructure Blog", isSelected: false },
        ],
        selectedDomain: "techpulse-cloud.com",
        domainRegistrar: orderSubmissions?.adsense?.registrar || "Namecheap",
        registrarAccount: orderSubmissions?.adsense?.registrarUsername || customerEmail,
        domainPushStatus: "PUSH_INITIATED",
        domainPushNotes: `Domain push initiated to ${
          orderSubmissions?.adsense?.registrar || "Namecheap"
        } account "${orderSubmissions?.adsense?.registrarUsername || customerEmail}". Please accept the push in your registrar panel.`,
        domainEppCode: "EPP-TECH-8492019-PUSH",
        masterGmail: {
          email: "techpulse.publisher@gmail.com",
          password: "AdSense$Transfer2026!secure",
          backupCodes: ["8492 0192", "4920 1827", "7193 8402", "3901 8472", "5820 1938"],
          recoveryPhone: orderSubmissions?.adsense?.contactPhone || "+1 (555) 234-5678",
          recoveryInstructions:
            "Log in at google.com using the email and temporary password above. When Google prompts for 2FA, use one of the 8-digit single-use backup codes. Once in your Google Account settings, immediately update the recovery phone number and change your password.",
          isConfirmed: false,
        },
        websiteBackup: {
          backupDownloadUrl: "https://dl.nexus-digital.store/backups/techpulse-full-wordpress-backup.wpress",
          sqlDownloadUrl: "https://dl.nexus-digital.store/backups/techpulse-database-export.sql.gz",
          restoreGuideUrl: "https://nexus-digital.store/docs/adsense-wordpress-migration-guide.pdf",
          isDownloaded: false,
        },
        warranty: {
          isActive: true,
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          certificateId: `ESCROW-CERT-${orderNumber}`,
        },
        chatMessages: [
          {
            id: "msg-welcome-init",
            sender: "admin",
            senderName: "AdSense Asset Specialist (Nexus Ops)",
            text: `Hello ${
              customerName || "Customer"
            }! Welcome to your dedicated AdSense handover desk. We have received your target registrar details (${
              orderSubmissions?.adsense?.registrar || "Namecheap"
            }: ${orderSubmissions?.adsense?.registrarUsername || customerEmail}). Please inspect the candidate domains below and confirm when you are ready for the Master Gmail credentials.`,
            time: "Just now",
          },
        ],
      }
    );
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync with server every 4 seconds to catch updates from admin panel in real-time
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(orderNumber)}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.order?.adsenseFulfillment) {
            setFulfillment((prev) => ({
              ...prev,
              ...data.order.adsenseFulfillment,
            }));
          }
        }
      } catch (err) {
        // silent fail on network glitch
      }
    };

    const interval = setInterval(fetchLatest, 4000);
    return () => clearInterval(interval);
  }, [orderNumber]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Sync state update to API
  const pushUpdateToServer = async (
    updates: Partial<AdSenseFulfillmentData>,
    chatMessageText?: string
  ) => {
    setIsUpdating(true);
    try {
      const payload: any = {
        orderId: orderNumber,
        updates: {
          adsenseFulfillment: updates,
        },
      };

      if (chatMessageText) {
        payload.newChatMessage = {
          sender: "customer",
          senderName: customerName || "Customer",
          text: chatMessageText,
        };
      }

      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.order?.adsenseFulfillment) {
          setFulfillment(data.order.adsenseFulfillment);
        }
      }
    } catch (err) {
      console.error("Error updating order fulfillment:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Customer selects domain from candidate list
  const handleSelectDomain = async (domainName: string) => {
    const updatedCandidates = (fulfillment.candidateDomains || []).map((d) => ({
      ...d,
      isSelected: d.domain === domainName,
    }));

    const newUpdates: Partial<AdSenseFulfillmentData> = {
      candidateDomains: updatedCandidates,
      selectedDomain: domainName,
      domainPushStatus: "PUSH_INITIATED",
      domainPushNotes: `Domain push for "${domainName}" initiated to your ${fulfillment.domainRegistrar || "Namecheap"} account "${fulfillment.registrarAccount}".`,
    };

    setFulfillment((prev) => ({
      ...prev,
      ...newUpdates,
    }));

    await pushUpdateToServer(
      newUpdates,
      `I have selected "${domainName}" as my preferred domain! Please push it to my ${fulfillment.domainRegistrar || "Namecheap"} account (${fulfillment.registrarAccount}).`
    );
  };

  // Customer confirms domain received
  const handleConfirmDomainReceived = async () => {
    const newUpdates: Partial<AdSenseFulfillmentData> = {
      stage: Math.max(fulfillment.stage, 2),
      domainPushStatus: "PUSH_CONFIRMED",
    };

    setFulfillment((prev) => ({ ...prev, ...newUpdates }));
    await pushUpdateToServer(
      newUpdates,
      `Domain push received and accepted in my ${fulfillment.domainRegistrar || "Namecheap"} account! Ready for Stage 2 (Master Gmail Handover).`
    );
  };

  // Customer confirms Gmail secured
  const handleConfirmGmailSecured = async () => {
    const updatedGmail = {
      ...(fulfillment.masterGmail || { email: "" }),
      isConfirmed: true,
    };

    const newUpdates: Partial<AdSenseFulfillmentData> = {
      stage: Math.max(fulfillment.stage, 3),
      masterGmail: updatedGmail,
    };

    setFulfillment((prev) => ({ ...prev, ...newUpdates }));
    await pushUpdateToServer(
      newUpdates,
      "I have successfully logged into the Master Gmail account, bound my recovery phone number, and changed the password. Ready to download WordPress files."
    );
  };

  // Customer confirms website backup downloaded
  const handleConfirmBackupDownloaded = async () => {
    const updatedBackup = {
      ...(fulfillment.websiteBackup || {}),
      isDownloaded: true,
    };

    const newUpdates: Partial<AdSenseFulfillmentData> = {
      stage: 4,
      websiteBackup: updatedBackup,
    };

    setFulfillment((prev) => ({ ...prev, ...newUpdates }));
    await pushUpdateToServer(
      newUpdates,
      "Full WordPress backup ZIP and SQL database files downloaded successfully. Thank you for the complete handover!"
    );
  };

  // Send a chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const messageText = chatInput.trim();
    setChatInput("");
    setIsSendingMsg(true);

    const tempMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "customer",
      senderName: customerName || "Customer",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setFulfillment((prev) => ({
      ...prev,
      chatMessages: [...(prev.chatMessages || []), tempMsg],
    }));

    await pushUpdateToServer({}, messageText);
    setIsSendingMsg(false);
  };

  const currentStage = fulfillment.stage || 1;

  return (
    <div className="space-y-6">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 1. VISUAL 4-STAGE PIPELINE PROGRESS TRACKER */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-[#10121a] rounded-3xl p-6 sm:p-7 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400">ORDER {orderNumber}</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                  TURNKEY ASSET HANDOVER
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Google AdSense &amp; Website Delivery Console
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-neutral-400 font-mono block">CURRENT STATUS</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 inline-block mt-0.5">
              {currentStage === 1 && "Stage 1: Domain Selection & Push"}
              {currentStage === 2 && "Stage 2: Master Gmail Handover"}
              {currentStage === 3 && "Stage 3: WordPress Archive Download"}
              {currentStage >= 4 && "Stage 4: Handshake Complete • 14-Day Warranty Active"}
            </span>
          </div>
        </div>

        {/* 4-Step Stepper Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6">
          {[
            { num: 1, title: "Domain Push", desc: "Select & push to registrar" },
            { num: 2, title: "Master Gmail", desc: "Credentials & 2FA codes" },
            { num: 3, title: "WP Backup", desc: "SQL database + files archive" },
            { num: 4, title: "Warranty Active", desc: "14-day escrow protection" },
          ].map((st) => {
            const isDone = currentStage > st.num;
            const isCurrent = currentStage === st.num;

            return (
              <div
                key={st.num}
                className={`p-3.5 rounded-2xl border transition-all relative ${
                  isCurrent
                    ? "bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10"
                    : isDone
                    ? "bg-neutral-900/60 border-emerald-500/30"
                    : "bg-white/[0.02] border-white/[0.06] opacity-60"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center ${
                      isDone
                        ? "bg-emerald-500 text-neutral-950"
                        : isCurrent
                        ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {isDone ? "✓" : st.num}
                  </span>
                  <span className={`text-xs font-bold ${isCurrent ? "text-white" : "text-neutral-300"}`}>
                    {st.title}
                  </span>
                </div>
                <p className="text-[10.5px] text-neutral-400 ml-8 leading-tight">{st.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Sequential Handshake Stages */}
        <div className="lg:col-span-7 space-y-6">
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* STAGE 1: DOMAIN SELECTION & FREE REGISTRAR PUSH */}
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div
            className={`rounded-3xl p-6 border transition-all ${
              currentStage === 1
                ? "bg-gradient-to-b from-[#131b26] to-[#0c1017] border-emerald-500/40 shadow-xl"
                : "bg-[#10121a] border-white/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-neutral-950 font-mono font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Domain Selection &amp; Free Registrar Push
                </h3>
              </div>
              {currentStage > 1 ? (
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Domain Pushed
                </span>
              ) : (
                <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                  ACTION REQUIRED
                </span>
              )}
            </div>

            <div className="pt-4 space-y-4 text-xs">
              {/* Destination Registrar Summary */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-neutral-400 text-[10px] block font-mono">YOUR REGISTRAR DESTINATION</span>
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {fulfillment.domainRegistrar || "Namecheap"}:{" "}
                    <span className="text-emerald-400 font-mono">{fulfillment.registrarAccount || customerEmail}</span>
                  </span>
                </div>
                <span className="text-[10.5px] font-bold text-neutral-400 bg-white/[0.06] px-2 py-1 rounded-lg">
                  Free Push SLA
                </span>
              </div>

              {/* Candidate Domains Selection */}
              {fulfillment.candidateDomains && fulfillment.candidateDomains.length > 0 && (
                <div className="space-y-2">
                  <span className="text-neutral-300 font-bold block">
                    Choose Your Approved Domain from the Available Inventory:
                  </span>
                  <div className="space-y-2">
                    {fulfillment.candidateDomains.map((cand) => {
                      const isChosen = cand.isSelected || fulfillment.selectedDomain === cand.domain;
                      return (
                        <div
                          key={cand.domain}
                          onClick={() => handleSelectDomain(cand.domain)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isChosen
                              ? "bg-emerald-500/15 border-emerald-400 text-white ring-1 ring-emerald-500/40 shadow-md"
                              : "bg-white/[0.02] border-white/[0.06] hover:border-white/20 text-neutral-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isChosen ? "border-emerald-400 bg-emerald-500" : "border-neutral-600 bg-neutral-900"
                              }`}
                            >
                              {isChosen && <div className="w-1.5 h-1.5 rounded-full bg-neutral-950 font-bold" />}
                            </div>
                            <div>
                              <span className="font-mono font-bold text-sm text-white block select-all">
                                {cand.domain}
                              </span>
                              <span className="text-[11px] text-neutral-400">{cand.niche}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            {isChosen ? (
                              <span className="text-[10px] font-bold text-neutral-950 bg-emerald-400 px-2.5 py-1 rounded-lg">
                                SELECTED
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="text-[11px] font-bold text-blue-400 hover:text-blue-300"
                              >
                                Select This &rarr;
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Push Notes & EPP Code */}
              {fulfillment.domainPushNotes && (
                <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/20 space-y-1">
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase block">
                    Fulfillment Operations Update
                  </span>
                  <p className="text-neutral-300 text-xs leading-relaxed">{fulfillment.domainPushNotes}</p>
                </div>
              )}

              {fulfillment.domainEppCode && (
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-neutral-400 text-[10px] font-mono block">DOMAIN AUTHORIZATION / EPP CODE</span>
                    <span className="font-mono font-bold text-white text-xs select-all">
                      {fulfillment.domainEppCode}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(fulfillment.domainEppCode || "", "epp")}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    {copiedKey === "epp" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "epp" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              )}

              {/* Action Button for Stage 1 */}
              {currentStage === 1 && (
                <div className="pt-2">
                  <button
                    onClick={handleConfirmDomainReceived}
                    disabled={isUpdating}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Domain Received in Registrar &rarr; Proceed to Stage 2</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* STAGE 2: MASTER GMAIL & 2FA CREDENTIALS */}
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div
            className={`rounded-3xl p-6 border transition-all ${
              currentStage === 2
                ? "bg-gradient-to-b from-[#171524] to-[#0d0a17] border-purple-500/40 shadow-xl"
                : "bg-[#10121a] border-white/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-6 h-6 rounded-full font-mono font-bold text-xs flex items-center justify-center ${
                    currentStage >= 2 ? "bg-purple-500 text-white" : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  2
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Master Gmail Account &amp; 2FA Handover
                </h3>
              </div>
              {currentStage > 2 ? (
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Gmail Secured
                </span>
              ) : currentStage === 2 ? (
                <span className="text-[11px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                  IN PROGRESS
                </span>
              ) : (
                <span className="text-[11px] text-neutral-500">Unlocks after Stage 1</span>
              )}
            </div>

            <div className="pt-4 space-y-4 text-xs">
              {currentStage >= 2 && fulfillment.masterGmail ? (
                <>
                  {/* Credentials Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Gmail ID */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">PRIMARY GMAIL LOGIN</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white text-xs select-all truncate">
                          {fulfillment.masterGmail.email}
                        </span>
                        <button
                          onClick={() => handleCopy(fulfillment.masterGmail?.email || "", "gmail-id")}
                          className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 shrink-0 ml-2"
                        >
                          {copiedKey === "gmail-id" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === "gmail-id" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Temporary Password */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">TEMPORARY PASSWORD</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white text-xs select-all">
                          {showPassword ? fulfillment.masterGmail.password : "••••••••••••••••"}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-neutral-400 hover:text-white text-xs"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleCopy(fulfillment.masterGmail?.password || "", "gmail-pwd")}
                            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                          >
                            {copiedKey === "gmail-pwd" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedKey === "gmail-pwd" ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2FA Single-Use Backup Codes */}
                  {fulfillment.masterGmail.backupCodes && fulfillment.masterGmail.backupCodes.length > 0 && (
                    <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-purple-400" />
                          2FA Single-Use Backup Verification Codes:
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          Use any code if prompted for 2FA
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {fulfillment.masterGmail.backupCodes.map((code, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleCopy(code, `code-${idx}`)}
                            className="p-2 rounded-xl bg-neutral-950/70 border border-purple-500/20 hover:border-purple-400/50 flex items-center justify-between font-mono text-white text-xs cursor-pointer group"
                          >
                            <span>{code}</span>
                            <span className="text-[10px] text-purple-400 group-hover:text-purple-300 font-sans">
                              {copiedKey === `code-${idx}` ? "✓" : "Copy"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step-by-Step Instructions */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5 text-neutral-300">
                    <strong className="text-white block text-xs">Security Handover Checklist:</strong>
                    <ol className="list-decimal list-inside space-y-1 text-neutral-400 text-[11px] leading-relaxed">
                      <li>Log in at <strong>google.com</strong> with the Gmail credentials above.</li>
                      <li>When prompted for 2-step verification, select &quot;Try another way&quot; &rarr; &quot;Enter an 8-digit backup code&quot;.</li>
                      <li>Go to <strong>myaccount.google.com/security</strong>.</li>
                      <li>Update the <strong>Recovery Phone Number</strong> and <strong>Recovery Email</strong> to your personal contacts.</li>
                      <li>Change the account password to complete full ownership transfer.</li>
                    </ol>
                  </div>

                  {currentStage === 2 && (
                    <button
                      onClick={handleConfirmGmailSecured}
                      disabled={isUpdating}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Google Account Secured &amp; Password Changed &rarr; Stage 3</span>
                    </button>
                  )}
                </>
              ) : (
                <p className="text-neutral-500 text-xs">
                  Credentials and single-use 2FA backup codes will be displayed here as soon as Stage 1 (Domain Push) is confirmed.
                </p>
              )}
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* STAGE 3: WORDPRESS BACKUP & SQL DATABASE */}
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div
            className={`rounded-3xl p-6 border transition-all ${
              currentStage === 3
                ? "bg-gradient-to-b from-[#131924] to-[#090e17] border-blue-500/40 shadow-xl"
                : "bg-[#10121a] border-white/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-6 h-6 rounded-full font-mono font-bold text-xs flex items-center justify-center ${
                    currentStage >= 3 ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  3
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Full WordPress Website &amp; SQL Database Backup
                </h3>
              </div>
              {currentStage > 3 ? (
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Files Downloaded
                </span>
              ) : currentStage === 3 ? (
                <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                  READY TO DOWNLOAD
                </span>
              ) : (
                <span className="text-[11px] text-neutral-500">Unlocks in Stage 3</span>
              )}
            </div>

            <div className="pt-4 space-y-4 text-xs">
              {currentStage >= 3 && fulfillment.websiteBackup ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={fulfillment.websiteBackup.backupDownloadUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-between text-left transition-colors group"
                    >
                      <div>
                        <span className="font-bold text-white text-xs block group-hover:text-blue-300">
                          WordPress Full Archive (.wpress / .zip)
                        </span>
                        <span className="text-[10px] text-neutral-400">Themes, plugins, uploads &amp; indexed posts</span>
                      </div>
                      <Download className="w-4 h-4 text-blue-400 shrink-0 ml-2" />
                    </a>

                    <a
                      href={fulfillment.websiteBackup.sqlDownloadUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-between text-left transition-colors group"
                    >
                      <div>
                        <span className="font-bold text-white text-xs block group-hover:text-blue-300">
                          SQL Database Export (.sql.gz)
                        </span>
                        <span className="text-[10px] text-neutral-400">Complete database with all SEO articles</span>
                      </div>
                      <Download className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    </a>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-neutral-300">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>1-Click Restore Guide for Hostinger, Namecheap &amp; cPanel</span>
                    </div>
                    <a
                      href={fulfillment.websiteBackup.restoreGuideUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <span>View Guide</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {currentStage === 3 && (
                    <button
                      onClick={handleConfirmBackupDownloaded}
                      disabled={isUpdating}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Files Downloaded &rarr; Activate 14-Day Warranty (Complete)</span>
                    </button>
                  )}
                </>
              ) : (
                <p className="text-neutral-500 text-xs">
                  Full WordPress files and SQL database download links will become available upon completing Stage 2.
                </p>
              )}
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {/* STAGE 4: WARRANTY ACTIVATION & FINAL VERIFICATION */}
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div
            className={`rounded-3xl p-6 border transition-all ${
              currentStage >= 4
                ? "bg-gradient-to-b from-[#101b15] to-[#090f0c] border-emerald-500/50 shadow-xl"
                : "bg-[#10121a] border-white/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-6 h-6 rounded-full font-mono font-bold text-xs flex items-center justify-center ${
                    currentStage >= 4 ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  4
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Handshake Complete &amp; 14-Day Warranty Certificate
                </h3>
              </div>
              {currentStage >= 4 ? (
                <span className="text-[11px] font-bold text-neutral-950 bg-emerald-400 px-3 py-1 rounded-full">
                  PROTECTED &amp; ACTIVE
                </span>
              ) : (
                <span className="text-[11px] text-neutral-500">Unlocks upon completion</span>
              )}
            </div>

            <div className="pt-4 space-y-3 text-xs">
              {currentStage >= 4 && fulfillment.warranty ? (
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase">
                        CERTIFICATE OF COMPLIANCE &amp; ESCROW PROTECTION
                      </span>
                      <strong className="text-sm font-mono text-white block">
                        {fulfillment.warranty.certificateId}
                      </strong>
                    </div>
                    <span className="text-xs font-mono text-emerald-300">
                      Protected through: <strong>{fulfillment.warranty.validUntil}</strong>
                    </span>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/20 grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Zero active policy violations verified</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>No bot ad-loading / organic traffic only</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Accrued organic balance remains in account</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Full replacement guarantee active</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-500 text-xs">
                  Your 14-day replacement escrow warranty certificate activates automatically as soon as the handover stages are finalized.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Live Real-Time Handshake Chat */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-[#0c0e17] border border-white/[0.08] p-5 sm:p-6 shadow-2xl h-[650px]">
          {/* Chat Header */}
          <div className="pb-3 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Order Handshake Desk</span>
                </h4>
                <span className="text-[10px] text-neutral-400">Live with Nexus AdSense Specialist</span>
              </div>
            </div>

            <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.04] px-2 py-0.5 rounded">
              Order #{orderNumber}
            </span>
          </div>

          {/* Messages Scroll Container */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
            {fulfillment.chatMessages && fulfillment.chatMessages.length > 0 ? (
              fulfillment.chatMessages.map((msg) => {
                const isMe = msg.sender === "customer";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-neutral-400">
                      <span className="font-semibold">{msg.senderName}</span>
                      <span>• {msg.time}</span>
                    </div>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        isMe
                          ? "bg-blue-600 text-white rounded-br-xs"
                          : "bg-neutral-800 text-neutral-100 border border-white/10 rounded-bl-xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-neutral-500 text-xs">
                No messages yet. Send a message to your assigned technician below.
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/[0.08]">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Reply with 2FA code, Namecheap username, or questions..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isSendingMsg || !chatInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
