import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Quote, QuoteFile, PricingConfig, Product, AuditLog, QuoteStatus } from "@/types";
import { initialProducts } from "@/data/products";
import { generateSecureStoragePath } from "@/lib/security/file-validation";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const UPLOAD_DIR = path.join(DATA_DIR, "local-uploads");

// Initial pricing records
const initialPricing: PricingConfig[] = [
  {
    id: "price-pla",
    material: "PLA+",
    materialRatePerKg: 1400,
    machineRatePerHour: 120,
    electricityRatePerHour: 15,
    labourRatePerHour: 200,
    postProcessingRate: 150,
    minimumCharge: 350,
    marginPercent: 25,
    active: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "price-petg",
    material: "PETG",
    materialRatePerKg: 1600,
    machineRatePerHour: 130,
    electricityRatePerHour: 18,
    labourRatePerHour: 200,
    postProcessingRate: 150,
    minimumCharge: 400,
    marginPercent: 25,
    active: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "price-abs",
    material: "ABS / ASA",
    materialRatePerKg: 1900,
    machineRatePerHour: 150,
    electricityRatePerHour: 22,
    labourRatePerHour: 250,
    postProcessingRate: 200,
    minimumCharge: 450,
    marginPercent: 30,
    active: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "price-tpu",
    material: "TPU 95A",
    materialRatePerKg: 2200,
    machineRatePerHour: 160,
    electricityRatePerHour: 18,
    labourRatePerHour: 250,
    postProcessingRate: 200,
    minimumCharge: 500,
    marginPercent: 30,
    active: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "price-resin",
    material: "Tough Resin",
    materialRatePerKg: 3800,
    machineRatePerHour: 280,
    electricityRatePerHour: 20,
    labourRatePerHour: 300,
    postProcessingRate: 350,
    minimumCharge: 750,
    marginPercent: 35,
    active: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "price-pacf",
    material: "PA12-CF (Carbon Fiber)",
    materialRatePerKg: 5500,
    machineRatePerHour: 350,
    electricityRatePerHour: 25,
    labourRatePerHour: 350,
    postProcessingRate: 400,
    minimumCharge: 950,
    marginPercent: 35,
    active: true,
    updatedAt: new Date().toISOString(),
  },
];

interface LocalDatabase {
  quotes: Quote[];
  products: Product[];
  pricing: PricingConfig[];
  auditLogs: AuditLog[];
}

function ensureLocalDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial: LocalDatabase = {
      quotes: [],
      products: initialProducts,
      pricing: initialPricing,
      auditLogs: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
  }
}

function readLocalDb(): LocalDatabase {
  ensureLocalDir();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      quotes: [],
      products: initialProducts,
      pricing: initialPricing,
      auditLogs: [],
    };
  }
}

function writeLocalDb(db: LocalDatabase) {
  ensureLocalDir();
  const tmpFile = DB_FILE + ".tmp";
  fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2), "utf-8");
  fs.renameSync(tmpFile, DB_FILE);
}

// Check if live Supabase service is configured
function getSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && serviceKey && !url.includes("your-project") && !serviceKey.includes("...")) {
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return null;
}

export function generatePublicReference(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `QT-${year}-${randomNum}`;
}

