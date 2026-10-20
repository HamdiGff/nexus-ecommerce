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

    const isAdSenseOrder = (items || []).some(
      (item: any) =>
        item.deliveryType === "MANUAL_HANDOFF" ||
        item.category === "adsense-websites" ||
        (item.title || "").toLowerCase().includes("adsense") ||
        (item.slug || "").includes("adsense")
    );

    const defaultAdSenseFulfillment = isAdSenseOrder
      ? {
          stage: 1, // 1: Domain Selection & Push, 2: Gmail Handover, 3: Website Backup, 4: Warranty Active
          candidateDomains: [
            { domain: "techpulse-cloud.com", niche: "Tech & SaaS Reviews", isSelected: true },
            { domain: "nextgen-cyber.io", niche: "AI & Cybersecurity Portal", isSelected: false },
            { domain: "cloudgrowth-hub.com", niche: "High-CPC Cloud Hosting Blog", isSelected: false },
          ],
          selectedDomain: "techpulse-cloud.com",
          domainRegistrar: submissions?.adsense?.registrar || submissions?.preferredRegistrar || "Namecheap",
          registrarAccount: submissions?.adsense?.registrarUsername || submissions?.preferredRegistrar || customer?.email || "",
          domainPushStatus: "PUSH_INITIATED",
          domainPushNotes: `Domain push initiated to ${submissions?.adsense?.registrar || "Namecheap"} account "${submissions?.adsense?.registrarUsername || customer?.email}". Please approve incoming transfer in your registrar dashboard.`,
          domainEppCode: "EPP-TECH-8492019-PUSH",
          masterGmail: {
            email: "techpulse.publisher@gmail.com",
            password: "AdSense$Transfer2026!secure",
            backupCodes: ["8492 0192", "4920 1827", "7193 8402", "3901 8472", "5820 1938"],
            recoveryPhone: submissions?.adsense?.contactPhone || "+1 (555) 234-5678",
            recoveryInstructions:
              "Log in with the temporary password above. When Google requests 2FA, enter one of the 8-digit single-use backup codes. Once in your Google account, navigate to Security to update the recovery phone number and password.",
            isConfirmed: false,
          },
          websiteBackup: {
            backupDownloadUrl: "https://dl.nexus-digital.store/backups/techpulse-full-wordpress-backup.wpress",
            sqlDownloadUrl: "https://dl.nexus-digital.store/backups/techpulse-database-export.sql.gz",
            restoreGuideUrl: "https://nexus-digital.store/docs/adsense-wordpress-migration-guide.pdf",
            isDownloaded: false,
          },
          warranty: {
            isActive: true,
            validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            certificateId: `ESCROW-CERT-${orderNumber}`,
          },
          chatMessages: [
            {
              id: `msg-${Date.now()}-1`,
              sender: "admin",
              senderName: "AdSense Asset Specialist (Nexus Ops)",
              text: `Hello ${
                customer?.name || "Customer"
              }! Welcome to your dedicated AdSense handover desk. We have received your target registrar details (${
                submissions?.adsense?.registrar || "Namecheap"
              }: ${submissions?.adsense?.registrarUsername || customer?.email}). Please inspect the candidate domains below and confirm when you are ready for the Master Gmail credentials.`,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        }
      : undefined;

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
      adsenseFulfillment: defaultAdSenseFulfillment,
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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { orderId, orderNumber: incomingNumber, updates, newChatMessage } = body;
    const cleanId = (orderId || incomingNumber || "").toUpperCase().trim();

    if (!cleanId) {
      return NextResponse.json({ success: false, error: "Order ID required" }, { status: 400 });
    }

    if (!global.__GLOBAL_ORDERS__) {
      global.__GLOBAL_ORDERS__ = [];
    }

    const orderIndex = global.__GLOBAL_ORDERS__.findIndex(
      (o) =>
        o.orderNumber?.toUpperCase() === cleanId ||
        o.orderId?.toUpperCase() === cleanId ||
        o.id?.toUpperCase() === cleanId
    );

    let targetOrder = orderIndex !== -1 ? global.__GLOBAL_ORDERS__[orderIndex] : null;

    if (!targetOrder) {
      // Create a default base order record if updating for the first time
      targetOrder = {
        id: cleanId,
        orderNumber: cleanId,
        orderId: cleanId,
        customerName: "Customer",
        customerEmail: "customer@nexus-client.com",
        status: "PROCESSING",
        total: 189.0,
        paymentMethod: "Credit Card",
        items: [],
        createdAt: new Date().toISOString(),
        adsenseFulfillment: {
          stage: 1,
          candidateDomains: [],
          selectedDomain: "",
          domainRegistrar: "Namecheap",
          registrarAccount: "",
          domainPushStatus: "PUSH_INITIATED",
          chatMessages: [],
        },
      };
      global.__GLOBAL_ORDERS__.unshift(targetOrder);
    }

    // Deep merge adsenseFulfillment if provided
    if (updates?.adsenseFulfillment) {
      targetOrder.adsenseFulfillment = {
        ...targetOrder.adsenseFulfillment,
        ...updates.adsenseFulfillment,
      };
    }

    // Merge status or other root fields
    if (updates?.status) {
      targetOrder.status = updates.status;
    }

    // Append new chat message if present
    if (newChatMessage) {
      if (!targetOrder.adsenseFulfillment) {
        targetOrder.adsenseFulfillment = { stage: 1, chatMessages: [] };
      }
      if (!targetOrder.adsenseFulfillment.chatMessages) {
        targetOrder.adsenseFulfillment.chatMessages = [];
      }
      targetOrder.adsenseFulfillment.chatMessages.push({
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: newChatMessage.sender || "customer",
        senderName: newChatMessage.senderName || (newChatMessage.sender === "admin" ? "AdSense Specialist" : "Buyer"),
        text: newChatMessage.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }

    const headers = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    };

    return NextResponse.json({ success: true, order: targetOrder }, { headers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to update order" }, { status: 500 });
  }
}
