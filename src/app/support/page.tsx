"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  Send,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Wrench,
  Globe,
  Clock,
  Ticket,
  Search,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { SupportTicketRecord } from "@/data/mockOrders";

export default function SupportPage() {
  const user = useAuthStore((state) => state.user);

  // Mode: "create" | "track"
  const [activeTab, setActiveTab] = useState<"create" | "track">("create");

  // Form State — pre-filled from logged-in user
  const [form, setForm] = useState({
    name: "",
    email: "",
    orderNumber: "",
    priority: "MEDIUM",
    subject: "",
    message: "",
  });

  const [activeTicket, setActiveTicket] = useState<SupportTicketRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketReply, setTicketReply] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Track mode state
  const [trackQuery, setTrackQuery] = useState("");
  const [trackError, setTrackError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-populate form when user logs in / page loads
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  // Persist submitted ticket numbers to localStorage keyed by email
  const persistTicketForUser = (ticket: SupportTicketRecord) => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(localStorage.getItem("nexus-my-tickets") || "{}");
      const key = ticket.customerEmail.toLowerCase();
      if (!stored[key]) stored[key] = [];
      // Store ticket number if not already there
      if (!stored[key].includes(ticket.ticketNumber)) {
        stored[key].unshift(ticket.ticketNumber);
        // Keep max 50 entries
        if (stored[key].length > 50) stored[key] = stored[key].slice(0, 50);
      }
      localStorage.setItem("nexus-my-tickets", JSON.stringify(stored));
    } catch { /* ignore */ }
  };


  // Auto-scroll when messages update in active ticket
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTicket?.messages]);

  // Real-time polling for active ticket so technician replies appear automatically
  useEffect(() => {
    if (!activeTicket?.id && !activeTicket?.ticketNumber) return;

    const ticketQuery = activeTicket.id || activeTicket.ticketNumber;
    const pollActiveTicket = async () => {
      try {
        const queryParam = activeTicket.id 
          ? `ticketId=${encodeURIComponent(activeTicket.id)}` 
          : `ticketNumber=${encodeURIComponent(activeTicket.ticketNumber)}`;
        const res = await fetch(`/api/tickets?${queryParam}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.ticket) {
          setActiveTicket(data.ticket);
        }
      } catch {
        // ignore
      }
    };

    const interval = setInterval(pollActiveTicket, 2500);
    return () => clearInterval(interval);
  }, [activeTicket?.id, activeTicket?.ticketNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success && data.ticket) {
        setActiveTicket(data.ticket);
        persistTicketForUser(data.ticket);
      } else {
        const fallbackTicket: SupportTicketRecord = {
          id: `tick-${Date.now()}`,
          ticketNumber: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: form.name,
          customerEmail: form.email,
          orderNumber: form.orderNumber || undefined,
          priority: form.priority as any,
          status: "OPEN",
          subject: form.subject,
          createdAt: "Just now",
          messages: [
            {
              id: `m-${Date.now()}`,
              sender: "CUSTOMER",
              senderName: form.name || "Customer",
              message: form.message,
              time: "Just now",
            },
          ],
        };
        setActiveTicket(fallbackTicket);
        persistTicketForUser(fallbackTicket);
      }
    } catch {
      const fallbackTicket: SupportTicketRecord = {
        id: `tick-${Date.now()}`,
        ticketNumber: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: form.name,
        customerEmail: form.email,
        orderNumber: form.orderNumber || undefined,
        priority: form.priority as any,
        status: "OPEN",
        subject: form.subject,
        createdAt: "Just now",
        messages: [
          {
            id: `m-${Date.now()}`,
            sender: "CUSTOMER",
            senderName: form.name || "Customer",
            message: form.message,
            time: "Just now",
          },
        ],
      };
      setActiveTicket(fallbackTicket);
      persistTicketForUser(fallbackTicket);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !ticketReply.trim()) return;

    const text = ticketReply.trim();
    setIsSendingReply(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reply",
          ticketId: activeTicket.id,
          message: text,
          sender: "CUSTOMER",
          name: activeTicket.customerName || "Customer",
        }),
      });

      const data = await res.json();
      if (data.success && data.ticket) {
        setActiveTicket(data.ticket);
        setTicketReply("");
      }
    } catch {
      // ignore
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError(null);
    const q = trackQuery.trim();
    if (!q) return;

    setIsSearching(true);
    try {
      if (q.includes("@")) {
        const res = await fetch(`/api/tickets?email=${encodeURIComponent(q.toLowerCase())}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.tickets) && data.tickets.length > 0) {
          setActiveTicket(data.tickets[0]);
        } else {
          setTrackError(`No tickets found for email: ${q}`);
        }
      } else {
        const res = await fetch("/api/tickets", { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.tickets)) {
          const found = data.tickets.find(
            (t: any) =>
              t.ticketNumber?.toUpperCase() === q.toUpperCase() ||
              t.id?.toUpperCase() === q.toUpperCase()
          );
          if (found) {
            setActiveTicket(found);
          } else {
            setTrackError(`Ticket #${q} not found. Please check the ticket ID.`);
          }
        }
      }
    } catch {
      setTrackError("Unable to fetch ticket details at this time.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        {/* Tab switcher: Open Ticket vs Track Ticket */}
        <div className="flex justify-center">
          <div className="bg-[#10121a] p-1.5 rounded-2xl border border-white/[0.08] inline-flex gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("create");
                setActiveTicket(null);
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "create" && !activeTicket
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Support Ticket</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("track");
                setActiveTicket(null);
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "track" || activeTicket
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Track Ticket Status & Replies</span>
            </button>
          </div>
        </div>

        {/* ACTIVE TICKET LIVE THREAD VIEW */}
        {activeTicket ? (
          <div className="bg-[#10121a] rounded-3xl border border-blue-500/30 shadow-2xl overflow-hidden space-y-0">
            {/* Ticket Header */}
            <div className="p-6 sm:p-7 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-sm text-blue-400">
                    {activeTicket.ticketNumber}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                      activeTicket.status === "RESOLVED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : activeTicket.status === "CLOSED"
                        ? "bg-neutral-800 text-neutral-400 border border-neutral-700"
                        : activeTicket.status === "IN_PROGRESS"
                        ? "bg-blue-500/10 text-blue-300 border border-blue-500/20 animate-pulse"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {activeTicket.status === "RESOLVED"
                      ? "Resolved"
                      : activeTicket.status === "CLOSED"
                      ? "Closed"
                      : activeTicket.status === "IN_PROGRESS"
                      ? "Specialist Replied"
                      : "Under Review by Technical Dispatch"}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">{activeTicket.subject}</h2>
                <p className="text-xs text-neutral-400">
                  Logged for {activeTicket.customerName} ({activeTicket.customerEmail})
                  {activeTicket.orderNumber && ` • Linked to Order: ${activeTicket.orderNumber}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/orders"
                  className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-neutral-300 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View in Customer Panel</span>
                </Link>
              </div>
            </div>

            {/* Conversation Stream */}
            <div className="p-6 sm:p-8 space-y-4 max-h-[420px] overflow-y-auto bg-[#0c0d14]">
              {activeTicket.messages?.map((m) => (
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
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input Box */}
            {activeTicket.status !== "CLOSED" ? (
              <form onSubmit={handleSendReply} className="p-4 sm:p-5 bg-[#10121a] border-t border-white/[0.08] flex gap-2">
                <input
                  type="text"
                  placeholder="Reply directly to NEXUS technical support..."
                  value={ticketReply}
                  onChange={(e) => setTicketReply(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isSendingReply || !ticketReply.trim()}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingReply ? "Sending..." : "Send Reply"}</span>
                </button>
              </form>
            ) : (
              <div className="p-4 bg-neutral-900/60 text-center text-xs text-neutral-500 border-t border-white/[0.06]">
                This ticket has been marked as closed. Need further help? You can open a new ticket anytime.
              </div>
            )}
          </div>
        ) : activeTab === "track" ? (
          /* TRACK EXISTING TICKET SEARCH */
          <div className="bg-[#10121a] p-8 rounded-3xl border border-white/[0.08] shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400" />
                Track Ticket Status & Agent Responses
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Enter your Ticket ID (e.g. TICK-1234) or your contact email address to view all replies.
              </p>
            </div>

            <form onSubmit={handleTrackSearch} className="space-y-4">
              <div>
                <label className="block font-semibold text-xs text-neutral-300 mb-1.5">
                  Ticket ID or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. TICK-9281 or customer@example.com"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden uppercase"
                  />
                  <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              {trackError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  {trackError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>{isSearching ? "Searching..." : "Track Ticket"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          /* CREATE NEW SUPPORT TICKET */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="md:col-span-7 bg-[#10121a] p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-2xl space-y-6">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  Open a Customer Support Ticket
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Need help with your WordPress activation, serial key, or AdSense transfer? We are here 24/7.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Alex Mercer"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alex.mercer@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">
                      Related Order Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NEX-849201"
                      value={form.orderNumber}
                      onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-neutral-900 text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      <option value="LOW">Low - General Inquiry</option>
                      <option value="MEDIUM">Medium - Normal Issue</option>
                      <option value="HIGH">High - Activation Delayed</option>
                      <option value="URGENT">Urgent - Key / Account Issue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Need assistance with WP Rocket activation"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Message Description *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about your inquiry or order..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting Ticket..." : "Submit Support Ticket"}</span>
                </button>
              </form>
            </div>

            {/* Quick FAQ Sidebar */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-[#10121a] p-6 rounded-3xl border border-white/[0.08] shadow-2xl space-y-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  Frequently Asked Questions
                </h3>

                <div className="text-xs text-neutral-400 space-y-3 divide-y divide-white/[0.06] pt-1">
                  <div className="pt-2">
                    <strong className="text-white block font-semibold">
                      How will I receive responses to my ticket?
                    </strong>
                    <p className="mt-0.5 text-neutral-400">
                      You can view technician replies live right here on the support page or under the <Link href="/orders" className="text-blue-400 underline">Customer Orders & Support Panel</Link>.
                    </p>
                  </div>

                  <div className="pt-2">
                    <strong className="text-white block font-semibold">
                      How long does WordPress plugin activation take?
                    </strong>
                    <p className="mt-0.5 text-neutral-400">
                      Typically between 30 to 45 minutes during operational hours after credentials are submitted.
                    </p>
                  </div>

                  <div className="pt-2">
                    <strong className="text-white block font-semibold">
                      Where can I view my purchased IDM license key?
                    </strong>
                    <p className="mt-0.5 text-neutral-400">
                      Instantly on your order receipt screen, in your confirmation email, or via the <Link href="/orders" className="text-blue-400 underline">Order Lookup Vault</Link>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
