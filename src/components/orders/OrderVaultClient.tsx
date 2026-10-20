"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Key,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Wrench,
  Globe,
  ShieldCheck,
  Download,
  Ticket,
  Star,
  MessageSquare,
  CreditCard,
  User,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Gamepad2,
  Cpu,
  Layers,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  FileText,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import CredentialPurgeTimer from "@/components/security/CredentialPurgeTimer";
import { findOrderRecord, OrderRecord } from "@/data/mockOrders";
import { generateOrderPdf } from "@/lib/pdfGenerator";
import AdSenseOrderHandoffPortal from "@/components/orders/AdSenseOrderHandoffPortal";

interface OrderVaultClientProps {
  orderId: string;
}

export default function OrderVaultClient({ orderId }: OrderVaultClientProps) {
  const cleanId = orderId?.toUpperCase() || "";
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const record = findOrderRecord(cleanId);
    if (record) {
      setActiveOrder(record);
    } else {
      // Default fallback for any custom order ID entered
      const fallback: OrderRecord = {
        id: cleanId,
        orderNumber: cleanId,
        customerName: "Alex Mercer",
        customerEmail: "alex.mercer@gmail.com",
        productTitle: "WP Rocket - Caching & Core Web Vitals Accelerator (1 Website — 1 Year)",
        category: "wordpress-plugin",
        deliveryType: "SERVICE_SETUP",
        status: "PROCESSING",
        total: 15.0,
        paymentRail: "Credit Card (Stripe)",
        transactionId: `pi_3Ovy_${cleanId.replace("NEX-", "")}`,
        createdAt: "October 19, 2026, 06:14 AM",
        itemDetails: {
          id: "prod-wp-rocket",
          title: "WP Rocket Speed Accelerator",
          tierOrVariant: "1 Website — 1 Year Official Agency Activation",
          categoryName: "WordPress Plugins",
          price: 15.0,
          quantity: 1,
          billingPeriod: "1 Year",
        },
        serviceCredentials: {
          wpAdminUrl: "https://mercerdigital.com/wp-admin",
          wpUsername: "nexus_admin_temp",
          wpPassword: "Temp@WpRocket#2026!",
          notes: "Please enable Delay JavaScript Execution and Cloudflare CDN add-on.",
          targetItem: "WP Rocket v3.18.2",
          technicianStep: 3,
          activatedLicenseKey: "WPR-AGENCY-AUTH-772910",
        },
        purgeHours: 24,
        isPurged: false,
      };
      setActiveOrder(fallback);
    }
    setIsLoading(false);
  }, [cleanId]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = () => {
    if (!activeOrder) return;
    setIsGeneratingPdf(true);
    try {
      generateOrderPdf(activeOrder);
    } catch (err) {
      console.error("PDF generation error:", err);
      handleDownloadReceiptText();
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 1000);
    }
  };

  const handleDownloadReceiptText = () => {
    if (!activeOrder) return;
    const text = `
============================================================
           NEXUS DIGITAL COMMERCE - OFFICIAL RECEIPT
============================================================
ORDER NUMBER:       ${activeOrder.orderNumber}
TRANSACTION REF:    ${activeOrder.transactionId}
PURCHASE DATE:      ${activeOrder.createdAt}
ORDER STATUS:       ${activeOrder.status}

CUSTOMER DETAILS:
------------------------------------------------------------
Full Name:          ${activeOrder.customerName}
Account Email:      ${activeOrder.customerEmail}

PAYMENT HISTORY:
------------------------------------------------------------
Payment Method:     ${activeOrder.paymentRail}
Gross Total Paid:   $${activeOrder.total.toFixed(2)} USD
Tax / VAT (0%):     $0.00 (Cross-border Digital Goods)
Net Amount:         $${activeOrder.total.toFixed(2)} USD
Payment Status:     PAID & SETTLED

PURCHASED DIGITAL ASSET / LICENSE:
------------------------------------------------------------
Product:            ${activeOrder.productTitle}
Category:           ${activeOrder.itemDetails.categoryName}
Plan / Variant:     ${activeOrder.itemDetails.tierOrVariant}
${
  activeOrder.serviceCredentials
    ? `Target Site:        ${activeOrder.serviceCredentials.wpAdminUrl}\nTemporary User:     ${activeOrder.serviceCredentials.wpUsername}\nActivation Status:  Technician In-Progress (SLA: 30-45 mins)`
    : ""
}
${
  activeOrder.accountCredentials
    ? `Account Email:      ${activeOrder.accountCredentials.accountEmail}\nProfile / Slot:     ${activeOrder.accountCredentials.profileSlot}\nExpires At:         ${activeOrder.accountCredentials.expiresAt}`
    : ""
}
${
  activeOrder.gameGiftCode
    ? `Gift Card Code:     ${activeOrder.gameGiftCode.code}\nPlatform / Region:  ${activeOrder.gameGiftCode.platform} (${activeOrder.gameGiftCode.region})`
    : ""
}
${
  activeOrder.softwareLicense
    ? `Software Key:       ${activeOrder.softwareLicense.licenseKey}\nEdition:            ${activeOrder.softwareLicense.edition}`
    : ""
}
${
  activeOrder.deliveredAsset
    ? `Domain:             ${activeOrder.deliveredAsset.domainName}\nEPP Code:           ${activeOrder.deliveredAsset.domainEppCode}\nGoogle Login:       ${activeOrder.deliveredAsset.gmailLogin}`
    : ""
}
${
  activeOrder.dispensedKey && !activeOrder.softwareLicense && !activeOrder.gameGiftCode
    ? `License Key:        ${activeOrder.dispensedKey}`
    : ""
}

SECURITY & GUARANTEE:
------------------------------------------------------------
• 100% Genuine Digital Delivery Guarantee.
• 24/7 Dedicated Support Desk: http://localhost:3000/support
• Temporary setup credentials purged automatically within 24 hours.

Thank you for choosing NEXUS Digital Marketplace!
============================================================
    `.trim();

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NEXUS-RECEIPT-${activeOrder.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || !activeOrder) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-neutral-100 flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Decrypting Digital Asset Vault...</span>
        </div>
      </div>
    );
  }

  const isWp = activeOrder.category === "wordpress-plugin" || activeOrder.category === "wordpress-theme" || activeOrder.deliveryType === "SERVICE_SETUP";
  const isAiAccount = activeOrder.category === "ai-tools" || Boolean(activeOrder.accountCredentials);
  const isGameCode = activeOrder.category === "game-codes" || Boolean(activeOrder.gameGiftCode);
  const isSoftwareKey = activeOrder.category === "software-license" || Boolean(activeOrder.softwareLicense);
  const isAdSense =
    activeOrder.category === "adsense-websites" ||
    Boolean(activeOrder.deliveredAsset) ||
    activeOrder.deliveryType === "MANUAL_HANDOFF" ||
    (activeOrder.productTitle || "").toLowerCase().includes("adsense") ||
    Boolean((activeOrder as any).adsenseFulfillment);

  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Order Lookup</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-xs font-bold text-blue-300 hover:text-white transition-all shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>{isGeneratingPdf ? "Generating Official PDF..." : "Download PDF Invoice & Certificate"}</span>
            </button>

            <Link
              href="/support"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-all"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              <span>Priority Help</span>
            </Link>
          </div>
        </div>

        {/* CUSTOMER PROFILE & ORDER STATUS BANNER */}
        <div className="bg-[#10121a] rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600/10 via-purple-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Left: Customer & Order ID */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono font-black text-xl text-white tracking-wider">
                  {activeOrder.orderNumber}
                </span>

                {/* Status Badge */}
                {activeOrder.status === "COMPLETED" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Fulfilled & Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    <Clock className="w-3.5 h-3.5 animate-pulse text-blue-400" />
                    Technician Processing
                  </span>
                )}

                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-neutral-300 border border-white/10">
                  {activeOrder.itemDetails.categoryName}
                </span>
              </div>

              {/* Customer Name & Email Badge */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shadow-xs">
                    {activeOrder.customerName.charAt(0)}
                  </div>
                  <span className="font-semibold text-white">{activeOrder.customerName}</span>
                </div>

                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400 font-mono">{activeOrder.customerEmail}</span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400">{activeOrder.createdAt}</span>
              </div>
            </div>

            {/* Right: Total Amount Paid & Payment Method */}
            <div className="lg:text-right lg:border-l lg:border-white/[0.08] lg:pl-8 space-y-1">
              <span className="text-xs text-neutral-400 block font-medium">Total Paid Amount</span>
              <div className="text-3xl font-black font-mono text-white">
                {formatPrice(activeOrder.total)}
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                <CreditCard className="w-3.5 h-3.5" />
                <span>{activeOrder.paymentRail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY & PAYMENT HISTORY CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Purchased Item Details */}
          <div className="lg:col-span-2 bg-[#10121a] rounded-3xl border border-white/[0.08] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Purchased Digital Assets
              </span>
              <span className="text-xs font-mono text-neutral-400">1 Item</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  {activeOrder.productTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                  <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-neutral-300 font-medium">
                    {activeOrder.itemDetails.tierOrVariant}
                  </span>
                  {activeOrder.itemDetails.billingPeriod && (
                    <span className="text-neutral-500">
                      • Validity: <strong className="text-neutral-300">{activeOrder.itemDetails.billingPeriod}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-base text-white">
                  {formatPrice(activeOrder.total)}
                </span>
                <span className="block text-[11px] text-emerald-400 font-medium">Qty: 1</span>
              </div>
            </div>

            {/* Quick verified review shortcut banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#10131e] to-teal-500/10 border border-emerald-500/25 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Star className="w-4 h-4 fill-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Verified Customer Feedback</h4>
                  <p className="text-[11px] text-neutral-400">
                    Your order is authenticated. You can submit or update your verified review anytime.
                  </p>
                </div>
              </div>
              <Link
                href="/products/wp-rocket#reviews"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shrink-0 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Write Review</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Payment Receipt & History */}
          <div className="bg-[#10121a] rounded-3xl border border-white/[0.08] p-6 shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block pb-3 border-b border-white/[0.08]">
              Payment History & Receipt
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-neutral-400">
                <span>Payment Rail:</span>
                <span className="font-semibold text-white">{activeOrder.paymentRail}</span>
              </div>

              <div className="flex justify-between items-center text-neutral-400">
                <span>Transaction ID:</span>
                <span className="font-mono text-neutral-300 truncate max-w-[150px]" title={activeOrder.transactionId}>
                  {activeOrder.transactionId}
                </span>
              </div>

              <div className="flex justify-between items-center text-neutral-400">
                <span>Payment Status:</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                  <Check className="w-3.5 h-3.5" /> Confirmed
                </span>
              </div>

              <div className="flex justify-between items-center text-neutral-400">
                <span>Subtotal:</span>
                <span className="font-mono text-white">{formatPrice(activeOrder.total)}</span>
              </div>

              <div className="flex justify-between items-center text-neutral-400">
                <span>Digital VAT / Sales Tax:</span>
                <span className="font-mono text-neutral-300">$0.00</span>
              </div>

              <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center font-bold text-sm">
                <span className="text-white">Amount Charged:</span>
                <span className="font-mono text-emerald-400">{formatPrice(activeOrder.total)}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/25 cursor-pointer disabled:opacity-50"
              >
                <FileText className="w-3.5 h-3.5 text-white" />
                <span>{isGeneratingPdf ? "Generating PDF..." : "Download Official PDF Tax Invoice"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DYNAMIC ASSET DELIVERY VAULTS ACCORDING TO ORDER TYPE    */}
        {/* ======================================================== */}

        {/* VAULT CASE 1: WORDPRESS PLUGIN OR THEME SERVICE SETUP */}
        {isWp && activeOrder.serviceCredentials && (
          <div className="bg-[#10121a] rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-white">
                    WordPress Technician Activation Hub
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Target Site:{" "}
                    <a
                      href={activeOrder.serviceCredentials.wpAdminUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 font-mono font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      {activeOrder.serviceCredentials.wpAdminUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-500/10 text-blue-300 font-bold px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 animate-spin" /> In Progress (SLA: 30 - 45 min)
                </span>
              </div>
            </div>

            {/* Dynamic Credential Auto-Purge Countdown Timer */}
            <CredentialPurgeTimer purgeHours={activeOrder.purgeHours || 24} variant="customer" />

            {/* 4-Step Visual Progress Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Payment Verified</span>
                </div>
                <p className="text-[11px] text-emerald-300/80">Stripe authorization confirmed.</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>2. Credentials Buffered</span>
                </div>
                <p className="text-[11px] text-emerald-300/80">AES-256 buffer locked.</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/10 border-2 border-blue-500/50 space-y-1 shadow-lg shadow-blue-500/10">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                  <Wrench className="w-4 h-4 text-blue-400 animate-spin" />
                  <span>3. Technician Installing</span>
                </div>
                <p className="text-[11px] text-blue-300/80 font-medium">Activating official agency stack.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1 opacity-60">
                <div className="flex items-center gap-1.5 text-neutral-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>4. Ready & Revoke</span>
                </div>
                <p className="text-[11px] text-neutral-400">Safely delete temporary user.</p>
              </div>
            </div>

            {/* Temporary credentials display for the customer */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                <span>Temporary Installation User Provided</span>
                <span className="text-[11px] text-neutral-500 font-normal">Encrypted in browser buffer</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 block font-sans">Username:</span>
                    <span className="text-white font-bold">{activeOrder.serviceCredentials.wpUsername}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(activeOrder.serviceCredentials!.wpUsername, "wp-user")}
                    className="text-neutral-400 hover:text-white"
                  >
                    {copiedKey === "wp-user" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 block font-sans">Password:</span>
                    <span className="text-white font-bold">
                      {showPassword ? activeOrder.serviceCredentials.wpPassword : "••••••••••••"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-neutral-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopy(activeOrder.serviceCredentials!.wpPassword, "wp-pass")}
                      className="text-neutral-400 hover:text-white"
                    >
                      {copiedKey === "wp-pass" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {activeOrder.serviceCredentials.notes && (
                <p className="text-xs text-neutral-400 pt-1">
                  <strong className="text-neutral-300">Your Instructions:</strong> &quot;{activeOrder.serviceCredentials.notes}&quot;
                </p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-white">Zero-Trust Guarantee:</strong> Once our technician completes step 4, the agency license stays permanently active on your domain. You can immediately delete the temporary administrator user or trigger the 1-click purge button above.
              </p>
            </div>
          </div>
        )}

        {/* VAULT CASE 2: AI TOOLS ACCOUNT (SHARED / PRIVATE CREDENTIALS) */}
        {isAiAccount && activeOrder.accountCredentials && (
          <div className="bg-[#10121a] rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-white">
                    Delivered AI Tool Account Credentials
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Tool: <strong className="text-white">{activeOrder.accountCredentials.toolName}</strong> ({activeOrder.accountCredentials.planType})
                  </p>
                </div>
              </div>

              <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Instant Delivery Active
              </span>
            </div>

            {/* Credentials Card */}
            <div className="p-5 rounded-2xl bg-neutral-950/90 border border-purple-500/30 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Login */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Account Login Email:
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-white select-all">
                      {activeOrder.accountCredentials.accountEmail}
                    </span>
                    <button
                      onClick={() => handleCopy(activeOrder.accountCredentials!.accountEmail, "ai-email")}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      {copiedKey === "ai-email" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Account Password:
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-white select-all">
                      {showPassword ? activeOrder.accountCredentials.accountPassword : "••••••••••••••••"}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-neutral-400 hover:text-white text-xs"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                      <button
                        onClick={() => handleCopy(activeOrder.accountCredentials!.accountPassword || "", "ai-pass")}
                        className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        {copiedKey === "ai-pass" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Slot & PIN (For Shared Accounts) */}
              {activeOrder.accountCredentials.profileSlot && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Assigned Profile & Slot:</span>
                    <strong className="text-purple-300 font-semibold text-sm">
                      {activeOrder.accountCredentials.profileSlot}
                    </strong>
                  </div>
                  {activeOrder.accountCredentials.profilePin && (
                    <div className="text-right">
                      <span className="text-neutral-400 block text-[11px]">Profile Lock PIN:</span>
                      <strong className="font-mono text-white text-base font-black">
                        {activeOrder.accountCredentials.profilePin}
                      </strong>
                    </div>
                  )}
                </div>
              )}

              {/* Expiry & Warranty Notice */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-neutral-400">
                <span>
                  Valid Through: <strong className="text-white">{activeOrder.accountCredentials.expiresAt || "30 Days from purchase"}</strong>
                </span>
                <span className="text-emerald-400 font-medium">
                  {activeOrder.accountCredentials.warrantyTerms || "Full 30-Day Auto-Replacement Guarantee"}
                </span>
              </div>
            </div>

            {/* Usage Rules */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-2">
              <strong className="text-white block font-semibold">Important Usage Rules:</strong>
              <ul className="list-disc list-inside space-y-1 text-neutral-300 leading-relaxed">
                <li>Log in using the email and password above at the official AI provider website.</li>
                <li>Please select your designated profile only to ensure chat privacy and fair rate limits.</li>
                <li>Do not attempt to change the account password or billing settings to preserve warranty protection.</li>
              </ul>
            </div>
          </div>
        )}

        {/* VAULT CASE 3: GAME DIGITAL GIFT CODE / WALLET VOUCHER */}
        {isGameCode && activeOrder.gameGiftCode && (
          <div className="bg-emerald-950/40 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-500/20 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-white">
                    {activeOrder.gameGiftCode.platform} Digital Gift Card Code
                  </h2>
                  <p className="text-xs text-emerald-300/80">
                    Region: {activeOrder.gameGiftCode.region} • Face Value: {activeOrder.gameGiftCode.faceValue}
                  </p>
                </div>
              </div>
              <span className="text-xs bg-emerald-900/60 text-emerald-200 font-bold px-3 py-1 rounded-full border border-emerald-600">
                100% Genuine Digital Code
              </span>
            </div>

            {/* Code Box */}
            <div className="p-5 rounded-2xl bg-neutral-950/90 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 block mb-1">
                  Your Digital Wallet PIN / Code:
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400 select-all tracking-wider">
                  {activeOrder.gameGiftCode.code}
                </span>
              </div>
              <button
                onClick={() => handleCopy(activeOrder.gameGiftCode!.code, "game-code")}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
              >
                {copiedKey === "game-code" ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Gift Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Redemption Instructions */}
            <div className="text-xs text-neutral-300 space-y-2 pt-1">
              <strong className="text-white block font-semibold">How to Redeem on {activeOrder.gameGiftCode.platform}:</strong>
              <p className="leading-relaxed text-neutral-400">
                {activeOrder.gameGiftCode.redemptionGuide}
              </p>
            </div>
          </div>
        )}

        {/* VAULT CASE 4: SOFTWARE RETAIL LICENSE KEY */}
        {isSoftwareKey && (
          <div className="bg-emerald-950/40 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-500/20 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-white">
                    Permanent Software Retail License Key
                  </h2>
                  <p className="text-xs text-emerald-300/80">
                    Product: {activeOrder.softwareLicense?.softwareName || activeOrder.productTitle}
                  </p>
                </div>
              </div>
              <span className="text-xs bg-emerald-900/60 text-emerald-200 font-bold px-3 py-1 rounded-full border border-emerald-600">
                Retail Activation
              </span>
            </div>

            {/* License Box */}
            <div className="p-5 rounded-2xl bg-neutral-950/90 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 block mb-1">
                  Product Activation Key:
                </span>
                <span className="font-mono text-lg sm:text-2xl font-black text-emerald-400 select-all tracking-wider">
                  {activeOrder.softwareLicense?.licenseKey || activeOrder.dispensedKey || "W11P-9X77B-KD82A-MN491-LP829"}
                </span>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    activeOrder.softwareLicense?.licenseKey || activeOrder.dispensedKey || "",
                    "soft-key"
                  )
                }
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
              >
                {copiedKey === "soft-key" ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Product Key</span>
                  </>
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="text-xs text-neutral-300 space-y-2 pt-1">
              <strong className="text-white block font-semibold">Activation Instructions:</strong>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-neutral-400">
                {activeOrder.softwareLicense?.activationInstructions?.map((step, idx) => (
                  <li key={idx}>{step}</li>
                )) || (
                  <>
                    <li>Download & install from the official publisher link.</li>
                    <li>Enter the license key above in the registration / activation modal.</li>
                    <li>Click Activate for lifetime hardware-bound license verification.</li>
                  </>
                )}
              </ol>
            </div>
          </div>
        )}

        {/* VAULT CASE 5: GOOGLE ADSENSE WEBSITE ASSET HANDOFF & 4-STAGE ESCROW PIPELINE */}
        {isAdSense && (
          <AdSenseOrderHandoffPortal
            orderId={activeOrder.id}
            orderNumber={activeOrder.orderNumber}
            customerName={activeOrder.customerName}
            customerEmail={activeOrder.customerEmail}
            initialFulfillment={(activeOrder as any).adsenseFulfillment}
            orderSubmissions={(activeOrder as any).submissions}
          />
        )}

        {/* 24/7 SUPPORT & GUARANTEE FOOTER */}
        <div className="p-6 rounded-3xl bg-[#10121a] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/[0.04] text-neutral-300 border border-white/10 rounded-2xl">
              <HelpCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Need Support or Have Questions?</h4>
              <p className="text-xs text-neutral-400">
                Our technicians monitor order fulfillment 24/7 with an average response time of under 15 minutes.
              </p>
            </div>
          </div>

          <Link
            href="/support"
            className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs transition-colors shrink-0 text-center"
          >
            Open Support Ticket
          </Link>
        </div>
      </div>
    </div>
  );
}
