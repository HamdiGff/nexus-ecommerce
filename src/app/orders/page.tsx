"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Key,
  ShieldCheck,
  Zap,
  Wrench,
  ArrowRight,
  ArrowLeft,
  PackageCheck,
  Ticket,
  Send,
  RefreshCw,
  User,
  ChevronDown,
  ChevronUp,
  LogIn,
  MailCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { formatPrice } from "@/lib/utils";
import { SupportTicketRecord } from "@/data/mockOrders";

// ── Status helpers ──────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-300 border border-blue-500/20",
  RESOLVED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  CLOSED: "bg-neutral-800 text-neutral-400 border border-neutral-700",
};

const STATUS_LABEL: Record<string, string> = {
  OPEN: "Under Review",
  IN_PROGRESS: "Specialist Replied",
  RESOLVED: "Resolved ✓",
  CLOSED: "Closed",
};

export default function OrderLookupPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // ── Active view tab ─────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"orders" | "tickets">("orders");

  // ── Orders state ────────────────────────────────────────────────────────
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [emailQuery, setEmailQuery] = useState("");

  // ── Tickets state ───────────────────────────────────────────────────────
  const [tickets, setTickets] = useState<SupportTicketRecord[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [customerReplies, setCustomerReplies] = useState<Record<string, string>>({});
  const [sendingReply, setSendingReply] = useState<Record<string, boolean>>({});
  const [ticketSearchInput, setTicketSearchInput] = useState("");
  const [ticketSearchError, setTicketSearchError] = useState<string | null>(null);

  // ── Per-ticket message container refs & tracking ──────────────────────────
  const messageContainersRef = useRef<Record<string, HTMLDivElement | null>>({});
  const lastMsgCountRef = useRef<Record<string, number>>({});
  const currentTicketsRef = useRef<SupportTicketRecord[]>([]);

  // Keep currentTicketsRef in sync with state
  useEffect(() => {
    currentTicketsRef.current = tickets;
  }, [tickets]);

  // The email used to query – prefer logged-in, fallback to manually typed
  const effectiveEmail = (user?.email || emailQuery).toLowerCase().trim();

  // ── Fetch orders ────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    let all: any[] = [];

    // 1. localStorage
    try {
      const stored = localStorage.getItem("nexus-recent-orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) all = parsed;
      }
    } catch { /* ignore */ }

    // 2. Server API
    if (effectiveEmail) {
      try {
        const res = await fetch(
          `/api/orders?email=${encodeURIComponent(effectiveEmail)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const map = new Map<string, any>();
          [...all, ...data.orders].forEach((o) => {
            const k = (o.orderNumber || o.orderId || o.id || "").toUpperCase();
            if (k && !map.has(k)) map.set(k, o);
          });
          all = Array.from(map.values());
        }
      } catch { /* ignore */ }
    }

    // 3. Filter by logged-in email or explicitly searched email (privacy restriction)
    const queryEmail = (user?.email || emailQuery).toLowerCase().trim();
    if (queryEmail) {
      const filtered = all.filter((o) => {
        const e = (o.customerEmail || o.customer?.email || "").toLowerCase();
        return e === queryEmail;
      });
      setUserOrders(filtered);
    } else {
      // When logged out and no email queried, clear orders to prevent data leaks
      setUserOrders([]);
    }
    setIsLoadingOrders(false);
  }, [effectiveEmail, user]);

  // ── Fetch tickets: Non-destructive merge with local cache & server ────────
  const fetchTickets = useCallback(async () => {
    // 1. Read persistent local cache
    let localCache: SupportTicketRecord[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexus-saved-tickets");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) localCache = parsed;
        }
      } catch { /* ignore */ }
    }

    // Build map from localCache and currently mounted tickets
    const ticketMap = new Map<string, SupportTicketRecord>();
    localCache.forEach((t) => {
      if (t.id) ticketMap.set(t.id, t);
      if (t.ticketNumber) ticketMap.set(t.ticketNumber, t);
    });
    currentTicketsRef.current.forEach((t) => {
      if (t.id) ticketMap.set(t.id, t);
      if (t.ticketNumber) ticketMap.set(t.ticketNumber, t);
    });

    let serverTickets: SupportTicketRecord[] = [];

    // 2. Fetch by email from server if available
    if (effectiveEmail) {
      try {
        const res = await fetch(
          `/api/tickets?email=${encodeURIComponent(effectiveEmail)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.tickets)) {
          serverTickets = data.tickets;
        }
      } catch { /* ignore */ }
    }

    // 3. Supplement from localStorage ticket numbers
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("nexus-my-tickets") || "{}");
        const allNums: string[] = [];
        if (effectiveEmail && stored[effectiveEmail]) {
          allNums.push(...stored[effectiveEmail]);
        } else if (!effectiveEmail) {
          Object.values(stored).forEach((arr: any) => {
            if (Array.isArray(arr)) allNums.push(...arr);
          });
        }

        const existingNums = new Set(serverTickets.map((t) => t.ticketNumber));
        const missing = allNums.filter((n) => !existingNums.has(n) && !ticketMap.has(n));

        if (missing.length > 0) {
          const results = await Promise.all(
            missing.slice(0, 10).map(async (num) => {
              try {
                const r = await fetch(
                  `/api/tickets?ticketNumber=${encodeURIComponent(num)}`,
                  { cache: "no-store" }
                );
                const d = await r.json();
                return (d.success && d.ticket) ? d.ticket : null;
              } catch { return null; }
            })
          );
          results.filter(Boolean).forEach((ticket) => {
            serverTickets.unshift(ticket);
          });
        }
      } catch { /* ignore */ }
    }

    // Merge server tickets (server data has latest admin replies and statuses)
    serverTickets.forEach((st) => {
      ticketMap.set(st.id, st);
      if (st.ticketNumber) ticketMap.set(st.ticketNumber, st);
    });

    // Unique tickets array filtered by effectiveEmail if provided
    const uniqueTickets: SupportTicketRecord[] = [];
    const seenIds = new Set<string>();
    Array.from(ticketMap.values()).forEach((t) => {
      if (!seenIds.has(t.id)) {
        seenIds.add(t.id);
        if (effectiveEmail) {
          if (!t.customerEmail || t.customerEmail.toLowerCase().trim() === effectiveEmail) {
            uniqueTickets.push(t);
          }
        } else {
          uniqueTickets.push(t);
        }
      }
    });

    // Sort by createdAt / updatedAt descending
    uniqueTickets.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt).getTime() || 0;
      const timeB = new Date(b.updatedAt || b.createdAt).getTime() || 0;
      return timeB - timeA;
    });

    // Cache merged tickets back to localStorage
    if (typeof window !== "undefined" && uniqueTickets.length > 0) {
      try {
        localStorage.setItem("nexus-saved-tickets", JSON.stringify(uniqueTickets.slice(0, 50)));
      } catch { /* ignore */ }
    }

    // Only update React state if tickets have genuinely changed (prevents re-render flicker)
    const prev = currentTicketsRef.current;
    let hasChanged = prev.length !== uniqueTickets.length;
    if (!hasChanged) {
      for (let i = 0; i < prev.length; i++) {
        const p = prev[i];
        const u = uniqueTickets[i];
        if (
          p.id !== u.id ||
          p.status !== u.status ||
          (p.messages?.length || 0) !== (u.messages?.length || 0) ||
          p.updatedAt !== u.updatedAt
        ) {
          hasChanged = true;
          break;
        }
      }
    }

    if (hasChanged) {
      setTickets(uniqueTickets);
    }
    setIsLoadingTickets(false);
  }, [effectiveEmail]);

  // ── Auto-expand first ticket when list first loads ────────────────────────
  const prevTicketCount = useRef(0);
  useEffect(() => {
    if (tickets.length > 0 && prevTicketCount.current === 0) {
      setExpandedTicketId(tickets[0].id);
    }
    prevTicketCount.current = tickets.length;
  }, [tickets.length]);

  // Initial load
  useEffect(() => {
    fetchOrders();
    fetchTickets();
  }, [fetchOrders, fetchTickets]);

  // Real-time polling for tickets every 2.5 s
  useEffect(() => {
    const iv = setInterval(() => {
      fetchTickets();
    }, 2500);
    return () => clearInterval(iv);
  }, [fetchTickets]);

  // ── Auto-scroll: strictly inside container, never scrolling the browser window ──
  useEffect(() => {
    if (!expandedTicketId) return;
    const currentTicket = tickets.find((t) => t.id === expandedTicketId);
    const msgCount = currentTicket?.messages?.length || 0;
    const lastCount = lastMsgCountRef.current[expandedTicketId];

    // Only scroll if expanding for the first time OR when a new message arrives
    if (lastCount === undefined || msgCount > lastCount) {
      lastMsgCountRef.current[expandedTicketId] = msgCount;
      requestAnimationFrame(() => {
        const container = messageContainersRef.current[expandedTicketId];
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
  }, [expandedTicketId, tickets]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleOrderLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    const clean = orderSearch.trim().toUpperCase();
    if (!clean) { setLookupError("Please enter your order number (e.g. NEX-948210)."); return; }
    router.push(`/orders/${clean}`);
  };

  const handleTicketSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSearchError(null);
    const q = ticketSearchInput.trim();
    if (!q) return;

    try {
      if (q.includes("@")) {
        const res = await fetch(`/api/tickets?email=${encodeURIComponent(q.toLowerCase())}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.tickets?.length > 0) {
          setTickets(data.tickets);
          setExpandedTicketId(data.tickets[0].id);
          try {
            const cached: SupportTicketRecord[] = JSON.parse(localStorage.getItem("nexus-saved-tickets") || "[]");
            const map = new Map<string, SupportTicketRecord>();
            cached.forEach((t) => map.set(t.id, t));
            data.tickets.forEach((t: SupportTicketRecord) => map.set(t.id, t));
            localStorage.setItem("nexus-saved-tickets", JSON.stringify(Array.from(map.values()).slice(0, 50)));
          } catch { /* ignore */ }
        } else {
          setTicketSearchError(`No tickets found for email: ${q}`);
        }
      } else {
        const num = q.toUpperCase().startsWith("TICK-") ? q.toUpperCase() : q;
        const res = await fetch(`/api/tickets?ticketNumber=${encodeURIComponent(num)}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.ticket) {
          setTickets([data.ticket]);
          setExpandedTicketId(data.ticket.id);
          try {
            const cached: SupportTicketRecord[] = JSON.parse(localStorage.getItem("nexus-saved-tickets") || "[]");
            const idx = cached.findIndex((t) => t.id === data.ticket.id);
            if (idx >= 0) cached[idx] = data.ticket;
            else cached.unshift(data.ticket);
            localStorage.setItem("nexus-saved-tickets", JSON.stringify(cached.slice(0, 50)));
          } catch { /* ignore */ }
          if (data.ticket.customerEmail && !effectiveEmail) {
            setEmailQuery(data.ticket.customerEmail);
          }
        } else {
          const resId = await fetch(`/api/tickets?ticketId=${encodeURIComponent(q)}`, { cache: "no-store" });
          const dataId = await resId.json();
          if (dataId.success && dataId.ticket) {
            setTickets([dataId.ticket]);
            setExpandedTicketId(dataId.ticket.id);
            try {
              const cached: SupportTicketRecord[] = JSON.parse(localStorage.getItem("nexus-saved-tickets") || "[]");
              const idx = cached.findIndex((t) => t.id === dataId.ticket.id);
              if (idx >= 0) cached[idx] = dataId.ticket;
              else cached.unshift(dataId.ticket);
              localStorage.setItem("nexus-saved-tickets", JSON.stringify(cached.slice(0, 50)));
            } catch { /* ignore */ }
            if (dataId.ticket.customerEmail && !effectiveEmail) {
              setEmailQuery(dataId.ticket.customerEmail);
            }
          } else {
            setTicketSearchError(`Ticket "${q}" not found. Please verify the ticket number.`);
          }
        }
      }
    } catch {
      setTicketSearchError("Could not fetch ticket — please try again.");
    }
  };

  const sendReply = async (ticketId: string) => {
    const text = customerReplies[ticketId]?.trim();
    if (!text) return;
    setSendingReply((p) => ({ ...p, [ticketId]: true }));
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
        setCustomerReplies((p) => ({ ...p, [ticketId]: "" }));

        // Update local storage cache
        try {
          const cached: SupportTicketRecord[] = JSON.parse(localStorage.getItem("nexus-saved-tickets") || "[]");
          const idx = cached.findIndex((t) => t.id === ticketId);
          if (idx >= 0) cached[idx] = data.ticket;
          else cached.unshift(data.ticket);
          localStorage.setItem("nexus-saved-tickets", JSON.stringify(cached.slice(0, 50)));
        } catch { /* ignore */ }

        // Scroll strictly inside message container after sending
        requestAnimationFrame(() => {
          const container = messageContainersRef.current[ticketId];
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      }
    } catch { /* ignore */ }
    setSendingReply((p) => ({ ...p, [ticketId]: false }));
  };

  // ── Ticket stats ──────────────────────────────────────────────────────────
  const ticketStats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "OPEN").length,
    inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter((t) => t.status === "RESOLVED").length,
    closed: tickets.filter((t) => t.status === "CLOSED").length,
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>

        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-blue-500/20 via-indigo-500/10 to-amber-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/10">
            <Key className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Customer Portal &amp; Digital Vault
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            View your purchased licenses, track WordPress activations, and read live replies from our support team.
          </p>

          {/* Logged-in identity pill */}
          {user ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 max-w-full">
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Signed in as <strong className="text-white">{user.email}</strong></span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span>
                <Link href="/" className="text-amber-200 underline underline-offset-2">Sign in</Link> to auto-load your orders &amp; tickets
              </span>
            </div>
          )}
        </div>

        {/* Email fallback (only if not logged in) */}
        {!user && (
          <div className="bg-[#10121a] rounded-2xl border border-white/[0.08] p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3 items-center">
            <MailCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <p className="text-xs text-neutral-400 flex-1 text-center sm:text-left">Enter the email you used at checkout to auto-load your orders and tickets:</p>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                className="flex-1 sm:w-56 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => { fetchOrders(); fetchTickets(); }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs text-white font-bold shrink-0 transition-colors cursor-pointer"
              >
                Load
              </button>
            </div>
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex justify-center w-full">
          <div className="bg-[#10121a] p-1.5 rounded-2xl border border-white/[0.08] grid grid-cols-2 sm:inline-flex gap-1.5 sm:gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>
                <span className="inline sm:hidden">Orders</span>
                <span className="hidden sm:inline">My Orders &amp; Licenses</span>
              </span>
              {userOrders.length > 0 && (
                <span className={`px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full text-[10px] ${activeTab === "orders" ? "bg-white/20" : "bg-neutral-800 text-neutral-300"}`}>
                  {userOrders.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tickets")}
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                activeTab === "tickets"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>
                <span className="inline sm:hidden">Tickets</span>
                <span className="hidden sm:inline">Support Tickets</span>
              </span>
              {tickets.length > 0 && (
                <span className={`px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full text-[10px] ${activeTab === "tickets" ? "bg-white/20" : "bg-neutral-800 text-neutral-300"}`}>
                  {tickets.length}
                </span>
              )}
              {/* Unread indicator: admin replied and tab not active */}
              {activeTab !== "tickets" && tickets.some((t) => t.status === "IN_PROGRESS") && (
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* TAB 1: ORDERS                            */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {isLoadingOrders ? (
              <div className="bg-[#10121a] rounded-3xl border border-white/[0.08] p-12 text-center text-xs text-neutral-400 animate-pulse">
                Loading your orders...
              </div>
            ) : userOrders.length > 0 ? (
              <div className="bg-[#10121a] rounded-3xl border border-blue-500/20 p-6 sm:p-8 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <PackageCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Your Purchased Digital Assets</h2>
                      <p className="text-xs text-neutral-400">Click any order to view your license keys &amp; fulfillment details.</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold">
                    {userOrders.length} Order{userOrders.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {userOrders.map((ord: any) => {
                    const orderId = ord.orderNumber || ord.orderId || ord.id;
                    const firstItem = ord.items?.[0];
                    const extra = (ord.items?.length || 1) - 1;

                    return (
                      <div key={orderId} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-400">{orderId}</span>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-semibold border border-emerald-500/20">
                              {ord.status || "CONFIRMED"}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-white truncate">
                            {firstItem?.title || firstItem?.productTitle || "Digital Asset Order"}
                            {extra > 0 && <span className="text-xs text-neutral-400 font-normal"> +{extra} more</span>}
                          </h4>
                          <p className="text-xs text-neutral-400">
                            {ord.timestamp || "Recent"} · {ord.paymentMethod || "Payment"} ·{" "}
                            <strong className="text-white">{formatPrice(ord.total || ord.totalAmount || 0)}</strong>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                          <Link
                            href={`/orders/${orderId}`}
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                          >
                            Open Vault &amp; Key <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href="/support"
                            className="px-3 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Open a support ticket for this order"
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

            {/* Manual order number lookup */}
            <div className="bg-[#10121a]/95 rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl space-y-5">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-400" />
                  Look Up Any Order Number
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Have a specific order number? Enter it below to open the vault directly.
                </p>
              </div>
              <form onSubmit={handleOrderLookup} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    required
                    placeholder="e.g. NEX-948210"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden uppercase"
                  />
                  <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer shrink-0"
                >
                  Unlock Vault <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              {lookupError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{lookupError}</p>
              )}
            </div>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* TAB 2: TICKETS                           */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "tickets" && (
          <div className="space-y-5">
            {/* Header bar */}
            <div className="bg-[#10121a] rounded-3xl border border-white/[0.08] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <h3 className="font-bold text-sm text-white">Support Inquiries &amp; Live Replies</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {effectiveEmail
                    ? <>Showing all tickets for <strong className="text-white">{effectiveEmail}</strong>. Admin replies update every few seconds automatically.</>
                    : "Sign in or enter your email above to auto-load your tickets."}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={fetchTickets}
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  title="Refresh"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <Link
                  href="/support"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Ticket className="w-3.5 h-3.5" /> Open New Ticket
                </Link>
              </div>
            </div>

            {/* Ticket Stats Bar */}
            {tickets.length > 0 && (
              <div className="bg-[#10121a] rounded-2xl border border-white/[0.08] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-bold text-white">Ticket Overview</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                  <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
                    <div className="text-lg font-extrabold text-white">{ticketStats.total}</div>
                    <div className="text-[10px] text-neutral-400 font-semibold mt-0.5">Total</div>
                  </div>
                  <div className="bg-amber-500/[0.05] rounded-xl p-3 border border-amber-500/20">
                    <div className="text-lg font-extrabold text-amber-400">{ticketStats.open}</div>
                    <div className="text-[10px] text-amber-400/70 font-semibold mt-0.5">Under Review</div>
                  </div>
                  <div className="bg-blue-500/[0.05] rounded-xl p-3 border border-blue-500/20">
                    <div className="text-lg font-extrabold text-blue-400">{ticketStats.inProgress}</div>
                    <div className="text-[10px] text-blue-400/70 font-semibold mt-0.5">Replied</div>
                  </div>
                  <div className="bg-emerald-500/[0.05] rounded-xl p-3 border border-emerald-500/20">
                    <div className="text-lg font-extrabold text-emerald-400">{ticketStats.resolved}</div>
                    <div className="text-[10px] text-emerald-400/70 font-semibold mt-0.5">Resolved</div>
                  </div>
                  <div className="bg-neutral-800/60 rounded-xl p-3 border border-neutral-700/40">
                    <div className="text-lg font-extrabold text-neutral-400">{ticketStats.closed}</div>
                    <div className="text-[10px] text-neutral-500 font-semibold mt-0.5">Closed</div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Ticket Lookup (for incognito / non-logged-in users) */}
            <div className="bg-[#10121a] rounded-2xl border border-white/[0.08] p-4">
              <form onSubmit={handleTicketSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by Ticket # (e.g. TICK-1234) or your email..."
                    value={ticketSearchInput}
                    onChange={(e) => setTicketSearchInput(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-bold transition-colors cursor-pointer shrink-0">
                  Find Ticket
                </button>
              </form>
              {ticketSearchError && (
                <p className="text-xs text-rose-400 mt-2 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">{ticketSearchError}</p>
              )}
            </div>

            {/* Ticket list */}
            {isLoadingTickets ? (
              <div className="bg-[#10121a] rounded-3xl border border-white/[0.08] p-12 text-center text-xs text-neutral-400 animate-pulse">
                Loading your tickets...
              </div>
            ) : tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.map((t) => {
                  const isExpanded = expandedTicketId === t.id;
                  const hasAdminReply = t.messages?.some((m) => m.sender === "ADMIN");
                  const adminReplied = t.status === "IN_PROGRESS" || hasAdminReply;

                  return (
                    <div
                      key={t.id}
                      className={`bg-[#10121a] rounded-3xl border transition-all overflow-hidden ${
                        isExpanded
                          ? "border-blue-500/40 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/20"
                          : "border-white/[0.08] hover:border-white/[0.15]"
                      }`}
                    >
                      {/* Summary header */}
                      <button
                        type="button"
                        onClick={() => setExpandedTicketId(isExpanded ? null : t.id)}
                        className="w-full text-left p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-400">{t.ticketNumber}</span>

                            {/* Status badge */}
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${STATUS_STYLES[t.status] || STATUS_STYLES.OPEN}`}>
                              <span className={`w-1.5 h-1.5 rounded-full bg-current ${adminReplied && t.status !== "RESOLVED" && t.status !== "CLOSED" ? "animate-pulse" : ""}`} />
                              {STATUS_LABEL[t.status] || t.status}
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

                          <h4 className="font-bold text-sm text-white truncate">{t.subject}</h4>

                          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {t.createdAt}
                            </span>
                            <span>{t.messages?.length || 1} message{(t.messages?.length || 1) > 1 ? "s" : ""}</span>
                            {t.resolvedAt && (
                              <span className="flex items-center gap-1 text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" /> Resolved
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Live badge when admin replied and not yet read */}
                          {adminReplied && t.status !== "RESOLVED" && t.status !== "CLOSED" && !isExpanded && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> New Reply
                            </span>
                          )}
                          <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                            {isExpanded ? "Collapse" : "View Replies"}
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </span>
                        </div>
                      </button>

                      {/* Expanded thread */}
                      {isExpanded && (
                        <div className="border-t border-white/[0.08] bg-[#0c0d14]">
                          {/* Messages scroll container */}
                          <div
                            ref={(el) => { messageContainersRef.current[t.id] = el; }}
                            className="p-6 space-y-4 max-h-[380px] overflow-y-auto"
                          >
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
                                  <span className={`font-bold flex items-center gap-1 ${m.sender === "ADMIN" ? "text-blue-400" : "text-neutral-400"}`}>
                                    {m.sender === "ADMIN" && <ShieldCheck className="w-3.5 h-3.5" />}
                                    {m.senderName}
                                  </span>
                                  <span className="text-neutral-500 text-[10px]">{m.time}</span>
                                </div>
                                <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                              </div>
                            ))}
                          </div>

                          {/* Reply input */}
                          {t.status !== "CLOSED" ? (
                            <form
                              onSubmit={(e) => { e.preventDefault(); sendReply(t.id); }}
                              className="p-4 bg-[#10121a] border-t border-white/[0.08] flex gap-2"
                            >
                              <input
                                type="text"
                                placeholder="Reply to the technician..."
                                value={customerReplies[t.id] || ""}
                                onChange={(e) => setCustomerReplies((p) => ({ ...p, [t.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendReply(t.id);
                                  }
                                }}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                type="submit"
                                disabled={sendingReply[t.id] || !customerReplies[t.id]?.trim()}
                                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                              >
                                <Send className="w-3.5 h-3.5" />
                                {sendingReply[t.id] ? "Sending…" : "Send"}
                              </button>
                            </form>
                          ) : (
                            <div className="p-3 text-center text-xs text-neutral-500 border-t border-white/[0.06]">
                              This ticket is closed. <Link href="/support" className="text-blue-400 underline">Open a new one</Link> if you need further help.
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
                <h4 className="font-bold text-sm text-white">No Support Tickets Yet</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  {effectiveEmail
                    ? `No tickets found for ${effectiveEmail}. Once you submit a ticket it will appear here instantly.`
                    : "Sign in or enter your billing email to load your ticket history."}
                </p>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md"
                >
                  <Ticket className="w-3.5 h-3.5" /> Submit Support Ticket
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Footer security row */}
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
