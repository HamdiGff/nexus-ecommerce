"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Check,
  ChevronDown,
  Wrench,
  Zap,
  Globe,
  HelpCircle,
  Mail,
  ShieldCheck,
  Edit2,
  Lock,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "customer" | "support";
  senderName: string;
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "support",
    senderName: "NEXUS Support Bot",
    text: "👋 Welcome to NEXUS Digital Support! I am here 24/7. How can we help you with your WordPress agency activation, instant software key, or AdSense transfer today?",
    timestamp: "Just now",
  },
];

export default function LiveChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // User Identification State (Mandatory Email Requirement)
  const [isRegistered, setIsRegistered] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  
  // Pre-chat form fields
  const [formEmail, setFormEmail] = useState("");
  const [formName, setFormName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("WordPress Activation");
  const [emailError, setEmailError] = useState("");
  const [hasSentInitialReply, setHasSentInitialReply] = useState(false);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  // Restore saved email and messages from localStorage on mount & sync from server
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("nexus_livechat_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.email) {
          const email = parsed.email.trim().toLowerCase();
          setUserEmail(email);
          setUserName(parsed.name || "Customer");
          setFormEmail(email);
          setFormName(parsed.name || "");
          setIsRegistered(true);

          // Restore saved messages from localStorage if present
          const storedMsgs = localStorage.getItem(`nexus_chat_msgs_${email}`);
          if (storedMsgs) {
            try {
              const msgs = JSON.parse(storedMsgs);
              if (Array.isArray(msgs) && msgs.length > 0) {
                setMessages(msgs);
                // If there are already messages, mark initial reply as sent
                if (msgs.some((m: any) => m.sender === "customer")) {
                  setHasSentInitialReply(true);
                }
              }
            } catch {
              // ignore
            }
          }

          if (localStorage.getItem(`nexus_chat_replied_${email}`) === "true") {
            setHasSentInitialReply(true);
          }
        }
      }
    } catch {
      // ignore storage error
    }
  }, []);

  // Poll server for live updates (admin replies and message sync)
  useEffect(() => {
    // Request notification permission for customer
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    if (!userEmail) return;

    const syncMessages = async () => {
      try {
        const res = await fetch(`/api/chat?email=${encodeURIComponent(userEmail.trim().toLowerCase())}`, {
          cache: "no-store",
          headers: { Pragma: "no-cache", "Cache-Control": "no-cache" },
        });
        const data = await res.json();
        if (data.success && data.chat && Array.isArray(data.chat.messages)) {
          const serverMsgs: ChatMessage[] = data.chat.messages.map((m: any) => ({
            id: m.id,
            sender: m.sender === "agent" ? "support" : "customer",
            senderName: m.senderName,
            text: m.text,
            timestamp: m.time || "Just now",
          }));

          if (serverMsgs.length > 0) {
            setMessages((prev) => {
              // Check if server has any message that is not in prev or server has more messages
              const hasNew = serverMsgs.some((sm) => !prev.some((pm) => pm.id === sm.id || (pm.text === sm.text && pm.sender === sm.sender)));
              if (hasNew || serverMsgs.length > prev.length) {
                const latest = serverMsgs[serverMsgs.length - 1];
                if (latest.sender === "support") {
                  if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
                    new Notification("Support Specialist Replied", {
                      body: latest.text,
                      icon: "/favicon.ico",
                    });
                  }
                  if (!isOpen) {
                    setUnreadCount((c) => c + 1);
                  }
                }

                try {
                  localStorage.setItem(`nexus_chat_msgs_${userEmail}`, JSON.stringify(serverMsgs));
                } catch {
                  // ignore
                }
                return serverMsgs;
              }
              return prev;
            });
          }
        }
      } catch {
        // ignore
      }
    };

    syncMessages();
    const interval = setInterval(syncMessages, 2000);
    return () => clearInterval(interval);
  }, [userEmail, isOpen]);

  useEffect(() => {
    if (isOpen && isRegistered) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, isRegistered, messages, isAgentTyping]);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = formEmail.trim().toLowerCase();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address to start chatting.");
      return;
    }

    setEmailError("");
    const displayName = formName.trim() || trimmedEmail.split("@")[0];
    
    setUserEmail(trimmedEmail);
    setUserName(displayName);
    setIsRegistered(true);

    try {
      localStorage.setItem(
        "nexus_livechat_user",
        JSON.stringify({ name: displayName, email: trimmedEmail, topic: selectedTopic })
      );
    } catch {
      // ignore storage error
    }

    // Welcome initial greeting tied to customer profile
    const welcomeMsg: ChatMessage = {
      id: `msg-lead-${Date.now()}`,
      sender: "support",
      senderName: "Sarah (Senior Tech Specialist)",
      text: `Hello ${displayName}! Your support session is linked to ${trimmedEmail} regarding "${selectedTopic}". An engineer has your profile open and can see your orders if any exist. How can we assist you?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, welcomeMsg]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "customer",
      senderName: userName || "You",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    // Broadcast to server API so admin panel receives it
    try {
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorName: userName || "Customer",
          visitorEmail: userEmail,
          message: text,
          sender: "visitor",
          topic: selectedTopic,
        }),
      });
    } catch {
      // ignore
    }

    // Only send the automated greeting response on the very FIRST customer message
    if (!hasSentInitialReply) {
      setHasSentInitialReply(true);
      if (userEmail) {
        try {
          localStorage.setItem(`nexus_chat_replied_${userEmail}`, "true");
        } catch { /* ignore */ }
      }
      setIsAgentTyping(true);

      setTimeout(() => {
        let reply =
          "Thanks for contacting us! Our technical dispatch team has logged your inquiry. If you have an active order number (e.g. NEX-XXXXXX), share it with us for instant verification.";

        const lower = text.toLowerCase();
        if (
          lower.includes("rank math") ||
          lower.includes("wp rocket") ||
          lower.includes("wordpress") ||
          lower.includes("credential")
        ) {
          reply =
            "🛠️ For WordPress plugins like Rank Math Pro & WP Rocket, our technician connects your site to our official agency dashboard within 30-45 minutes after you provide the temporary credentials during checkout. You can revoke the temporary user right after activation!";
        } else if (
          lower.includes("idm") ||
          lower.includes("steam") ||
          lower.includes("key") ||
          lower.includes("serial") ||
          lower.includes("code")
        ) {
          reply =
            "⚡ License keys for IDM and Steam gift cards are auto-delivered immediately on your confirmation screen and emailed to you. You can also view them anytime in our Order Lookup Vault!";
        } else if (
          lower.includes("adsense") ||
          lower.includes("website") ||
          lower.includes("domain")
        ) {
          reply =
            "🌐 For Google AdSense approved websites, our transfer manager delivers the dedicated Gmail logins and domain authorization (EPP) code directly to your Customer Order Vault within 2-6 hours.";
        } else if (
          lower.includes("human") ||
          lower.includes("agent") ||
          lower.includes("live")
        ) {
          reply =
            "👨‍💻 Connecting you directly to an available senior technician. Please hold on for just a moment while they review your chat session.";
        }

        const supportMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "support",
          senderName: "Sarah (Senior Tech Support)",
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, supportMsg]);
        setIsAgentTyping(false);

        // Also record bot response on server
        try {
          fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              visitorName: "Sarah (Senior Tech Support)",
              visitorEmail: userEmail,
              message: reply,
              sender: "agent",
              topic: selectedTopic,
            }),
          });
        } catch {
          // ignore
        }
      }, 1200);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-white/20"
          aria-label="Open Live Chat"
        >
          <MessageCircle className="w-6 h-6" />

          {/* Pulse Live Beacon */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#090a0f]" />
          </span>

          {/* Unread Message Pill */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -left-2 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#090a0f]">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Live Chat Window */}
      {isOpen && (
        <div className="w-[370px] sm:w-[420px] h-[580px] bg-[#0f1118]/95 backdrop-blur-2xl rounded-3xl border border-white/[0.12] shadow-2xl shadow-black/90 flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-[#0f1118] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-white/20 flex items-center justify-center font-bold text-white text-sm shadow-md">
                  N
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0f1118]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>NEXUS Live Support</span>
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                </h3>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Technicians Online & Ready
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STEP 1: PRE-CHAT EMAIL SUBMISSION FORM */}
          {!isRegistered ? (
            <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">Enter your email to start</h4>
                    <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
                      Our support staff needs your email to instantly look up your active orders, license keys, and temporary setup credentials.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleStartChat} id="prechat-form" className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. name@company.com"
                        value={formEmail}
                        onChange={(e) => {
                          setFormEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-neutral-500 focus:outline-hidden focus:border-blue-500 text-xs font-mono"
                      />
                    </div>
                    {emailError && (
                      <p className="text-rose-400 text-[11px] mt-1 font-medium">{emailError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      Your Name <span className="text-neutral-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="e.g. David Miller"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-neutral-500 focus:outline-hidden focus:border-blue-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141724] border border-white/10 text-neutral-200 text-xs focus:outline-hidden focus:border-blue-500"
                    >
                      <option value="WordPress Activation">🛠️ WordPress Activation (Rank Math / WP Rocket)</option>
                      <option value="Instant Serial Keys">⚡ Instant Serial Keys (IDM / Steam)</option>
                      <option value="AdSense Site Transfer">🌐 Google AdSense Approved Blog Transfer</option>
                      <option value="Billing & Pre-Sales">💳 Billing, Crypto & General Pre-Sales</option>
                    </select>
                  </div>
                </form>
              </div>

              <div className="pt-4 space-y-2 border-t border-white/[0.08]">
                <button
                  type="submit"
                  form="prechat-form"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Connect with Live Technician
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500">
                  <Lock className="w-3 h-3 text-neutral-400" />
                  <span>256-Bit Encrypted Session • Order Lookup Enabled</span>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: ACTIVE LIVE CONVERSATION STREAM */
            <>
              {/* Customer Account Indicator Strip */}
              <div className="px-4 py-2 bg-blue-950/30 border-b border-white/[0.06] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-neutral-300 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-neutral-400">Chatting as:</span>
                  <span className="font-semibold text-white font-mono truncate max-w-[180px]">
                    {userEmail}
                  </span>
                </div>
                <button
                  onClick={() => setIsRegistered(false)}
                  className="text-blue-400 hover:text-blue-300 font-semibold text-[10px] flex items-center gap-1 shrink-0 ml-2"
                  title="Switch or update email address"
                >
                  <Edit2 className="w-3 h-3" /> Change
                </button>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {messages.map((m) => {
                  const isUser = m.sender === "customer";
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[10px] text-neutral-400 px-1 mb-1 font-medium">
                        {m.senderName} • {m.timestamp}
                      </span>
                      <div
                        className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${
                          isUser
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs shadow-md shadow-indigo-600/20"
                            : "bg-white/[0.06] border border-white/[0.08] text-neutral-200 rounded-bl-xs"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}

                {/* Agent Typing Indicator */}
                {isAgentTyping && (
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-neutral-400 px-1 mb-1">Support typing...</span>
                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse delay-150" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse delay-300" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Pills */}
              <div className="px-4 py-2 bg-white/[0.02] border-t border-white/[0.06] overflow-x-auto flex gap-1.5 scrollbar-none">
                <button
                  onClick={() => handleQuickQuestion("How does WordPress plugin activation work?")}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-medium text-neutral-300 whitespace-nowrap border border-white/[0.06] transition-colors"
                >
                  🛠️ WP Activation Guide
                </button>
                <button
                  onClick={() => handleQuickQuestion("Where is my IDM or Steam key delivered?")}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-medium text-neutral-300 whitespace-nowrap border border-white/[0.06] transition-colors"
                >
                  ⚡ Instant Key Delivery
                </button>
                <button
                  onClick={() => handleQuickQuestion("Can I speak with a live support agent?")}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-medium text-neutral-300 whitespace-nowrap border border-white/[0.06] transition-colors"
                >
                  👨‍💻 Speak with Live Agent
                </button>
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3.5 bg-[#0a0c12] border-t border-white/[0.08] flex gap-2 items-center"
              >
                <input
                  type="text"
                  placeholder="Ask a question or enter Order #..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 disabled:opacity-40 transition-all shrink-0 cursor-pointer"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
