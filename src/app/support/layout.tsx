import type { Metadata } from "next";
import { getSiteUrl, SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "24/7 Customer Support Desk & Order Assistance",
  description:
    "Get instant technical support for WordPress plugin setups, IDM license keys, Steam cards, and Google AdSense website deliveries.",
  alternates: {
    canonical: `${getSiteUrl()}/support`,
  },
  openGraph: {
    title: `24/7 Customer Support Desk | ${SITE_CONFIG.name}`,
    description:
      "Open or track customer support tickets with dedicated technician replies in under 15 minutes.",
    url: `${getSiteUrl()}/support`,
    siteName: SITE_CONFIG.name,
    images: [`${getSiteUrl()}/og-image.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: `Customer Support & Assistance | ${SITE_CONFIG.shortName}`,
    description: "24/7 live assistance and order resolution for digital assets.",
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = getSiteUrl();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How are WordPress agency licenses activated on my website?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our certified technicians securely connect to your WordPress admin URL using temporary credentials provided during checkout, connect our official Agency License Key directly from the developer network, and immediately purge access for complete privacy.",
        },
      },
      {
        "@type": "Question",
        name: "How fast are digital software keys and game codes delivered?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Retail software licenses and digital voucher codes (like Steam and IDM) are dispensed instantly (under 60 seconds) in your Customer Order Vault upon payment confirmation.",
        },
      },
      {
        "@type": "Question",
        name: "How is a Google AdSense approved website transferred safely?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AdSense sites are fulfilled through our dedicated 4-stage handover desk: 1) Free internal domain push to your registrar, 2) Master Gmail account & 2FA single-use backup codes, 3) Full WordPress backup archive and SQL database dump, and 4) 14-day policy compliance warranty.",
        },
      },
      {
        "@type": "Question",
        name: "What payment methods are supported on NEXUS Digital?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We support Visa, MasterCard, American Express, PayPal, and cryptocurrency payments (Bitcoin, Ethereum, and USDT).",
        },
      },
    ],
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${siteUrl}/support`,
    name: "NEXUS Support & Help Center",
    description: "Customer service help center and technical ticket dispatch.",
    mainEntity: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: siteUrl,
      email: SITE_CONFIG.supportEmail,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {children}
    </>
  );
}