// ----------------------------------------------------------------------
// QUOTES
// ----------------------------------------------------------------------
export async function createQuote(
  quoteData: Omit<Quote, "id" | "publicReference" | "files" | "createdAt" | "updatedAt" | "status">,
  uploadedFiles: Array<{
    buffer: Buffer;
    originalFilename: string;
    mimeType: string;
    extension: string;
  }>
): Promise<{ quote: Quote; files: QuoteFile[] }> {
  const supabase = getSupabaseAdminClient();
  const quoteId = crypto.randomUUID();
  const publicRef = generatePublicReference();
  const now = new Date().toISOString();

  const savedFiles: QuoteFile[] = [];

  // Save files
  for (const file of uploadedFiles) {
    const fileId = crypto.randomUUID();
    const storagePath = generateSecureStoragePath(quoteId, file.extension);

    if (supabase) {
      const bucketName = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "quote-files";
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, file.buffer, {
          contentType: file.mimeType,
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase storage upload error:", uploadError);
        throw new Error("Failed to store uploaded file safely");
      }
    } else {
      // Local private storage
      const localQuoteDir = path.join(UPLOAD_DIR, quoteId);
      if (!fs.existsSync(localQuoteDir)) {
        fs.mkdirSync(localQuoteDir, { recursive: true });
      }
      const localFilePath = path.join(localQuoteDir, `${fileId}.${file.extension}`);
      fs.writeFileSync(localFilePath, file.buffer);
    }

    savedFiles.push({
      id: fileId,
      quoteId,
      storagePath,
      originalFilename: file.originalFilename,
      mimeType: file.mimeType,
      extension: file.extension,
      sizeBytes: file.buffer.length,
      createdAt: now,
    });
  }

  const newQuote: Quote = {
    ...quoteData,
    id: quoteId,
    publicReference: publicRef,
    status: "NEW",
    files: savedFiles,
    currency: quoteData.currency || "INR",
    createdAt: now,
    updatedAt: now,
  };

  if (supabase) {
    const { error: qError } = await supabase.from("quotes").insert({
      id: quoteId,
      public_reference: publicRef,
      customer_name: newQuote.customerName,
      company_name: newQuote.companyName,
      email: newQuote.email,
      phone: newQuote.phone,
      location: newQuote.location,
      product_id: newQuote.productId || null,
      service_type: newQuote.serviceType,
      quantity: newQuote.quantity,
      material: newQuote.material,
      color: newQuote.color,
      quality: newQuote.quality,
      infill: newQuote.infill,
      required_date: newQuote.requiredDate,
      requirements: newQuote.requirements,
      google_drive_url: newQuote.googleDriveUrl,
      status: "NEW",
      currency: newQuote.currency,
      created_at: now,
      updated_at: now,
    });

    if (qError) {
      console.error("Supabase insert quote error:", qError);
      throw new Error("Failed to persist quotation request");
    }

    for (const f of savedFiles) {
      await supabase.from("quote_files").insert({
        id: f.id,
        quote_id: quoteId,
        storage_path: f.storagePath,
        original_filename: f.originalFilename,
        mime_type: f.mimeType,
        extension: f.extension,
        size_bytes: f.sizeBytes,
        created_at: f.createdAt,
      });
    }
  } else {
    const db = readLocalDb();
    db.quotes.unshift(newQuote);
    writeLocalDb(db);
  }

  return { quote: newQuote, files: savedFiles };
}

export async function getQuotes(filterStatus?: QuoteStatus): Promise<Quote[]> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    let query = supabase
      .from("quotes")
      .select("*, quote_files(*)")
      .order("created_at", { ascending: false });

    if (filterStatus) {
      query = query.eq("status", filterStatus);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Supabase fetch quotes error:", error);
      throw new Error("Failed to load quotes");
    }

    return (data || []).map((q: any) => ({
      id: q.id,
      publicReference: q.public_reference,
      customerName: q.customer_name,
      companyName: q.company_name,
      email: q.email,
      phone: q.phone,
      location: q.location,
      productId: q.product_id,
      serviceType: q.service_type,
      quantity: q.quantity,
      material: q.material,
      color: q.color,
      quality: q.quality,
      infill: q.infill,
      requiredDate: q.required_date,
      requirements: q.requirements,
      googleDriveUrl: q.google_drive_url,
      status: q.status as QuoteStatus,
      estimatedPrice: q.estimated_price ? Number(q.estimated_price) : undefined,
      finalPrice: q.final_price ? Number(q.final_price) : undefined,
      currency: q.currency,
      adminNotes: q.admin_notes,
      files: (q.quote_files || []).map((f: any) => ({
        id: f.id,
        quoteId: f.quote_id,
        storagePath: f.storage_path,
        originalFilename: f.original_filename,
        mimeType: f.mime_type,
        extension: f.extension,
        sizeBytes: Number(f.size_bytes),
        createdAt: f.created_at,
      })),
      createdAt: q.created_at,
      updatedAt: q.updated_at,
    }));
  }

  const db = readLocalDb();
  if (filterStatus) {
    return db.quotes.filter((q) => q.status === filterStatus);
  }
  return db.quotes;
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("quotes")
      .select("*, quote_files(*)")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      publicReference: data.public_reference,
      customerName: data.customer_name,
      companyName: data.company_name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      productId: data.product_id,
      serviceType: data.service_type,
      quantity: data.quantity,
      material: data.material,
      color: data.color,
      quality: data.quality,
      infill: data.infill,
      requiredDate: data.required_date,
      requirements: data.requirements,
      googleDriveUrl: data.google_drive_url,
      status: data.status as QuoteStatus,
      estimatedPrice: data.estimated_price ? Number(data.estimated_price) : undefined,
      finalPrice: data.final_price ? Number(data.final_price) : undefined,
      currency: data.currency,
      adminNotes: data.admin_notes,
      files: (data.quote_files || []).map((f: any) => ({
        id: f.id,
        quoteId: f.quote_id,
        storagePath: f.storage_path,
        originalFilename: f.original_filename,
        mimeType: f.mime_type,
        extension: f.extension,
        sizeBytes: Number(f.size_bytes),
        createdAt: f.created_at,
      })),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  const db = readLocalDb();
  return db.quotes.find((q) => q.id === id) || null;
}

