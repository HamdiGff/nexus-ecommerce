"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Coins,
  CreditCard,
  Package,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Plus,
  Wrench,
  Zap,
  Globe,
  Key,
  Eye,
  EyeOff,
  Ticket,
  Send,
  MessageSquare,
  MessageCircle,
  AlertCircle,
  Copy,
  Check,
  MapPin,
  Laptop,
  ExternalLink,
  User,
  Settings,
  KeyRound,
  Save,
  Lock,
  Layers,
  Search,
  Bell,
  SlidersHorizontal,
  ChevronRight,
  Database,
  BarChart3,
  HelpCircle,
  FileText,
  Boxes,
  Users,
  Trash2,
  Tag,
  Percent,
  Flame,
  Sparkles,
  Gamepad2,
  RefreshCw,
} from "lucide-react";
import { MOCK_DIGITAL_PRODUCTS, DigitalProduct, DeliveryType } from "@/data/mockProducts";
import {
  INITIAL_ORDERS as SEED_ADMIN_ORDERS,
  OrderRecord,
  AccountCredentials,
  GameGiftCode,
  SoftwareLicense,
  TurnkeyWebsiteAsset,
  ServiceCredentials,
} from "@/data/mockOrders";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/authStore";
import { useCouponStore } from "@/lib/store/couponStore";
import CredentialPurgeTimer from "@/components/security/CredentialPurgeTimer";
import AdminProductManager from "@/components/admin/AdminProductManager";
import AdminCategoryManager from "@/components/admin/AdminCategoryManager";

interface OrderAdminRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productTitle: string;
  deliveryType: DeliveryType;
  category?: string;
  total: number;
  paymentRail: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED";
  createdAt: string;
  // Service Setup credentials (for WP plugins & themes)
  serviceCredentials?: ServiceCredentials;
  // AI tool account logins
  accountCredentials?: AccountCredentials;
  // Game digital voucher PIN
  gameGiftCode?: GameGiftCode;
  // Software license key
  softwareLicense?: SoftwareLicense;
  // Instant code dispensed
  dispensedKey?: string;
  // Dynamic Purge Security fields
  isPurged?: boolean;
  purgedAt?: string;
  purgeHours?: number;
  // Manual Asset delivered (for AdSense websites)
  deliveredAsset?: TurnkeyWebsiteAsset;
}

interface SupportTicketRecord {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  orderNumber?: string;
  subject: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  messages: Array<{
    id: string;
    sender: "CUSTOMER" | "ADMIN";
    senderName: string;
    message: string;
    time: string;
  }>;
}

interface LiveChatSession {
  id: string;
  visitorName: string;
  visitorEmail: string;
  ipAddress: string;
  ipLocation: string;
  deviceInfo: string;
  currentPage: string;
  referrer: string;
  sessionDuration: string;
  inquiryTopic: string;
  status: "ONLINE" | "WAITING_REPLY" | "RESOLVED";
  unread: boolean;
  messages: {
    id: string;
    sender: "visitor" | "agent";
    senderName: string;
    text: string;
    time: string;
  }[];
}

