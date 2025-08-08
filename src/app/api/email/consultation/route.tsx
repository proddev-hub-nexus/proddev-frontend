import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import ConsultationEmailTemplate from "@/general/components/email/consultation/schedule-template";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- CORS ---
const ALLOWED_ORIGINS = new Set<string>([
  "https://proddev.it.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function makeCorsHeaders(origin: string | null): Headers {
  const headers = new Headers();
  if (origin && ALLOWED_ORIGINS.has(origin))
    headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Allow-Credentials", "true");
  return headers;
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: makeCorsHeaders(req.headers.get("origin")),
  });
}

// --- Validation ---
const BodySchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  consultationType: z.string().min(1),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  goals: z.string().min(1),
  additionalInfo: z.string().optional().nullable(),
  scheduledDateTime: z.string().optional().nullable(),
});

// --- Config ---
const RESEND_DISABLED = process.env.RESEND_DISABLED === "1";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function getResend(): Resend {
  return new Resend(requireEnv("RESEND_API_KEY"));
}

function getFromAddress(): string {
  if (RESEND_DISABLED) return "Dev Mode <dev@example.com>";
  return requireEnv("RESEND_FROM");
}

// --- Formatting helpers ---
function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}

function formatTime(timeString: string): string {
  const [hRaw, mRaw] = timeString.split(":");
  const h = Number(hRaw);
  const m = Number(mRaw);
  const hour12 = h % 12 || 12;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

// --- Email sending (safe wrappers) ---
interface EmailSendOutcome {
  ok: boolean;
  id: string | null;
  error: string | null;
}

async function sendClientEmail(
  resend: Resend,
  from: string,
  data: z.infer<typeof BodySchema>,
  useSimple = false
): Promise<EmailSendOutcome> {
  try {
    console.log("🚀 Attempting to send client email...");
    console.log("From:", from);
    console.log("To:", data.email);
    console.log("Use Simple:", useSimple);

    const subject = `Consultation Confirmed - ${formatDate(data.preferredDate)} at ${formatTime(data.preferredTime)}`;

    if (useSimple) {
      console.log("📧 Sending simple text email...");
      const resp = await resend.emails.send({
        from,
        to: [data.email],
        subject,
        text: `Hi ${data.fullName},\n\nYour consultation is confirmed for ${formatDate(data.preferredDate)} at ${formatTime(data.preferredTime)}.\n\nBest regards,\nProdDev Hub Team`,
      });

      console.log("✉️ Simple email response:", resp);

      if (resp.error) {
        console.error("❌ Simple email error:", resp.error);
        return {
          ok: false,
          id: null,
          error: resp.error.message ?? "Email service error",
        };
      }
      return { ok: true, id: resp.data?.id ?? null, error: null };
    } else {
      console.log("🎨 Sending React template email...");
      const resp = await resend.emails.send({
        from,
        to: [data.email],
        subject,
        react: ConsultationEmailTemplate({ ...data }),
      });

      console.log("✉️ Template email response:", resp);

      if (resp.error) {
        console.error("❌ Template email error:", resp.error);
        return {
          ok: false,
          id: null,
          error: resp.error.message ?? "Email service error",
        };
      }
      return { ok: true, id: resp.data?.id ?? null, error: null };
    }
  } catch (e) {
    console.error("💥 Client email exception:", e);
    return { ok: false, id: null, error: String(e) };
  }
}

async function sendTeamEmail(
  resend: Resend,
  from: string,
  data: z.infer<typeof BodySchema>,
  useSimple = false
): Promise<EmailSendOutcome> {
  try {
    const subject = `New Consultation Request - ${data.fullName}`;
    const to = process.env.TEAM_EMAIL ?? "proddevhubnexus@gmail.com";

    console.log("👥 Sending team notification to:", to);

    if (useSimple) {
      const resp = await resend.emails.send({
        from,
        to: [to],
        subject,
        text: `${data.fullName} (${data.email}) requested a ${data.consultationType} consultation for ${formatDate(data.preferredDate)} at ${formatTime(data.preferredTime)}.\n\nGoals: ${data.goals}`,
      });

      if (resp.error) {
        console.error("❌ Team email error:", resp.error);
        return {
          ok: false,
          id: null,
          error: resp.error.message ?? "Email service error",
        };
      }
      return { ok: true, id: resp.data?.id ?? null, error: null };
    } else {
      const resp = await resend.emails.send({
        from,
        to: [to],
        subject,
        react: ConsultationEmailTemplate({ ...data }),
      });

      if (resp.error) {
        console.error("❌ Team email error:", resp.error);
        return {
          ok: false,
          id: null,
          error: resp.error.message ?? "Email service error",
        };
      }
      return { ok: true, id: resp.data?.id ?? null, error: null };
    }
  } catch (e) {
    console.error("💥 Team email exception:", e);
    return { ok: false, id: null, error: String(e) };
  }
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const baseHeaders = makeCorsHeaders(origin);

  try {
    console.log("🔍 POST request received");
    console.log("Environment check:");
    console.log("- RESEND_DISABLED:", process.env.RESEND_DISABLED);
    console.log("- RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
    console.log("- RESEND_FROM:", process.env.RESEND_FROM);
    console.log("- RESEND_USE_SIMPLE:", process.env.RESEND_USE_SIMPLE);

    const json = await req.json();
    console.log("📝 Request data received:", {
      fullName: json.fullName,
      email: json.email,
      consultationType: json.consultationType,
    });

    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      console.error("❌ Validation failed:", parsed.error.flatten());
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400, headers: baseHeaders }
      );
    }

    // Simulate sends in dev if RESEND_DISABLED=1
    if (RESEND_DISABLED) {
      console.log("🎭 Simulation mode enabled");
      return NextResponse.json(
        {
          message: "Consultation scheduled successfully (simulated)",
          data: {
            clientEmailId: "simulated-client-id",
            teamEmailId: "simulated-team-id",
            scheduledDateTime: parsed.data.scheduledDateTime ?? null,
            consultationType: parsed.data.consultationType,
          },
        },
        { status: 200, headers: baseHeaders }
      );
    }

    console.log("🚀 Real email mode - attempting to send emails...");

    const resend = getResend();
    const from = getFromAddress();
    const useSimple = process.env.RESEND_USE_SIMPLE === "1";

    console.log("📧 Email config:");
    console.log("- From address:", from);
    console.log("- Use simple mode:", useSimple);

    const [client, team] = await Promise.all([
      sendClientEmail(resend, from, parsed.data, useSimple),
      sendTeamEmail(resend, from, parsed.data, useSimple),
    ]);

    console.log("📊 Email results:");
    console.log("- Client email success:", client.ok, "ID:", client.id);
    console.log("- Team email success:", team.ok, "ID:", team.id);

    if (!client.ok) {
      console.error("💥 Client email failed, returning 502");
      return NextResponse.json(
        { message: "Failed to send confirmation email", error: client.error },
        { status: 502, headers: baseHeaders }
      );
    }

    console.log("✅ Success! Returning 200");
    return NextResponse.json(
      {
        message: "Consultation scheduled successfully",
        data: {
          clientEmailId: client.id,
          teamEmailId: team.ok ? team.id : null,
          scheduledDateTime: parsed.data.scheduledDateTime ?? null,
          consultationType: parsed.data.consultationType,
        },
        warnings: team.ok ? undefined : ["Team notification failed"],
      },
      { status: 200, headers: baseHeaders }
    );
  } catch (err) {
    console.error("💥 Unexpected error:", err);
    return NextResponse.json(
      { message: "Failed to schedule consultation", error: String(err) },
      { status: 500, headers: baseHeaders }
    );
  }
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  const headers = makeCorsHeaders(origin);

  try {
    const today = new Date();
    const availableDates: Array<{ value: string; label: string }> = [];

    for (let i = 1; i <= 30; i++) {
      const date = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate() + i
        )
      );
      const weekday = date.getUTCDay();
      if (weekday === 0 || weekday === 6) continue;
      availableDates.push({
        value: date.toISOString().slice(0, 10),
        label: new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        }).format(date),
      });
      if (availableDates.length >= 10) break;
    }

    const availableTimeSlots = [
      { value: "09:00", label: "9:00 AM - 9:30 AM" },
      { value: "10:00", label: "10:00 AM - 10:30 AM" },
      { value: "11:00", label: "11:00 AM - 11:30 AM" },
      { value: "14:00", label: "2:00 PM - 2:30 PM" },
      { value: "15:00", label: "3:00 PM - 3:30 PM" },
      { value: "16:00", label: "4:00 PM - 4:30 PM" },
      { value: "17:00", label: "5:00 PM - 5:30 PM" },
    ];

    const consultationTypes = [
      { value: "career-transition", label: "Career Transition" },
      { value: "skill-development", label: "Skill Development" },
      { value: "course-selection", label: "Course Selection" },
      { value: "certification-guidance", label: "Certification Guidance" },
      { value: "general-inquiry", label: "General Inquiry" },
    ];

    return NextResponse.json(
      { availableDates, availableTimeSlots, consultationTypes },
      { status: 200, headers }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch consultation data", error: String(err) },
      { status: 500, headers }
    );
  }
}
