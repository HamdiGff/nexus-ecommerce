import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicProductsDir = path.join(__dirname, "..", "public", "products");

if (!fs.existsSync(publicProductsDir)) {
  fs.mkdirSync(publicProductsDir, { recursive: true });
}

// Generate Rank Math Pro Brand SVG Banner
function generateRankMathSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070a12" />
      <stop offset="50%" stop-color="#0c1222" />
      <stop offset="100%" stop-color="#06080e" />
    </linearGradient>

    <radialGradient id="rankGlow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#d946ef" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Rank Math Logo Gradients -->
    <linearGradient id="rmBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>

    <linearGradient id="rmPink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="50%" stop-color="#e11d48" />
      <stop offset="100%" stop-color="#be123c" />
    </linearGradient>

    <linearGradient id="goldPro" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>

    <!-- Grid Pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" stroke-width="1" stroke-opacity="0.08" />
    </pattern>

    <filter id="dropGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#2563eb" flood-opacity="0.5" />
    </filter>

    <filter id="pinkGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#f43f5e" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Deep Technical Background -->
  <rect width="1200" height="750" fill="url(#bgGrad)" />
  <rect width="1200" height="750" fill="url(#grid)" />
  <rect width="1200" height="750" fill="url(#rankGlow)" />

  <!-- WordPress Watermark Silhouette in Background Right -->
  <g opacity="0.04" transform="translate(860, 200) scale(1.6)">
    <circle cx="100" cy="100" r="90" fill="none" stroke="#ffffff" stroke-width="12" />
    <path d="M 45 45 L 85 155 L 105 95 L 125 155 L 165 45" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- Top Glass Bar with Badge -->
  <g transform="translate(60, 50)">
    <rect width="230" height="38" rx="19" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
    <circle cx="24" cy="19" r="5" fill="#10b981" />
    <text x="38" y="24" fill="#e2e8f0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">OFFICIAL AGENCY KEY</text>
  </g>

  <g transform="translate(930, 50)">
    <rect width="210" height="38" rx="19" fill="#1e1b4b" fill-opacity="0.8" stroke="#6366f1" stroke-opacity="0.3" stroke-width="1" />
    <text x="105" y="24" fill="#a5b4fc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1">WORDPRESS VERIFIED</text>
  </g>

  <!-- CENTER STAGE: Iconic Rank Math SEO Logo + PRO -->
  <g transform="translate(180, 160)" filter="url(#dropGlow)">
    <!-- Rank Math Stylized Icon Container -->
    <rect x="0" y="0" width="180" height="180" rx="42" fill="#0b1120" stroke="#3b82f6" stroke-width="2" stroke-opacity="0.4" />
    
    <!-- Stylized Rank Math R & SEO Arrow -->
    <g transform="translate(38, 38)">
      <!-- Left Vertical Stem -->
      <path d="M 12 10 L 12 94" stroke="url(#rmBlue)" stroke-width="16" stroke-linecap="round" />
      
      <!-- Top Loop -->
      <path d="M 12 18 C 12 18, 55 10, 68 28 C 80 44, 72 62, 45 62 L 12 62" fill="none" stroke="url(#rmBlue)" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Rising SEO Growth Arrow Leg (Rank Math signature) -->
      <path d="M 38 56 L 82 96" stroke="url(#rmPink)" stroke-width="16" stroke-linecap="round" />
      <polygon points="86,76 100,102 72,102" fill="url(#rmPink)" filter="url(#pinkGlow)" />

      <!-- Data Dots / Growth Points -->
      <circle cx="28" cy="80" r="4" fill="#38bdf8" />
      <circle cx="50" cy="72" r="5" fill="#a855f7" />
      <circle cx="78" cy="48" r="6" fill="#f43f5e" />
    </g>

    <!-- Wordmark & Badges Group -->
    <g transform="translate(220, 50)">
      <text x="0" y="65" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="72" font-weight="900" letter-spacing="-1">
        <tspan fill="#ffffff">Rank</tspan><tspan fill="#38bdf8">Math</tspan>
      </text>

      <!-- PRO Pill Badge -->
      <g transform="translate(360, 12)">
        <rect width="110" height="50" rx="14" fill="url(#goldPro)" />
        <text x="55" y="34" fill="#000000" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="900" text-anchor="middle" letter-spacing="2">PRO</text>
      </g>

      <text x="2" y="105" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" letter-spacing="0.5">
        The Swiss Army Knife of WordPress SEO
      </text>
    </g>
  </g>

  <!-- Live SEO Analytics Mockup Graph Line -->
  <g transform="translate(180, 420)">
    <!-- Base plate -->
    <rect width="840" height="150" rx="24" fill="#0a0f1d" fill-opacity="0.8" stroke="#1e293b" stroke-width="1.5" />
    
    <!-- Rising SEO chart line -->
    <path d="M 50 110 Q 180 95, 260 75 T 460 60 T 640 30 T 780 20" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round" />
    <path d="M 50 110 Q 180 95, 260 75 T 460 60 T 640 30 T 780 20 L 780 130 L 50 130 Z" fill="url(#rankGlow)" opacity="0.4" />
    
    <!-- Feature Points -->
    <g transform="translate(60, 45)">
      <circle cx="15" cy="15" r="12" fill="#1e293b" stroke="#3b82f6" stroke-width="2" />
      <text x="15" y="20" fill="#38bdf8" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">✓</text>
      <text x="38" y="16" fill="#f8fafc" font-family="sans-serif" font-size="15" font-weight="700">Content AI 2.0</text>
      <text x="38" y="34" fill="#64748b" font-family="sans-serif" font-size="12">840+ Smart Credits</text>
    </g>

    <g transform="translate(320, 45)">
      <circle cx="15" cy="15" r="12" fill="#1e293b" stroke="#ec4899" stroke-width="2" />
      <text x="15" y="20" fill="#f43f5e" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">✓</text>
      <text x="38" y="16" fill="#f8fafc" font-family="sans-serif" font-size="15" font-weight="700">Schema Generator</text>
      <text x="38" y="34" fill="#64748b" font-family="sans-serif" font-size="12">84+ Rich Snippet Types</text>
    </g>

    <g transform="translate(580, 45)">
      <circle cx="15" cy="15" r="12" fill="#1e293b" stroke="#10b981" stroke-width="2" />
      <text x="15" y="20" fill="#34d399" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">✓</text>
      <text x="38" y="16" fill="#f8fafc" font-family="sans-serif" font-size="15" font-weight="700">Google Trends & Index</text>
      <text x="38" y="34" fill="#64748b" font-family="sans-serif" font-size="12">Instant Fast Indexing</text>
    </g>
  </g>

  <!-- Bottom Spec Pills -->
  <g transform="translate(180, 610)">
    <rect width="185" height="42" rx="12" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.08" />
    <text x="92" y="26" fill="#94a3b8" font-family="sans-serif" font-size="13" font-weight="600" text-anchor="middle">⚡ Auto Updates in WP</text>
  </g>

  <g transform="translate(385, 610)">
    <rect width="185" height="42" rx="12" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.08" />
    <text x="92" y="26" fill="#94a3b8" font-family="sans-serif" font-size="13" font-weight="600" text-anchor="middle">🔒 Encrypted Setup</text>
  </g>

  <g transform="translate(590, 610)">
    <rect width="210" height="42" rx="12" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.08" />
    <text x="105" y="26" fill="#94a3b8" font-family="sans-serif" font-size="13" font-weight="600" text-anchor="middle">🛡️ 100% Agency Genuine</text>
  </g>

  <g transform="translate(820, 610)">
    <rect width="200" height="42" rx="12" fill="#2563eb" fill-opacity="0.15" stroke="#3b82f6" stroke-opacity="0.4" />
    <text x="100" y="26" fill="#60a5fa" font-family="sans-serif" font-size="13" font-weight="700" text-anchor="middle">⭐ 4.9 (238 Reviews)</text>
  </g>
