"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  Zap,
  Wrench,
  Globe,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  Ticket,
  Tag,
  Percent,
  X,
  FileText,
} from "lucide-react";
import { useCartStore, CartItem } from "@/lib/store/cartStore";
import { useCouponStore } from "@/lib/store/couponStore";
import { useAuthStore } from "@/lib/store/authStore";
import { formatPrice } from "@/lib/utils";
import { generateOrderPdf } from "@/lib/pdfGenerator";
import { findOrderRecord } from "@/data/mockOrders";

type PaymentMethod = "card" | "paypal" | "crypto";
type CryptoCoin = "BTC" | "ETH" | "USDT";

const CRYPTO_CONFIG: Record<
  CryptoCoin,
  { name: string; symbol: string; address: string; network: string; rateUsd: number }
> = {
  BTC: {
    name: "Bitcoin",
    symbol: "BTC",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "Bitcoin Native (SegWit)",
    rateUsd: 68500,
  },
  ETH: {
    name: "Ethereum",
    symbol: "ETH",
    address: "0x71C8A699313EFAe934E22A633F0525aB3b35049B",
    network: "Ethereum Mainnet (ERC-20)",
    rateUsd: 3550,
  },
  USDT: {
    name: "Tether USD",
    symbol: "USDT",
    address: "0x71C8A699313EFAe934E22A633F0525aB3b35049B",
    network: "USDT (ERC-20 / Polygon)",
    rateUsd: 1.0,
  },
};

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart, setItemSubmission } = useCartStore();
  const subtotal = getSubtotal();
  const { appliedCoupon, applyCoupon, removeAppliedCoupon, calculateDiscount } =
    useCouponStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const discountAmount = calculateDiscount(subtotal);
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput, subtotal, paymentMethod);
    if (res.success) {
      setCouponFeedback({ type: "success", text: res.message });
      setCouponInput("");
    } else {
      setCouponFeedback({ type: "error", text: res.message });
    }
  };

  // Customer contact state linked to logged in user
  const loggedInUser = useAuthStore((state) => state.user);
  const [customer, setCustomer] = useState({
    name: loggedInUser?.name || "",
    email: loggedInUser?.email || "",
    notes: "",
  });

  // Sync if user signs in while on page
  useEffect(() => {
    if (loggedInUser) {
      setCustomer((prev) => ({
        ...prev,
        name: prev.name || loggedInUser.name,
        email: prev.email || loggedInUser.email,
      }));
    }
  }, [loggedInUser]);

  // Dynamic submissions per cart item (especially for SERVICE_SETUP items)
  const [itemCredentials, setItemCredentials] = useState<
    Record<string, { wpUrl: string; wpUser: string; wpPass: string; notes?: string }>
  >({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  // AdSense Turnkey Asset Transfer State
  const [adsenseDetails, setAdsenseDetails] = useState({
    registrar: "Namecheap",
    registrarUsername: "",
    contactPhone: "",
    backupEmail: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCoin>("ETH");
  const [cryptoTxHash, setCryptoTxHash] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedKeys, setCopiedKeys] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  // Card form state
  const [cardData, setCardData] = useState({
    number: "•••• •••• •••• 4242",
    exp: "12/28",
    cvc: "888",
    name: "Alex Taylor",
  });

  const cryptoInfo = CRYPTO_CONFIG[selectedCrypto];
  const cryptoAmount = (total / cryptoInfo.rateUsd).toFixed(
    selectedCrypto === "BTC" ? 6 : selectedCrypto === "ETH" ? 4 : 2
  );

  const handleCredentialChange = (
    itemId: string,
    field: "wpUrl" | "wpUser" | "wpPass" | "notes",
    value: string
  ) => {
    setItemCredentials((prev) => ({
      ...prev,
      [itemId]: {
        wpUrl: prev[itemId]?.wpUrl || "",
        wpUser: prev[itemId]?.wpUser || "",
        wpPass: prev[itemId]?.wpPass || "",
        notes: prev[itemId]?.notes || "",
        [field]: value,
      },
    }));

    setItemSubmission(itemId, {
      [field]: value,
    });
  };

  const handleCopy = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeys((prev) => ({ ...prev, [keyId]: true }));
    setTimeout(() => {
      setCopiedKeys((prev) => ({ ...prev, [keyId]: false }));
    }, 2000);
  };

  const handleCopyCryptoAddress = () => {
    navigator.clipboard.writeText(cryptoInfo.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const serviceSetupItems = items.filter((i) => i.deliveryType === "SERVICE_SETUP");
  const instantCodeItems = items.filter((i) => i.deliveryType === "INSTANT_CODE");
  const manualHandoffItems = items.filter((i) => i.deliveryType === "MANUAL_HANDOFF");

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate that required credentials are provided for all SERVICE_SETUP items
    for (const item of serviceSetupItems) {
      const creds = itemCredentials[item.id];
      if (!creds?.wpUrl || !creds?.wpUser || !creds?.wpPass) {
        setValidationError(
          `Please provide your WordPress Admin URL, temporary username, and password for "${item.title}" before proceeding.`
        );
        return;
      }
    }

    // Validate AdSense Turnkey Asset Transfer requirements
    if (manualHandoffItems.length > 0) {
      if (!adsenseDetails.registrarUsername.trim()) {
        setValidationError(
          "Please provide your Domain Registrar username or account email (e.g. Namecheap username, Hostinger or GoDaddy email) for the free domain authorization push."
        );
        return;
      }
    }

    if (!customer.email || !customer.email.includes("@")) {
      setValidationError("Please provide a valid email address to receive your order receipt and digital license.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Generate realistic digital license keys for instant items
      const generatedLicenseKeys: Record<string, string> = {};
      instantCodeItems.forEach((item) => {
        if (item.title.toLowerCase().includes("idm")) {
          generatedLicenseKeys[item.id] = `IDM-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
            1000 + Math.random() * 9000
          )}-${Math.floor(1000 + Math.random() * 9000)}-NXUS`;
        } else if (item.title.toLowerCase().includes("steam")) {
          generatedLicenseKeys[item.id] = `STM-${Math.floor(1000 + Math.random() * 9000)}-QZ84-${Math.floor(
            1000 + Math.random() * 9000
          )}-USD`;
        } else {
          generatedLicenseKeys[item.id] = `LIC-${Math.random().toString(36).substring(2, 10).toUpperCase()}-2026`;
        }
      });

      const generatedOrder = {
        orderId: `NEX-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...items],
        total,
        paymentMethod:
          paymentMethod === "crypto"
            ? `Crypto (${selectedCrypto} on ${cryptoInfo.network})`
            : paymentMethod === "paypal"
            ? "PayPal Checkout"
            : "Credit Card (Stripe)",
        customer,
        submissions: {
          ...itemCredentials,
          adsense: adsenseDetails,
          preferredRegistrar: `${adsenseDetails.registrar}: ${adsenseDetails.registrarUsername}`,
        },
        generatedLicenseKeys,
        timestamp: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Persist to local order history and server API for verified review check & vault lookup
      try {
        const existing = JSON.parse(localStorage.getItem("nexus-recent-orders") || "[]");
        localStorage.setItem("nexus-recent-orders", JSON.stringify([generatedOrder, ...existing]));
      } catch {
        // ignore
      }

      // Sync order with backend server so customer can view it across browsers & devices
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generatedOrder),
      }).catch(() => {});

      setOrderComplete(generatedOrder);
      clearCart();
    }, 1800);
  };

  // ORDER COMPLETE CONFIRMATION VIEW
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#090a0f] text-neutral-100 py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-[#10121a] rounded-2xl sm:rounded-3xl border border-white/[0.1] p-5 sm:p-10 shadow-2xl">
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-emerald-300 uppercase bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
              Payment Confirmed • Digital Order Active
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-4">
              Thank you for your purchase!
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-2 max-w-lg mx-auto leading-relaxed">
              Your order confirmation and activation details have been dispatched to{" "}
              <strong className="text-white">{orderComplete.customer.email}</strong>.
            </p>
          </div>

          {/* INSTANT LICENSE CODES SECTION */}
          {Object.keys(orderComplete.generatedLicenseKeys).length > 0 && (
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl bg-emerald-950/60 text-white border border-emerald-800/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-emerald-300 text-emerald-300 shrink-0" />
                  <span>Instant License Keys &amp; Codes</span>
                </span>
                <span className="text-[10px] sm:text-[11px] bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded-md font-mono border border-emerald-700/50">
                  Official Retail Codes
                </span>
              </div>

              <div className="space-y-3">
                {orderComplete.items
                  .filter((item: CartItem) => item.deliveryType === "INSTANT_CODE")
                  .map((item: CartItem) => {
                    const code = orderComplete.generatedLicenseKeys[item.id];
                    const isCopied = copiedKeys[item.id];
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 sm:p-4 rounded-xl bg-neutral-950/80 border border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-200 truncate">{item.title}</p>
                          <p className="font-mono text-sm sm:text-base font-extrabold text-emerald-400 mt-0.5 select-all tracking-wider break-all">
                            {code}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(code, item.id)}
                          className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Key</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
              </div>

              <p className="text-[11px] text-emerald-200/80 pt-1">
                📌 <em>To activate: Open the application or dashboard, paste your license key in the registration dialog, and submit.</em>
              </p>
            </div>
          )}

          {/* WORDPRESS SETUP QUEUE STATUS */}
          {orderComplete.items.some((i: CartItem) => i.deliveryType === "SERVICE_SETUP") && (
            <div className="mt-6 p-4 sm:p-6 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-3 text-left">
              <div className="flex items-center gap-2 text-blue-300 font-bold text-xs sm:text-sm">
                <Wrench className="w-4 h-4 text-blue-400 shrink-0" />
                <span>WordPress Activation Assigned to Installation Queue</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Our installation technician has received your temporary credentials and is activating the
                official agency license on your specified site(s). 
              </p>
              <div className="p-3 bg-black/40 rounded-xl border border-blue-500/20 text-xs text-neutral-300 space-y-1 font-mono">
                {Object.entries(orderComplete.submissions).map(([itemId, creds]: any) => (
                  <div key={itemId} className="flex flex-col sm:flex-row justify-between gap-1">
                    <span className="truncate">Target: {creds.wpUrl}</span>
                    <span className="text-blue-400 font-bold">Status: In Queue (30 - 45 min)</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-blue-300/80">
                🔒 Reminder: You will receive an email notice as soon as activation is complete, after which you can safely delete the temporary user.
              </p>
            </div>
          )}

          {/* TURNKEY ASSET HANDOFF STATUS */}
          {orderComplete.items.some((i: CartItem) => i.deliveryType === "MANUAL_HANDOFF") && (
            <div className="mt-6 p-4 sm:p-6 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-3 text-left">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs sm:text-sm">
                <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Turnkey Website &amp; AdSense Account Transfer Initiated</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Our transfer manager is preparing your domain authorization (EPP) push and dedicated Google account backup credentials. 
                Handoff is guaranteed within <strong className="text-white">2 to 6 hours</strong>.
              </p>
            </div>
          )}

          {/* Order Details Metadata Card */}
          <div className="mt-6 p-4 sm:p-6 bg-white/[0.03] rounded-2xl border border-white/10 text-left space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.08] text-xs">
              <span className="text-neutral-400 font-medium">Order Number</span>
              <span className="font-mono font-bold text-white">{orderComplete.orderId}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.08] text-xs">
              <span className="text-neutral-400 font-medium">Payment Method</span>
              <span className="font-semibold text-neutral-200">{orderComplete.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center pt-1 text-sm font-bold text-white">
              <span>Total Paid</span>
              <span className="font-mono text-emerald-400">{formatPrice(orderComplete.total)}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 justify-center items-center">
            <button
              onClick={() => {
                const mapped = findOrderRecord(orderComplete.orderId);
                if (mapped) {
                  generateOrderPdf(mapped);
                }
              }}
              className="w-full sm:w-auto py-3 px-5 sm:px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/20 text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>Download Official PDF Invoice</span>
            </button>

            {orderComplete.items.length > 0 && (
              <Link
                href={`/products/${orderComplete.items[0].slug || orderComplete.items[0].id}#reviews`}
                className="w-full sm:w-auto py-3 px-5 sm:px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/20 text-center flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Write Verified Review Now</span>
              </Link>
            )}

            <Link
              href={`/orders/${orderComplete.orderId}`}
              className="w-full sm:w-auto py-3 px-5 sm:px-6 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/10 font-semibold text-xs sm:text-sm transition-colors text-center"
            >
              Customer Order Vault
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto py-3 px-5 sm:px-6 rounded-xl text-neutral-400 hover:text-white font-medium text-xs sm:text-sm transition-colors text-center"
            >
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD CHECKOUT VIEW
  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        {validationError && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-medium">{validationError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Form: Delivery Inputs & Payment Gateways */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Buyer Contact (Digital Delivery Target) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs">
              <h2 className="text-lg font-bold text-neutral-950 mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs flex items-center justify-center font-mono">
                  1
                </span>
                Digital Delivery Contact
              </h2>
              <p className="text-xs text-neutral-500 mb-6">
                All activation keys, receipts, and credential handoffs will be sent to this email.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Email Address (for License Dispatch) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:ring-2 focus:ring-neutral-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: DYNAMIC PRODUCT REQUIREMENTS (If cart has SERVICE_SETUP items) */}
            {serviceSetupItems.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-blue-500/40 shadow-xs space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-950 flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-blue-600" />
                      WordPress Activation Credentials
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Required before payment so our technicians can install and activate your official license.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full uppercase">
                    Mandatory Setup
                  </span>
                </div>

                {/* Safety Recommendation Banner */}
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Security Best Practice:</p>
                    <p className="text-blue-800 leading-relaxed">
                      We recommend creating a temporary administrator account inside your WordPress dashboard (e.g. username: <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">nexus_temp</code>). 
                      You can delete this user right after activation.
                    </p>
                  </div>
                </div>

                {/* Requirement Form Per Item */}
                {serviceSetupItems.map((item) => {
                  const creds = itemCredentials[item.id] || { wpUrl: "", wpUser: "", wpPass: "" };
                  const isPassVisible = showPassword[item.id] || false;

                  return (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                        <span className="font-bold text-xs text-neutral-900">{item.title}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">Tier: {item.variantTitle}</span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          WordPress Admin Login URL *
                        </label>
                        <input
                          type="url"
                          placeholder="https://yourdomain.com/wp-admin"
                          value={creds.wpUrl}
                          onChange={(e) => handleCredentialChange(item.id, "wpUrl", e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Temporary Admin Username *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. temp_admin"
                            value={creds.wpUser}
                            onChange={(e) => handleCredentialChange(item.id, "wpUser", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Temporary Admin Password *
                          </label>
                          <div className="relative">
                            <input
                              type={isPassVisible ? "text" : "password"}
                              placeholder="••••••••••••"
                              value={creds.wpPass}
                              onChange={(e) => handleCredentialChange(item.id, "wpPass", e.target.value)}
                              className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-neutral-300 text-xs font-mono bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPassword((prev) => ({ ...prev, [item.id]: !isPassVisible }))
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                            >
                              {isPassVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Optional Activation Notes / 2FA Instructions
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Cloudflare enabled, bypass with direct IP, or staging site"
                          value={creds.notes || ""}
                          onChange={(e) => handleCredentialChange(item.id, "notes", e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs bg-white"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 2b: GOOGLE ADSENSE & TURNKEY ASSET HANDOVER DETAILS */}
            {manualHandoffItems.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/40 shadow-xs space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-950 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-emerald-600" />
                      AdSense &amp; Domain Transfer Destination
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Required for free registrar domain push and Master Gmail 2FA ownership handshake.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full uppercase">
                    Free Domain Push
                  </span>
                </div>

                {/* Safety Guarantee Callout */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Zero Transfer Fees:</strong> Domain is pushed directly inside your registrar (Namecheap, Hostinger, GoDaddy, Porkbun, Dynadot) at zero cost. Primary Master Gmail credentials and WordPress backup files will be dispatched in your private Order Vault.
                  </p>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Your Domain Registrar *
                      </label>
                      <select
                        value={adsenseDetails.registrar}
                        onChange={(e) => setAdsenseDetails({ ...adsenseDetails, registrar: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      >
                        <option value="Namecheap">Namecheap (Recommended - Instant Push)</option>
                        <option value="Hostinger">Hostinger</option>
                        <option value="GoDaddy">GoDaddy</option>
                        <option value="Porkbun">Porkbun</option>
                        <option value="Dynadot">Dynadot</option>
                        <option value="Cloudflare">Cloudflare</option>
                        <option value="Other">Other (Will provide EPP Auth Code)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Registrar Account Username or Email *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. your_namecheap_username or account email"
                        value={adsenseDetails.registrarUsername}
                        onChange={(e) => setAdsenseDetails({ ...adsenseDetails, registrarUsername: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Your Personal Email for Master Gmail Transfer
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. buyer.personal@gmail.com"
                        value={adsenseDetails.backupEmail}
                        onChange={(e) => setAdsenseDetails({ ...adsenseDetails, backupEmail: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        WhatsApp / Telegram Phone (For Live 2FA Handshake)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +1 555 123 4567 (WhatsApp or Telegram)"
                        value={adsenseDetails.contactPhone}
                        onChange={(e) => setAdsenseDetails({ ...adsenseDetails, contactPhone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Domain Keyword or Niche Preferences (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Prefer cloud tech, AI SaaS, or finance blogging niche"
                      value={adsenseDetails.notes}
                      onChange={(e) => setAdsenseDetails({ ...adsenseDetails, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Instant Delivery Notice (If instant items in cart) */}
            {instantCodeItems.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
                <Zap className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="block font-semibold">Instant Key Dispenser Enabled:</strong>
                  <span>
                    Your retail serial key(s) for {instantCodeItems.map((i) => i.title).join(", ")} will be revealed on screen immediately upon payment.
                  </span>
                </div>
              </div>
            )}

            {/* Step 3: Payment Rail Selection */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs">
              <h2 className="text-lg font-bold text-neutral-950 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs flex items-center justify-center font-mono">
                  {1 + (serviceSetupItems.length > 0 ? 1 : 0) + (manualHandoffItems.length > 0 ? 1 : 0)}
                </span>
                Payment Method
              </h2>

              {/* Payment Tabs (Responsive & Touch-Optimized) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
                      : "border-neutral-200 text-neutral-700 hover:border-neutral-300 bg-neutral-50"
                  }`}
                >
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[11px] sm:text-xs font-bold text-center">Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                    paymentMethod === "paypal"
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
                      : "border-neutral-200 text-neutral-700 hover:border-neutral-300 bg-neutral-50"
                  }`}
                >
                  <div className="font-extrabold italic text-xs sm:text-sm tracking-tighter">
                    <span className="text-cyan-400">Pay</span>
                    <span className="text-blue-500">Pal</span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold">PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("crypto")}
                  className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                    paymentMethod === "crypto"
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
                      : "border-neutral-200 text-neutral-700 hover:border-neutral-300 bg-neutral-50"
                  }`}
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <span className="text-[11px] sm:text-xs font-bold text-center">Crypto (Web3)</span>
                </button>
              </div>

              {/* CARD FORM */}
              {paymentMethod === "card" && (
                <div className="space-y-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                      Stripe Protected Form
                    </span>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-white border border-neutral-200 rounded text-[10px] font-bold">
                        VISA
                      </span>
                      <span className="px-2 py-0.5 bg-white border border-neutral-200 rounded text-[10px] font-bold">
                        MC
                      </span>
                      <span className="px-2 py-0.5 bg-white border border-neutral-200 rounded text-[10px] font-bold">
                        AMEX
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono text-sm bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardData.exp}
                        onChange={(e) => setCardData({ ...cardData, exp: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        CVC / Security Code
                      </label>
                      <input
                        type="text"
                        value={cardData.cvc}
                        onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PAYPAL FORM */}
              {paymentMethod === "paypal" && (
                <div className="space-y-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
                  <p className="text-xs text-neutral-600">
                    Authorize securely with your PayPal account or pay with debit/credit card.
                  </p>

                  <div className="max-w-sm mx-auto space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f4b82d] text-neutral-900 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <span className="italic font-extrabold text-blue-900">PayPal</span>
                      <span className="font-semibold text-xs text-neutral-800">Checkout</span>
                    </button>
                  </div>
                </div>
              )}

              {/* CRYPTO PAYMENT ENGINE */}
              {paymentMethod === "crypto" && (
                <div className="space-y-5 p-6 rounded-2xl bg-neutral-900 text-white border border-neutral-800">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Decentralized Crypto Settlement
                    </span>
                    <span className="text-[11px] text-neutral-400">Rate Lock: 15:00 min</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(["ETH", "BTC", "USDT"] as CryptoCoin[]).map((coin) => (
                      <button
                        key={coin}
                        type="button"
                        onClick={() => setSelectedCrypto(coin)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          selectedCrypto === coin
                            ? "bg-amber-400 text-neutral-950 border-amber-400"
                            : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
                        }`}
                      >
                        {coin}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-neutral-400">Send Exactly:</span>
                      <span className="font-mono text-xl font-extrabold text-amber-400">
                        {cryptoAmount} {selectedCrypto}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-neutral-500">
                      <span>Network: {cryptoInfo.network}</span>
                      <span>1 {selectedCrypto} ≈ ${cryptoInfo.rateUsd.toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Receiving Address:
                    </label>
                    <div className="flex items-center gap-2 p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
                      <span className="font-mono text-xs text-neutral-200 truncate flex-1 select-all">
                        {cryptoInfo.address}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCryptoAddress}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        {copiedAddress ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              {paymentMethod !== "paypal" && (
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || items.length === 0}
                  className="mt-6 w-full py-4 px-6 rounded-2xl bg-neutral-950 text-white font-bold text-sm hover:bg-neutral-800 transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {isProcessing ? (
                    <span>Verifying Credentials & Processing...</span>
                  ) : (
                    <span>Complete Order • {formatPrice(total)}</span>
                  )}
                </button>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-bit SSL encrypted • Instant digital delivery</span>
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs sticky top-24">
              <h2 className="text-lg font-bold text-neutral-950 mb-6">Digital Order Summary</h2>

              <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto mb-6 pr-2">
                {items.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-4">No digital items in cart.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="py-3 flex gap-3 items-center justify-between">
                      <div className="flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-lg bg-neutral-900 overflow-hidden border border-neutral-200 shrink-0">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-neutral-900 line-clamp-1">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700">
                              {item.deliveryType === "SERVICE_SETUP"
                                ? "WP Setup"
                                : item.deliveryType === "INSTANT_CODE"
                                ? "Instant Key"
                                : "Turnkey Handoff"}
                            </span>
                            {item.variantTitle && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 truncate max-w-[150px]">
                                {item.variantTitle}
                              </span>
                            )}
                            <span className="text-[11px] text-neutral-400">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-neutral-950">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Promo / Coupon Code Section */}
              <div className="pt-4 pb-4 border-t border-neutral-200 space-y-2.5">
                <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  Have a Promo / Coupon Code?
                </label>

                {appliedCoupon ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-xs text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-md">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        {appliedCoupon.discountType === "PERCENTAGE"
                          ? `${appliedCoupon.discountValue}% OFF`
                          : `$${appliedCoupon.discountValue} OFF`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeAppliedCoupon}
                      className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        if (couponFeedback) setCouponFeedback(null);
                      }}
                      placeholder="e.g. SAVE20 or FLASH25"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <p
                    className={`text-[11px] font-medium ${
                      couponFeedback.type === "success"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {couponFeedback.text}
                  </p>
                )}

                {/* Popular Coupons Quick Picks */}
                {!appliedCoupon && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-neutral-400 font-medium">Try:</span>
                    {["SAVE20", "FLASH25", "CRYPTO15"].map((cCode) => (
                      <button
                        key={cCode}
                        type="button"
                        onClick={() => {
                          setCouponInput(cCode);
                          applyCoupon(cCode, subtotal, paymentMethod);
                        }}
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 transition-colors"
                      >
                        {cCode}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2.5 text-xs text-neutral-600 pt-4 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-neutral-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5" />
                      Coupon Discount ({appliedCoupon.code})
                    </span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Digital Delivery & Handling</span>
                  <span className="font-mono font-bold text-emerald-600">FREE (0.00)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-950 pt-3 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span className="font-mono text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="mt-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Genuine Retail & Agency Licenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Instant Dispenser for Serial Keys</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-blue-600" />
                  <span>24/7 Dedicated Ticket Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
