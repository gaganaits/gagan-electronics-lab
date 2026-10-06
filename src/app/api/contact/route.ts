import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { contactFormSchema } from "@/lib/validation/schemas";
import { logAuditEvent } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);

    // Rate limit: 5 inquiries per hour per IP
    const rateCheck = checkRateLimit(ip, "contact_form", {
      windowMs: 60 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateCheck.allowed) {
      const waitMinutes = Math.ceil(rateCheck.resetTimeMs / (60 * 1000));
      return NextResponse.json(
        {
          error: `Too many inquiries sent from this IP. Please wait ${waitMinutes} minutes before sending another.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // In a live deployment, this can also dispatch an email or webhook
    await logAuditEvent("system", "CONTACT_INQUIRY_RECEIVED", "inquiry", parsed.data.email, {
      name: parsed.data.name,
      subject: parsed.data.subject,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting Gagan Electronics Lab. Our team will review your inquiry and reply within 1 business day.",
    });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again." },
      { status: 500 }
    );
  }
}
