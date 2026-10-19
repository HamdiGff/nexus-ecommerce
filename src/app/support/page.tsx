"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    orderNumber: "",
    priority: "MEDIUM",
    subject: "",
    message: "",
  });

  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const ticketId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedTicket(ticketId);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        {submittedTicket ? (
          <div className="bg-[#10121a] rounded-3xl border border-white/[0.08] p-8 sm:p-12 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
              Ticket Submitted
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
              Support Ticket #{submittedTicket} Created
            </h1>

            <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto">
              Our technical specialists have received your inquiry. A confirmation and response will be sent to{" "}
              <strong className="text-white">{form.email}</strong> shortly.
            </p>

            <div className="pt-6 flex gap-3 justify-center">
              <Link
                href="/"
                className="py-3 px-6 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 transition-colors"
              >
                Return to Storefront
              </Link>
              <Link
                href="/admin"
                className="py-3 px-6 rounded-xl bg-white/[0.06] text-white font-semibold text-xs border border-white/10 hover:bg-white/[0.1] transition-colors"
              >
                View in Admin Hub
              </Link>
            </div>
          </div>
        ) : (
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-neutral-900 text-white"
                    >
                      <option value="LOW">Low - General Question</option>
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
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Message Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-indigo-600/25"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Submitting Ticket..." : "Submit Support Ticket"}
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

                  <div className="pt-2">
                    <strong className="text-white block font-semibold">
                      How does the AdSense site transfer work?
                    </strong>
                    <p className="mt-0.5 text-neutral-400">
                      Our transfer manager prepares the domain EPP code and Gmail login, which are handed off securely via your order portal within 2-6 hours.
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
