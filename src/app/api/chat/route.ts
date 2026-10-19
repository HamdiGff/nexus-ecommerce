import { NextResponse } from "next/server";

// In-memory global store that survives between client sessions and incognito windows
declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_LIVE_CHATS__: any[] | undefined;
}

if (!global.__GLOBAL_LIVE_CHATS__) {
  global.__GLOBAL_LIVE_CHATS__ = [];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.toLowerCase();

  const chats = global.__GLOBAL_LIVE_CHATS__ || [];

  if (email) {
    const userChat = chats.find((c) => c.visitorEmail.toLowerCase() === email);
    return NextResponse.json({ success: true, chat: userChat || null });
  }

  return NextResponse.json({ success: true, chats });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { visitorName, visitorEmail, message, sender, topic } = body;

    if (!visitorEmail || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Detect Real IP and Country from Vercel / Cloudflare headers
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";
    const vercelCountry = req.headers.get("x-vercel-ip-country");
    const vercelCity = req.headers.get("x-vercel-ip-city");
    
    let resolvedLocation = "United States (US)";
    if (vercelCountry) {
      resolvedLocation = vercelCity ? `${decodeURIComponent(vercelCity)}, ${vercelCountry}` : vercelCountry;
    } else if (body.ipLocation && body.ipLocation !== "United States (US)") {
      resolvedLocation = body.ipLocation;
    }

    const chats = global.__GLOBAL_LIVE_CHATS__ || [];
    const normalizedEmail = visitorEmail.trim().toLowerCase();
    let session = chats.find((c) => c.visitorEmail.toLowerCase() === normalizedEmail);

    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: sender || "visitor",
      senderName: sender === "agent" ? "Support Specialist" : (visitorName || "Customer"),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (!session) {
      session = {
        id: `chat-${Date.now()}`,
        visitorName: visitorName || normalizedEmail.split("@")[0],
        visitorEmail: normalizedEmail,
        ipAddress: realIp,
        ipLocation: resolvedLocation,
        deviceInfo: body.deviceInfo || req.headers.get("user-agent")?.slice(0, 40) || "Web Browser",
        currentPage: "/",
        referrer: "Direct",
        sessionDuration: "Active now",
        inquiryTopic: topic || "General Inquiry",
        status: "WAITING_REPLY",
        unread: true,
        messages: [newMsg],
      };
      chats.unshift(session);
    } else {
      session.messages.push(newMsg);
      if (session.ipLocation === "United States (US)" && resolvedLocation !== "United States (US)") {
        session.ipLocation = resolvedLocation;
      }
      if (sender !== "agent") {
        session.status = "WAITING_REPLY";
        session.unread = true;
      } else {
        session.status = "ONLINE";
        session.unread = false;
      }
    }

    global.__GLOBAL_LIVE_CHATS__ = chats;

    return NextResponse.json({ success: true, session, message: newMsg });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
