import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth";
import { getDbProducts, updateDbProduct, logAuditEvent } from "@/lib/db";

export async function GET() {
  const session = getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const products = await getDbProducts();
    return NextResponse.json({ products });
  } catch (err) {
    console.error("Admin get products error:", err);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, active, shortDescription, printSpeed, layerResolution } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    const updated = await updateDbProduct(id, {
      ...(active !== undefined && { active: Boolean(active) }),
      ...(shortDescription && { shortDescription }),
      ...(printSpeed && { printSpeed }),
      ...(layerResolution && { layerResolution }),
    });

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await logAuditEvent(session.email, "PRODUCT_UPDATED", "product", id, { active });

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    console.error("Admin update product error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
