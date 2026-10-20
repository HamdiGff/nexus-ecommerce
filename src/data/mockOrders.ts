import { DeliveryType } from "./mockProducts";

export type OrderCategory =
  | "wordpress-plugin"
  | "wordpress-theme"
  | "game-codes"
  | "software-license"
  | "ai-tools"
  | "adsense-websites";

export interface OrderItemDetail {
  id: string;
  title: string;
  tierOrVariant: string;
  categoryName: string;
  price: number;
  quantity: number;
  billingPeriod?: string;
}

export interface ServiceCredentials {
  wpAdminUrl: string;
  wpUsername: string;
  wpPassword: string;
  notes?: string;
  targetItem?: string;
  technicianStep?: 1 | 2 | 3 | 4;
  activatedLicenseKey?: string;
}

export interface AccountCredentials {
  toolName: string;
  accountEmail: string;
  accountPassword?: string;
  profileSlot?: string;
  profilePin?: string;
  expiresAt?: string;
  planType: "Shared Slot" | "Private Dedicated Account";
  warrantyTerms?: string;
  isDelivered: boolean;
}

export interface GameGiftCode {
  platform: "Steam" | "PlayStation" | "Xbox" | "Nintendo" | "Razer Gold";
  code: string;
  region: string;
  faceValue: string;
  redemptionGuide: string;
  isDelivered: boolean;
}

export interface SoftwareLicense {
  softwareName: string;
  licenseKey: string;
  edition: string;
  officialDownloadUrl: string;
  activationInstructions: string[];
  isDelivered: boolean;
}

export interface TurnkeyWebsiteAsset {
  websiteName: string;
  domainName: string;
  domainEppCode?: string;
  gmailLogin?: string;
  gmailPassword?: string;
  adsensePublisherId?: string;
  monthlyRevenue?: string;
  notes?: string;
  isDelivered: boolean;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productTitle: string;
  category: OrderCategory;
  deliveryType: DeliveryType;
  status: "PENDING" | "PROCESSING" | "COMPLETED";
  total: number;
  paymentRail: string;
  transactionId: string;
  createdAt: string;
  itemDetails: OrderItemDetail;

  // Specific asset delivery payloads:
  serviceCredentials?: ServiceCredentials;
  accountCredentials?: AccountCredentials;
  gameGiftCode?: GameGiftCode;
  softwareLicense?: SoftwareLicense;
  deliveredAsset?: TurnkeyWebsiteAsset;
  adsenseFulfillment?: any;
  adsenseDetails?: any;
  submissions?: any;

  // Dispensed code shortcut for instant delivery
  dispensedKey?: string;

  // Purge protection
  isPurged?: boolean;
  purgedAt?: string;
  purgeHours?: number;
}

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "NEX-884920",
    orderNumber: "NEX-884920",
    customerName: "Alex Mercer",
    customerEmail: "alex.mercer@gmail.com",
    productTitle: "Google AdSense Approved Turnkey Website (PIN-Verified)",
    category: "adsense-websites",
    deliveryType: "MANUAL_HANDOFF",
    status: "PROCESSING",
    total: 349.0,
    paymentRail: "Credit Card (Stripe)",
    transactionId: "tx_adsense_884920",
    createdAt: "Just now",
    itemDetails: {
      id: "prod-adsense-turnkey",
      title: "Google AdSense Approved Turnkey Website",
      tierOrVariant: "PIN-Verified + Active Balance",
      categoryName: "AdSense Websites",
      price: 349.0,
      quantity: 1,
    },
    adsenseDetails: {
      registrar: "Namecheap",
      registrarUsername: "alexmercer_nc",
      backupEmail: "alex.recovery@gmail.com",
      contactPhone: "+1 (555) 234-8921",
      notes: "Looking for a clean tech blog with high CPC US/UK traffic history.",
    },
    submissions: {
      adsense: {
        registrar: "Namecheap",
        registrarUsername: "alexmercer_nc",
        backupEmail: "alex.recovery@gmail.com",
        contactPhone: "+1 (555) 234-8921",
        notes: "Looking for a clean tech blog with high CPC US/UK traffic history.",
      },
    },
    adsenseFulfillment: {
      stage: 1,
      candidateDomains: [
        { domain: "techpulse-cloud.com", niche: "Tech & SaaS Reviews (High CPC)", isSelected: true },
        { domain: "nextgen-cyber.io", niche: "AI & Cybersecurity Portal", isSelected: false },
        { domain: "cloudgrowth-hub.com", niche: "Cloud Infrastructure Blog", isSelected: false },
      ],
      selectedDomain: "techpulse-cloud.com",
      domainRegistrar: "Namecheap",
      registrarAccount: "alexmercer_nc",
      domainPushStatus: "PUSH_INITIATED",
      domainPushNotes:
        "Free internal domain push initiated to Namecheap account (alexmercer_nc). Please accept from your Namecheap dashboard > Domain List > Incoming Transfers.",
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
        recoveryPhone: "+1 (555) 234-8921",
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
        validUntil: "Nov 3, 2026",
        certificateId: "ESCROW-CERT-NEX-884920",
      },
      chatMessages: [
        {
          id: "msg-alex-1",
          sender: "admin",
          senderName: "AdSense Asset Specialist (Nexus Ops)",
          text: "Hello Alex! Welcome to your dedicated AdSense handover desk. We have received your target Namecheap username (alexmercer_nc). Please inspect the candidate domains below and let us know if you'd like us to push techpulse-cloud.com right away.",
          time: "10:30 AM",
        },
        {
          id: "msg-alex-2",
          sender: "customer",
          senderName: "Alex Mercer",
          text: "Hi! techpulse-cloud.com looks perfect for my tech niche. I've selected it in the portal. Please proceed with the Namecheap push!",
          time: "10:35 AM",
        },
        {
          id: "msg-alex-3",
          sender: "admin",
          senderName: "AdSense Asset Specialist (Nexus Ops)",
          text: "Great choice! The internal domain push has been initiated to alexmercer_nc. You will see it under your Namecheap dashboard > Incoming Transfers. We are preparing the Master Gmail credentials now.",
          time: "10:38 AM",
        },
      ],
    },
    isPurged: false,
    purgeHours: 24,
  },
];

