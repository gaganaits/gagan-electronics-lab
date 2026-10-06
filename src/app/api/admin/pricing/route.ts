import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth";
import { getPricingConfigs, updatePricingConfig, logAuditEvent } from "@/lib/db";
import { pricingConfigSchema } from "@/lib/validation/schemas";

export async function GET() {
  const session = getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const pricing = await getPricingConfigs();
    return NextResponse.json({ pricing });
  } catch (err) {
    console.error("Admin get pricing error:", err);
    return NextResponse.json({ error: "Failed to load pricing configurations" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing pricing item ID" }, { status: 400 });
    }

    const parsed = pricingConfigSchema.safeParse(data);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Invalid pricing data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const updated = await updatePricingConfig(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Pricing item not found" }, { status: 404 });
    }

    await logAuditEvent(session.email, "PRICING_CONFIG_UPDATED", "pricing_config", id, {
      material: parsed.data.material,
      materialRate: parsed.data.materialRatePerKg,
      margin: parsed.data.marginPercent,
    });

    return NextResponse.json({ success: true, pricing: updated });
  } catch (err) {
    console.error("Admin update pricing error:", err);
    return NextResponse.json({ error: "Failed to update pricing configuration" }, { status: 500 });
  }
}
