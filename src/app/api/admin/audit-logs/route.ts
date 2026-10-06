import { NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth";
import { getAuditLogs } from "@/lib/db";

export async function GET() {
  const session = getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const logs = await getAuditLogs();
    return NextResponse.json({ logs });
  } catch (err) {
    console.error("Admin get audit logs error:", err);
    return NextResponse.json({ error: "Failed to load audit logs" }, { status: 500 });
  }
}
