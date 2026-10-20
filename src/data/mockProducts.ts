export type DeliveryType = "SERVICE_SETUP" | "INSTANT_CODE" | "MANUAL_HANDOFF";

export interface ProductRequirementDef {
  fieldKey: string;
  label: string;
  fieldType: "TEXT" | "PASSWORD" | "URL" | "TEXTAREA";
  placeholder: string;
  helpText?: string;
  isRequired: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  price: number;
  stockQuantity: number;
  tierName?: string;
  badge?: string;
  licenseCount?: number;
  originalPrice?: number;
  perks?: string[];
}

export interface DigitalProduct {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory?: string; // Subcategory ID (e.g. "plugins", "themes", "shared-accounts", "private-accounts")
  accountType?: "SHARED" | "PRIVATE"; // Specific to AI Tools accounts
  deliveryType: DeliveryType;
  isInstantDelivery: boolean;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  variants: ProductVariant[];
  features: string[];
  requirements?: ProductRequirementDef[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  instantStockCount?: number; // For INSTANT_CODE items
  seoKeywords: string[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  badge?: string;
  iconName: "Wrench" | "Gamepad2" | "Key" | "Sparkles" | "Globe" | "Boxes";
  subcategories: SubCategory[];
}

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "wordpress",
    name: "WordPress Plugins & Themes",
    slug: "wordpress",
    description: "Official agency activations for premium WordPress plugins, page builders, and agency themes.",
    badge: "AGENCY ACTIVATIONS",
    iconName: "Wrench",
    subcategories: [
      {
        id: "plugins",
        name: "WordPress Plugins",
        slug: "plugins",
        description: "Official activations for SEO plugins, caching, drag-and-drop builders, and speed managers.",
      },
      {
        id: "themes",
        name: "WordPress Themes",
        slug: "themes",
        description: "Agency themes and starter kits (Astra Pro, GeneratePress, Divi, Kadence).",
      },
    ],
  },
  {
    id: "game-digital-codes",
    name: "Game Digital Codes",
    slug: "game-digital-codes",
    description: "Instant digital codes and wallet cards for Steam, PlayStation, Xbox, and Nintendo.",
    badge: "INSTANT AUTO-DELIVERY",
    iconName: "Gamepad2",
    subcategories: [
      {
        id: "wallet-cards",
        name: "Wallet & Gift Cards",
        slug: "wallet-cards",
        description: "Steam $50/$100 USD, PlayStation Store, Apple & Xbox gift cards.",
      },
      {
        id: "game-keys",
        name: "Game CD Keys & Passes",
        slug: "game-keys",
        description: "PC & console digital game keys and Xbox Game Pass memberships.",
      },
    ],
  },
  {
    id: "software-licenses",
    name: "Software License Keys",
    slug: "software-licenses",
    description: "100% genuine retail and OEM serial keys for Windows, Microsoft Office, and utility software.",
    badge: "GENUINE RETAIL",
    iconName: "Key",
    subcategories: [
      {
        id: "operating-systems",
        name: "Operating Systems",
        slug: "operating-systems",
        description: "Windows 11 Pro, Windows 10 Pro lifetime retail and OEM serial product keys.",
      },
      {
        id: "productivity",
        name: "Productivity Suites",
        slug: "productivity",
        description: "Microsoft Office 2024 / 2021 Professional Plus lifetime keys.",
      },
      {
        id: "security-utilities",
        name: "Security & Utilities",
        slug: "security-utilities",
        description: "Internet Download Manager (IDM), Malwarebytes Premium, and utilities.",
      },
    ],
  },
  {
    id: "ai-tools",
    name: "AI Tools (Shared & Private Accounts)",
    slug: "ai-tools",
    description: "Premium access to top AI suites including ChatGPT Plus, Claude Pro, Midjourney, and Cursor.",
    badge: "SHARED & PRIVATE",
    iconName: "Sparkles",
    subcategories: [
      {
        id: "shared-accounts",
        name: "Shared Accounts",
        slug: "shared-accounts",
        description: "High-value shared credentials for ChatGPT Plus, Midjourney, and Claude Pro.",
      },
      {
        id: "private-accounts",
        name: "Private Dedicated Accounts",
        slug: "private-accounts",
        description: "Exclusive private accounts provisioned on your personal email address.",
      },
    ],
  },
  {
    id: "adsense-websites",
    name: "Google AdSense Approved Websites",
    slug: "adsense-websites",
    description: "Turnkey ready-to-earn websites with verified Google AdSense approvals and clean history.",
    badge: "TURNKEY ASSETS",
    iconName: "Globe",
    subcategories: [
      {
        id: "turnkey-blogs",
        name: "AdSense Approved Blogs",
        slug: "turnkey-blogs",
        description: "Established niche blogs in High-CPC Tech, Finance, and Health.",
      },
      {
        id: "starter-portals",
        name: "Monetized Starter Portals",
        slug: "starter-portals",
        description: "Aged .COM domains + active monetization ready for traffic scaling.",
      },
    ],
  },
];