const INITIAL_ORDERS: OrderAdminRecord[] = [];
const INITIAL_TICKETS: SupportTicketRecord[] = [];
const INITIAL_LIVE_CHATS: LiveChatSession[] = [];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "fulfillment" | "products" | "categories" | "license-pool" | "coupons" | "tickets" | "live-chat" | "settings"
  >("products");

  const {
    coupons,
    createCoupon,
    toggleCouponActive,
    deleteCoupon,
    flashSaleActive,
    toggleFlashSale,
    flashSaleCode,
  } = useCouponStore();

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState({
    code: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    discountValue: 20,
    minOrder: 0,
    maxUses: 100,
    description: "",
    requiresCrypto: false,
    isActive: true,
  });

  const handleGenerateRandomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let res = "NEX-";
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCouponForm((prev) => ({ ...prev, code: res }));
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponForm.code.trim()) return;

    createCoupon({
      code: newCouponForm.code.trim(),
      discountType: newCouponForm.discountType,
      discountValue: Number(newCouponForm.discountValue),
      minOrder: newCouponForm.minOrder ? Number(newCouponForm.minOrder) : undefined,
      maxUses: newCouponForm.maxUses ? Number(newCouponForm.maxUses) : undefined,
      description: newCouponForm.description || `${newCouponForm.discountValue}% promotional discount`,
      requiresCrypto: newCouponForm.requiresCrypto,
      isActive: true,
    });

    setShowCouponModal(false);
    setNewCouponForm({
      code: "",
      discountType: "PERCENTAGE",
      discountValue: 20,
      minOrder: 0,
      maxUses: 100,
      description: "",
      requiresCrypto: false,
      isActive: true,
    });
  };

  const apiKeys = useAuthStore((state) => state.apiKeys);
  const updateApiKeys = useAuthStore((state) => state.updateApiKeys);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const loginAdminDemo = useAuthStore((state) => state.loginAdminDemo);

  const [localApiKeys, setLocalApiKeys] = useState(apiKeys);
  const [savedSuccess, setSavedSuccess] = useState(false);


  const [orders, setOrders] = useState<OrderAdminRecord[]>(() => {
    return SEED_ADMIN_ORDERS.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      productTitle: o.productTitle,
      deliveryType: o.deliveryType,
      category: o.category,
      total: o.total,
      paymentRail: o.paymentRail,
      status: o.status,
      createdAt: o.createdAt,
      serviceCredentials: o.serviceCredentials,
      accountCredentials: o.accountCredentials,
      gameGiftCode: o.gameGiftCode,
      softwareLicense: o.softwareLicense,
      dispensedKey: o.dispensedKey,
      deliveredAsset: o.deliveredAsset,
      isPurged: o.isPurged,
      purgeHours: o.purgeHours,
    }));
  });

  // Sync client-side checkouts from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("nexus-recent-orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        setOrders((prev) => {
          const existingNums = new Set(prev.map((o) => o.orderNumber.toUpperCase()));
          const newOnes: OrderAdminRecord[] = [];
          for (const o of parsed) {
            const num = (o.orderId || o.orderNumber || "").toUpperCase();
            if (num && !existingNums.has(num)) {
              newOnes.push({
                id: o.orderId || o.id,
                orderNumber: num,
                customerName: o.customer?.name || "Customer",
                customerEmail: o.customer?.email || "customer@example.com",
                productTitle: o.items?.[0]?.title || "Digital Order Item",
                deliveryType: (o.items?.[0]?.deliveryType as DeliveryType) || "SERVICE_SETUP",
                category: o.items?.[0]?.category || "wordpress-plugin",
                total: o.total || 15.0,
                paymentRail: o.paymentMethod || "Credit Card (Stripe)",
                status: "PROCESSING",
                createdAt: o.timestamp || "Just now",
                serviceCredentials: o.submissions?.[o.items?.[0]?.id]
                  ? {
                      wpAdminUrl: o.submissions[o.items[0].id].wpAdminUrl,
                      wpUsername: o.submissions[o.items[0].id].wpUsername,
                      wpPassword: o.submissions[o.items[0].id].wpPassword,
                      notes: o.submissions[o.items[0].id].notes,
                      technicianStep: 2,
                    }
                  : undefined,
                dispensedKey: o.generatedLicenseKeys?.[o.items?.[0]?.id],
                isPurged: false,
                purgeHours: 24,
              });
            }
          }
          return [...newOnes, ...prev];
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const [tickets, setTickets] = useState<SupportTicketRecord[]>(INITIAL_TICKETS);
  const [products, setProducts] = useState<DigitalProduct[]>(MOCK_DIGITAL_PRODUCTS);
  const [liveChats, setLiveChats] = useState<LiveChatSession[]>(INITIAL_LIVE_CHATS);
  const [selectedChat, setSelectedChat] = useState<LiveChatSession | null>(INITIAL_LIVE_CHATS[0] || null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketRecord | null>(INITIAL_TICKETS[0] || null);
  const [replyMessage, setReplyMessage] = useState("");
  const [liveChatReply, setLiveChatReply] = useState("");
  const [chatFilter, setChatFilter] = useState<"ALL" | "WITH_ORDERS" | "WAITING">("ALL");

  // Sync tickets & live chats from global API routes (survives incognito/browsers)
  useEffect(() => {
    const fetchRealtimeSupport = async () => {
      try {
        // 1. Fetch tickets
        const tickRes = await fetch("/api/tickets");
        const tickData = await tickRes.json();
        if (tickData.success && Array.isArray(tickData.tickets) && tickData.tickets.length > 0) {
          setTickets(tickData.tickets);
          setSelectedTicket((prev) => prev || tickData.tickets[0]);
        }

        // 2. Fetch live chats
        const chatRes = await fetch("/api/chat");
        const chatData = await chatRes.json();
        if (chatData.success && Array.isArray(chatData.chats) && chatData.chats.length > 0) {
          setLiveChats(chatData.chats);
          setSelectedChat((prev) => prev || chatData.chats[0]);
        }
      } catch {
        // ignore
      }
    };

    fetchRealtimeSupport();
    const interval = setInterval(fetchRealtimeSupport, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter state for fulfillment
  const [fulfillmentFilter, setFulfillmentFilter] = useState<
    "ALL" | "SERVICE_SETUP" | "AI_TOOLS" | "GAME_CODES" | "SOFTWARE_LICENSE" | "MANUAL_HANDOFF"
  >("ALL");

  // State for revealing passwords in admin
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  // 1. Manual Website Asset Handoff Modal
  const [handoffTargetOrder, setHandoffTargetOrder] = useState<OrderAdminRecord | null>(null);
  const [assetForm, setAssetForm] = useState({
    eppCode: "",
    gmailLogin: "",
    gmailPassword: "",
    notes: "",
  });

  // 2. AI Tool Account Logins Dispatch Modal
  const [aiDispatchOrder, setAiDispatchOrder] = useState<OrderAdminRecord | null>(null);
  const [aiForm, setAiForm] = useState({
    toolName: "ChatGPT Plus (OpenAI)",
    accountEmail: "chatgpt.shared.pool29@nexusaccount.com",
    accountPassword: "NexusAI#PlusPass2026!",
    profileSlot: "Slot #2 (Private Profile — PIN: 4892)",
    profilePin: "4892",
    planType: "Shared Slot" as "Shared Slot" | "Private Dedicated Account",
    expiresAt: "30 Days from delivery",
    warrantyTerms: "30-Day Auto Replacement Warranty included",
  });

  // 3. WordPress Setup Confirmation Modal
  const [wpActivationOrder, setWpActivationOrder] = useState<OrderAdminRecord | null>(null);
  const [wpActivationKey, setWpActivationKey] = useState("WPR-AGENCY-AUTH-772910");

  // 4. Game Digital Gift Code Dispatch Modal
  const [giftCodeTargetOrder, setGiftCodeTargetOrder] = useState<OrderAdminRecord | null>(null);
  const [giftCodeForm, setGiftCodeForm] = useState({
    platform: "Steam",
    code: "STM-8492-QZ84-9382-USD",
    region: "Global / United States (USD)",
    faceValue: "$50.00 USD",
    redemptionGuide: "Open Steam Client > Games Menu > Redeem a Steam Wallet Code > Paste key and click Continue.",
  });

  // Product Creator Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    slug: "",
    category: "wordpress",
    deliveryType: "SERVICE_SETUP" as DeliveryType,
    price: 19.99,
    description: "",
  });

  // License Key Batch Uploader State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyBatchText, setKeyBatchText] = useState("");
  const [keyBatchProduct, setKeyBatchProduct] = useState("prod-idm-lifetime");

  // Helper to persist order updates to localStorage so customer vault reflects changes
  const syncOrderToLocalStorage = (updatedOrder: OrderAdminRecord) => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(localStorage.getItem("nexus-recent-orders") || "[]");
      const idx = stored.findIndex(
        (o: any) =>
          o.orderId?.toUpperCase() === updatedOrder.orderNumber.toUpperCase() ||
          o.orderNumber?.toUpperCase() === updatedOrder.orderNumber.toUpperCase()
      );
      if (idx !== -1) {
        stored[idx] = { ...stored[idx], ...updatedOrder };
      } else {
        stored.unshift(updatedOrder);
      }
      localStorage.setItem("nexus-recent-orders", JSON.stringify(stored));
    } catch {
      // ignore
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const togglePasswordReveal = (orderId: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const markServiceCompleted = (orderId: string, licenseKey?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated: OrderAdminRecord = {
            ...o,
            status: "COMPLETED",
            serviceCredentials: o.serviceCredentials
              ? {
                  ...o.serviceCredentials,
                  technicianStep: 4,
                  activatedLicenseKey: licenseKey || o.serviceCredentials.activatedLicenseKey || "AGENCY-LIC-ACTIVATED",
                }
              : undefined,
          };
          syncOrderToLocalStorage(updated);
          return updated;
        }
        return o;
      })
    );
    setWpActivationOrder(null);
  };

  const purgeOrderCredentials = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated: OrderAdminRecord = {
            ...o,
            isPurged: true,
            purgedAt: "Just now",
            serviceCredentials: o.serviceCredentials
              ? {
                  ...o.serviceCredentials,
                  wpPassword: "[PURGED_FOR_SECURITY]",
                }
              : undefined,
          };
          syncOrderToLocalStorage(updated);
          return updated;
        }
        return o;
      })
    );
  };

  // Dispatch Website / AdSense credentials
  const handleDeliverAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoffTargetOrder) return;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === handoffTargetOrder.id) {
          const updated: OrderAdminRecord = {
            ...o,
            status: "COMPLETED",
            deliveredAsset: {
              websiteName: o.deliveredAsset?.websiteName || o.productTitle,
              domainName: o.deliveredAsset?.domainName || "domain.com",
              domainEppCode: assetForm.eppCode,
              gmailLogin: assetForm.gmailLogin,
              gmailPassword: assetForm.gmailPassword,
              notes: assetForm.notes,
              isDelivered: true,
            },
          };
          syncOrderToLocalStorage(updated);
          return updated;
        }
        return o;
      })
    );

    setHandoffTargetOrder(null);
  };

  // Dispatch AI Tool Account Logins
  const handleDeliverAiAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiDispatchOrder) return;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === aiDispatchOrder.id) {
          const updated: OrderAdminRecord = {
            ...o,
            status: "COMPLETED",
            accountCredentials: {
              toolName: aiForm.toolName,
              accountEmail: aiForm.accountEmail,
              accountPassword: aiForm.accountPassword,
              profileSlot: aiForm.profileSlot,
              profilePin: aiForm.profilePin,
              planType: aiForm.planType,
              expiresAt: aiForm.expiresAt,
              warrantyTerms: aiForm.warrantyTerms,
              isDelivered: true,
            },
          };
          syncOrderToLocalStorage(updated);
          return updated;
        }
        return o;
      })
    );

    setAiDispatchOrder(null);
  };

  // Dispatch / Swap Game Digital Gift Code
  const handleDeliverGiftCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCodeTargetOrder) return;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === giftCodeTargetOrder.id) {
          const updated: OrderAdminRecord = {
            ...o,
            status: "COMPLETED",
            dispensedKey: giftCodeForm.code,
            gameGiftCode: {
              platform: giftCodeForm.platform as any,
              code: giftCodeForm.code,
              region: giftCodeForm.region,
              faceValue: giftCodeForm.faceValue,
              redemptionGuide: giftCodeForm.redemptionGuide,
              isDelivered: true,
            },
          };
          syncOrderToLocalStorage(updated);
          return updated;
        }
        return o;
      })
    );

    setGiftCodeTargetOrder(null);
  };

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    const newReply = {
      id: `m-${Date.now()}`,
      sender: "ADMIN" as const,
      senderName: "NEXUS Support Specialist",
      message: replyMessage.trim(),
      time: "Just now",
    };

    const updated = {
      ...selectedTicket,
      status: "IN_PROGRESS" as const,
      messages: [...selectedTicket.messages, newReply],
    };

    setSelectedTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setReplyMessage("");
  };

  const handleSendLiveReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !liveChatReply.trim()) return;

    const replyText = liveChatReply.trim();
    const newMsg = {
      id: `cm-${Date.now()}`,
      sender: "agent" as const,
      senderName: "Admin Specialist",
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = {
      ...selectedChat,
      status: "ONLINE" as const,
      unread: false,
      messages: [...selectedChat.messages, newMsg],
    };

    setSelectedChat(updated);
    setLiveChats((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setLiveChatReply("");

    // Broadcast reply to server API so customer sees it in real-time
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorName: selectedChat.visitorName,
          visitorEmail: selectedChat.visitorEmail,
          message: replyText,
          sender: "agent",
        }),
      });
    } catch {
      // ignore
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: DigitalProduct = {
      id: `prod-${Date.now()}`,
      title: newProduct.title,
      slug: newProduct.slug || newProduct.title.toLowerCase().replace(/\s+/g, "-"),
      category: newProduct.category,
      deliveryType: newProduct.deliveryType,
      isInstantDelivery: newProduct.deliveryType === "INSTANT_CODE",
      shortDescription: newProduct.description.slice(0, 80),
      description: newProduct.description,
      price: Number(newProduct.price),
      rating: 5.0,
      reviewsCount: 1,
      images: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        {
          id: `var-${Date.now()}`,
          sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
          title: "Standard License",
          price: Number(newProduct.price),
          stockQuantity: 99,
        },
      ],
      features: [
        "Official genuine digital license",
        "Instant delivery & activation guarantee",
        "24/7 Priority support",
      ],
      seoKeywords: [newProduct.title.toLowerCase()],
    };

    setProducts([created, ...products]);
    setShowProductModal(false);
  };

  const handleAddKeys = (e: React.FormEvent) => {
    e.preventDefault();
    const keys = keyBatchText.split("\n").filter((k) => k.trim().length > 0);
    alert(`Successfully added ${keys.length} new license keys to inventory!`);
    setShowKeyModal(false);
    setKeyBatchText("");
  };

  const filteredOrders = orders.filter((o) => {
    if (fulfillmentFilter === "ALL") return true;
    if (fulfillmentFilter === "SERVICE_SETUP") {
      return o.deliveryType === "SERVICE_SETUP" || o.category?.includes("wordpress");
    }
    if (fulfillmentFilter === "AI_TOOLS") {
      return o.category === "ai-tools" || Boolean(o.accountCredentials);
    }
    if (fulfillmentFilter === "GAME_CODES") {
      return o.category === "game-codes" || Boolean(o.gameGiftCode);
    }
    if (fulfillmentFilter === "SOFTWARE_LICENSE") {
      return o.category === "software-license" || Boolean(o.softwareLicense);
    }
    if (fulfillmentFilter === "MANUAL_HANDOFF") {
      return o.deliveryType === "MANUAL_HANDOFF" && (o.category === "adsense-websites" || Boolean(o.deliveredAsset));
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#07080c] text-neutral-100 flex flex-col md:flex-row antialiased">
      {/* 1. CMS FIXED LEFT SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#0c0e15] border-r border-white/[0.08] flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-indigo-600/30">
              N
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight block">
                NEXUS CMS
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Control Panel
              </span>
            </div>
          </Link>

          <Link
            href="/"
            title="Return to storefront"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 p-3 space-y-6 overflow-y-auto">
          {/* CATEGORY: COMMERCE & FULFILLMENT */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Order Fulfillment
            </span>

            <button
              onClick={() => setActiveTab("fulfillment")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "fulfillment"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Orders & Setup</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === "fulfillment"
                    ? "bg-white/20 text-white"
                    : "bg-blue-500/10 text-blue-400"
                }`}
              >
                {orders.filter((o) => o.status === "PROCESSING").length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("license-pool")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "license-pool"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>License Key Pools</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">128 Keys</span>
            </button>
          </div>

          {/* CATEGORY: CATALOG & CONTENT */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Catalog & CMS
            </span>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "products"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-purple-400" />
                <span>Products & SEO</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">{products.length} Items</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "categories"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Categories & Taxonomy</span>
              </div>
              <span className="text-[10px] text-amber-400/90 font-mono font-bold">5 Active</span>
            </button>
          </div>

          {/* CATEGORY: PROMOTIONS & GROWTH */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Promotions & Growth
            </span>

            <button
              onClick={() => setActiveTab("coupons")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "coupons"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-emerald-400" />
                <span>Coupons & Flash Sales</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                {coupons.length}
              </span>
            </button>
          </div>

          {/* CATEGORY: SUPPORT & CUSTOMER SERVICE */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Customer Communications
            </span>

            <button
              onClick={() => setActiveTab("live-chat")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                activeTab === "live-chat"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-cyan-400" />
                <span>Live Visitor Chats</span>
              </div>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {liveChats.some((c) => c.unread) && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">
                    {liveChats.filter((c) => c.unread).length}
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("tickets")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "tickets"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Ticket className="w-4 h-4 text-amber-400" />
                <span>Support Tickets</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === "tickets"
                    ? "bg-white/20 text-white"
                    : "bg-purple-500/10 text-purple-400"
                }`}
              >
                {tickets.filter((t) => t.status !== "RESOLVED").length}
              </span>
            </button>
          </div>

          {/* CATEGORY: SYSTEM SETTINGS */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Configuration & Keys
            </span>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-orange-400" />
                <span>API Keys & Credentials</span>
              </div>
            </button>
          </div>
        </div>

        {/* Admin Staff Identity Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
              AD
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Super Admin</span>
              <span className="text-[10px] text-neutral-400 font-mono">admin@nexusdigital.io</span>
            </div>
          </div>
          <Link
            href="/"
            className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-white/[0.06] transition-colors"
            title="Log Out / Exit to Storefront"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* 2. MAIN CMS CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top App Bar */}
        <header className="h-16 border-b border-white/[0.08] bg-[#090b11]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              {activeTab === "fulfillment"
                ? "Fulfillment Queue & Credentials"
                : activeTab === "products"
                ? "Product Catalog & SEO Manager"
                : activeTab === "license-pool"
                ? "License Key Inventory Pools"
                : activeTab === "tickets"
                ? "Customer Support Desk"
                : activeTab === "live-chat"
                ? "Real-Time Live Visitor Chat Console"
                : "API Keys & Integrations"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProductModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
            <button
              onClick={() => setShowKeyModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Upload Keys</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 max-w-7xl w-full">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0f1118] p-5 rounded-2xl border border-white/[0.08] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-400">Total Sales</span>
                <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-2">
                {formatPrice(totalRevenue)}
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
                100% Digital Fulfillment
              </span>
            </div>

            <div className="bg-[#0f1118] p-5 rounded-2xl border border-white/[0.08] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-400">WP Queued Setups</span>
                <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-2">
                {orders.filter((o) => o.deliveryType === "SERVICE_SETUP" && o.status === "PROCESSING").length}
              </div>
              <span className="text-[11px] text-blue-400 font-semibold mt-1 block">
                Credentials Available
              </span>
            </div>

            <div className="bg-[#0f1118] p-5 rounded-2xl border border-white/[0.08] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-400">Keys Dispensed</span>
                <div className="p-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-2">128</div>
              <span className="text-[11px] text-purple-400 font-semibold mt-1 block">
                Instant delivery
              </span>
            </div>

            <div className="bg-[#0f1118] p-5 rounded-2xl border border-white/[0.08] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-400">Active Tickets</span>
                <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
                  <Ticket className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-2">
                {tickets.filter((t) => t.status !== "RESOLVED").length}
              </div>
              <span className="text-[11px] text-amber-400 font-semibold mt-1 block">
                Avg: 18 mins
              </span>
            </div>
          </div>

        {/* TAB 1: FULFILLMENT QUEUE */}
        {activeTab === "fulfillment" && (
          <div className="space-y-6">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFulfillmentFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  fulfillmentFilter === "ALL" ? "bg-neutral-900 text-white" : "bg-white text-neutral-600 border border-neutral-200"
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setFulfillmentFilter("SERVICE_SETUP")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  fulfillmentFilter === "SERVICE_SETUP" ? "bg-blue-600 text-white" : "bg-white text-blue-700 border border-blue-200"
                }`}
              >
                <Wrench className="w-3 h-3" /> WP Activations (Themes & Plugins)
              </button>
              <button
                onClick={() => setFulfillmentFilter("AI_TOOLS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  fulfillmentFilter === "AI_TOOLS" ? "bg-purple-600 text-white" : "bg-white text-purple-700 border border-purple-200"
                }`}
              >
                <Sparkles className="w-3 h-3" /> AI Tool Accounts
              </button>
              <button
                onClick={() => setFulfillmentFilter("GAME_CODES")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  fulfillmentFilter === "GAME_CODES" ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 border border-emerald-200"
                }`}
              >
                <Gamepad2 className="w-3 h-3" /> Game Gift Codes
              </button>
              <button
                onClick={() => setFulfillmentFilter("SOFTWARE_LICENSE")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  fulfillmentFilter === "SOFTWARE_LICENSE" ? "bg-cyan-600 text-white" : "bg-white text-cyan-700 border border-cyan-200"
                }`}
              >
                <Key className="w-3 h-3" /> Software Licenses
              </button>
              <button
                onClick={() => setFulfillmentFilter("MANUAL_HANDOFF")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  fulfillmentFilter === "MANUAL_HANDOFF" ? "bg-amber-600 text-white" : "bg-white text-amber-700 border border-amber-200"
                }`}
              >
                <Globe className="w-3 h-3" /> Website Handoffs
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs divide-y divide-neutral-100">
              {filteredOrders.map((order) => {
                const isPassVisible = revealedPasswords[order.id] || false;
                const isWp = order.deliveryType === "SERVICE_SETUP" || order.category?.includes("wordpress");
                const isAi = order.category === "ai-tools" || Boolean(order.accountCredentials);
                const isGame = order.category === "game-codes" || Boolean(order.gameGiftCode);
                const isSoftware = order.category === "software-license" || Boolean(order.softwareLicense);
                const isWebsite = order.deliveryType === "MANUAL_HANDOFF" && (order.category === "adsense-websites" || Boolean(order.deliveredAsset));

                return (
                  <div key={order.id} className="p-6 hover:bg-neutral-50/50 transition-colors space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-sm text-neutral-950">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs text-neutral-400">• {order.createdAt}</span>

                          {/* Delivery Type Badge */}
                          {isWp && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
                              <Wrench className="w-3 h-3" /> WP Setup ({order.category === "wordpress-theme" ? "Theme" : "Plugin"})
                            </span>
                          )}
                          {isAi && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> AI Tool Account
                            </span>
                          )}
                          {isGame && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <Gamepad2 className="w-3 h-3" /> Game Digital Code
                            </span>
                          )}
                          {isSoftware && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 flex items-center gap-1">
                              <Key className="w-3 h-3" /> Retail License Key
                            </span>
                          )}
                          {isWebsite && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                              <Globe className="w-3 h-3" /> AdSense Website Transfer
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-neutral-900 text-sm mt-1">{order.productTitle}</h4>
                        <p className="text-xs text-neutral-500">
                          Customer: <strong className="text-neutral-800">{order.customerName}</strong> ({order.customerEmail}) • Paid via {order.paymentRail}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-neutral-950">
                          {formatPrice(order.total)}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            order.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800 animate-pulse"
                          }`}
                        >
                          {order.status === "COMPLETED" ? "Fulfilled" : "Action Needed"}
                        </span>
                      </div>
                    </div>

                    {/* TYPE 1: WORDPRESS SERVICE SETUP (PLUGINS & THEMES) */}
                    {isWp && order.serviceCredentials && (
                      <div className="p-4 rounded-2xl bg-[#0d1017] border border-blue-500/20 text-xs space-y-3">
                        <div className="flex items-center justify-between font-bold text-white pb-2 border-b border-white/[0.08] flex-wrap gap-2">
                          <span className="flex items-center gap-1.5 text-blue-400">
                            <Wrench className="w-3.5 h-3.5" />
                            Client WordPress Installation Credentials
                          </span>
                          <div className="flex items-center gap-2">
                            {order.status === "PROCESSING" && (
                              <button
                                onClick={() => {
                                  setWpActivationOrder(order);
                                  setWpActivationKey(
                                    order.serviceCredentials?.activatedLicenseKey ||
                                    (order.category === "wordpress-theme" ? "ASTRA-PRO-AGENCY-883102" : "WPR-AGENCY-772910-MERCER")
                                  );
                                }}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Mark Activated & Complete</span>
                              </button>
                            )}
                            {!order.isPurged && (
                              <button
                                onClick={() => purgeOrderCredentials(order.id)}
                                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Purge Credentials</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Live Credential Auto-Purge Countdown */}
                        <CredentialPurgeTimer
                          purgeHours={order.purgeHours || 24}
                          initialPurged={order.isPurged}
                          onPurge={() => purgeOrderCredentials(order.id)}
                          variant="admin"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono pt-1">
                          <div>
                            <span className="text-neutral-400 text-[10px] block font-sans">Target Admin Login URL</span>
                            <a
                              href={order.serviceCredentials.wpAdminUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 font-semibold hover:underline truncate block flex items-center gap-1"
                            >
                              <span>{order.serviceCredentials.wpAdminUrl}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          <div>
                            <span className="text-neutral-400 text-[10px] block font-sans">Temporary Username</span>
                            <span className="text-white font-bold select-all">
                              {order.serviceCredentials.wpUsername}
                            </span>
                          </div>

                          <div>
                            <span className="text-neutral-400 text-[10px] block font-sans">Temporary Password</span>
                            {order.isPurged ? (
                              <span className="text-emerald-400 font-bold select-all text-[11px]">
                                [PURGED FOR SECURITY]
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-white font-bold select-all">
                                  {isPassVisible ? order.serviceCredentials.wpPassword : "••••••••••••"}
                                </span>
                                <button
                                  onClick={() => togglePasswordReveal(order.id)}
                                  className="text-neutral-400 hover:text-white"
                                >
                                  {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {order.serviceCredentials.notes && (
                          <div className="pt-2 text-[11px] text-neutral-400 border-t border-white/[0.06]">
                            <strong className="text-neutral-300">Client Instructions:</strong> &quot;{order.serviceCredentials.notes}&quot;
                          </div>
                        )}

                        {order.serviceCredentials.activatedLicenseKey && (
                          <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center justify-between">
                            <span>
                              Active Agency License: <strong className="font-mono text-white">{order.serviceCredentials.activatedLicenseKey}</strong>
                            </span>
                            <span className="text-emerald-400 font-bold">Connected & Verified</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TYPE 2: AI TOOLS ACCOUNT (SHARED / PRIVATE CREDENTIALS) */}
                    {isAi && (
                      <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-3">
                        <div className="flex items-center justify-between font-bold text-white pb-2 border-b border-purple-500/20 flex-wrap gap-2">
                          <span className="flex items-center gap-1.5 text-purple-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Tool Account Credentials Delivery
                          </span>
                          <div className="flex items-center gap-2">
                            {order.status === "PROCESSING" ? (
                              <button
                                onClick={() => {
                                  setAiDispatchOrder(order);
                                  setAiForm({
                                    toolName: order.accountCredentials?.toolName || order.productTitle,
                                    accountEmail: order.accountCredentials?.accountEmail || "chatgpt.shared.pool29@nexusaccount.com",
                                    accountPassword: order.accountCredentials?.accountPassword || "NexusAI#PlusPass2026!",
                                    profileSlot: order.accountCredentials?.profileSlot || "Slot #2 (Private Profile — PIN: 4892)",
                                    profilePin: order.accountCredentials?.profilePin || "4892",
                                    planType: order.accountCredentials?.planType || "Shared Slot",
                                    expiresAt: order.accountCredentials?.expiresAt || "30 Days from delivery",
                                    warrantyTerms: order.accountCredentials?.warrantyTerms || "30-Day Auto Replacement Guarantee",
                                  });
                                }}
                                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-[11px] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Dispatch Account Logins</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setAiDispatchOrder(order);
                                  setAiForm({
                                    toolName: order.accountCredentials?.toolName || order.productTitle,
                                    accountEmail: order.accountCredentials?.accountEmail || "",
                                    accountPassword: order.accountCredentials?.accountPassword || "",
                                    profileSlot: order.accountCredentials?.profileSlot || "",
                                    profilePin: order.accountCredentials?.profilePin || "",
                                    planType: order.accountCredentials?.planType || "Shared Slot",
                                    expiresAt: order.accountCredentials?.expiresAt || "",
                                    warrantyTerms: order.accountCredentials?.warrantyTerms || "",
                                  });
                                }}
                                className="px-2.5 py-1 bg-white/[0.05] hover:bg-white/[0.1] text-purple-300 border border-purple-500/30 rounded-lg text-[11px] font-semibold"
                              >
                                Edit Credentials
                              </button>
                            )}
                          </div>
                        </div>

                        {order.accountCredentials?.isDelivered ? (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono pt-1 text-neutral-300">
                            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                              <span className="text-[10px] text-neutral-400 block font-sans">Account Login:</span>
                              <span className="font-bold text-white select-all">{order.accountCredentials.accountEmail}</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                              <span className="text-[10px] text-neutral-400 block font-sans">Password:</span>
                              <span className="font-bold text-white select-all">{order.accountCredentials.accountPassword}</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                              <span className="text-[10px] text-neutral-400 block font-sans">Slot / PIN:</span>
                              <span className="font-bold text-purple-300 select-all">
                                {order.accountCredentials.profileSlot} {order.accountCredentials.profilePin ? `(PIN: ${order.accountCredentials.profilePin})` : ""}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-purple-300 text-xs">
                            Awaiting login assignment: Click &quot;Dispatch Account Logins&quot; to assign the dedicated or shared AI credentials to {order.customerName}.
                          </p>
                        )}
                      </div>
                    )}

                    {/* TYPE 3: GAME DIGITAL GIFT CODES */}
                    {isGame && (
                      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-3">
                        <div className="flex items-center justify-between font-bold text-white pb-2 border-b border-emerald-500/20 flex-wrap gap-2">
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <Gamepad2 className="w-3.5 h-3.5" />
                            Game Digital Gift Code Fulfillment
                          </span>
                          <button
                            onClick={() => {
                              setGiftCodeTargetOrder(order);
                              setGiftCodeForm({
                                platform: order.gameGiftCode?.platform || "Steam",
                                code: order.gameGiftCode?.code || order.dispensedKey || "STM-8492-QZ84-9382-USD",
                                region: order.gameGiftCode?.region || "Global / US",
                                faceValue: order.gameGiftCode?.faceValue || "$50.00 USD",
                                redemptionGuide: order.gameGiftCode?.redemptionGuide || "Redeem in Steam Client",
                              });
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Re-issue / Update Voucher Code</span>
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-neutral-950/80 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                              Active Voucher PIN (Delivered to Customer):
                            </span>
                            <span className="font-mono text-sm sm:text-base font-extrabold text-white select-all">
                              {order.gameGiftCode?.code || order.dispensedKey}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-400">
                            {order.gameGiftCode?.platform} • {order.gameGiftCode?.faceValue} ({order.gameGiftCode?.region})
                          </span>
                        </div>
                      </div>
                    )}

                    {/* TYPE 4: SOFTWARE RETAIL LICENSE KEYS */}
                    {isSoftware && (
                      <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-2">
                        <div className="flex items-center justify-between font-bold text-white pb-2 border-b border-cyan-500/20">
                          <span className="flex items-center gap-1.5 text-cyan-400">
                            <Key className="w-3.5 h-3.5" />
                            Retail License Serial Key Dispenser
                          </span>
                          <span className="text-xs text-cyan-300 font-bold px-2 py-0.5 rounded-full bg-cyan-500/20">
                            Auto-Dispensed
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-neutral-950/80 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
                          <div>
                            <span className="text-[10px] text-neutral-400 block font-sans">Hardware Bound Retail Key:</span>
                            <span className="font-extrabold text-white select-all">
                              {order.softwareLicense?.licenseKey || order.dispensedKey}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-400 font-sans">
                            {order.softwareLicense?.edition || "Retail Online Activation"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* TYPE 5: TURNKEY WEBSITE & ADSENSE HANDOFF */}
                    {isWebsite && (
                      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-2">
                        <div className="flex items-center justify-between font-bold text-amber-300 pb-2 border-b border-amber-500/20">
                          <span className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-amber-400" />
                            Turnkey Website & AdSense Account Transfer
                          </span>
                          {order.status === "PROCESSING" && (
                            <button
                              onClick={() => {
                                setHandoffTargetOrder(order);
                                setAssetForm({
                                  eppCode: order.deliveredAsset?.domainEppCode || "EPP-TECH-8492019-NAMECHEAP",
                                  gmailLogin: order.deliveredAsset?.gmailLogin || "techpulse.blog.owner@gmail.com",
                                  gmailPassword: order.deliveredAsset?.gmailPassword || "AdSense$Transfer2026!secure",
                                  notes: order.deliveredAsset?.notes || "",
                                });
                              }}
                              className="px-3.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-[11px] transition-colors shadow-xs cursor-pointer"
                            >
                              Dispatch Credentials to Buyer
                            </button>
                          )}
                        </div>

                        {order.deliveredAsset?.isDelivered ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-neutral-300">
                            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                              <span className="text-neutral-400 text-[10px] block font-sans">Domain EPP Code:</span>
                              <span className="font-bold text-white select-all">{order.deliveredAsset.domainEppCode}</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                              <span className="text-neutral-400 text-[10px] block font-sans">Google Login:</span>
                              <span className="font-bold text-white select-all">{order.deliveredAsset.gmailLogin}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-amber-300 text-xs">
                            Awaiting transfer input: Click &quot;Dispatch Credentials to Buyer&quot; to input the domain auth code and Google logins.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredOrders.length === 0 && (
                <div className="p-16 text-center bg-neutral-900/40 rounded-3xl border border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-3 text-neutral-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Orders in Fulfillment Queue</h4>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
                    Your storefront catalog is cleaned and ready. Incoming customer orders and automated credentials will appear here live.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS & SEO MANAGER */}
        {activeTab === "products" && <AdminProductManager />}

        {/* TAB 2B: CATEGORIES & TAXONOMY MANAGER */}
        {activeTab === "categories" && <AdminCategoryManager />}

        {/* TAB 3: LICENSE KEY INVENTORY POOLS */}
        {activeTab === "license-pool" && (
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-xs space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
              <div>
                <h3 className="font-bold text-base text-neutral-950">Automated License Key Pools</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Serial keys uploaded here are dispensed in real-time to buyers upon verified payment.
                </p>
              </div>
              <button
                onClick={() => setShowKeyModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Batch Upload Keys
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-neutral-900">IDM Lifetime Retail Keys</span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                    47 Ready in Pool
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  Format: 20-digit serial codes (e.g. IDM-XXXX-XXXX-XXXX-XXXX).
                </p>
                <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs font-mono text-neutral-600 space-y-1">
                  <div>IDM-9481-8201-9482-NXUS (Next in queue)</div>
                  <div>IDM-8492-1049-3829-NXUS (Reserved)</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-neutral-900">Steam $50 USD Digital Codes</span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                    82 Ready in Pool
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  Format: 15-character Steam wallet redemption pin.
                </p>
                <div className="p-3 bg-white rounded-xl border border-neutral-200 text-xs font-mono text-neutral-600 space-y-1">
                  <div>STM-8492-QZ84-4820-USD (Next in queue)</div>
                  <div>STM-1940-QZ84-8841-USD (Reserved)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COUPONS & FLASH SALE GENERATOR */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            {/* Flash Sale Global Controller Box */}
            <div className="bg-[#0f1118] p-6 rounded-3xl border border-white/[0.08] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl">
                    <Flame className="w-5 h-5 fill-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">Global Flash Sale Banner</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        flashSaleActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-neutral-800 text-neutral-400"
                      }`}>
                        {flashSaleActive ? "LIVE ON STOREFRONT" : "PAUSED"}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Prominently displays a ticking countdown timer and coupon across the entire site header.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleFlashSale(!flashSaleActive)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                      flashSaleActive
                        ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    {flashSaleActive ? "Pause Flash Sale" : "Activate Flash Sale"}
                  </button>
                </div>
              </div>

              {/* Flash Sale Banner Configuration */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] text-neutral-400 font-sans block">Flash Sale Code</span>
                  <span className="font-bold text-amber-400 text-sm select-all">{flashSaleCode}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] text-neutral-400 font-sans block">Discount Value</span>
                  <span className="font-bold text-white text-sm">25% OFF Everything</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] text-neutral-400 font-sans block">Status & Expiry</span>
                  <span className="font-bold text-emerald-400 text-sm">Countdown Active (4h 18m)</span>
                </div>
              </div>
            </div>

            {/* Coupons List Header & Generator CTA */}
            <div className="bg-[#0f1118] rounded-3xl border border-white/[0.08] overflow-hidden shadow-xs">
              <div className="p-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-white">Active Custom Coupons</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Coupons immediately redeemable at customer checkout with live validation.
                  </p>
                </div>

                <button
                  onClick={() => setShowCouponModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Generate New Coupon
                </button>
              </div>

              {/* Coupons Table */}
              <div className="divide-y divide-white/[0.06]">
                {coupons.map((c) => (
                  <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-sm text-white bg-white/[0.06] px-2.5 py-0.5 rounded-lg border border-white/10 select-all">
                            {c.code}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-neutral-800 text-neutral-400"
                          }`}>
                            {c.isActive ? "ACTIVE" : "PAUSED"}
                          </span>
                          {c.requiresCrypto && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                              CRYPTO EXCLUSIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-300 mt-1">{c.description}</p>
                        <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-1">
                          <span>Discount: <strong className="text-white">{c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : `$${c.discountValue}`}</strong></span>
                          {c.minOrder ? <span>Min Order: <strong className="text-white">${c.minOrder}</strong></span> : null}
                          <span>Redemptions: <strong className="text-white">{c.usageCount} {c.maxUses ? `/ ${c.maxUses}` : "used"}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCouponActive(c.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                          c.isActive
                            ? "border-neutral-700 hover:border-neutral-600 text-neutral-300 bg-white/[0.02]"
                            : "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                        }`}
                      >
                        {c.isActive ? "Pause" : "Resume"}
                      </button>

                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUPPORT TICKET SYSTEM (Phase 6) */}
        {activeTab === "tickets" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Ticket List Column */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs divide-y divide-neutral-100">
              <div className="p-5 border-b border-neutral-200 flex justify-between items-center">
                <h3 className="font-bold text-sm text-neutral-900">Customer Inquiries</h3>
                <span className="text-xs text-neutral-500">{tickets.length} total</span>
              </div>

              {tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`w-full text-left p-5 transition-colors block ${
                    selectedTicket?.id === t.id ? "bg-neutral-100/80 border-l-4 border-neutral-900" : "hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-neutral-900">{t.ticketNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.priority === "HIGH" || t.priority === "URGENT"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  <h4 className="font-bold text-neutral-950 text-xs mt-1 line-clamp-1">{t.subject}</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    From: {t.customerName} • {t.createdAt}
                  </p>
                </button>
              ))}
            </div>

            {/* Threaded Message Column */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200 shadow-xs flex flex-col justify-between overflow-hidden">
              {selectedTicket ? (
                <>
                  {/* Ticket Header */}
                  <div className="p-6 border-b border-neutral-200 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-neutral-600">
                          {selectedTicket.ticketNumber}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {selectedTicket.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-neutral-900 mt-1">
                        {selectedTicket.subject}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Customer: {selectedTicket.customerName} ({selectedTicket.customerEmail})
                        {selectedTicket.orderNumber && ` • Order: ${selectedTicket.orderNumber}`}
                      </p>
                    </div>
                  </div>

                  {/* Message Thread */}
                  <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                    {selectedTicket.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-4 rounded-2xl max-w-[85%] text-xs space-y-1 ${
                          m.sender === "ADMIN"
                            ? "bg-neutral-950 text-white ml-auto"
                            : "bg-neutral-100 text-neutral-900 mr-auto"
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] opacity-75">
                          <span className="font-semibold">{m.senderName}</span>
                          <span>{m.time}</span>
                        </div>
                        <p className="leading-relaxed">{m.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendTicketReply} className="p-4 bg-neutral-50 border-t border-neutral-200 flex gap-2">
                    <input
                      type="text"
                      placeholder="Write response to customer..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" /> Reply
                    </button>
                  </form>
                </>
              ) : (
                <div className="p-12 text-center text-neutral-500 text-xs">
                  Select a ticket from the left to view the conversation.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: LIVE VISITOR CHATS CONSOLE */}
        {activeTab === "live-chat" && (() => {
          const matchedOrders = selectedChat
            ? orders.filter(
                (o) => o.customerEmail.toLowerCase() === selectedChat.visitorEmail.toLowerCase()
              )
            : [];

          const filteredLiveChats = liveChats.filter((chat) => {
            if (chatFilter === "WAITING") return chat.status === "WAITING_REPLY";
            if (chatFilter === "WITH_ORDERS") {
              return orders.some(
                (o) => o.customerEmail.toLowerCase() === chat.visitorEmail.toLowerCase()
              );
            }
            return true;
          });

          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Active Sessions List */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs divide-y divide-neutral-100">
                <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="font-bold text-sm text-neutral-900">Live Visitor Sessions</h3>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {liveChats.length} total
                    </span>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex gap-1.5 text-[11px]">
                    <button
                      onClick={() => setChatFilter("ALL")}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        chatFilter === "ALL"
                          ? "bg-neutral-900 text-white"
                          : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
                      }`}
                    >
                      All ({liveChats.length})
                    </button>
                    <button
                      onClick={() => setChatFilter("WITH_ORDERS")}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                        chatFilter === "WITH_ORDERS"
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      Buyers ({liveChats.filter((c) => orders.some((o) => o.customerEmail.toLowerCase() === c.visitorEmail.toLowerCase())).length})
                    </button>
                    <button
                      onClick={() => setChatFilter("WAITING")}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        chatFilter === "WAITING"
                          ? "bg-amber-600 text-white"
                          : "bg-white text-amber-700 border border-amber-200 hover:bg-amber-50"
                      }`}
                    >
                      Waiting ({liveChats.filter((c) => c.status === "WAITING_REPLY").length})
                    </button>
                  </div>
                </div>

                <div className="max-h-[680px] overflow-y-auto divide-y divide-neutral-100">
                  {filteredLiveChats.map((chat) => {
                    const hasOrders = orders.some(
                      (o) => o.customerEmail.toLowerCase() === chat.visitorEmail.toLowerCase()
                    );
                    const isSelected = selectedChat?.id === chat.id;

                    return (
                      <button
                        key={chat.id}
                        onClick={() => {
                          setSelectedChat(chat);
                          setLiveChats((prev) =>
                            prev.map((c) => (c.id === chat.id ? { ...c, unread: false } : c))
                          );
                        }}
                        className={`w-full text-left p-4 transition-colors block relative ${
                          isSelected
                            ? "bg-blue-50/50 border-l-4 border-blue-600"
                            : "hover:bg-neutral-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-neutral-900">{chat.visitorName}</span>
                            {chat.unread && (
                              <span className="w-2 h-2 rounded-full bg-blue-600" />
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              chat.status === "WAITING_REPLY"
                                ? "bg-amber-100 text-amber-800"
                                : chat.status === "ONLINE"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-neutral-100 text-neutral-700"
                            }`}
                          >
                            {chat.status === "WAITING_REPLY" ? "Waiting Reply" : "Online"}
                          </span>
                        </div>

                        {/* Customer Email & Verified Buyer Pill */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-neutral-500 font-mono truncate max-w-[170px]">
                            {chat.visitorEmail}
                          </span>
                          {hasOrders && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 shrink-0 flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" /> Buyer
                            </span>
                          )}
                        </div>

                        {/* Geolocation & Current URL */}
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-1.5">
                          <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span className="truncate">{chat.ipLocation}</span>
                        </div>

                        <p className="text-xs text-neutral-600 mt-2 line-clamp-1">
                          {chat.messages[chat.messages.length - 1]?.text}
                        </p>
                        <span className="text-[10px] text-neutral-400 mt-1 block">
                          {chat.messages[chat.messages.length - 1]?.time} • {chat.sessionDuration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Chat Stream & Customer Intelligence Hub */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs flex flex-col">
                {selectedChat ? (
                  <>
                    {/* Chat Session Header */}
                    <div className="p-5 border-b border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                            {selectedChat.visitorName[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm text-neutral-900">
                                {selectedChat.visitorName}
                              </h3>
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active Online
                              </span>
                            </div>
                            <span className="font-mono text-xs text-neutral-500">
                              {selectedChat.visitorEmail}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          onClick={() => {
                            const updated = { ...selectedChat, status: "RESOLVED" as const };
                            setSelectedChat(updated);
                            setLiveChats((prev) =>
                              prev.map((c) => (c.id === updated.id ? updated : c))
                            );
                          }}
                          className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>

                    {/* VISITOR INTELLIGENCE: LOCATION & DEVICE SPECS */}
                    <div className="p-4 bg-neutral-100/40 border-b border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                            Visitor Location & IP
                          </span>
                          <span className="font-semibold text-neutral-900">{selectedChat.ipLocation}</span>
                          <span className="text-[11px] text-neutral-500 font-mono block">
                            IP: {selectedChat.ipAddress}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Laptop className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                            Browser & Device
                          </span>
                          <span className="font-semibold text-neutral-900">{selectedChat.deviceInfo}</span>
                          <span className="text-[11px] text-neutral-500 block">
                            {selectedChat.sessionDuration}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Globe className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                            Browsing URL & Source
                          </span>
                          <span className="font-semibold text-blue-600 font-mono text-[11px] truncate block max-w-[200px]">
                            {selectedChat.currentPage}
                          </span>
                          <span className="text-[10px] text-neutral-500 block truncate max-w-[200px]">
                            Via: {selectedChat.referrer}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CUSTOMER ACTIVE ORDERS DRAWER */}
                    <div className="p-4 border-b border-neutral-200 bg-white">
                      {matchedOrders.length > 0 ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <h4 className="font-bold text-xs text-neutral-900">
                                Linked Customer Purchase History ({matchedOrders.length} Order{matchedOrders.length > 1 ? "s" : ""})
                              </h4>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              Total Spent: {formatPrice(matchedOrders.reduce((acc, curr) => acc + curr.total, 0))}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {matchedOrders.map((ord) => (
                              <div
                                key={ord.id}
                                className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-mono font-bold text-neutral-900">
                                    {ord.orderNumber}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      ord.status === "COMPLETED"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {ord.status}
                                  </span>
                                </div>

                                <p className="font-medium text-neutral-800 line-clamp-1">
                                  {ord.productTitle}
                                </p>

                                <div className="flex justify-between items-center text-[11px] text-neutral-500 pt-1 border-t border-neutral-200/60">
                                  <span>{formatPrice(ord.total)} • {ord.paymentRail}</span>
                                  <span className="font-semibold text-neutral-700">
                                    {ord.deliveryType === "SERVICE_SETUP"
                                      ? "WP Service"
                                      : ord.deliveryType === "INSTANT_CODE"
                                      ? "Instant Key"
                                      : "Manual Transfer"}
                                  </span>
                                </div>

                                {/* Order-specific status insights */}
                                {ord.deliveryType === "SERVICE_SETUP" && ord.serviceCredentials && (
                                  <div className="p-2 bg-blue-50/60 rounded-xl text-[11px] text-blue-900 space-y-0.5 border border-blue-100 font-mono">
                                    <div><strong>WP Admin:</strong> {ord.serviceCredentials.wpAdminUrl}</div>
                                    <div><strong>User:</strong> {ord.serviceCredentials.wpUsername}</div>
                                  </div>
                                )}

                                {ord.deliveryType === "INSTANT_CODE" && ord.dispensedKey && (
                                  <div className="p-2 bg-emerald-50/60 rounded-xl text-[11px] text-emerald-900 border border-emerald-100 font-mono truncate">
                                    <strong>Dispensed Key:</strong> {ord.dispensedKey}
                                  </div>
                                )}

                                {ord.deliveryType === "MANUAL_HANDOFF" && (
                                  <div className="p-2 bg-purple-50/60 rounded-xl text-[11px] text-purple-900 border border-purple-100">
                                    <strong>AdSense Handoff:</strong> EPP code & Gmail transfer in progress
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs text-amber-900">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-amber-600" />
                            <div>
                              <span className="font-bold">Prospective Buyer (0 Previous Orders)</span>
                              <p className="text-[11px] text-amber-700 mt-0.5">
                                User submitted email <span className="font-mono font-semibold">{selectedChat.visitorEmail}</span> and is exploring products.
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-100 text-amber-800 shrink-0">
                            Pre-Sales Lead
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="p-6 space-y-4 max-h-[360px] min-h-[260px] overflow-y-auto bg-neutral-50/30">
                      {selectedChat.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`p-4 rounded-2xl max-w-[85%] text-xs space-y-1 ${
                            m.sender === "agent"
                              ? "bg-neutral-950 text-white ml-auto rounded-tr-xs shadow-xs"
                              : "bg-white text-neutral-900 mr-auto rounded-tl-xs border border-neutral-200 shadow-xs"
                          }`}
                        >
                          <div className="flex justify-between items-center text-[10px] opacity-75 gap-4">
                            <span className="font-semibold">{m.senderName}</span>
                            <span>{m.time}</span>
                          </div>
                          <p className="leading-relaxed">{m.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Quick Contextual Canned Responses */}
                    <div className="px-5 py-2.5 bg-neutral-100/60 border-t border-neutral-200 flex flex-wrap gap-1.5 text-[11px]">
                      <span className="text-neutral-400 self-center mr-1">Quick replies:</span>
                      <button
                        type="button"
                        onClick={() =>
                          setLiveChatReply(
                            `Hello ${selectedChat.visitorName}! I can see your order ${
                              matchedOrders[0]?.orderNumber || ""
                            } is currently processing. Our technician is actively applying the license credentials.`
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-[11px] transition-colors"
                      >
                        Order Processing Update
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLiveChatReply(
                            "We only require temporary admin access and connect directly via our developer portal. You can delete the temporary account right after activation!"
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-[11px] transition-colors"
                      >
                        WP Credentials Guide
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLiveChatReply(
                            "Instant serial keys are auto-delivered immediately upon checkout confirmation and permanently available in your Customer Order Vault."
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-[11px] transition-colors"
                      >
                        Instant Keys Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLiveChatReply(
                            "The domain EPP authorization code and dedicated Gmail account will be securely transferred within 2 hours directly into your order vault."
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-[11px] transition-colors"
                      >
                        AdSense Transfer ETA
                      </button>
                    </div>

                    {/* Reply Input Form */}
                    <form
                      onSubmit={handleSendLiveReply}
                      className="p-4 bg-white border-t border-neutral-200 flex gap-2"
                    >
                      <input
                        type="text"
                        placeholder={`Reply directly to ${selectedChat.visitorName} (${selectedChat.visitorEmail})...`}
                        value={liveChatReply}
                        onChange={(e) => setLiveChatReply(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" /> Send Reply
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="p-16 text-center text-neutral-500 text-xs">
                    Select a live visitor session to begin chatting.
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* TAB 6: API KEYS & SYSTEM INTEGRATIONS */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header info card */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    API Keys & External Service Credentials
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
                  Configure authentication providers (Google Client ID & Secret), payment gateways (Stripe, PayPal, Crypto wallets), and transactional email SMTP credentials. Values are securely encrypted and can be updated anytime.
                </p>
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  API Keys Saved Successfully!
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateApiKeys(localApiKeys);
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 3500);
              }}
              className="space-y-6"
            >
              {/* SECTION 1: GOOGLE OAUTH & SSO CONFIG */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    G
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">
                      Google OAuth 2.0 & Sign-In Settings
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Enables one-tap Google SSO for customer logins and support ticket tracking.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1.5">
                      Google Client ID
                    </label>
                    <input
                      type="text"
                      value={localApiKeys.googleClientId}
                      onChange={(e) =>
                        setLocalApiKeys({ ...localApiKeys, googleClientId: e.target.value })
                      }
                      placeholder="e.g. 1234567890-abcdefgh.apps.googleusercontent.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 font-mono text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                    />
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      From Google Cloud Console &rarr; APIs & Services &rarr; Credentials
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1.5">
                      Google Client Secret
                    </label>
                    <input
                      type="password"
                      value={localApiKeys.googleClientSecret}
                      onChange={(e) =>
                        setLocalApiKeys({ ...localApiKeys, googleClientSecret: e.target.value })
                      }
                      placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 font-mono text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                    />
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      Keep this private. Never shared with the storefront client.
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PAYMENT GATEWAYS (STRIPE & CRYPTO) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">
                      Payment Gateway API Keys
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Stripe card processing and decentralized cryptocurrency wallet addresses.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1.5">
                      Stripe Publishable Key
                    </label>
                    <input
                      type="text"
                      value={localApiKeys.stripePublishableKey}
                      onChange={(e) =>
                        setLocalApiKeys({ ...localApiKeys, stripePublishableKey: e.target.value })
                      }
                      placeholder="pk_live_..."
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 font-mono text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1.5">
                      Stripe Restricted / Secret Key
                    </label>
                    <input
                      type="password"
                      value={localApiKeys.stripeSecretKey}
                      onChange={(e) =>
                        setLocalApiKeys({ ...localApiKeys, stripeSecretKey: e.target.value })
                      }
                      placeholder="sk_live_..."
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 font-mono text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1.5">
                      Bitcoin (BTC) Destination Address
                    </label>
                    <input
                      type="text"
                      value={localApiKeys.cryptoBtcAddress}
                      onChange={(e) =>
                        setLocalApiKeys({ ...localApiKeys, cryptoBtcAddress: e.target.value })
                      }
                      placeholder="bc1q..."
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 font-mono text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1.5">
                      USDT / Polygon Escrow Wallet
                    </label>
                    <input
                      type="text"
                      value={localApiKeys.cryptoUsdtAddress}
                      onChange={(e) =>
                        setLocalApiKeys({ ...localApiKeys, cryptoUsdtAddress: e.target.value })
                      }
                      placeholder="0x..."
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 font-mono text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: TRANSACTIONAL SMTP EMAIL (MAILGUN / RESEND) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">
                      Transactional Order Email (SMTP)
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Used for instant serial key delivery, WP installation notices, and ticket notifications.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1.5">
                      SMTP Host Server
                    </label>
                    <input
                      type="text"
                      value={localApiKeys.smtpHost}
                      onChange={(e) =>
                        setLocalApiKeys({ ...localApiKeys, smtpHost: e.target.value })
                      }
                      placeholder="smtp.mailgun.org"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 font-mono text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1.5">
                      SMTP Username / Email
                    </label>
                    <input
                      type="text"
                      value={localApiKeys.smtpUser}
                      onChange={(e) =>
                        setLocalApiKeys({ ...localApiKeys, smtpUser: e.target.value })
                      }
                      placeholder="postmaster@nexusdigital.io"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 font-mono text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1.5">
                      SMTP Password / App Key
                    </label>
                    <input
                      type="password"
                      value={localApiKeys.smtpPass}
                      onChange={(e) =>
                        setLocalApiKeys({ ...localApiKeys, smtpPass: e.target.value })
                      }
                      placeholder="••••••••••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 font-mono text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON BAR */}
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-200">
                <span className="text-xs text-neutral-500">
                  Changes take effect immediately across all storefront checkout sessions and Google logins.
                </span>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save API Configuration</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: MANUAL ASSET HANDOFF DISPATCH */}
        {handoffTargetOrder && (
          <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <h3 className="text-lg font-bold text-neutral-950 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  Dispatch Website & Account Handoff
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Order {handoffTargetOrder.orderNumber} • {handoffTargetOrder.customerName}
                </p>
              </div>

              <form onSubmit={handleDeliverAsset} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Domain Authorization / EPP Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EPP-8492019-NAMECHEAP"
                    value={assetForm.eppCode}
                    onChange={(e) => setAssetForm({ ...assetForm, eppCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Google / Gmail Account Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="owner.adsense@gmail.com"
                    value={assetForm.gmailLogin}
                    onChange={(e) => setAssetForm({ ...assetForm, gmailLogin: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Temporary Google Password
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="AdSense$Pass2026!"
                    value={assetForm.gmailPassword}
                    onChange={(e) => setAssetForm({ ...assetForm, gmailPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Transfer Instructions & Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Domain registrar push instructions or backup code locations..."
                    value={assetForm.notes}
                    onChange={(e) => setAssetForm({ ...assetForm, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                  />
                </div>

                <div className="flex gap-3 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setHandoffTargetOrder(null)}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-sm"
                  >
                    Deliver to Customer Portal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: AI TOOL ACCOUNT LOGINS DISPATCH */}
        {aiDispatchOrder && (
          <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h3 className="text-lg font-bold text-neutral-950 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Dispatch AI Tool Account Logins
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Order {aiDispatchOrder.orderNumber} • {aiDispatchOrder.customerName} ({aiDispatchOrder.productTitle})
                  </p>
                </div>
                <button
                  onClick={() => setAiDispatchOrder(null)}
                  className="text-neutral-400 hover:text-neutral-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleDeliverAiAccount} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Tool & Service Name
                  </label>
                  <input
                    type="text"
                    required
                    value={aiForm.toolName}
                    onChange={(e) => setAiForm({ ...aiForm, toolName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Account Login Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="chatgpt.pool@nexusaccount.com"
                      value={aiForm.accountEmail}
                      onChange={(e) => setAiForm({ ...aiForm, accountEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Account Password
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="NexusAI#PlusPass2026!"
                      value={aiForm.accountPassword}
                      onChange={(e) => setAiForm({ ...aiForm, accountPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Profile Slot / Assignment
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Slot #2 (Private Profile)"
                      value={aiForm.profileSlot}
                      onChange={(e) => setAiForm({ ...aiForm, profileSlot: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Profile Lock PIN (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4892"
                      value={aiForm.profilePin}
                      onChange={(e) => setAiForm({ ...aiForm, profilePin: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Subscription Plan Type
                    </label>
                    <select
                      value={aiForm.planType}
                      onChange={(e) =>
                        setAiForm({
                          ...aiForm,
                          planType: e.target.value as "Shared Slot" | "Private Dedicated Account",
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white"
                    >
                      <option value="Shared Slot">Shared Profile Slot</option>
                      <option value="Private Dedicated Account">Private Dedicated Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Valid Through / Duration
                    </label>
                    <input
                      type="text"
                      placeholder="30 Days Renewable"
                      value={aiForm.expiresAt}
                      onChange={(e) => setAiForm({ ...aiForm, expiresAt: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Customer Warranty / Usage Terms
                  </label>
                  <input
                    type="text"
                    value={aiForm.warrantyTerms}
                    onChange={(e) => setAiForm({ ...aiForm, warrantyTerms: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                  />
                </div>

                <div className="flex gap-3 pt-3 justify-end border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setAiDispatchOrder(null)}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Send Logins to Buyer Vault</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: WORDPRESS ACTIVATION CONFIRMATION */}
        {wpActivationOrder && (
          <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h3 className="text-lg font-bold text-neutral-950 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-blue-600" />
                    Confirm WordPress Setup
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Order {wpActivationOrder.orderNumber} • {wpActivationOrder.customerName}
                  </p>
                </div>
                <button
                  onClick={() => setWpActivationOrder(null)}
                  className="text-neutral-400 hover:text-neutral-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-1">
                  <span className="text-[10px] text-blue-700 uppercase font-bold block">Target Website:</span>
                  <span className="font-mono font-bold text-blue-950">{wpActivationOrder.serviceCredentials?.wpAdminUrl}</span>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Agency License Key Connected:
                  </label>
                  <input
                    type="text"
                    required
                    value={wpActivationKey}
                    onChange={(e) => setWpActivationKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono text-xs uppercase"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    This key will be stamped into the customer certificate and their setup marked complete.
                  </span>
                </div>

                <div className="flex gap-3 pt-3 justify-end border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setWpActivationOrder(null)}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => markServiceCompleted(wpActivationOrder.id, wpActivationKey)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Activation & Send Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: GAME DIGITAL GIFT CODE DISPATCH & REISSUE */}
        {giftCodeTargetOrder && (
          <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h3 className="text-lg font-bold text-neutral-950 flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-emerald-600" />
                    Dispatch Game Digital Gift Code
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Order {giftCodeTargetOrder.orderNumber} • {giftCodeTargetOrder.customerName}
                  </p>
                </div>
                <button
                  onClick={() => setGiftCodeTargetOrder(null)}
                  className="text-neutral-400 hover:text-neutral-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleDeliverGiftCode} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Platform</label>
                  <select
                    value={giftCodeForm.platform}
                    onChange={(e) => setGiftCodeForm({ ...giftCodeForm, platform: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white"
                  >
                    <option value="Steam">Steam Wallet</option>
                    <option value="PlayStation">PlayStation Network (PSN)</option>
                    <option value="Xbox">Xbox / Microsoft Store</option>
                    <option value="Nintendo">Nintendo eShop</option>
                    <option value="Razer Gold">Razer Gold</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Digital Voucher / Serial Code PIN:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STM-8492-QZ84-9382-USD"
                    value={giftCodeForm.code}
                    onChange={(e) => setGiftCodeForm({ ...giftCodeForm, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono text-xs uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Region</label>
                    <input
                      type="text"
                      value={giftCodeForm.region}
                      onChange={(e) => setGiftCodeForm({ ...giftCodeForm, region: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Face Value</label>
                    <input
                      type="text"
                      value={giftCodeForm.faceValue}
                      onChange={(e) => setGiftCodeForm({ ...giftCodeForm, faceValue: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Redemption Instructions</label>
                  <textarea
                    rows={2}
                    value={giftCodeForm.redemptionGuide}
                    onChange={(e) => setGiftCodeForm({ ...giftCodeForm, redemptionGuide: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300"
                  />
                </div>

                <div className="flex gap-3 pt-3 justify-end border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setGiftCodeTargetOrder(null)}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Dispatch Gift Code</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD PRODUCT */}
        {showProductModal && (
          <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-neutral-950">Add Digital Product</h3>

              <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elementor Pro Agency License"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Delivery Fulfillment Type</label>
                  <select
                    value={newProduct.deliveryType}
                    onChange={(e) => setNewProduct({ ...newProduct, deliveryType: e.target.value as DeliveryType })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white font-semibold"
                  >
                    <option value="SERVICE_SETUP">WordPress Service Setup (Requires WP credentials)</option>
                    <option value="INSTANT_CODE">Instant Auto-Delivery (Dispenses serial key)</option>
                    <option value="MANUAL_HANDOFF">Manual Asset Handoff (AdSense / Domain transfer)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Comprehensive description for buyers and Google SEO..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300"
                  />
                </div>

                <div className="flex gap-3 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="px-4 py-2 rounded-xl border border-neutral-300 font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold"
                  >
                    Save & Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: BATCH UPLOAD KEYS */}
        {showKeyModal && (
          <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-neutral-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-neutral-950 flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-600" />
                Batch Upload License Keys
              </h3>
              <p className="text-xs text-neutral-500">
                Paste raw license keys one per line. They will be added to the automated dispenser queue.
              </p>

              <form onSubmit={handleAddKeys} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Select Product Pool</label>
                  <select
                    value={keyBatchProduct}
                    onChange={(e) => setKeyBatchProduct(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 bg-white"
                  >
                    <option value="prod-idm-lifetime">Internet Download Manager (IDM)</option>
                    <option value="prod-steam-gift-50">Steam $50 USD Gift Code</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Keys (1 per line)</label>
                  <textarea
                    rows={6}
                    required
                    placeholder={"IDM-1928-8492-9182-NXUS\nIDM-9482-1049-3829-NXUS\nIDM-8492-0192-4820-NXUS"}
                    value={keyBatchText}
                    onChange={(e) => setKeyBatchText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 font-mono text-xs"
                  />
                </div>

                <div className="flex gap-3 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="px-4 py-2 rounded-xl border border-neutral-300 font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Upload to Pool
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CUSTOM COUPON GENERATOR */}
        {showCouponModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#10121a] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-400" />
                  Generate Custom Coupon
                </h3>
                <button
                  onClick={() => setShowCouponModal(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCouponSubmit} className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-neutral-300">Coupon Code</label>
                    <button
                      type="button"
                      onClick={handleGenerateRandomCode}
                      className="text-[10px] font-bold text-blue-400 hover:underline"
                    >
                      🎲 Generate Random
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIP25 or AUTUMN"
                    value={newCouponForm.code}
                    onChange={(e) =>
                      setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-[#0c0e15] font-mono text-white uppercase focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Type</label>
                    <select
                      value={newCouponForm.discountType}
                      onChange={(e) =>
                        setNewCouponForm({
                          ...newCouponForm,
                          discountType: e.target.value as "PERCENTAGE" | "FIXED",
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0c0e15] text-white focus:border-blue-500 outline-none"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">
                      Value {newCouponForm.discountType === "PERCENTAGE" ? "(%)" : "($)"}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={newCouponForm.discountType === "PERCENTAGE" ? 100 : 1000}
                      required
                      value={newCouponForm.discountValue}
                      onChange={(e) =>
                        setNewCouponForm({
                          ...newCouponForm,
                          discountValue: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-[#0c0e15] font-mono text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Min Order ($)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={newCouponForm.minOrder || ""}
                      onChange={(e) =>
                        setNewCouponForm({
                          ...newCouponForm,
                          minOrder: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-[#0c0e15] font-mono text-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Max Uses</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="100"
                      value={newCouponForm.maxUses || ""}
                      onChange={(e) =>
                        setNewCouponForm({
                          ...newCouponForm,
                          maxUses: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-[#0c0e15] font-mono text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. 20% discount on all digital licenses"
                    value={newCouponForm.description}
                    onChange={(e) =>
                      setNewCouponForm({ ...newCouponForm, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-[#0c0e15] text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={newCouponForm.requiresCrypto}
                    onChange={(e) =>
                      setNewCouponForm({
                        ...newCouponForm,
                        requiresCrypto: e.target.checked,
                      })
                    }
                    className="rounded border-white/20 bg-neutral-900 text-blue-600 focus:ring-0"
                  />
                  <span>Restrict to Crypto checkout only</span>
                </label>

                <div className="flex gap-3 pt-3 justify-end border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setShowCouponModal(false)}
                    className="px-4 py-2 rounded-xl border border-white/10 text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:brightness-110 shadow-lg shadow-indigo-600/20"
                  >
                    Publish Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
