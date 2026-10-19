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

  // Dispensed code shortcut for instant delivery
  dispensedKey?: string;

  // Purge protection
  isPurged?: boolean;
  purgedAt?: string;
  purgeHours?: number;
}

export const INITIAL_ORDERS: OrderRecord[] = [];

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
  messages: TicketMessage[];
}