export async function updateQuoteStatus(
  id: string,
  update: {
    status: QuoteStatus;
    estimatedPrice?: number;
    finalPrice?: number;
    adminNotes?: string;
  }
): Promise<Quote | null> {
  const now = new Date().toISOString();
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("quotes")
      .update({
        status: update.status,
        estimated_price: update.estimatedPrice,
        final_price: update.finalPrice,
        admin_notes: update.adminNotes,
        updated_at: now,
      })
      .eq("id", id)
      .select("*, quote_files(*)")
      .single();

    if (error || !data) return null;
    return getQuoteById(id);
  }

  const db = readLocalDb();
  const index = db.quotes.findIndex((q) => q.id === id);
  if (index === -1) return null;

  db.quotes[index] = {
    ...db.quotes[index],
    status: update.status,
    estimatedPrice: update.estimatedPrice !== undefined ? update.estimatedPrice : db.quotes[index].estimatedPrice,
    finalPrice: update.finalPrice !== undefined ? update.finalPrice : db.quotes[index].finalPrice,
    adminNotes: update.adminNotes !== undefined ? update.adminNotes : db.quotes[index].adminNotes,
    updatedAt: now,
  };

  writeLocalDb(db);
  return db.quotes[index];
}

// ----------------------------------------------------------------------
// FILE ACCESS / SIGNED URLS
// ----------------------------------------------------------------------
export async function getFileSignedUrl(quoteId: string, fileId: string): Promise<{ url: string; filename: string } | null> {
  const quote = await getQuoteById(quoteId);
  if (!quote) return null;

  const file = quote.files.find((f) => f.id === fileId);
  if (!file) return null;

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const bucketName = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "quote-files";
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(file.storagePath, 900); // 15 minutes expiration

    if (error || !data) {
      console.error("Supabase signed url error:", error);
      return null;
    }

    return { url: data.signedUrl, filename: file.originalFilename };
  }

  // Fallback to authenticated download API endpoint
  return {
    url: `/api/admin/files/download?quoteId=${encodeURIComponent(quoteId)}&fileId=${encodeURIComponent(fileId)}`,
    filename: file.originalFilename,
  };
}

export function getLocalFileBuffer(quoteId: string, fileId: string): { buffer: Buffer; filename: string; mimeType: string } | null {
  const db = readLocalDb();
  const quote = db.quotes.find((q) => q.id === quoteId);
  if (!quote) return null;
  const file = quote.files.find((f) => f.id === fileId);
  if (!file) return null;

  const filePath = path.join(UPLOAD_DIR, quoteId, `${fileId}.${file.extension}`);
  if (!fs.existsSync(filePath)) return null;

  const buffer = fs.readFileSync(filePath);
  return {
    buffer,
    filename: file.originalFilename,
    mimeType: file.mimeType,
  };
}

