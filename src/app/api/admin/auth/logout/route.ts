import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminSession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { logAuditEvent } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = getCurrentAdminSession();
  if (session) {
    await logAuditEvent(session.email, "ADMIN_LOGOUT", "admin_auth", session.email);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
