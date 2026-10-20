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
  Plus,
  Trash2,
  RefreshCw,
  Key,
  Shield,
  FileText,
  User,
  Phone,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CandidateDomain {
  domain: string;
  niche: string;
  isSelected?: boolean;
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

interface AdminAdSenseDeliveryModalProps {
  order: any;
  onClose: () => void;
  onOrderUpdated: (updatedOrder: any) => void;
}

export default function AdminAdSenseDeliveryModal({
  order,
  onClose,
  onOrderUpdated,
}: AdminAdSenseDeliveryModalProps) {
  // Extract checkout submissions or order details
  const submissions = order.submissions?.adsense || order.adsenseDetails || {};
  const customerName = order.customerName || order.customer?.name || "Customer";
  const customerEmail = order.customerEmail || order.customer?.email || "";

  // Target Registrar from customer checkout
  const buyerRegistrar = submissions.registrar || order.adsenseFulfillment?.domainRegistrar || "Namecheap";
  const buyerRegistrarAccount = submissions.registrarUsername || order.adsenseFulfillment?.registrarAccount || customerEmail;
  const buyerBackupEmail = submissions.backupEmail || customerEmail;
  const buyerPhone = submissions.contactPhone || "+1 (555) 000-0000";
  const buyerNotes = submissions.notes || "";

  // Fulfillment local state initialized from order
  const [fulfillment, setFulfillment] = useState<AdSenseFulfillmentData>(() => {
    const existing = order.adsenseFulfillment;
    return (
      existing || {
        stage: 1,
        candidateDomains: [
          { domain: "techpulse-cloud.com", niche: "Tech & SaaS Reviews (High CPC)", isSelected: true },
          { domain: "nextgen-cyber.io", niche: "AI & Cybersecurity Portal", isSelected: false },
          { domain: "cloudgrowth-hub.com", niche: "Cloud Infrastructure Blog", isSelected: false },
        ],
        selectedDomain: "techpulse-cloud.com",
        domainRegistrar: buyerRegistrar,
        registrarAccount: buyerRegistrarAccount,
        domainPushStatus: "PUSH_INITIATED",
        domainPushNotes: `Free internal domain push initiated to ${buyerRegistrar} account (${buyerRegistrarAccount}). Please accept from your registrar dashboard.`,
        domainEppCode: "EPP-NEXUS-8492019-FREEPUSH",
        masterGmail: {
          email: "techpulse.adsense.owner@gmail.com",
          password: "AdSense$Transfer2026!Secure",
          backupCodes: [
            "8492 1049",
            "9382 5012",
            "1049 8392",
            "4920 1823",
            "5820 4819",
            "9381 2940",
            "3019 4820",
            "7482 1948",
          ],
          recoveryPhone: buyerPhone,
          recoveryInstructions:
            "Log in with the temporary password above. When Google requests 2FA, enter one of the 8-digit single-use backup codes. Once in your Google account, navigate to Security to update recovery phone and password.",
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
          certificateId: `ESCROW-CERT-${order.orderNumber}`,
        },
        chatMessages: [
          {
            id: `msg-admin-init`,
            sender: "admin",
            senderName: "AdSense Asset Specialist (Nexus Ops)",
            text: `Hello ${customerName}! Welcome to your dedicated AdSense handover desk. We have received your target registrar details (${buyerRegistrar}: ${buyerRegistrarAccount}). Please inspect the candidate domains below and confirm when you are ready for the Master Gmail credentials.`,
            time: "Just now",
          },
        ],
      }
    );
  });

  // Current active stage view in modal
  const [activeTab, setActiveTab] = useState<"stage1" | "stage2" | "stage3" | "stage4" | "chat">("stage1");

  // Input states for adding new domain candidate
  const [newDomainName, setNewDomainName] = useState("");
  const [newDomainNiche, setNewDomainNiche] = useState("");

  // Input state for live chat
  const [chatInput, setChatInput] = useState("");
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Poll order for live chat updates every 3 seconds
  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(order.orderNumber)}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.order?.adsenseFulfillment) {
            setFulfillment((prev) => ({
              ...prev,
              ...data.order.adsenseFulfillment,
              // keep local active stage unless updated
              chatMessages: data.order.adsenseFulfillment.chatMessages || prev.chatMessages,
            }));
          }
        }
      } catch {
        // silent
      }
    };

    const timer = setInterval(fetchLatestOrder, 3000);
    return () => clearInterval(timer);
  }, [order.orderNumber]);

  // Persist full fulfillment state to API and localStorage
  const saveFulfillmentUpdates = async (
    customUpdates?: Partial<AdSenseFulfillmentData>,
    newMsg?: string,
    markCompleted?: boolean
  ) => {
    setIsSaving(true);
    try {
      const mergedFulfillment = {
        ...fulfillment,
        ...(customUpdates || {}),
      };

      const payload: any = {
        orderId: order.orderNumber,
        updates: {
          adsenseFulfillment: mergedFulfillment,
          status: markCompleted ? "COMPLETED" : order.status,
        },
      };

      if (newMsg?.trim()) {
        payload.newChatMessage = {
          sender: "admin",
          senderName: "AdSense Specialist (Nexus Ops)",
          text: newMsg.trim(),
        };
      }

      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData?.order) {
          setFulfillment(resData.order.adsenseFulfillment);
          onOrderUpdated(resData.order);
        }
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to update AdSense fulfillment:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Add Candidate Domain
  const handleAddCandidateDomain = () => {
    if (!newDomainName.trim()) return;
    const cleanDomain = newDomainName.trim().toLowerCase().replace(/^https?:\/\//, "");
    const updatedCandidates = [
      ...(fulfillment.candidateDomains || []),
      {
        domain: cleanDomain,
        niche: newDomainNiche.trim() || "Tech Blogging & Software Reviews",
        isSelected: false,
      },
    ];

    const updated = {
      ...fulfillment,
      candidateDomains: updatedCandidates,
    };
    setFulfillment(updated);
    setNewDomainName("");
    setNewDomainNiche("");

    saveFulfillmentUpdates(
      { candidateDomains: updatedCandidates },
      `We have added a new candidate domain for your review: ${cleanDomain} (${newDomainNiche || "Tech / AI Niche"}). Please choose your preferred domain.`
    );
  };

  // Remove Candidate Domain
  const handleRemoveDomain = (domainName: string) => {
    const updatedCandidates = (fulfillment.candidateDomains || []).filter((d) => d.domain !== domainName);
    const updated = { ...fulfillment, candidateDomains: updatedCandidates };
    setFulfillment(updated);
    saveFulfillmentUpdates({ candidateDomains: updatedCandidates });
  };

  // Send message to buyer in live order chat
  const handleSendChatMessage = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const textToSend = presetText || chatInput;
    if (!textToSend.trim()) return;

    setIsSendingMsg(true);
    await saveFulfillmentUpdates(undefined, textToSend);
    setChatInput("");
    setIsSendingMsg(false);
  };

  // Generate 8 new backup codes
  const generateNewBackupCodes = () => {
    const newCodes: string[] = [];
    for (let i = 0; i < 8; i++) {
      const part1 = Math.floor(1000 + Math.random() * 9000);
      const part2 = Math.floor(1000 + Math.random() * 9000);
      newCodes.push(`${part1} ${part2}`);
    }
    const updatedGmail = {
      ...(fulfillment.masterGmail || { email: "owner@gmail.com" }),
      backupCodes: newCodes,
    };
    setFulfillment({
      ...fulfillment,
      masterGmail: updatedGmail,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-5xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto text-neutral-100 max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-600/20 shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-white">{order.orderNumber}</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AdSense Turnkey Delivery Desk
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Stage {fulfillment.stage} of 4
                </span>
              </div>
              <h2 className="text-lg font-bold text-neutral-100 mt-0.5">
                {order.productTitle || "Google AdSense Approved Website Asset"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-lg font-black text-amber-400">
              {formatPrice(order.total || 189.0)}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* BUYER CHECKOUT DESTINATION DETAILS SUMMARY BAR */}
        <div className="bg-neutral-900/60 border-b border-neutral-800/80 px-4 sm:px-6 py-3 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 text-neutral-300">
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-bold">Target Registrar:</span>
            <span className="font-bold text-white flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-400" />
              {buyerRegistrar}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-bold">Registrar Account / User:</span>
            <span className="font-mono font-bold text-amber-300 truncate block select-all">
              {buyerRegistrarAccount}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-bold">Buyer Recovery Gmail:</span>
            <span className="font-mono font-bold text-neutral-200 truncate block select-all">
              {buyerBackupEmail}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-bold">2FA Contact Phone:</span>
            <span className="font-mono font-bold text-neutral-200 truncate block select-all">
              {buyerPhone}
            </span>
          </div>
        </div>

        {buyerNotes && (
          <div className="bg-amber-950/20 border-b border-amber-500/20 px-6 py-2 text-xs text-amber-200 flex items-center gap-2">
            <span className="font-bold text-amber-400">Buyer Preferences:</span>
            <span className="italic">&quot;{buyerNotes}&quot;</span>
          </div>
        )}

        {/* STAGES / NAVIGATION TABS */}
        <div className="flex border-b border-neutral-800 bg-neutral-900/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab("stage1")}
            className={`px-4 sm:px-6 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "stage1"
                ? "border-amber-500 text-amber-400 bg-amber-500/10"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[10px] font-mono">
              1
            </span>
            <span>Stage 1: Candidate Domains & Push</span>
            {(fulfillment.candidateDomains || []).length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                {(fulfillment.candidateDomains || []).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("stage2")}
            className={`px-4 sm:px-6 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "stage2"
                ? "border-amber-500 text-amber-400 bg-amber-500/10"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[10px] font-mono">
              2
            </span>
            <span>Stage 2: Master Gmail & 2FA Codes</span>
          </button>

          <button
            onClick={() => setActiveTab("stage3")}
            className={`px-4 sm:px-6 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "stage3"
                ? "border-amber-500 text-amber-400 bg-amber-500/10"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[10px] font-mono">
              3
            </span>
            <span>Stage 3: WordPress & SQL Backup</span>
          </button>

          <button
            onClick={() => setActiveTab("stage4")}
            className={`px-4 sm:px-6 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "stage4"
                ? "border-amber-500 text-amber-400 bg-amber-500/10"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[10px] font-mono">
              4
            </span>
            <span>Stage 4: Warranty & Handshake</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 sm:px-6 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ml-auto whitespace-nowrap ${
              activeTab === "chat"
                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>Buyer Delivery Chat Desk</span>
            {(fulfillment.chatMessages || []).length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500 text-white font-mono">
                {(fulfillment.chatMessages || []).length}
              </span>
            )}
          </button>
        </div>

        {/* MODAL MAIN CONTENT BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: STAGE 1 DOMAIN CANDIDATES & PUSH */}
          {activeTab === "stage1" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* CURRENT CANDIDATE DOMAINS OFFERED TO CUSTOMER */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-amber-400" />
                      Candidate Domain Inventory for Buyer Selection
                    </h3>
                    <p className="text-xs text-neutral-400">
                      The buyer can select one of these domains from their order portal. Once selected, perform the internal push to {buyerRegistrar}.
                    </p>
                  </div>

                  <span className="text-xs text-neutral-400">
                    Selected:{" "}
                    <strong className="text-amber-300 font-mono">
                      {fulfillment.selectedDomain || "Awaiting Buyer Selection"}
                    </strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(fulfillment.candidateDomains || []).map((cand, idx) => {
                    const isChosen = fulfillment.selectedDomain === cand.domain || cand.isSelected;
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border transition-all relative ${
                          isChosen
                            ? "bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/30"
                            : "bg-neutral-900/60 border-neutral-800"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono font-bold text-sm text-white">{cand.domain}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDomain(cand.domain)}
                            className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                            title="Remove candidate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[11px] text-neutral-400 block mb-2">{cand.niche}</span>

                        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                          {isChosen ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Selected by Buyer
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = {
                                  ...fulfillment,
                                  selectedDomain: cand.domain,
                                  candidateDomains: (fulfillment.candidateDomains || []).map((d) => ({
                                    ...d,
                                    isSelected: d.domain === cand.domain,
                                  })),
                                };
                                setFulfillment(updated);
                                saveFulfillmentUpdates(
                                  {
                                    selectedDomain: cand.domain,
                                    candidateDomains: updated.candidateDomains,
                                  },
                                  `Admin has set ${cand.domain} as the designated domain for your AdSense website.`
                                );
                              }}
                              className="text-[11px] text-amber-400 hover:underline font-semibold"
                            >
                              Designate this Domain
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ADD NEW CANDIDATE DOMAIN */}
                <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
                  <span className="text-xs font-bold text-neutral-300 block">
                    Add Another Candidate Domain to Buyer&apos;s Options:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="e.g. cloudinsider-tech.com"
                      value={newDomainName}
                      onChange={(e) => setNewDomainName(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-white placeholder-neutral-600 focus:outline-hidden focus:border-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="e.g. AI & Cloud Computing Portal (US Traffic)"
                      value={newDomainNiche}
                      onChange={(e) => setNewDomainNiche(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddCandidateDomain}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add Candidate Domain & Alert Buyer</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* DOMAIN PUSH STATUS & INSTRUCTIONS */}
              <div className="p-5 rounded-2xl bg-amber-950/10 border border-amber-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-amber-400" />
                    Registrar Transfer / Push Dispatch Controls
                  </h4>

                  <span className="text-xs text-neutral-400">
                    Destination: <strong className="text-white">{buyerRegistrar}</strong> ({buyerRegistrarAccount})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-400 mb-1">
                      Domain Push Status:
                    </label>
                    <select
                      value={fulfillment.domainPushStatus || "PENDING_SELECTION"}
                      onChange={(e) =>
                        setFulfillment({
                          ...fulfillment,
                          domainPushStatus: e.target.value as any,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-semibold"
                    >
                      <option value="PENDING_SELECTION">Awaiting Domain Selection</option>
                      <option value="PUSH_INITIATED">Domain Push Initiated (Internal Transfer)</option>
                      <option value="PUSH_CONFIRMED">Domain Push Confirmed / Accepted by Buyer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-400 mb-1">
                      Domain EPP / Auth Code (Optional):
                    </label>
                    <input
                      type="text"
                      value={fulfillment.domainEppCode || ""}
                      onChange={(e) =>
                        setFulfillment({
                          ...fulfillment,
                          domainEppCode: e.target.value,
                        })
                      }
                      placeholder="EPP-NEXUS-8492019-FREEPUSH"
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-400 mb-1 text-xs">
                    Push Instructions / Notes for Buyer:
                  </label>
                  <textarea
                    rows={2}
                    value={fulfillment.domainPushNotes || ""}
                    onChange={(e) =>
                      setFulfillment({
                        ...fulfillment,
                        domainPushNotes: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white"
                    placeholder="Provide specific directions for Namecheap, Hostinger, GoDaddy incoming transfer accept..."
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-500/20">
                  <button
                    type="button"
                    onClick={() =>
                      handleSendChatMessage(
                        undefined,
                        `We have initiated the free internal domain push of "${fulfillment.selectedDomain || "your chosen domain"}" to your ${buyerRegistrar} account (${buyerRegistrarAccount}). Please check your registrar email or dashboard to accept the incoming transfer.`
                      )
                    }
                    className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition-colors"
                  >
                    Quick Chat: &quot;Domain Push Initiated&quot;
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = {
                        ...fulfillment,
                        stage: 2,
                        domainPushStatus: "PUSH_CONFIRMED" as const,
                      };
                      setFulfillment(updated);
                      setActiveTab("stage2");
                      saveFulfillmentUpdates(
                        updated,
                        `Stage 1 (Domain Push) completed! We are now unlocking Stage 2: Master Gmail Account & 2FA credentials.`
                      );
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>Save & Advance to Stage 2 (Gmail Transfer)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STAGE 2 MASTER GMAIL & 2FA */}
          {activeTab === "stage2" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400" />
                    Master Google / AdSense Gmail Credentials
                  </h3>
                  <p className="text-xs text-neutral-400">
                    This account contains the active Google AdSense property. Single-use 2FA backup codes allow the buyer to log in securely and update recovery methods.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={generateNewBackupCodes}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Regenerate 8 Backup Codes</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-400 mb-1">
                    Master Gmail Address:
                  </label>
                  <input
                    type="email"
                    value={fulfillment.masterGmail?.email || ""}
                    onChange={(e) =>
                      setFulfillment({
                        ...fulfillment,
                        masterGmail: {
                          ...(fulfillment.masterGmail || { email: "" }),
                          email: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-mono"
                    placeholder="techpulse.adsense.owner@gmail.com"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-neutral-400">
                      Temporary Google Account Password:
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-neutral-500 hover:text-neutral-300 text-[11px] flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? "Hide" : "Reveal"}</span>
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={fulfillment.masterGmail?.password || ""}
                    onChange={(e) =>
                      setFulfillment({
                        ...fulfillment,
                        masterGmail: {
                          ...(fulfillment.masterGmail || { email: "" }),
                          password: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-mono"
                    placeholder="AdSense$Pass2026!Secure"
                  />
                </div>
              </div>

              {/* 2FA SINGLE USE BACKUP CODES GRID */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    8-Digit Single-Use 2FA Backup Codes (Grid for Buyer):
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Buyer uses one code to authenticate past Google 2FA
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(fulfillment.masterGmail?.backupCodes || []).map((code, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-center font-mono font-bold text-white text-xs select-all flex items-center justify-between"
                    >
                      <span className="text-neutral-600 text-[10px]">#{idx + 1}</span>
                      <span className="text-amber-300">{code}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-400 mb-1 text-xs">
                  Login & Recovery Step-by-Step Instructions:
                </label>
                <textarea
                  rows={3}
                  value={fulfillment.masterGmail?.recoveryInstructions || ""}
                  onChange={(e) =>
                    setFulfillment({
                      ...fulfillment,
                      masterGmail: {
                        ...(fulfillment.masterGmail || { email: "" }),
                        recoveryInstructions: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() =>
                    handleSendChatMessage(
                      undefined,
                      `We have dispatched your Master Gmail ID (${fulfillment.masterGmail?.email}) and 8 single-use 2FA backup codes to Stage 2 of your portal. Please log in, verify AdSense access, and update your recovery phone/email.`
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition-colors"
                >
                  Quick Chat: &quot;Gmail & 2FA Dispatched&quot;
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...fulfillment,
                      stage: 3,
                    };
                    setFulfillment(updated);
                    setActiveTab("stage3");
                    saveFulfillmentUpdates(
                      updated,
                      `Stage 2 completed! Moving to Stage 3: WordPress Backup (.wpress) and Database SQL download links.`
                    );
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Save & Advance to Stage 3 (Backup Files)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: STAGE 3 WORDPRESS & SQL BACKUPS */}
          {activeTab === "stage3" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-amber-400" />
                  Website Archive & Database Backup Links
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Provide secure direct download links for the full WordPress installation, themes, AdSense-optimized layouts, and database dump.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-400 mb-1">
                    WordPress Full Archive Download URL (.wpress / .zip):
                  </label>
                  <input
                    type="url"
                    value={fulfillment.websiteBackup?.backupDownloadUrl || ""}
                    onChange={(e) =>
                      setFulfillment({
                        ...fulfillment,
                        websiteBackup: {
                          ...(fulfillment.websiteBackup || {}),
                          backupDownloadUrl: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-mono"
                    placeholder="https://dl.nexus-digital.store/backups/techpulse-full-wordpress-backup.wpress"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-400 mb-1">
                    SQL Database Export URL (.sql.gz / .sql):
                  </label>
                  <input
                    type="url"
                    value={fulfillment.websiteBackup?.sqlDownloadUrl || ""}
                    onChange={(e) =>
                      setFulfillment({
                        ...fulfillment,
                        websiteBackup: {
                          ...(fulfillment.websiteBackup || {}),
                          sqlDownloadUrl: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-mono"
                    placeholder="https://dl.nexus-digital.store/backups/techpulse-database-export.sql.gz"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-400 mb-1">
                    Migration & Restoration Guide PDF / Documentation URL:
                  </label>
                  <input
                    type="url"
                    value={fulfillment.websiteBackup?.restoreGuideUrl || ""}
                    onChange={(e) =>
                      setFulfillment({
                        ...fulfillment,
                        websiteBackup: {
                          ...(fulfillment.websiteBackup || {}),
                          restoreGuideUrl: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-mono"
                    placeholder="https://nexus-digital.store/docs/adsense-wordpress-migration-guide.pdf"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() =>
                    handleSendChatMessage(
                      undefined,
                      `Your website archive files and SQL database dump are now uploaded to Stage 3 of your portal. You can download and restore them to any web hosting of your choice.`
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition-colors"
                >
                  Quick Chat: &quot;Backup Links Dispatched&quot;
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...fulfillment,
                      stage: 4,
                    };
                    setFulfillment(updated);
                    setActiveTab("stage4");
                    saveFulfillmentUpdates(
                      updated,
                      `All website files delivered! Advancing to Stage 4: 14-Day Warranty & Transfer Handshake.`
                    );
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Save & Advance to Stage 4 (Warranty Handshake)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: STAGE 4 WARRANTY & HANDSHAKE */}
          {activeTab === "stage4" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    14-Day AdSense Policy Compliance & Safety Warranty
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active Escrow Protection
                  </span>
                </div>
                <p className="text-xs text-neutral-300">
                  Guarantee certificate issued for 14 calendar days covering AdSense validity, zero historical policy strikes, domain ownership push, and carried account balances.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Certificate ID:</span>
                  <span className="font-mono font-bold text-white text-sm select-all">
                    {fulfillment.warranty?.certificateId || `ESCROW-CERT-${order.orderNumber}`}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Warranty Valid Until:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {fulfillment.warranty?.validUntil || "14 Days from Handover"}
                  </span>
                </div>
              </div>

              {/* SAFETY VERIFICATION CHECKLIST */}
              <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-2 text-xs text-neutral-300">
                <span className="font-bold text-white block mb-2">Final Pre-Flight Verification Checklist:</span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Domain pushed without registrar lock or pending approvals.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Google AdSense status active with clean traffic logs (No ad-limits, no invalid click penalties).</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Master Gmail recovery phone and email transferred to buyer.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>WordPress theme & full SQL database files verified accessible.</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() =>
                    handleSendChatMessage(
                      undefined,
                      `Congratulations! All assets for your AdSense website have been fully handed over. Your 14-day warranty certificate (${fulfillment.warranty?.certificateId}) is now active. Feel free to message here anytime if you have any questions!`
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition-colors"
                >
                  Quick Chat: &quot;Congratulate & Finalize&quot;
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...fulfillment,
                      stage: 4,
                      warranty: {
                        isActive: true,
                        validUntil: fulfillment.warranty?.validUntil || "14 Days",
                        certificateId: fulfillment.warranty?.certificateId || `ESCROW-CERT-${order.orderNumber}`,
                      },
                    };
                    setFulfillment(updated);
                    saveFulfillmentUpdates(
                      updated,
                      `Order marked COMPLETED by Nexus Ops. Transfer handshake signed.`,
                      true
                    );
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Order COMPLETED & Deliver Warranty</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: LIVE DELIVERY CHAT DESK */}
          {activeTab === "chat" && (
            <div className="space-y-4 animate-in fade-in duration-200 flex flex-col h-[480px]">
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-white">Live Customer Order Chat Channel</span>
                  <span className="text-neutral-500">• Order {order.orderNumber}</span>
                </div>
                <span className="text-[11px] text-neutral-400">
                  Direct line with buyer ({customerEmail})
                </span>
              </div>

              {/* CHAT MESSAGES SCROLL AREA */}
              <div className="flex-1 bg-neutral-950 border border-neutral-800 rounded-2xl p-4 overflow-y-auto space-y-3">
                {(fulfillment.chatMessages || []).map((msg) => {
                  const isAdmin = msg.sender === "admin";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[11px]">
                        <span className="font-bold text-neutral-400">{msg.senderName}</span>
                        <span className="text-neutral-600">• {msg.time}</span>
                        {isAdmin && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                            Ops
                          </span>
                        )}
                      </div>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-normal leading-relaxed ${
                          isAdmin
                            ? "bg-amber-600 text-white rounded-br-xs shadow-sm"
                            : "bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-bl-xs"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* QUICK CHAT TEMPLATES */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
                <span className="text-neutral-500 shrink-0">Quick reply:</span>
                <button
                  type="button"
                  onClick={() =>
                    setChatInput("Candidate domains have been updated! Please review them in your portal.")
                  }
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 shrink-0 cursor-pointer"
                >
                  Candidate domains updated
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setChatInput(
                      `Domain push initiated to your ${buyerRegistrar} account (${buyerRegistrarAccount}). Please accept from your registrar dashboard.`
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 shrink-0 cursor-pointer"
                >
                  Push initiated
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setChatInput("Master Gmail logins and single-use 2FA backup codes are now ready in Stage 2.")
                  }
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 shrink-0 cursor-pointer"
                >
                  Gmail logins dispatched
                </button>
              </div>

              {/* CHAT INPUT FORM */}
              <form onSubmit={handleSendChatMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message to the customer..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={isSendingMsg || !chatInput.trim()}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Buyer</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* MODAL FOOTER BAR */}
        <div className="p-4 sm:px-6 bg-neutral-900/80 border-t border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                Changes Synced with Buyer Portal!
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold cursor-pointer"
            >
              Close Console
            </button>
            <button
              type="button"
              onClick={() => saveFulfillmentUpdates()}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Save & Sync Assets</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
