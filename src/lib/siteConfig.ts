/**
 * Centralized Site Configuration & SEO Helpers
 * Ensures smooth transition from temporary domains / localhost to production.
 */

export function getSiteUrl(): string {
  // 1. Explicit production / environment URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  }
  // 2. Vercel deployment URL
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL.replace(/\/+$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }
  // 3. Client-side fallback
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  // 4. Default fallback
  return "https://nexusdigital.store";
}

export const SITE_CONFIG = {
  name: "NEXUS Digital Marketplace",
  shortName: "NEXUS",
  description:
    "The premier digital goods marketplace. Buy Rank Math Pro, WP Rocket, Elementor Pro, Astra Pro, IDM lifetime serial keys, Steam cards, and verified Google AdSense turnkey websites with instant delivery.",
  keywords: [
    "rank math pro license",
    "wp rocket cheap",
    "elementor pro license key",
    "astra pro theme agency",
    "idm lifetime serial key",
    "buy steam gift card crypto",
    "adsense approved website for sale",
    "pin verified adsense websites",
    "chatgpt plus shared account",
    "buy claude pro",
    "claude team subscription",
    "instant digital delivery",
    "cheap software licenses",
    "official agency licenses",
  ],
  supportEmail: "support@nexusdigital.store",
  social: {
    twitter: "@NexusDigitalHQ",
  },
};
