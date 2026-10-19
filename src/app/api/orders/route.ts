import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_ORDERS__: any[] | undefined;
}

if (!global.__GLOBAL_ORDERS__) {
  global.__GLOBAL_ORDERS__ = [];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.toLowerCase()?.trim();
  const orderNumber = searchParams.get("orderNumber")?.toUpperCase()?.trim();

  const orders = global.__GLOBAL_ORDERS__ || [];

  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  };

  if (orderNumber) {
    const found = orders.find(
      (o) =>
        o.orderNumber?.toUpperCase() === orderNumber ||
        o.orderId?.toUpperCase() === orderNumber ||
        o.id?.toUpperCase() === orderNumber
    );
    return NextResponse.json({ success: true, order: found || null }, { headers });
  }

  if (email) {
    const matching = orders.filter((o) => {
      const ordEmail = (o.customerEmail || o.customer?.email || "").toLowerCase().trim();
      return ordEmail === email;
    });
    return NextResponse.json({ success: true, orders: matching }, { headers });
  }

  return NextResponse.json({ success: true, orders }, { headers });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, paymentMethod, total, orderId, orderNumber: incomingNumber, submissions, generatedLicenseKeys, timestamp } = body;

    const orderNumber = incomingNumber || orderId || `NEX-${Math.floor(100000 + Math.random() * 900000)}`;

    const normalizedOrder = {
      id: orderNumber,
      orderNumber,
      orderId: orderNumber,
      customerEmail: (customer?.email || "").toLowerCase().trim(),
      customerName:
        `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim() ||
        customer?.name ||
        "Customer",
      customer,
      status: "PAID",
      subtotal: total || 0,
      total: total || 0,
      totalAmount: total || 0,
      paymentMethod: paymentMethod || "Credit Card (Stripe)",
      items: items || [],
      submissions: submissions || {},
      generatedLicenseKeys: generatedLicenseKeys || {},
      timestamp:
        timestamp ||
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      createdAt: new Date().toISOString(),
    };

    // Save to global memory store so it is accessible cross-browser / cross-session
    if (!global.__GLOBAL_ORDERS__) {
      global.__GLOBAL_ORDERS__ = [];
    }
    const existingIndex = global.__GLOBAL_ORDERS__.findIndex(
      (o) => o.orderNumber === orderNumber || o.id === orderNumber
    );
    if (existingIndex !== -1) {
      global.__GLOBAL_ORDERS__[existingIndex] = { ...global.__GLOBAL_ORDERS__[existingIndex], ...normalizedOrder };
    } else {
      global.__GLOBAL_ORDERS__.unshift(normalizedOrder);
    }

    // Attempt Prisma database persistence as well
    try {
      const dbOrder = await prisma.order.create({
        data: {
          orderNumber,
          customerEmail: customer?.email || "",
          customerName: normalizedOrder.customerName,
          status: "PAID",
          subtotal: total || 0,
          totalAmount: total || 0,
          paymentMethod: paymentMethod || "Credit Card (Stripe)",
          items: {
            create: (items || []).map((item: any) => ({
              productId: item.productId || item.id,
              productTitle: item.title,
              deliveryType: item.deliveryType || "INSTANT_CODE",
              unitPrice: item.price || 0,
              quantity: item.quantity || 1,
              total: (item.price || 0) * (item.quantity || 1),
            })),
          },
        },
      });
      return NextResponse.json({ success: true, order: dbOrder || normalizedOrder });
    } catch {
      // Prisma offline/mock fallback
      return NextResponse.json({ success: true, order: normalizedOrder });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process order" },
      { status: 500 }
    );
  }
}
