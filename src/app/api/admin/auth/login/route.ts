import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { verifyAdminCredentials, createSignedSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { logAuditEvent } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);

    // Rate limit: 5 failed attempts per 15 minutes
    const rateCheck = checkRateLimit(ip, "admin_login", {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateCheck.allowed) {
      const waitMinutes = Math.ceil(rateCheck.resetTimeMs / (60 * 1000));
      return NextResponse.json(
        {
          error: `Too many login attempts. For security reasons, please wait ${waitMinutes} minutes.`,
        },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const isValid = verifyAdminCredentials(email, password);

    if (!isValid) {
      await logAuditEvent("unauthenticated", "FAILED_LOGIN_ATTEMPT", "admin_auth", email.substring(0, 50), {
        ip,
      });
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Success: create token and set cookie
    const token = createSignedSessionToken(email.toLowerCase().trim(), "ADMIN");
    await logAuditEvent(email, "ADMIN_LOGIN_SUCCESS", "admin_auth", email, { ip });

    const response = NextResponse.json({
      success: true,
      email: email.toLowerCase().trim(),
      role: "ADMIN",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Authentication service error" }, { status: 500 });
  }
}
