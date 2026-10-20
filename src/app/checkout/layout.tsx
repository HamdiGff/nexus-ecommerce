import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Secure Encrypted Checkout",
  description:
    "Complete your digital order securely via Credit Card, PayPal, or Cryptocurrency with 256-bit SSL encryption.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
