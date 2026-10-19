import { NextResponse } from "next/server";

declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_SUPPORT_TICKETS__: any[] | undefined;
}

if (!global.__GLOBAL_SUPPORT_TICKETS__) {
  global.__GLOBAL_SUPPORT_TICKETS__ = [];
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.toLowerCase()?.trim();

  const tickets = global.__GLOBAL_SUPPORT_TICKETS__ || [];

  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  };

  if (email) {
    const userTickets = tickets.filter((t) => t.customerEmail.toLowerCase().trim() === email);
    return NextResponse.json({ success: true, tickets: userTickets }, { headers });
  }

  return NextResponse.json({ success: true, tickets }, { headers });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, ticketId, name, email, orderNumber, priority, subject, message, sender, status } = body;

    const tickets = global.__GLOBAL_SUPPORT_TICKETS__ || [];

    // Action 1: Add a message reply to an existing ticket (from Admin or Customer)
    if (action === "reply" && ticketId) {
      const ticket = tickets.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
      if (!ticket) {
        return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 });
      }

      const newMsg = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: sender || "ADMIN",
        senderName: sender === "CUSTOMER" ? (name || "Customer") : "NEXUS Support Specialist",
        message: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      ticket.messages.push(newMsg);
      if (status) {
        ticket.status = status;
      } else if (sender === "ADMIN") {
        ticket.status = "IN_PROGRESS";
      }

      global.__GLOBAL_SUPPORT_TICKETS__ = tickets;
      return NextResponse.json({ success: true, ticket, message: newMsg });
    }

    // Action 2: Update status directly (e.g. RESOLVED / CLOSED)
    if (action === "update_status" && ticketId && status) {
      const ticket = tickets.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
      if (ticket) {
        ticket.status = status;
      }
      global.__GLOBAL_SUPPORT_TICKETS__ = tickets;
      return NextResponse.json({ success: true, ticket });
    }

    // Action 3: Create a brand new ticket
    if (!email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const ticketNumber = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket = {
      id: `tick-${Date.now()}`,
      ticketNumber,
      customerName: name || email.split("@")[0],
      customerEmail: email.trim().toLowerCase(),
      orderNumber: orderNumber || undefined,
      subject,
      priority: priority || "MEDIUM",
      status: "OPEN",
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: "CUSTOMER",
          senderName: name || "Customer",
          message,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    tickets.unshift(newTicket);
    global.__GLOBAL_SUPPORT_TICKETS__ = tickets;

    return NextResponse.json({ success: true, ticket: newTicket });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
