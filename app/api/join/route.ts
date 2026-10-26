import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  organization: z.string().min(1).max(100).optional(),
  graduation: z.string().min(1).max(100).optional(),
  roles: z.array(z.string()).optional(),
  portfolio: z.string().max(500).optional(),
  why: z.string().max(2000).optional(),
  packages: z.array(z.string()).optional(),
  budgetTier: z.string().optional(),
  eventDate: z.string().optional(),
  website: z.string().optional(), // honeypot
});

const rate = new Map<string, { count: number; time: number }>();
const WINDOW = 60_000;
const MAX = 5;

function getIp(req: NextRequest) {
  return req.ip || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const now = Date.now();
  const entry = rate.get(ip);
  if (entry && now - entry.time < WINDOW) {
    if (entry.count >= MAX) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    entry.count += 1;
  } else {
    rate.set(ip, { count: 1, time: now });
  }

  try {
    const body = await req.json();
    if (body.website) {
      return NextResponse.json({ ok: true });
    }
    const parsed = schema.parse(body);

    const payload = {
      type: "join",
      ...parsed,
      receivedAt: new Date().toISOString(),
    };

    if (process.env.WEBHOOK_URL) {
      try {
        await fetch(process.env.WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {}
    } else if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "noreply@resolutionclub.example.com",
            to: ["contact@resolutionclub.example.com"],
            subject: "Crew Application",
            text: JSON.stringify(payload, null, 2),
          }),
        });
      } catch {}
    } else {
      console.log("join_request", payload);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