// Helper array for tab navigation
export const CATEGORIES = [
  { id: "all", name: "All Digital Goods", slug: "all" },
  ...INITIAL_CATEGORIES.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
];

export const MOCK_DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "wp-rocket",
    title: "WP Rocket - WordPress Caching & Core Web Vitals Accelerator",
    slug: "wp-rocket",
    category: "wordpress",
    subcategory: "plugins",
    deliveryType: "SERVICE_SETUP",
    isInstantDelivery: false,
    shortDescription:
      "Accelerate your WordPress website with official WP Rocket agency activation. Instantly boost Google PageSpeed to 95+, pass Core Web Vitals, and unlock automated cloud CSS/JS optimization with 100% genuine dashboard updates.",
    description:
      "WP Rocket is widely recognized as the most powerful, user-friendly WordPress caching and performance optimization plugin in the world. Engineered specifically to conquer Google Core Web Vitals (LCP, INP, CLS), WP Rocket applies 80% of web performance best practices the moment it is activated—without requiring you to write complex .htaccess rules or touch a single line of code.\n\nFrom automated cloud-powered 'Remove Unused CSS' (RUCSS) to cutting-edge 'Delay JavaScript Execution', smart sitemap preloading, mobile-dedicated caching, and seamless WooCommerce integration, WP Rocket delivers lightning-fast load times that boost SEO rankings, slash bounce rates, and increase conversion rates. Our official agency license grants you 100% authentic activation with direct, automatic updates through your WordPress dashboard—completely clean, safe, and guaranteed.",
    price: 15.0,
    originalPrice: 59.0,
    rating: 4.9,
    reviewsCount: 150,
    images: [
      "/products/wp-rocket.svg",
      "/products/wp-rocket-cwv-benchmark.svg",
      "/products/wp-rocket-features-breakdown.svg",
    ],
    variants: [
      {
        id: "wpr-1site",
        sku: "WPR-1SITE-1Y",
        title: "1 Website — 1 Year Activation",
        tierName: "Single License",
        price: 15.0,
        originalPrice: 59.0,
        licenseCount: 1,
        stockQuantity: 150,
        badge: "STARTER DEAL",
        perks: [
          "1 WordPress Domain Activation",
          "1 Year of Direct Dashboard Updates",
          "Google Core Web Vitals Optimization",
          "Remove Unused CSS (Cloud RUCSS)",
          "Delay JavaScript Execution",
          "Priority Support Desk Access",
        ],
      },
      {
        id: "wpr-3sites",
        sku: "WPR-3SITES-1Y",
        title: "3 Websites Pack — 1 Year Activation",
        tierName: "Plus Pack (Save 73%)",
        price: 32.0,
        originalPrice: 118.0,
        licenseCount: 3,
        stockQuantity: 100,
        badge: "MOST POPULAR — SAVE 73%",
        perks: [
          "3 WordPress Domains Activation ($10.66/site)",
          "1 Year of Direct Dashboard Updates",
          "All Premium Features & Cloud Optimization",
          "WooCommerce & eCommerce Speed Boost",
          "Separate Mobile Caching for All Sites",
          "Dedicated Setup Assistance",
        ],
      },
      {
        id: "wpr-5sites",
        sku: "WPR-5SITES-1Y",
        title: "5 Websites Agency Pack — 1 Year Activation",
        tierName: "Agency Value Pack",
        price: 49.0,
        originalPrice: 199.0,
        licenseCount: 5,
        stockQuantity: 75,
        badge: "BEST VALUE FOR AGENCIES",
        perks: [
          "5 WordPress Domains Activation ($9.80/site)",
          "1 Year of Direct Dashboard Updates",
          "Full Agency License Authentication",
          "Multi-Site & Staging Environments Allowed",
          "Cloudflare & Custom CDN 1-Click Sync",
          "White-Glove Installation Guarantee",
        ],
      },
    ],
    features: [
      "100% Authentic Agency License with Automatic Dashboard Updates",
      "Instant 80% Google PageSpeed Boost Out-of-the-Box",
      "Remove Unused CSS (Cloud RUCSS) for Perfect LCP Scores",
      "Delay JavaScript Execution Eliminates Render-Blocking Scripts",
      "Automated Sitemap & Page Cache Preloading",
      "Native Image & Video LazyLoad with YouTube Preview Facades",
      "Automated Database Cleanup (Revisions, Auto-Drafts & Transients)",
      "Full Compatibility with Elementor, Divi, Bricks, Astra & WooCommerce",
      "Zero GPL Risk — Clean, Verified, Official Code",
    ],
    isFeatured: true,
    isNewArrival: true,
    instantStockCount: 150,
    seoKeywords: [
      "wp rocket discount",
      "wp rocket cheap license",
      "buy wp rocket 15",
      "wp rocket 3 websites",
      "wp rocket agency license",
      "wordpress caching plugin",
      "core web vitals accelerator",
      "pass google pagespeed 100",
      "remove unused css wordpress",
      "delay javascript execution wp rocket",
    ],
  },
  {
    id: "rank-math-pro",
    title: "Rank Math PRO - Just PRO",
    slug: "rank-math-pro",
    category: "wordpress",
    subcategory: "plugins",
    deliveryType: "SERVICE_SETUP",
    isInstantDelivery: false,
    shortDescription:
      "Skyrocket your WordPress search engine rankings with official Rank Math PRO (Just PRO plan) agency activation. Advanced Schema generator, Google Search Console sync, keyword rank tracking, and automated image SEO with 100% genuine one-click dashboard updates.",
    description:
      "Rank Math PRO is heralded as the Swiss Army Knife of WordPress SEO. Built from the ground up for modern search algorithms, Rank Math PRO delivers unmatched power, speed, and intelligence to help your content dominate Google search rankings.\n\nUnlike traditional bloated SEO plugins that slow down your database, Rank Math PRO is ultra-fast, lightweight, and modular. It features a sophisticated Schema Generator that automatically implements JSON-LD rich snippets (FAQ, How-To, Product, Recipe, Review, Video), a full Google Search Console integration right inside your WordPress admin dashboard, an automated rank tracker with position history, advanced local SEO, automated image SEO (auto ALT and Title tags), and deep WooCommerce optimization.\n\nOur official agency activation provides authentic, clean licensing connected directly through your WordPress dashboard. You receive direct one-click automatic updates from the official Rank Math repository—completely authentic, virus-free, and backed by our full warranty.",
    price: 14.0,
    originalPrice: 59.0,
    rating: 4.9,
    reviewsCount: 118,
    images: [
      "/products/rank-math-pro.svg",
    ],
    variants: [
      {
        id: "rmp-1site",
        sku: "RMP-1SITE-1Y",
        title: "1 Website — 1 Year Activation (Just PRO)",
        tierName: "Just PRO Single License",
        price: 14.0,
        originalPrice: 59.0,
        licenseCount: 1,
        stockQuantity: 120,
        badge: "STARTER DEAL",
        perks: [
          "1 WordPress Domain Official Activation",
          "1 Year of Direct Dashboard Updates",
          "Advanced Schema Generator (Rich Snippets)",
          "Google Analytics 4 & Search Console Sync",
          "Rank Tracker & Keyword Position Reports",
          "Automated Image SEO & 404 Monitor",
        ],
      },
      {
        id: "rmp-3sites",
        sku: "RMP-3SITES-1Y",
        title: "3 Websites Pack — 1 Year Activation (Just PRO)",
        tierName: "Just PRO Plus Pack (Save 75%)",
        price: 29.0,
        originalPrice: 118.0,
        licenseCount: 3,
        stockQuantity: 85,
        badge: "MOST POPULAR — SAVE 75%",
        perks: [
          "3 WordPress Domains Activation ($9.66/site)",
          "1 Year of Direct Dashboard Updates",
          "Full WooCommerce SEO & Product Schema",
          "Podcast & Video SEO Modules",
          "Local SEO Multi-Location Support",
          "Dedicated Priority Setup Assistance",
        ],
      },
      {
        id: "rmp-5sites",
        sku: "RMP-5SITES-1Y",
        title: "5 Websites Agency Pack — 1 Year Activation (Just PRO)",
        tierName: "Just PRO Agency Pack",
        price: 45.0,
        originalPrice: 199.0,
        licenseCount: 5,
        stockQuantity: 60,
        badge: "BEST VALUE FOR AGENCIES",
        perks: [
          "5 WordPress Domains Activation ($9.00/site)",
          "1 Year of Direct Dashboard Updates",
          "Full Agency License Authentication",
          "Staging & Sub-domain Activations Included",
          "Advanced Redirection Manager (301, 302, 410)",
          "White-Glove Installation Guarantee",
        ],
      },
    ],
    features: [
      "100% Official Agency License with Automatic WordPress Dashboard Updates",
      "Advanced Schema Generator with Multi-Type Rich Snippets (Article, Product, FAQ, Recipe)",
      "Built-in Google Search Console & Analytics 4 Dashboard Integration",
      "Comprehensive Rank Tracker with Keyword Position History & Reports",
      "Deep WooCommerce SEO Module with Automated Product Schema & Breadcrumbs",
      "Automated Image SEO Optimization (Auto ALT and Title Attributes)",
      "Advanced Redirection Manager (301, 302, 307, 410) & 404 Monitor",
      "Compatible with Elementor, Divi, Gutenberg, Bricks, and Beaver Builder",
      "Zero Nulled/GPL Code — 100% Clean Official Agency Deployment",
    ],
    isFeatured: true,
    isNewArrival: true,
    instantStockCount: 120,
    seoKeywords: [
      "rank math pro",
      "rank math pro just pro",
      "rank math pro discount",
      "buy rank math pro cheap",
      "rank math agency license",
      "wordpress seo plugin",
      "schema generator wordpress",
      "rank math pro 1 website",
      "rank math vs yoast seo",
      "rank math seo agency",
    ],
  },
];

export const MOCK_PRODUCTS = MOCK_DIGITAL_PRODUCTS;

export interface ProductBundle {
  id: string;
  title: string;
  badge: string;
  description: string;
  productIds: string[];
  discountPercent: number;
}

export const MOCK_PRODUCT_BUNDLES: ProductBundle[] = [
  {
    id: "bundle-wp-power-duo",
    title: "WordPress Power Duo: WP Rocket + Rank Math PRO",
    badge: "SAVE EXTRA 15% TOGETHER",
    description: "The definitive WordPress accelerator and SEO combo. Maximum Google Core Web Vitals speed + Top-tier Rich Snippets & Search Rankings.",
    productIds: ["wp-rocket", "rank-math-pro"],
    discountPercent: 15,
  },
];
