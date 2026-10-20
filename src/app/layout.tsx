import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import QuickAddFeedbackEngine from "@/components/cart/QuickAddFeedbackEngine";
import LiveChatWidget from "@/components/chat/LiveChatWidget";
import FlashSaleBanner from "@/components/layout/FlashSaleBanner";

import GlobalJsonLd from "@/components/seo/GlobalJsonLd";
import { getSiteUrl, SITE_CONFIG } from "@/lib/siteConfig";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_CONFIG.name} | WordPress Licenses, Software Keys & Turnkey Websites`,
    template: `%s | ${SITE_CONFIG.shortName}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} | WordPress Licenses, Software Keys & Turnkey Websites`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Premier Digital Goods Marketplace`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | WordPress Licenses & Turnkey Websites`,
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.social.twitter,
    images: ["/og-image.png"],
  },
};

import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} h-full antialiased scroll-smooth dark`}>
      <body className="min-h-full flex flex-col bg-[#090a0f] text-neutral-100 font-sans selection:bg-blue-600 selection:text-white">
        <GlobalJsonLd />
        <Suspense fallback={null}>
          <FlashSaleBanner />
        </Suspense>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>
        <Suspense fallback={null}>
          <QuickAddFeedbackEngine />
        </Suspense>
        <Suspense fallback={null}>
          <LiveChatWidget />
        </Suspense>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