/**
 * Helper to fetch an order from localStorage (recent checkout) or seed dataset
 */
export function findOrderRecord(orderIdOrNumber: string): OrderRecord | null {
  if (!orderIdOrNumber) return null;
  const target = orderIdOrNumber.trim().toUpperCase();

  // 1. Try local storage if in browser
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("nexus-recent-orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        const match = parsed.find(
          (o: any) =>
            o.orderId?.toUpperCase() === target ||
            o.orderNumber?.toUpperCase() === target ||
            o.id?.toUpperCase() === target
        );
        if (match) {
          // Map localStorage order format to OrderRecord if needed
          return {
            id: match.orderId || match.id,
            orderNumber: match.orderId || match.orderNumber,
            customerName: match.customer?.name || "Customer",
            customerEmail: match.customer?.email || "customer@example.com",
            productTitle:
              match.items?.[0]?.title ||
              "WP Rocket - WordPress Caching & Core Web Vitals Accelerator",
            category: match.items?.[0]?.category || "wordpress-plugin",
            deliveryType: match.items?.[0]?.deliveryType || "SERVICE_SETUP",
            status: match.status || "PROCESSING",
            total: match.total || 15.0,
            paymentRail: match.paymentMethod || "Credit Card (Stripe)",
            transactionId: match.transactionId || `tx_${Math.random().toString(36).substring(2, 10)}`,
            createdAt: match.timestamp || "October 19, 2026",
            itemDetails: {
              id: match.items?.[0]?.id || "item-1",
              title: match.items?.[0]?.title || "WP Rocket Speed Accelerator",
              tierOrVariant: match.items?.[0]?.variantTitle || "1 Website — 1 Year Activation",
              categoryName: match.items?.[0]?.category || "WordPress Plugins",
              price: match.items?.[0]?.price || 15.0,
              quantity: match.items?.[0]?.quantity || 1,
            },
            serviceCredentials: match.submissions?.[match.items?.[0]?.id]
              ? {
                  wpAdminUrl: match.submissions[match.items[0].id].wpAdminUrl,
                  wpUsername: match.submissions[match.items[0].id].wpUsername,
                  wpPassword: match.submissions[match.items[0].id].wpPassword,
                  notes: match.submissions[match.items[0].id].notes,
                  technicianStep: 2,
                }
              : undefined,
            adsenseFulfillment: match.adsenseFulfillment,
            adsenseDetails: match.submissions?.adsense || match.adsenseDetails,
            submissions: match.submissions,
            dispensedKey: match.generatedLicenseKeys?.[match.items?.[0]?.id],
            isPurged: false,
            purgeHours: 24,
          };
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

  // 2. Fallback to pre-seeded orders
  const found = INITIAL_ORDERS.find(
    (o) =>
      o.orderNumber.toUpperCase() === target ||
      o.id.toUpperCase() === target ||
      (target === "ALEX" && o.customerName.toLowerCase().includes("alex"))
  );

  return found || null;
}

export interface TicketMessage {
  id: string;
  sender: "CUSTOMER" | "ADMIN";
  senderName: string;
  message: string;
  time: string;
}

export interface SupportTicketRecord {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  orderNumber?: string;
  subject: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string | null;
  messages: TicketMessage[];
}
