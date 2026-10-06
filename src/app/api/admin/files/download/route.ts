import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth";
import { getLocalFileBuffer, logAuditEvent } from "@/lib/db";

export async function GET(req: NextRequest) {
  // STRICT AUTHORIZATION: unauthenticated users cannot download customer CAD files
  const session = getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized file access" }, { status: 401 });
  }

  const quoteId = req.nextUrl.searchParams.get("quoteId");
  const fileId = req.nextUrl.searchParams.get("fileId");

  if (!quoteId || !fileId) {
    return NextResponse.json({ error: "Invalid file request parameters" }, { status: 400 });
  }

  const fileData = getLocalFileBuffer(quoteId, fileId);
  if (!fileData) {
    return NextResponse.json({ error: "File not found or expired" }, { status: 404 });
  }

  await logAuditEvent(session.email, "CUSTOMER_FILE_DOWNLOADED", "quote_file", fileData.filename, {
    quoteId,
  });

  return new NextResponse(new Uint8Array(fileData.buffer), {
    status: 200,
    headers: {
      "Content-Type": fileData.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(fileData.filename)}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}
