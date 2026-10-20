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
      "/products/rank-math-schema-rich-snippets.svg",
      "/products/rank-math-analytics-rank-tracker.svg",
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
  {
    id: "elementor-pro",
    title: "Elementor Pro - Visual WordPress Page & Theme Builder",
    slug: "elementor-pro",
    category: "wordpress",
    subcategory: "plugins",
    deliveryType: "SERVICE_SETUP",
    isInstantDelivery: false,
    shortDescription:
      "Build high-converting WordPress websites visually with official Elementor Pro agency activation. Design custom headers, footers, WooCommerce shops, dynamic loop grids, multi-step forms, and popups with 100% genuine one-click dashboard updates.",
    description:
      "Elementor Pro is the undisputed global benchmark for visual web creation on WordPress, powering more than 16,000,000 websites across the globe. By seamlessly combining intuitive drag-and-drop design with enterprise-grade dynamic capabilities, Elementor Pro allows creators, freelance developers, and agencies to construct pixel-perfect, custom websites without touching a single line of backend code.\n\nWith Elementor Pro's revolutionary Theme Builder, you gain 100% visual control over every aspect of your site: create dynamic headers that adapt on scroll, custom sticky footers, single post layouts, taxonomy archives, and personalized 404 pages. The built-in WooCommerce Builder transforms standard online stores into bespoke e-commerce experiences with customized product templates, AJAX add-to-cart buttons, mini-carts, and high-converting checkouts.\n\nEliminate bloated third-party plugins with Elementor Pro's native suite: build lead-capturing multi-step forms with webhook integrations, design behavioral exit-intent popups, and leverage the Loop Builder to display custom post types with Advanced Custom Fields (ACF) or Pods data. Our official agency license grants you 100% authentic activation with direct, automatic updates through your WordPress dashboard—completely clean, safe, and backed by our full warranty.",
    price: 15.0,
    originalPrice: 59.0,
    rating: 4.9,
    reviewsCount: 164,
    images: [
      "/products/elementor-pro.svg",
      "/products/elementor-theme-builder-widgets.svg",
      "/products/elementor-loop-builder-forms.svg",
    ],
    variants: [
      {
        id: "el-1site",
        sku: "EL-1SITE-1Y",
        title: "1 Website — 1 Year Activation",
        tierName: "Starter Creator",
        price: 15.0,
        originalPrice: 59.0,
        licenseCount: 1,
        stockQuantity: 140,
        badge: "STARTER DEAL",
        perks: [
          "1 WordPress Domain Official Activation",
          "1 Year of Direct Dashboard Updates",
          "Complete Theme Builder (Header, Footer, 404)",
          "WooCommerce Shop & Checkout Builder",
          "Advanced Form Builder & Popup Engine",
          "Loop Builder & Dynamic Tags Support",
        ],
      },
      {
        id: "el-3sites",
        sku: "EL-3SITES-1Y",
        title: "3 Websites Pack — 1 Year Activation",
        tierName: "Plus Creator Pack (Save 73%)",
        price: 32.0,
        originalPrice: 118.0,
        licenseCount: 3,
        stockQuantity: 95,
        badge: "MOST POPULAR — SAVE 73%",
        perks: [
          "3 WordPress Domains Activation ($10.66/site)",
          "1 Year of Direct Dashboard Updates",
          "Full 100+ Pro Widgets & 300+ Template Kits",
          "Motion Effects, Custom CSS & Lottie",
          "ACF, MetaBox & Toolset Dynamic Querying",
          "Dedicated Priority Setup Assistance",
        ],
      },
      {
        id: "el-5sites",
        sku: "EL-5SITES-1Y",
        title: "5 Websites Agency Pack — 1 Year Activation",
        tierName: "Agency Value Pack",
        price: 49.0,
        originalPrice: 199.0,
        licenseCount: 5,
        stockQuantity: 70,
        badge: "BEST VALUE FOR AGENCIES",
        perks: [
          "5 WordPress Domains Activation ($9.80/site)",
          "1 Year of Direct Dashboard Updates",
          "Full Agency License Authentication",
          "Multi-Site & Staging Environments Allowed",
          "Sub-Domain & Client Development Rights",
          "White-Glove Installation Guarantee",
        ],
      },
    ],
    features: [
      "100% Authentic Official Agency License with Automatic WordPress Dashboard Updates",
      "Complete Theme Builder (Custom Header, Footer, Single Post, Archive & 404)",
      "WooCommerce Visual Builder (Custom Single Product, Cart, Checkout & Shop Pages)",
      "Advanced Form Builder with Multi-Step, File Upload, Webhooks & Zapier Sync",
      "Interactive Popup Builder with Exit-Intent Triggers & Scroll Milestones",
      "Loop Grid & Loop Carousel with Dynamic ACF / Custom Fields Query Binding",
      "100+ Professional Widgets (Posts, Slides, Pricing Tables, Animated Headlines)",
      "300+ Premium Designer Template Kits & Blocks Library",
      "Custom CSS Per Widget & Advanced Motion Effects with Lottie Animation",
      "Zero Nulled/GPL Code — 100% Clean Official Agency Deployment",
    ],
    isFeatured: true,
    isNewArrival: true,
    instantStockCount: 140,
    seoKeywords: [
      "elementor pro",
      "buy elementor pro cheap",
      "elementor pro discount",
      "elementor agency license",
      "wordpress theme builder",
      "elementor pro 1 website",
      "elementor woocommerce builder",
      "elementor pro license key",
      "elementor loop builder",
      "visual page builder wordpress",
    ],
  },
  {
    id: "astra-pro-theme",
    title: "Astra Pro Theme - Agency License & 280+ Premium Starter Templates",
    slug: "astra-pro-theme",
    category: "wordpress",
    subcategory: "themes",
    deliveryType: "SERVICE_SETUP",
    isInstantDelivery: false,
    shortDescription:
      "Turbocharge your WordPress speed and design flexibility with official Astra Pro agency activation. Features <50KB zero-jQuery core, 3-row visual header & footer builder, 280+ premium starter templates, custom layouts & action hooks, and deep WooCommerce customization with 100% genuine one-click dashboard updates.",
    description:
      "Astra Pro is the undisputed champion of lightweight WordPress themes, proudly powering over 1,600,000+ active websites worldwide. Engineered with obsessive attention to performance, Astra loads in less than 0.5 seconds, weighs under 50 KB on a default WordPress installation, and operates on pure vanilla JavaScript with zero jQuery dependencies—guaranteeing 100/100 Google Core Web Vitals scores out of the box.\n\nWith Astra Pro's powerful Visual Header & Footer Builder, you can drag and drop responsive rows, craft sticky navigation bars with logo shrink effects, create transparent overlay headers for immersive hero sections, and deploy mobile off-canvas drawers in minutes. The built-in Custom Layouts engine lets you inject custom banners, dynamic CTAs, and PHP action hooks anywhere on your website with pinpoint conditional display rules—completely eliminating the need for bulky child themes.\n\nFor digital store owners, Astra Pro transforms WooCommerce into a conversion powerhouse with off-canvas product filters, modern grid/list catalog layouts, quick-view modals, sticky add-to-cart bars, and distraction-free multi-step checkouts that drastically reduce cart abandonment. Plus, with full White Label capabilities and 280+ one-click importable Starter Templates for Elementor and Gutenberg, Astra Pro is the ultimate workhorse for freelance web creators and enterprise digital agencies.",
    price: 12.0,
    originalPrice: 59.0,
    rating: 4.95,
    reviewsCount: 218,
    images: [
      "/products/astra-pro-theme.svg",
      "/products/astra-customizer-starter-templates.svg",
      "/products/astra-performance-core-vitals.svg",
    ],
    variants: [
      {
        id: "astra-1site",
        sku: "ASTRA-1SITE-1Y",
        title: "1 Website - Agency Activation",
        tierName: "Starter Creator",
        price: 12.0,
        originalPrice: 59.0,
        licenseCount: 1,
        stockQuantity: 150,
        badge: "BEST VALUE",
        perks: [
          "1 WordPress Website Activation",
          "Official 1-Click Dashboard Updates",
          "280+ Premium Starter Templates Included",
          "Visual Header & Footer Builder Modules",
          "Deep WooCommerce Customizer Suite",
          "Direct Agency Fleet Activation (Clean & Nulled-Free)",
          "1 Year Nexus Priority Warranty & Support",
        ],
      },
      {
        id: "astra-3sites",
        sku: "ASTRA-3SITES-1Y",
        title: "3 Websites - Freelancer Pack",
        tierName: "Freelancer Pack",
        price: 25.0,
        originalPrice: 129.0,
        licenseCount: 3,
        stockQuantity: 85,
        badge: "MOST POPULAR",
        perks: [
          "3 WordPress Websites Activation",
          "Official 1-Click Dashboard Updates",
          "All 280+ Premium Starter Templates Kits",
          "Custom Layouts & Conditional Action Hooks",
          "Mega Menu & Local GDPR Google Fonts",
          "Distraction-Free WooCommerce Checkout",
          "White Label Agency Rebranding Support",
          "1 Year Full Warranty & Multi-Site Reallocation",
        ],
      },
      {
        id: "astra-10sites",
        sku: "ASTRA-10SITES-1Y",
        title: "10 Websites - Agency Scale",
        tierName: "Agency Fleet",
        price: 39.0,
        originalPrice: 249.0,
        licenseCount: 10,
        stockQuantity: 40,
        badge: "AGENCY CHOICE",
        perks: [
          "10 WordPress Websites Fleet Activation",
          "Official 1-Click Dashboard Auto-Updates",
          "Unlimited 280+ Starter Site Kits Imports",
          "Full White Label Agency Customization",
          "Custom Layouts, Hooks & 404 Builders",
          "Priority Emergency Support Dispatch (< 15 mins)",
          "1 Year Full Warranty with Fleet Dashboard Access",
        ],
      },
    ],
    features: [
      "Ultra-Lightweight <50 KB Frontend Footprint with Zero jQuery",
      "Visual Drag-and-Drop 3-Row Header & Footer Builder",
      "Sticky, Transparent, and Mobile Off-Canvas Header Navigations",
      "280+ Professionally Designed 1-Click Starter Website Kits",
      "Custom Layouts Engine with Conditional Action Hook Injections",
      "Deep WooCommerce Customizer (Off-Canvas Filters, Sticky Cart)",
      "Distraction-Free Checkout to Drastically Cut Cart Abandonment",
      "Self-Hosted Local Google Fonts for 100% GDPR Privacy Compliance",
      "Advanced Mega Menus with Multi-Column Layouts & Badges",
      "Full Agency White Label Capability (Rebrand Theme As Your Own)",
      "Clean Schema.org Structured Microdata for Rapid SEO Indexing",
      "100% Genuine Brainstorm Force Agency Fleet Activation",
    ],
    isFeatured: true,
    isNewArrival: true,
    instantStockCount: 150,
    seoKeywords: [
      "astra pro",
      "astra pro theme",
      "buy astra pro discount",
      "astra theme agency license",
      "astra starter templates",
      "lightweight wordpress theme",
      "astra pro woocommerce",
      "brainstorm force astra pro",
      "fastest wordpress theme",
      "astra pro license key",
    ],
  },
  {
    id: "google-adsense-approved-websites",
    title: "Google AdSense Approved Websites & Accounts (Country-Targeted, PIN & GAM Verified)",
    slug: "google-adsense-approved-websites",
    category: "adsense-websites",
    subcategory: "turnkey-blogs",
    deliveryType: "MANUAL_HANDOFF",
    isInstantDelivery: false,
    shortDescription:
      "Acquire official Google AdSense approved turnkey websites in high-CPC tech blogging niches. Choose from USA, UK, Canada, India, Turkey & Middle East accounts. Available in Freshly Approved, PIN-Verified, and 5+ Times Paid Veteran tiers with Google Ad Manager (GAM). Includes Master Gmail account, full WordPress backup & free domain push with zero active policy violations.",
    description:
      "Skip Google AdSense's strict manual review process and avoid months of approval rejections. Our premium turnkey assets are 100% genuine, fully approved websites built on modern WordPress architecture in established technology, SaaS, and high-CPC publisher niches.\n\nEvery asset undergoes a rigorous multi-point compliance audit: 0 active policy violations, strictly organic search traffic (never subjected to blackhat ad loading, bots, or artificial click generation), and zero historical ad limits ('Ad serving has been limited'). Depending on site traffic, many properties carry a live organic balance that is passed directly to you.\n\nChoose your preferred target country (USA, UK, Canada, India, Turkey, Middle East/GCC, or Global) and account maturity tier:\n1. Freshly Approved Tech Blog: Brand-new approval in high-yield tech blogging. May include Google Ad Manager (GAM), but not guaranteed.\n2. PIN-Verified AdSense Website: Physical postal address verification completed via official Google mail. Completely withdrawal-ready with zero postal delay—simply attach your bank account.\n3. 5+ Times Paid Veteran + Guaranteed GAM: Top-tier publisher account that has received payments over 5 times, featuring maximum algorithm trust and guaranteed Google Ad Manager (GAM 360 / MCM) approval.\n\nPACKAGE INCLUSIONS & SAFE HANDOVER:\n• Master Gmail Account: Delivered with the original primary Google account used for approval with full 2FA and recovery phone handover.\n• Full Website Backup: Complete WordPress source files and SQL database export (compatible with All-in-One WP Migration or Duplicator on any host).\n• Free Domain Authorization Push: Domain registered at trusted providers (Namecheap, GoDaddy, Porkbun, Dynadot) pushed directly to your account with zero transfer surcharges.\n• 14-Day Escrow & Replacement Warranty: Comprehensive protection covering pre-existing approval or policy defects.",
    price: 189.0,
    originalPrice: 249.0,
    rating: 4.97,
    reviewsCount: 88,
    images: [
      "/products/google-adsense-hero.svg",
      "/products/google-adsense-pin-gam.svg",
      "/products/google-adsense-safety-escrow.svg",
    ],
    variants: [
      {
        id: "adsense-fresh-tech",
        sku: "ADS-FRESH-TECH",
        title: "Freshly Approved Tech Blog (Global / Multi-Geo)",
        tierName: "Fresh Approval",
        price: 189.0,
        originalPrice: 249.0,
        stockQuantity: 4,
        licenseCount: 1,
        perks: [
          "100% Active AdSense Green Approval",
          "High-CPC Tech / SaaS Niche Blog",
          "Master Gmail Account Included",
          "Free Domain Push (Namecheap/Porkbun)",
          "Google Ad Manager (GAM Potential)",
          "14-Day Replacement Warranty",
        ],
      },
      {
        id: "adsense-fresh-usa-uk",
        sku: "ADS-FRESH-USA-UK",
        title: "Freshly Approved Tech Blog — USA / UK ($ High CPC)",
        tierName: "Tier-1 High CPC",
        badge: "HIGH CPC",
        price: 249.0,
        originalPrice: 320.0,
        stockQuantity: 3,
        licenseCount: 1,
        perks: [
          "USA or UK Bank & Tax Profile Ready",
          "Compatible with Payoneer, Wise & Wire",
          "Aged .COM Domain Push Included",
          "Original Master Gmail Account",
          "Full WordPress Source & Database",
          "Zero Policy Strikes Guaranteed",
        ],
      },
      {
        id: "adsense-pin-verified",
        sku: "ADS-PIN-VERIFIED",
        title: "PIN-Verified AdSense Website — Instant Withdrawal Ready",
        tierName: "PIN Verified",
        badge: "MOST POPULAR",
        price: 369.0,
        originalPrice: 480.0,
        stockQuantity: 3,
        licenseCount: 1,
        perks: [
          "Physical Postal Address PIN Cleared",
          "Zero 4-Week Postal Waiting Time",
          "Add Your Bank Account Immediately",
          "Existing Organic Balance Included",
          "Master Gmail & Recovery Transfer",
          "Full WP Files + SQL Database",
        ],
      },
      {
        id: "adsense-veteran-5x-gam",
        sku: "ADS-VETERAN-5X-GAM",
        title: "5x Payment Received Veteran + Guaranteed Google Ad Manager (GAM)",
        tierName: "Veteran Publisher",
        badge: "ELITE ASSET",
        price: 589.0,
        originalPrice: 750.0,
        stockQuantity: 2,
        licenseCount: 1,
        perks: [
          "Received Google Bank Wires 5+ Times",
          "Guaranteed GAM 360 / MCM Approved",
          "Immune to New Account Scrutiny Flags",
          "Highest Algorithm Trust & eCPM Yield",
          "Live Video & Live Transfer Support",
          "Aged High-Authority .COM Asset",
        ],
      },
      {
        id: "adsense-geo-gcc-me",
        sku: "ADS-GEO-GCC-ME",
        title: "Middle East / GCC AdSense Website (UAE, KSA, Egypt)",
        tierName: "Regional GCC",
        price: 299.0,
        originalPrice: 390.0,
        stockQuantity: 2,
        licenseCount: 1,
        perks: [
          "GCC / UAE / KSA Banking & P.O. Box Ready",
          "High eCPM Finance & Tech Audience",
          "Master Gmail Account Handover",
          "Free Domain Push & WordPress DB",
          "Full Arabic/English Content Architecture",
        ],
      },
      {
        id: "adsense-geo-india",
        sku: "ADS-GEO-INDIA",
        title: "India PIN-Verified AdSense Site (Direct INR Bank Transfer)",
        tierName: "India Region",
        price: 279.0,
        originalPrice: 360.0,
        stockQuantity: 3,
        licenseCount: 1,
        perks: [
          "India Post Postal PIN Verified",
          "Direct NEFT / RTGS INR Bank Linking",
          "Zero Bank Intermediary Forex Cuts",
          "High Traffic Indian Tech Niche Portal",
          "Master Gmail with 2FA Handshake",
        ],
      },
    ],
    features: [
      "100% Active Google AdSense Green Status Verification",
      "Original Master Gmail Account Included with Clean Transfer",
      "Free Domain Authorization Push at Namecheap, GoDaddy, Porkbun, or Dynadot",
      "Complete WordPress Database Export & Source Files Included",
      "Strict Anti-Ad-Loading Policy (Never Subjected to Bots or Blackhat Traffic)",
      "Zero Policy Violations, Zero Strike History & Zero Active Ad Limits",
      "Any Carried Organic Balance Accrued is 100% Retained by Buyer",
      "14-Day Escrow & Full Replacement Warranty Against Pre-Existing Defects",
    ],
    requirements: [
      {
        fieldKey: "targetBuyerEmail",
        label: "Your Personal Email (For Gmail & Order Vault Handover)",
        fieldType: "TEXT",
        placeholder: "e.g. yourname@gmail.com",
        helpText: "We initiate the primary Master Gmail recovery binding to this address.",
        isRequired: true,
      },
      {
        fieldKey: "preferredRegistrar",
        label: "Preferred Domain Registrar for Free Domain Push",
        fieldType: "TEXT",
        placeholder: "e.g. Namecheap username, GoDaddy customer #, or Porkbun",
        helpText: "Enter your username/email at your registrar for an instant free push.",
        isRequired: true,
      },
      {
        fieldKey: "targetCountry",
        label: "Desired AdSense Payout Country / Currency",
        fieldType: "TEXT",
        placeholder: "e.g. United States (USD), United Kingdom (GBP), India (INR), etc.",
        helpText: "Confirm your payout country so we align the exact profile match.",
        isRequired: true,
      },
      {
        fieldKey: "contactPhone",
        label: "WhatsApp or Telegram for Live 2FA Security Handshake",
        fieldType: "TEXT",
        placeholder: "e.g. +1 555 123 4567 (WhatsApp / Telegram)",
        helpText: "Our security engineer will coordinate the 2FA handover live with you.",
        isRequired: false,
      },
    ],
    isFeatured: true,
    isNewArrival: true,
    instantStockCount: undefined,
    seoKeywords: [
      "buy google adsense approved website",
      "google adsense website for sale",
      "buy adsense account with pin",
      "pin verified adsense website",
      "5 times paid adsense account",
      "google ad manager approved site",
      "buy gam 360 website",
      "usa adsense approved site",
      "uk adsense website buy",
      "india adsense pin verified site",
      "clean adsense no ad limit",
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
    id: "bundle-adsense-monetization-suite",
    title: "Publisher Monetization Powerhouse: AdSense Site + WP Rocket + Rank Math PRO",
    badge: "SAVE EXTRA 20% TOGETHER",
    description: "Turnkey AdSense Approved Website paired with official WP Rocket Core Web Vitals speed and Rank Math PRO SEO Schema for maximum search traffic & ad revenue.",
    productIds: ["google-adsense-approved-websites", "wp-rocket", "rank-math-pro"],
    discountPercent: 20,
  },
  {
    id: "bundle-wp-quad-stack",
    title: "WordPress Elite Quad Stack: Astra Pro + Elementor Pro + WP Rocket + Rank Math PRO",
    badge: "SAVE EXTRA 25% TOGETHER",
    description: "The ultimate 4-part WordPress powerhouse: The fastest theme + visual builder + Core Web Vitals cache + automated SEO schema.",
    productIds: ["astra-pro-theme", "elementor-pro", "wp-rocket", "rank-math-pro"],
    discountPercent: 25,
  },
  {
    id: "bundle-wp-design-duo",
    title: "WordPress Design & Speed Duo: Astra Pro + Elementor Pro",
    badge: "SAVE EXTRA 15% TOGETHER",
    description: "The world's fastest theme framework paired with the #1 visual page builder for pixel-perfect performance.",
    productIds: ["astra-pro-theme", "elementor-pro"],
    discountPercent: 15,
  },
  {
    id: "bundle-wp-holy-trinity",
    title: "WordPress Holy Trinity: Elementor Pro + WP Rocket + Rank Math PRO",
    badge: "SAVE EXTRA 20% TOGETHER",
    description: "The complete trifecta for elite WordPress development: Visual Theme Builder + Core Web Vitals Accelerator + Advanced Schema SEO.",
    productIds: ["elementor-pro", "wp-rocket", "rank-math-pro"],
    discountPercent: 20,
  },
  {
    id: "bundle-wp-power-duo",
    title: "WordPress Power Duo: WP Rocket + Rank Math PRO",
    badge: "SAVE EXTRA 15% TOGETHER",
    description: "The definitive WordPress accelerator and SEO combo. Maximum Google Core Web Vitals speed + Top-tier Rich Snippets & Search Rankings.",
    productIds: ["wp-rocket", "rank-math-pro"],
    discountPercent: 15,
  },
];
