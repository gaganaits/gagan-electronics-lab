import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { quoteSubmissionSchema } from "@/lib/validation/schemas";
import { validateUploadedFile, MAX_FILES_PER_QUOTE } from "@/lib/security/file-validation";
import { validateGoogleDriveUrl } from "@/lib/security/url-validation";
import { createQuote } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);

    // 1. Rate limiting: 5 quotes per hour per IP
    const rateCheck = checkRateLimit(ip, "quote_submission", {
      windowMs: 60 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateCheck.allowed) {
      const waitMinutes = Math.ceil(rateCheck.resetTimeMs / (60 * 1000));
      return NextResponse.json(
        {
          error: `Too many quotation requests from this IP. Please wait ${waitMinutes} minutes before submitting again.`,
        },
        { status: 429 }
      );
    }

    // 2. Parse form data
    const formData = await req.formData();

    const customerName = formData.get("customerName")?.toString() || "";
    const companyName = formData.get("companyName")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const location = formData.get("location")?.toString() || "";
    const serviceType = formData.get("serviceType")?.toString() || "";
    const productId = formData.get("productId")?.toString() || "";
    const quantity = formData.get("quantity")?.toString() || "1";
    const material = formData.get("material")?.toString() || "";
    const color = formData.get("color")?.toString() || "";
    const quality = formData.get("quality")?.toString() || "";
    const infill = formData.get("infill")?.toString() || "";
    const requiredDate = formData.get("requiredDate")?.toString() || "";
    const requirements = formData.get("requirements")?.toString() || "";
    const googleDriveUrl = formData.get("googleDriveUrl")?.toString() || "";

    // 3. Schema validation
    const parsed = quoteSubmissionSchema.safeParse({
      customerName,
      companyName,
      email,
      phone,
      location,
      serviceType,
      productId,
      quantity: Number(quantity),
      material,
      color,
      quality,
      infill,
      requiredDate,
      requirements,
      googleDriveUrl,
    });

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // 4. Validate Google Drive URL if present
    if (googleDriveUrl) {
      const driveCheck = validateGoogleDriveUrl(googleDriveUrl);
      if (!driveCheck.valid) {
        return NextResponse.json({ error: driveCheck.error }, { status: 400 });
      }
    }

    // 5. Process files
    const fileEntries = formData.getAll("files");
    const validFilesToUpload: Array<{
      buffer: Buffer;
      originalFilename: string;
      mimeType: string;
      extension: string;
    }> = [];

    if (fileEntries.length > MAX_FILES_PER_QUOTE) {
      return NextResponse.json(
        {
          error: `You cannot upload more than ${MAX_FILES_PER_QUOTE} files per quote. Please provide a Google Drive link for larger assemblies.`,
        },
        { status: 400 }
      );
    }

    for (const entry of fileEntries) {
      if (entry instanceof File && entry.size > 0) {
        const arrayBuffer = await entry.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const validation = validateUploadedFile(entry.name, buffer, entry.type);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error || `Invalid file ${entry.name}` },
            { status: 400 }
          );
        }

        validFilesToUpload.push({
          buffer,
          originalFilename: validation.sanitizedFilename || entry.name,
          mimeType: validation.detectedMime || entry.type,
          extension: validation.normalizedExtension || "stl",
        });
      }
    }

    // Ensure at least one file or Google Drive URL or explicit custom project description was provided
    if (validFilesToUpload.length === 0 && !googleDriveUrl && !requirements) {
      return NextResponse.json(
        {
          error: "Please upload at least one 3D/CAD file, provide a Google Drive link, or describe your project requirements.",
        },
        { status: 400 }
      );
    }

    // 6. Create quote record safely
    const { quote } = await createQuote(
      {
        customerName: parsed.data.customerName,
        companyName: parsed.data.companyName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        location: parsed.data.location,
        productId: parsed.data.productId,
        serviceType: parsed.data.serviceType,
        quantity: parsed.data.quantity,
        material: parsed.data.material,
        color: parsed.data.color,
        quality: parsed.data.quality,
        infill: parsed.data.infill,
        requiredDate: parsed.data.requiredDate,
        requirements: parsed.data.requirements || "",
        googleDriveUrl: parsed.data.googleDriveUrl,
        currency: "INR",
      },
      validFilesToUpload
    );

    return NextResponse.json(
      {
        success: true,
        reference: quote.publicReference,
        message: "Your quotation request has been submitted successfully.",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Quote submission error:", err);
    return NextResponse.json(
      {
        error: "Something went wrong while submitting your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
