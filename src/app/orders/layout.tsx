import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Order Portal & Digital Vault",
  description:
    "Secure customer vault for accessing software license keys, WordPress installation status, and AdSense site transfers.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
