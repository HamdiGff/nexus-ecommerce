import { Suspense } from "react";
import OrderVaultClient from "@/components/orders/OrderVaultClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const instant = false;

export function generateStaticParams() {
  return [
    { id: "NEX-772910" },
    { id: "NEX-883102" },
    { id: "NEX-554219" },
    { id: "NEX-442198" },
    { id: "NEX-331905" },
    { id: "NEX-948208" },
    { id: "NEX-948210" },
    { id: "NEX-948209" },
  ];
}

export default async function OrderVaultPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-xs text-neutral-500 font-mono">
          Loading digital asset vault...
        </div>
      }
    >
      <OrderVaultClient orderId={id} />
    </Suspense>
  );
}
