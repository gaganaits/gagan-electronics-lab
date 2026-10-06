import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth";
import { getQuotes } from "@/lib/db";
import { QuoteStatus } from "@/types";

export async function GET(req: NextRequest) {
  const session = getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const statusParam = searchParams.get("status") as QuoteStatus | null;
    const quotes = await getQuotes(statusParam || undefined);

    return NextResponse.json({ quotes });
  } catch (err) {
    console.error("Admin get quotes error:", err);
    return NextResponse.json({ error: "Failed to fetch quotation records" }, { status: 500 });
  }
}
