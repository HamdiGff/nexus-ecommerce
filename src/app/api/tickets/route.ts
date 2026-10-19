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
    const { name, email, orderNumber, priority, subject, message } = body;

    if (!email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tickets = global.__GLOBAL_SUPPORT_TICKETS__ || [];
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
