import { NextResponse } from "next/server";

declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_SUPPORT_TICKETS__: any[] | undefined;
}

if (!global.__GLOBAL_SUPPORT_TICKETS__) {
  global.__GLOBAL_SUPPORT_TICKETS__ = [];
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.toLowerCase()?.trim();
  const ticketId = searchParams.get("ticketId");
  const ticketNumber = searchParams.get("ticketNumber")?.toUpperCase()?.trim();

  const tickets = global.__GLOBAL_SUPPORT_TICKETS__ || [];

  // Lookup by single ticket ID or number
  if (ticketId) {
    const found = tickets.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
    return NextResponse.json({ success: true, ticket: found || null }, { headers: NO_CACHE_HEADERS });
  }

  if (ticketNumber) {
    const found = tickets.find((t) => t.ticketNumber === ticketNumber);
    return NextResponse.json({ success: true, ticket: found || null }, { headers: NO_CACHE_HEADERS });
  }

  // Filter by customer email
  if (email) {
    const userTickets = tickets.filter(
      (t) => t.customerEmail?.toLowerCase().trim() === email
    );
    return NextResponse.json({ success: true, tickets: userTickets }, { headers: NO_CACHE_HEADERS });
  }

  // Return all tickets (admin view)
  return NextResponse.json({ success: true, tickets }, { headers: NO_CACHE_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      action,
      ticketId,
      name,
      email,
      orderNumber,
      priority,
      subject,
      message,
      sender,
      status,
    } = body;

    const tickets = global.__GLOBAL_SUPPORT_TICKETS__ || [];

    // ── Action: DELETE ticket (admin-only) ─────────────────────────────
    if (action === "delete" && ticketId) {
      const before = tickets.length;
      global.__GLOBAL_SUPPORT_TICKETS__ = tickets.filter(
        (t) => t.id !== ticketId && t.ticketNumber !== ticketId
      );
      const deleted = before !== global.__GLOBAL_SUPPORT_TICKETS__!.length;
      return NextResponse.json({ success: true, deleted }, { headers: NO_CACHE_HEADERS });
    }

    // ── Action: Reply ─────────────────────────────────────────────────
    if (action === "reply" && ticketId) {
      const ticket = tickets.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
      if (!ticket) {
        return NextResponse.json(
          { success: false, error: "Ticket not found" },
          { status: 404, headers: NO_CACHE_HEADERS }
        );
      }

      const newMsg = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: sender || "ADMIN",
        senderName:
          sender === "CUSTOMER"
            ? name || ticket.customerName || "Customer"
            : "NEXUS Support Specialist",
        message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: new Date().toISOString(),
      };

      ticket.messages.push(newMsg);

      if (status) {
        ticket.status = status;
      } else if (sender === "ADMIN") {
        ticket.status = "IN_PROGRESS";
      }
      ticket.updatedAt = new Date().toISOString();

      global.__GLOBAL_SUPPORT_TICKETS__ = tickets;
      return NextResponse.json({ success: true, ticket, message: newMsg }, { headers: NO_CACHE_HEADERS });
    }

    // ── Action: Update status ─────────────────────────────────────────
    if (action === "update_status" && ticketId && status) {
      const ticket = tickets.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
      if (ticket) {
        ticket.status = status;
        ticket.updatedAt = new Date().toISOString();
        if (status === "RESOLVED") {
          ticket.resolvedAt = new Date().toISOString();
        }
      }
      global.__GLOBAL_SUPPORT_TICKETS__ = tickets;
      return NextResponse.json({ success: true, ticket }, { headers: NO_CACHE_HEADERS });
    }

    // ── Action: Create new ticket ─────────────────────────────────────
    if (!email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: email, subject, message" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const ticketNumber = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();

    const newTicket = {
      id: `tick-${Date.now()}`,
      ticketNumber,
      customerName: name || email.split("@")[0],
      customerEmail: email.trim().toLowerCase(),
      orderNumber: orderNumber || undefined,
      subject,
      priority: priority || "MEDIUM",
      status: "OPEN",
      createdAt: now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      updatedAt: now.toISOString(),
      resolvedAt: null,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: "CUSTOMER",
          senderName: name || email.split("@")[0],
          message,
          time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          timestamp: now.toISOString(),
        },
      ],
    };

    tickets.unshift(newTicket);
    global.__GLOBAL_SUPPORT_TICKETS__ = tickets;

    return NextResponse.json({ success: true, ticket: newTicket }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