</svg>`;
}

// Generate WP Rocket SVG
function generateWPRocketSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750" width="1200" height="750">
  <defs>
    <linearGradient id="rocketBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a14" />
      <stop offset="50%" stop-color="#140f1f" />
      <stop offset="100%" stop-color="#07060c" />
    </linearGradient>
    <radialGradient id="rocketGlow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#f97316" stop-opacity="0.3" />
      <stop offset="60%" stop-color="#ef4444" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="rocketOrange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fb923c" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>
    <pattern id="rgrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f97316" stroke-width="1" stroke-opacity="0.06" />
    </pattern>
  </defs>

  <rect width="1200" height="750" fill="url(#rocketBg)" />
  <rect width="1200" height="750" fill="url(#rgrid)" />
  <rect width="1200" height="750" fill="url(#rocketGlow)" />

  <g transform="translate(60, 50)">
    <rect width="210" height="38" rx="19" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
    <circle cx="24" cy="19" r="5" fill="#f97316" />
    <text x="38" y="24" fill="#fed7aa" font-family="sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">WP CACHING LEADER</text>
  </g>

  <!-- Center Rocket Branding -->
  <g transform="translate(180, 160)">
    <rect x="0" y="0" width="180" height="180" rx="42" fill="#130e1c" stroke="#ea580c" stroke-width="2" stroke-opacity="0.4" />
    
    <!-- Rocket Icon -->
    <g transform="translate(50, 40)">
      <path d="M 40 10 C 65 25, 75 55, 70 85 L 55 85 L 40 60 L 25 85 L 10 85 C 5 55, 15 25, 40 10 Z" fill="url(#rocketOrange)" />
      <circle cx="40" cy="40" r="10" fill="#0f172a" />
      <circle cx="40" cy="40" r="5" fill="#38bdf8" />
      <!-- Flame -->
      <polygon points="30,88 40,110 50,88 40,94" fill="#fbbf24" />
    </g>

    <g transform="translate(220, 50)">
      <text x="0" y="65" font-family="sans-serif" font-size="70" font-weight="900" letter-spacing="-1">
        <tspan fill="#ffffff">WP</tspan><tspan fill="#f97316">Rocket</tspan>
      </text>
      <text x="2" y="105" fill="#94a3b8" font-family="sans-serif" font-size="20" font-weight="600">
        Google PageSpeed 99+ Core Web Vitals Accelerator
      </text>
    </g>
  </g>

  <!-- Speedometer & Stats Card -->
  <g transform="translate(180, 420)">
    <rect width="840" height="150" rx="24" fill="#0f0c18" stroke="#271c35" stroke-width="1.5" />
    <g transform="translate(60, 45)">
      <text x="0" y="30" fill="#22c55e" font-family="monospace" font-size="42" font-weight="bold">100 / 100</text>
      <text x="0" y="55" fill="#94a3b8" font-family="sans-serif" font-size="14">Google Mobile PageSpeed</text>
    </g>
    <g transform="translate(360, 45)">
      <text x="0" y="30" fill="#38bdf8" font-family="monospace" font-size="42" font-weight="bold">- 68%</text>
      <text x="0" y="55" fill="#94a3b8" font-family="sans-serif" font-size="14">Reduced TTFB &amp; Payload</text>
    </g>
    <g transform="translate(620, 45)">
      <text x="0" y="30" fill="#fb923c" font-family="monospace" font-size="42" font-weight="bold">&lt; 0.4s</text>
      <text x="0" y="55" fill="#94a3b8" font-family="sans-serif" font-size="14">Average Load Speed</text>
    </g>
  </g>

  <!-- Bottom Pills -->
  <g transform="translate(180, 610)">
    <rect width="260" height="42" rx="12" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.08" />
    <text x="130" y="26" fill="#94a3b8" font-family="sans-serif" font-size="13" font-weight="600" text-anchor="middle">⚡ Delay JS Execution</text>
  </g>
  <g transform="translate(460, 610)">
    <rect width="260" height="42" rx="12" fill="#ffffff" fill-opacity="0.04" stroke="#ffffff" stroke-opacity="0.08" />
    <text x="130" y="26" fill="#94a3b8" font-family="sans-serif" font-size="13" font-weight="600" text-anchor="middle">🚀 Remove Unused CSS</text>
  </g>
  <g transform="translate(740, 610)">
    <rect width="280" height="42" rx="12" fill="#ea580c" fill-opacity="0.15" stroke="#f97316" stroke-opacity="0.4" />
    <text x="140" y="26" fill="#fb923c" font-family="sans-serif" font-size="13" font-weight="700" text-anchor="middle">⭐ 5.0 (312 Verified Reviews)</text>
  </g>
</svg>`;
}

// Write the SVG files
const rankMathSvgPath = path.join(publicProductsDir, "rank-math-pro.svg");
fs.writeFileSync(rankMathSvgPath, generateRankMathSVG(), "utf8");
console.log(`Generated Rank Math Pro artwork at: ${rankMathSvgPath}`);

const wpRocketSvgPath = path.join(publicProductsDir, "wp-rocket.svg");
fs.writeFileSync(wpRocketSvgPath, generateWPRocketSVG(), "utf8");
console.log(`Generated WP Rocket artwork at: ${wpRocketSvgPath}`);
