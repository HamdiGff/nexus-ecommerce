"use client";

import { useState, useEffect, useRef } from "react";
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
  PackageCheck,
  ShoppingBag,
  ExternalLink,
  Clock,
  Sparkles,
  Ticket,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { formatPrice } from "@/lib/utils";
import { SupportTicketRecord } from "@/data/mockOrders";

export default function OrderLookupPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Active view tab: "orders" | "tickets"
  const [activeTab, setActiveTab] = useState<"orders" | "tickets">("orders");

  // Order lookup form state
  const [orderNumber, setOrderNumber] = useState("");
  const [emailQuery, setEmailQuery] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Orders list state
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Tickets list & interaction state
  const [tickets, setTickets] = useState<SupportTicketRecord[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [customerReplies, setCustomerReplies] = useState<Record<string, string>>({});
  const [isSubmittingReply, setIsSubmittingReply] = useState<Record<string, boolean>>({});
  const [ticketSearchInput, setTicketSearchInput] = useState("");
  const [ticketSearchError, setTicketSearchError] = useState<string | null>(null);

  const ticketMessagesEndRef = useRef<HTMLDivElement>(null);

  // Determine effective email for current user
  const effectiveEmail = (user?.email || emailQuery || "").toLowerCase().trim();

  // 1. Fetch orders from localStorage + server API
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    let allOrders: any[] = [];

    // Local storage orders
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexus-recent-orders");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            allOrders = parsed;
          }
        }
      } catch {
        // ignore
      }
    }

    // Server API orders
    try {
      const url = effectiveEmail
        ? `/api/orders?email=${encodeURIComponent(effectiveEmail)}`
        : "/api/orders";
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        // Merge & deduplicate by orderNumber or id
        const map = new Map<string, any>();
        [...allOrders, ...data.orders].forEach((ord) => {
          const key = (ord.orderNumber || ord.orderId || ord.id || "").toUpperCase();
          if (key && !map.has(key)) {
            map.set(key, ord);
          }
        });
        allOrders = Array.from(map.values());
      }
    } catch {
      // ignore
    }

    // Filter by user if logged in
    if (user?.email) {
      const filtered = allOrders.filter((o) => {
        const ordEmail = (o.customerEmail || o.customer?.email || "").toLowerCase().trim();
        return !ordEmail || ordEmail === user.email.toLowerCase().trim();
      });
      setUserOrders(filtered.length > 0 ? filtered : allOrders);
    } else {
      setUserOrders(allOrders);
    }
    setIsLoadingOrders(false);
  };

  // 2. Fetch support tickets matching customer email
  const fetchTickets = async () => {
    try {
      const url = effectiveEmail
        ? `/api/tickets?email=${encodeURIComponent(effectiveEmail)}`
        : "/api/tickets";
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.tickets)) {
        setTickets(data.tickets);
        // Automatically expand the first ticket if none expanded yet
        if (data.tickets.length > 0 && !expandedTicketId) {
          setExpandedTicketId(data.tickets[0].id);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchTickets();
  }, [user, emailQuery]);

  // Real-time polling for tickets every 3s so customer sees admin replies immediately
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTickets();
    }, 3000);
    return () => clearInterval(interval);
  }, [effectiveEmail]);

  // Scroll to bottom of message thread when expanded ticket updates
  useEffect(() => {
    if (expandedTicketId) {
      ticketMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [expandedTicketId, tickets]);

  // Handle single order lookup form
  const handleOrderLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    const cleanOrder = orderNumber.trim().toUpperCase();
    if (!cleanOrder) {
      setLookupError("Please enter your order number (e.g. NEX-948210).");
      return;
    }
    router.push(`/orders/${cleanOrder}`);
  };

  // Handle ticket search by ticket number or email
  const handleTicketSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSearchError(null);
    const clean = ticketSearchInput.trim();
    if (!clean) return;

    setIsLoadingTickets(true);
    try {
      // Check if user entered an email or a ticket number
      if (clean.includes("@")) {
        const res = await fetch(`/api/tickets?email=${encodeURIComponent(clean.toLowerCase())}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.tickets) && data.tickets.length > 0) {
          setTickets(data.tickets);
          setExpandedTicketId(data.tickets[0].id);
        } else {
          setTicketSearchError(`No support tickets found associated with ${clean}.`);
        }
      } else {
        // Search by ticket number
        const res = await fetch("/api/tickets", { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.tickets)) {
          const target = clean.toUpperCase();
          const match = data.tickets.find(
            (t: SupportTicketRecord) =>
              t.ticketNumber.toUpperCase() === target || t.id.toUpperCase() === target
          );
          if (match) {
            setTickets([match]);
            setExpandedTicketId(match.id);
          } else {
            setTicketSearchError(`Ticket "${clean}" not found. Please verify the ticket ID.`);
          }
        }
      }
    } catch {
      setTicketSearchError("Unable to fetch ticket details at this moment.");
    } finally {
      setIsLoadingTickets(false);
    }
  };

  // Customer sending a reply to a ticket
  const handleSendCustomerReply = async (ticketId: string) => {
    const text = customerReplies[ticketId]?.trim();
    if (!text) return;

    setIsSubmittingReply((prev) => ({ ...prev, [ticketId]: true }));
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reply",
          ticketId,
          message: text,
          sender: "CUSTOMER",
          name: user?.name || (user?.email ? user.email.split("@")[0] : "Customer"),
        }),
      });
      const data = await res.json();
      if (data.success && data.ticket) {
        setTickets((prev) => prev.map((t) => (t.id === ticketId ? data.ticket : t)));
        setCustomerReplies((prev) => ({ ...prev, [ticketId]: "" }));
      }
    } catch {
      // ignore
    } finally {
      setIsSubmittingReply((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-500/20 via-indigo-500/10 to-amber-500/20 border border-blue-500/30 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/10">
            <Key className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
            Customer Portal & Digital Vault
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Access your delivered software licenses, monitor WordPress service credentials,
            and view real-time replies from our 24/7 technical support team.
          </p>

          {user?.email && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-neutral-300">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Signed in as <strong className="text-white">{user.email}</strong></span>
            </div>
          )}
        </div>

        {/* Main Tab Navigation: Orders vs Tickets */}
        <div className="flex justify-center">
          <div className="bg-[#10121a] p-1.5 rounded-2xl border border-white/[0.08] inline-flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              <span>My Orders & Licenses</span>
              {userOrders.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === "orders" ? "bg-white/20 text-white" : "bg-neutral-800 text-neutral-300"
                }`}>
                  {userOrders.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tickets")}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "tickets"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Support Tickets & Replies</span>
              {tickets.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === "tickets" ? "bg-white/20 text-white" : "bg-neutral-800 text-neutral-300"
                }`}>
                  {tickets.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: ORDERS & DIGITAL LICENSES                         */}
        {/* ======================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* List of Orders */}
            {userOrders.length > 0 ? (
              <div className="bg-[#10121a] rounded-3xl border border-blue-500/30 p-6 sm:p-8 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <PackageCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Your Purchased Digital Assets</h2>
                      <p className="text-xs text-neutral-400">
                        Select any order to view your license keys and fulfillment progress.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold font-mono">
                    {userOrders.length} Order{userOrders.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {userOrders.map((ord: any) => {
                    const orderId = ord.orderNumber || ord.orderId || ord.id;
                    const firstItem = ord.items?.[0];
                    const itemCount = ord.items?.length || 1;

                    return (
                      <div
                        key={orderId}
                        className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-400">
                              {orderId}
                            </span>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-semibold border border-emerald-500/20">
                              {ord.status || "CONFIRMED"}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-white">
                            {firstItem?.title || firstItem?.productTitle || "Digital Asset Order"}
                            {itemCount > 1 && (
                              <span className="text-xs text-neutral-400 font-normal">
                                {" "}+ {itemCount - 1} more item{itemCount > 2 ? "s" : ""}
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-neutral-400">
                            {ord.timestamp || "Recent order"} • {ord.paymentMethod || "Direct Payment"} •{" "}
                            <strong className="text-white">{formatPrice(ord.total || ord.totalAmount || 0)}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Link
                            href={`/orders/${orderId}`}
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                          >
                            <span>Open Vault & Key</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/support`}
                            className="px-3 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-neutral-300 font-semibold text-xs flex items-center gap-1 transition-colors"
                            title="Open ticket for this order"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Manual Order Lookup Card */}
            <div className="bg-[#10121a]/95 rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-400" />
                  Look Up Any Order Number
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Don&apos;t see your order above? Enter your order number or billing email below.
                </p>
              </div>

              <form onSubmit={handleOrderLookup} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Order Number
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
                    Filter by Billing Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="youremail@example.com"
                    value={emailQuery}
                    onChange={(e) => setEmailQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                {lookupError && (
                  <p className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                    {lookupError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  <span>Unlock Order Vault</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: SUPPORT TICKETS & RESOLUTION SYSTEM                */}
        {/* ======================================================== */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            {/* Header info bar with "Create New Ticket" action */}
            <div className="bg-[#10121a] rounded-3xl border border-white/[0.08] p-6 sm:p-7 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white">
                    Support Inquiries & Live Replies
                  </h3>
                </div>
                <p className="text-xs text-neutral-400">
                  Track your support inquiries in real-time. Replies from technicians update live.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={fetchTickets}
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Refresh tickets"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <Link
                  href="/support"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Open New Ticket</span>
                </Link>
              </div>
            </div>

            {/* Quick Ticket Search Bar */}
            <div className="bg-[#10121a] rounded-2xl border border-white/[0.08] p-4 shadow-sm">
              <form onSubmit={handleTicketSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by Ticket # (e.g. TICK-1234) or Email..."
                    value={ticketSearchInput}
                    onChange={(e) => setTicketSearchInput(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
                <button
                  type="submit"
                  disabled={isLoadingTickets}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  {isLoadingTickets ? "Searching..." : "Lookup Ticket"}
                </button>
              </form>
              {ticketSearchError && (
                <p className="text-xs text-rose-400 mt-2 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                  {ticketSearchError}
                </p>
              )}
            </div>

            {/* Tickets Accordion / Thread Stream */}
            {tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.map((t) => {
                  const isExpanded = expandedTicketId === t.id;
                  const lastMessage = t.messages?.[t.messages.length - 1];
                  const hasAdminReply = t.messages?.some((m) => m.sender === "ADMIN");

                  return (
                    <div
                      key={t.id}
                      className={`bg-[#10121a] rounded-3xl border transition-all overflow-hidden ${
                        isExpanded
                          ? "border-blue-500/40 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/20"
                          : "border-white/[0.08] hover:border-white/[0.15]"
                      }`}
                    >
                      {/* Ticket Summary Header Bar */}
                      <button
                        type="button"
                        onClick={() => setExpandedTicketId(isExpanded ? null : t.id)}
                        className="w-full text-left p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-400">
                              {t.ticketNumber}
                            </span>

                            {/* Status Badge */}
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                t.status === "RESOLVED"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : t.status === "CLOSED"
                                  ? "bg-neutral-800 text-neutral-400 border border-neutral-700"
                                  : t.status === "IN_PROGRESS" || hasAdminReply
                                  ? "bg-blue-500/10 text-blue-300 border border-blue-500/20 animate-pulse"
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {t.status === "RESOLVED"
                                ? "Resolved"
                                : t.status === "CLOSED"
                                ? "Closed"
                                : t.status === "IN_PROGRESS" || hasAdminReply
                                ? "Specialist Replied"
                                : "Under Review"}
                            </span>

                            <span className="text-[10px] bg-white/[0.04] text-neutral-400 px-2 py-0.5 rounded border border-white/10 font-semibold">
                              {t.priority}
                            </span>

                            {t.orderNumber && (
                              <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">
                                Order: {t.orderNumber}
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-sm text-white">{t.subject}</h4>

                          <p className="text-xs text-neutral-400">
                            Created {t.createdAt} • {t.messages?.length || 1} message{t.messages?.length > 1 ? "s" : ""}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                            {isExpanded ? "Collapse Conversation" : "View Responses"}
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </span>
                        </div>
                      </button>

                      {/* Expanded Conversation Thread */}
                      {isExpanded && (
                        <div className="border-t border-white/[0.08] bg-[#0c0d14]">
                          {/* Messages Timeline */}
                          <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto">
                            {t.messages?.map((m) => (
                              <div
                                key={m.id}
                                className={`p-4 rounded-2xl max-w-[85%] text-xs space-y-1.5 ${
                                  m.sender === "ADMIN"
                                    ? "bg-blue-600/15 border border-blue-500/30 text-neutral-100 ml-auto rounded-tr-xs shadow-md"
                                    : "bg-white/[0.05] border border-white/[0.08] text-neutral-200 mr-auto rounded-tl-xs shadow-xs"
                                }`}
                              >
                                <div className="flex items-center justify-between text-[11px] gap-4">
                                  <span
                                    className={`font-bold flex items-center gap-1 ${
                                      m.sender === "ADMIN" ? "text-blue-400" : "text-neutral-400"
                                    }`}
                                  >
                                    {m.sender === "ADMIN" && <ShieldCheck className="w-3.5 h-3.5" />}
                                    {m.senderName}
                                  </span>
                                  <span className="text-neutral-500 text-[10px]">{m.time}</span>
                                </div>
                                <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                              </div>
                            ))}
                            <div ref={ticketMessagesEndRef} />
                          </div>

                          {/* Customer Reply Input */}
                          {t.status !== "CLOSED" ? (
                            <div className="p-4 bg-[#10121a] border-t border-white/[0.08]">
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleSendCustomerReply(t.id);
                                }}
                                className="flex gap-2"
                              >
                                <input
                                  type="text"
                                  placeholder="Type your reply to the technician..."
                                  value={customerReplies[t.id] || ""}
                                  onChange={(e) =>
                                    setCustomerReplies((prev) => ({
                                      ...prev,
                                      [t.id]: e.target.value,
                                    }))
                                  }
                                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                  type="submit"
                                  disabled={
                                    isSubmittingReply[t.id] ||
                                    !customerReplies[t.id]?.trim()
                                  }
                                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>{isSubmittingReply[t.id] ? "Sending..." : "Send Reply"}</span>
                                </button>
                              </form>
                            </div>
                          ) : (
                            <div className="p-3 bg-neutral-900/60 text-center text-xs text-neutral-500 border-t border-white/[0.06]">
                              This support ticket has been closed. If you require further assistance, please open a new ticket.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#10121a] rounded-3xl border border-white/[0.08] p-12 text-center space-y-4">
                <div className="w-12 h-12 bg-white/[0.04] text-neutral-400 rounded-2xl flex items-center justify-center mx-auto border border-white/10">
                  <Ticket className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-white">No Support Tickets Logged Yet</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Have questions about your order, license delivery, or need technician help?
                  Submit a ticket and our team will respond within minutes.
                </p>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Submit Support Ticket</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Security & Guarantees Footer */}
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
