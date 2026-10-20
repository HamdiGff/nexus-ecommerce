import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchant Admin Console",
  description: "Administrative control center for digital orders and inventory management.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