// ----------------------------------------------------------------------
// PRICING CONFIG
// ----------------------------------------------------------------------
export async function getPricingConfigs(): Promise<PricingConfig[]> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase.from("pricing_config").select("*").order("material");
    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        material: d.material,
        materialRatePerKg: Number(d.material_rate_per_kg),
        machineRatePerHour: Number(d.machine_rate_per_hour),
        electricityRatePerHour: Number(d.electricity_rate_per_hour),
        labourRatePerHour: Number(d.labour_rate_per_hour),
        postProcessingRate: Number(d.post_processing_rate),
        minimumCharge: Number(d.minimum_charge),
        marginPercent: Number(d.margin_percent),
        active: d.active,
        updatedAt: d.updated_at,
      }));
    }
  }

  const db = readLocalDb();
  return db.pricing;
}

export async function updatePricingConfig(
  id: string,
  updates: Partial<Omit<PricingConfig, "id">>
): Promise<PricingConfig | null> {
  const now = new Date().toISOString();
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const payload: any = { updated_at: now };
    if (updates.materialRatePerKg !== undefined) payload.material_rate_per_kg = updates.materialRatePerKg;
    if (updates.machineRatePerHour !== undefined) payload.machine_rate_per_hour = updates.machineRatePerHour;
    if (updates.electricityRatePerHour !== undefined) payload.electricity_rate_per_hour = updates.electricityRatePerHour;
    if (updates.labourRatePerHour !== undefined) payload.labour_rate_per_hour = updates.labourRatePerHour;
    if (updates.postProcessingRate !== undefined) payload.post_processing_rate = updates.postProcessingRate;
    if (updates.minimumCharge !== undefined) payload.minimum_charge = updates.minimumCharge;
    if (updates.marginPercent !== undefined) payload.margin_percent = updates.marginPercent;

    const { data, error } = await supabase
      .from("pricing_config")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return null;
    return {
      id: data.id,
      material: data.material,
      materialRatePerKg: Number(data.material_rate_per_kg),
      machineRatePerHour: Number(data.machine_rate_per_hour),
      electricityRatePerHour: Number(data.electricity_rate_per_hour),
      labourRatePerHour: Number(data.labour_rate_per_hour),
      postProcessingRate: Number(data.post_processing_rate),
      minimumCharge: Number(data.minimum_charge),
      marginPercent: Number(data.margin_percent),
      active: data.active,
      updatedAt: data.updated_at,
    };
  }

  const db = readLocalDb();
  const idx = db.pricing.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  db.pricing[idx] = {
    ...db.pricing[idx],
    ...updates,
    updatedAt: now,
  };
  writeLocalDb(db);
  return db.pricing[idx];
}

// ----------------------------------------------------------------------
// PRODUCTS
// ----------------------------------------------------------------------
export async function getDbProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase.from("products").select("*").order("name");
    if (!error && data && data.length > 0) {
      return data.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category,
        shortDescription: p.short_description,
        description: p.description,
        technology: p.technology,
        buildVolume: p.build_volume,
        printSpeed: p.print_speed,
        layerResolution: p.layer_resolution,
        supportedMaterials: p.supported_materials,
        specifications: p.specifications,
        applications: p.applications,
        images: p.images,
        brochurePath: p.brochure_path,
        active: p.active,
        featured: p.featured,
      }));
    }
  }

  const db = readLocalDb();
  return db.products;
}

export async function updateDbProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = readLocalDb();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  db.products[idx] = {
    ...db.products[idx],
    ...updates,
  };
  writeLocalDb(db);
  return db.products[idx];
}

// ----------------------------------------------------------------------
// AUDIT LOGS
// ----------------------------------------------------------------------
export async function logAuditEvent(
  adminEmail: string,
  action: string,
  resourceType: string,
  resourceId: string,
  metadata?: Record<string, any>
): Promise<void> {
  const log: AuditLog = {
    id: crypto.randomUUID(),
    adminEmail,
    action,
    resourceType,
    resourceId,
    metadata,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    await supabase.from("audit_logs").insert({
      id: log.id,
      admin_email: log.adminEmail,
      action: log.action,
      resource_type: log.resourceType,
      resource_id: log.resourceId,
      metadata: log.metadata,
      created_at: log.createdAt,
    });
    return;
  }

  const db = readLocalDb();
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  writeLocalDb(db);
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        adminEmail: d.admin_email,
        action: d.action,
        resourceType: d.resource_type,
        resourceId: d.resource_id,
        metadata: d.metadata,
        createdAt: d.created_at,
      }));
    }
  }

  const db = readLocalDb();
  return db.auditLogs;
}
