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

export const INITIAL_ORDERS: OrderRecord[] = [
  // 1. Alex Mercer — WP Rocket WordPress Plugin Setup
  {
    id: "ord-772910",
    orderNumber: "NEX-772910",
    customerName: "Alex Mercer",
    customerEmail: "alex.mercer@gmail.com",
    productTitle: "WP Rocket - Caching & Core Web Vitals Accelerator (1 Website — 1 Year Activation)",
    category: "wordpress-plugin",
    deliveryType: "SERVICE_SETUP",
    status: "PROCESSING",
    total: 15.0,
    paymentRail: "Credit Card (Stripe)",
    transactionId: "pi_3Ovy9214Lkx90Mercer",
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
      notes: "Please enable Delay JavaScript Execution and Cloudflare CDN add-on if possible.",
      targetItem: "WP Rocket v3.18.2",
      technicianStep: 3,
      activatedLicenseKey: "WPR-AGENCY-772910-MERCER",
    },
    purgeHours: 24,
    isPurged: false,
  },

  // 2. Marcus Vance — Astra Pro Agency Bundle (WordPress Theme Setup)
  {
    id: "ord-883102",
    orderNumber: "NEX-883102",
    customerName: "Marcus Vance",
    customerEmail: "marcus.vance@agencyflow.co",
    productTitle: "Astra Pro Agency Bundle — WordPress Theme Setup & Premium Starter Templates",
    category: "wordpress-theme",
    deliveryType: "SERVICE_SETUP",
    status: "PROCESSING",
    total: 49.0,
    paymentRail: "PayPal Express",
    transactionId: "PAYID-MN82019488VANCE",
    createdAt: "October 19, 2026, 05:40 AM",
    itemDetails: {
      id: "prod-astra-theme",
      title: "Astra Pro Theme & Agency Addons",
      tierOrVariant: "Lifetime Agency License (Direct Site Connect)",
      categoryName: "WordPress Themes",
      price: 49.0,
      quantity: 1,
      billingPeriod: "Lifetime",
    },
    serviceCredentials: {
      wpAdminUrl: "https://agencyflow.co/wp-admin",
      wpUsername: "setup_support_admin",
      wpPassword: "AstraFlow#Temp991!",
      notes: "Please import the 'Digital Agency' starter template if possible.",
      targetItem: "Astra Pro Theme v4.8 + Agency Addons",
      technicianStep: 2,
      activatedLicenseKey: "ASTRA-PRO-AGENCY-883102",
    },
    purgeHours: 24,
    isPurged: false,
  },

  // 3. Elena Rostova — ChatGPT Plus Shared Account (AI Tools)
  {
    id: "ord-554219",
    orderNumber: "NEX-554219",
    customerName: "Elena Rostova",
    customerEmail: "elena.rostova@designlab.io",
    productTitle: "ChatGPT Plus Shared Account (Private Profile Slot #2 — GPT-4o & Canvas Access)",
    category: "ai-tools",
    deliveryType: "MANUAL_HANDOFF",
    status: "COMPLETED",
    total: 9.99,
    paymentRail: "Crypto (USDT TRC-20)",
    transactionId: "0x8f2a419c8d7e63b0192847cda71",
    createdAt: "October 19, 2026, 04:22 AM",
    itemDetails: {
      id: "prod-chatgpt-shared",
      title: "ChatGPT Plus Shared Account",
      tierOrVariant: "Private Slot #2 (Exclusive Dedicated Chat Profile)",
      categoryName: "AI Tools & Accounts",
      price: 9.99,
      quantity: 1,
      billingPeriod: "30 Days Renewable",
    },
    accountCredentials: {
      toolName: "ChatGPT Plus (OpenAI)",
      accountEmail: "chatgpt.shared.pool29@nexusaccount.com",
      accountPassword: "NexusAI#PlusPass2026!",
      profileSlot: "Slot #2 (Elena - Do not touch other profiles)",
      profilePin: "4892",
      expiresAt: "November 19, 2026",
      planType: "Shared Slot",
      warrantyTerms: "30-Day Instant Replacement Guarantee. Do not change master password or email.",
      isDelivered: true,
    },
  },

  // 4. David Chen — Steam $50 USD Wallet Digital Gift Code
  {
    id: "ord-442198",
    orderNumber: "NEX-442198",
    customerName: "David Chen",
    customerEmail: "david.chen88@gmail.com",
    productTitle: "Steam $50 USD Wallet Digital Gift Code (Global / US Region)",
    category: "game-codes",
    deliveryType: "INSTANT_CODE",
    status: "COMPLETED",
    total: 49.5,
    paymentRail: "Credit Card (Stripe)",
    transactionId: "pi_3Ox9281ChenSteam50",
    createdAt: "October 19, 2026, 03:10 AM",
    dispensedKey: "STM-8492-QZ84-9382-USD",
    itemDetails: {
      id: "prod-steam-50",
      title: "Steam $50 USD Digital Wallet Card",
      tierOrVariant: "$50 USD Balance Voucher",
      categoryName: "Game Digital Codes",
      price: 49.5,
      quantity: 1,
    },
    gameGiftCode: {
      platform: "Steam",
      code: "STM-8492-QZ84-9382-USD",
      region: "Global / United States (USD)",
      faceValue: "$50.00 USD",
      redemptionGuide: "Open Steam Client > Games Menu > Redeem a Steam Wallet Code > Paste key and click Continue.",
      isDelivered: true,
    },
  },

  // 5. Sarah Jenkins — Windows 11 Pro Lifetime Retail License Key
  {
    id: "ord-331905",
    orderNumber: "NEX-331905",
    customerName: "Sarah Jenkins",
    customerEmail: "sarah.j@techsolutions.com",
    productTitle: "Windows 11 Pro Lifetime Retail License Key (1-PC Online Activation)",
    category: "software-license",
    deliveryType: "INSTANT_CODE",
    status: "COMPLETED",
    total: 19.99,
    paymentRail: "Credit Card (Stripe)",
    transactionId: "pi_3Owm281JenkinsWin11",
    createdAt: "October 19, 2026, 02:05 AM",
    dispensedKey: "W11P-9X77B-KD82A-MN491-LP829",
    itemDetails: {
      id: "prod-win11-pro",
      title: "Windows 11 Professional Retail License",
      tierOrVariant: "1 PC / Laptop — Lifetime Bind to Motherboard",
      categoryName: "Software License Keys",
      price: 19.99,
      quantity: 1,
    },
    softwareLicense: {
      softwareName: "Microsoft Windows 11 Professional",
      licenseKey: "W11P-9X77B-KD82A-MN491-LP829",
      edition: "Retail 64-bit / 32-bit Multilingual",
      officialDownloadUrl: "https://www.microsoft.com/software-download/windows11",
      activationInstructions: [
        "Go to Windows Start > Settings > System > Activation.",
        "Click 'Change product key' and paste: W11P-9X77B-KD82A-MN491-LP829",
        "Click Activate. Your Windows 11 Pro will be digitally linked to your hardware permanently.",
      ],
      isDelivered: true,
    },
  },

  // 6. TechPulse Owner — Google AdSense Approved Tech Blog + .COM Domain
  {
    id: "ord-948208",
    orderNumber: "NEX-948208",
    customerName: "TechPulse Owner",
    customerEmail: "techpulse.blog.owner@gmail.com",
    productTitle: "Google AdSense Approved Tech Blog + .COM Domain (Turnkey Ready)",
    category: "adsense-websites",
    deliveryType: "MANUAL_HANDOFF",
    status: "PROCESSING",
    total: 450.0,
    paymentRail: "Escrow / Bank Wire",
    transactionId: "ESC-948208-TECHPULSE",
    createdAt: "October 19, 2026, 01:15 AM",
    itemDetails: {
      id: "prod-adsense-blog",
      title: "TechPulse.com AdSense Asset",
      tierOrVariant: "Turnkey Website + Approved AdSense Account + Domain",
      categoryName: "Google AdSense Websites",
      price: 450.0,
      quantity: 1,
    },
    deliveredAsset: {
      websiteName: "TechPulse Insights (.com)",
      domainName: "techpulseinsights.com",
      domainEppCode: "EPP-TECH-8492019-NAMECHEAP",
      gmailLogin: "techpulse.blog.owner@gmail.com",
      gmailPassword: "AdSense$Transfer2026!secure",
      adsensePublisherId: "pub-8492019482019481",
      monthlyRevenue: "$85.00 - $120.00 / mo",
      notes: "Domain unlock initiated at Namecheap. AdSense ownership invite dispatched.",
      isDelivered: false,
    },
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
