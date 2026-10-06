import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth";
import { getQuoteById, updateQuoteStatus, getFileSignedUrl, logAuditEvent } from "@/lib/db";
import { quoteStatusUpdateSchema } from "@/lib/validation/schemas";

interface RouteParams {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Missing quote ID" }, { status: 400 });
  }

  try {
    const quote = await getQuoteById(id);
    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Attach signed URLs for files
    const filesWithUrls = await Promise.all(
      quote.files.map(async (file) => {
        const signed = await getFileSignedUrl(quote.id, file.id);
        return {
          ...file,
          downloadUrl: signed?.url || null,
        };
      })
    );

    await logAuditEvent(session.email, "QUOTE_VIEWED", "quote", quote.publicReference);

    return NextResponse.json({
      quote: {
        ...quote,
        files: filesWithUrls,
      },
    });
  } catch (err) {
    console.error("Admin get quote detail error:", err);
    return NextResponse.json({ error: "Failed to fetch quote details" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Missing quote ID" }, { status: 400 });
  }

  try {
    const existing = await getQuoteById(id);
    if (!existing) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = quoteStatusUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Invalid update data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const updated = await updateQuoteStatus(id, {
      status: parsed.data.status,
      estimatedPrice: parsed.data.estimatedPrice,
      finalPrice: parsed.data.finalPrice,
      adminNotes: parsed.data.adminNotes,
    });

    if (existing.status !== parsed.data.status) {
      await logAuditEvent(session.email, "QUOTE_STATUS_CHANGED", "quote", existing.publicReference, {
        oldStatus: existing.status,
        newStatus: parsed.data.status,
      });
    }

    if (
      existing.finalPrice !== parsed.data.finalPrice ||
      existing.estimatedPrice !== parsed.data.estimatedPrice
    ) {
      await logAuditEvent(session.email, "QUOTE_PRICE_UPDATED", "quote", existing.publicReference, {
        estimatedPrice: parsed.data.estimatedPrice,
        finalPrice: parsed.data.finalPrice,
      });
    }

    return NextResponse.json({ success: true, quote: updated });
  } catch (err) {
    console.error("Admin update quote error:", err);
    return NextResponse.json({ error: "Failed to update quotation" }, { status: 500 });
  }
}
