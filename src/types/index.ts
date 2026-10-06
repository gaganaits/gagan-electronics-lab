export type QuoteStatus =
  | "NEW"
  | "UNDER_REVIEW"
  | "QUOTE_SENT"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED"
  | "ARCHIVED";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "FDM" | "SLA" | "SLS" | "SERVICE";
  shortDescription: string;
  description: string;
  technology: string;
  buildVolume: string; // e.g. "300 × 300 × 400 mm"
  printSpeed: string; // e.g. "Up to 250 mm/s"
  layerResolution: string; // e.g. "50 – 300 microns"
  supportedMaterials: string[];
  specifications: Record<string, string>;
  applications: string[];
  images: string[];
  brochurePath?: string;
  active: boolean;
  featured?: boolean;
}

export interface QuoteFile {
  id: string;
  quoteId: string;
  storagePath: string;
  originalFilename: string;
  mimeType: string;
  extension: string;
  sizeBytes: number;
  createdAt: string;
}

export interface Quote {
  id: string;
  publicReference: string; // e.g. "QT-2026-081492"
  customerName: string;
  companyName?: string;
  email: string;
  phone: string;
  location: string;
  productId?: string;
  serviceType: string;
  quantity: number;
  material: string;
  color: string;
  quality: string;
  infill?: string;
  requiredDate?: string;
  requirements: string;
  googleDriveUrl?: string;
  status: QuoteStatus;
  estimatedPrice?: number;
  finalPrice?: number;
  currency: string;
  files: QuoteFile[];
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

export interface PricingConfig {
  id: string;
  material: string;
  materialRatePerKg: number; // in INR ₹
  machineRatePerHour: number; // in INR ₹
  electricityRatePerHour: number; // in INR ₹
  labourRatePerHour: number; // in INR ₹
  postProcessingRate: number; // in INR ₹
  minimumCharge: number; // in INR ₹
  marginPercent: number; // percentage (e.g. 25%)
  active: boolean;
  updatedAt: string;
}

export interface AdminProfile {
  userId: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF";
  active: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, any>;
  createdAt: string;
}
