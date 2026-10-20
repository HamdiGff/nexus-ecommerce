import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import QuickAddFeedbackEngine from "@/components/cart/QuickAddFeedbackEngine";
import LiveChatWidget from "@/components/chat/LiveChatWidget";
import FlashSaleBanner from "@/components/layout/FlashSaleBanner";

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
  title: {
    default: "NEXUS Digital | WordPress Licenses, Software Keys & Turnkey Websites",
    template: "%s | NEXUS Digital",
  },
  description:
    "The premier digital goods marketplace. Buy Rank Math Pro, WP Rocket, IDM lifetime keys, Steam cards, and Google AdSense approved websites with instant delivery.",
  keywords: [
    "rank math pro license",
    "wp rocket cheap",
    "astra pro theme",
    "idm lifetime serial key",
    "buy steam gift card crypto",
    "adsense approved website for sale",
    "instant digital delivery",
  ],
  authors: [{ name: "NEXUS Digital Commerce" }],
  creator: "NEXUS Digital",
  publisher: "NEXUS Digital",
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
    siteName: "NEXUS Digital Marketplace",
    title: "NEXUS Digital | WordPress Licenses, Software Keys & Turnkey Websites",
    description:
      "Official WordPress agency licenses, instant software activation codes, and turnkey AdSense monetized websites.",
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
