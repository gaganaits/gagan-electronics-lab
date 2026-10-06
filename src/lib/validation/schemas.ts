import { z } from "zod";

export const googleDriveRegex = /^https:\/\/(drive\.google\.com|docs\.google\.com)\/(file\/d\/|drive\/folders\/|open\?|document\/d\/|spreadsheets\/d\/)[a-zA-Z0-9_\-\/?=&]+$/;

export const quoteSubmissionSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  companyName: z
    .string()
    .trim()
    .max(100, "Company name must be under 100 characters")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(120, "Email must be under 120 characters"),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 digits")
    .max(25, "Phone number must be under 25 digits"),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be under 100 characters"),
  serviceType: z
    .string()
    .trim()
    .min(1, "Please select a service or technology"),
  productId: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  quantity: z
    .coerce
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(10000, "For orders over 10,000 units please contact our enterprise team directly"),
  material: z
    .string()
    .trim()
    .min(1, "Please select a material preference"),
  color: z
    .string()
    .trim()
    .min(1, "Please specify a color preference"),
  quality: z
    .string()
    .trim()
    .min(1, "Please select a layer height or quality grade"),
  infill: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  requiredDate: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  requirements: z
    .string()
    .trim()
    .max(2500, "Requirements text must be under 2,500 characters")
    .optional()
    .or(z.literal("")),
  googleDriveUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val || val === "") return true;
      try {
        const parsed = new URL(val);
        const host = parsed.hostname.toLowerCase();
        return host === "drive.google.com" || host === "docs.google.com";
      } catch {
        return false;
      }
    }, {
      message: "Google Drive link must be a valid URL on drive.google.com or docs.google.com",
    }),
});

export const quoteStatusUpdateSchema = z.object({
  status: z.enum([
    "NEW",
    "UNDER_REVIEW",
    "QUOTE_SENT",
    "ACCEPTED",
    "REJECTED",
    "COMPLETED",
    "ARCHIVED",
  ]),
  estimatedPrice: z.number().nonnegative().optional(),
  finalPrice: z.number().nonnegative().optional(),
  currency: z.string().default("INR"),
  adminNotes: z.string().max(3000).optional(),
});

export const pricingConfigSchema = z.object({
  material: z.string().min(1),
  materialRatePerKg: z.number().nonnegative("Material rate cannot be negative"),
  machineRatePerHour: z.number().nonnegative("Machine rate cannot be negative"),
  electricityRatePerHour: z.number().nonnegative("Electricity rate cannot be negative"),
  labourRatePerHour: z.number().nonnegative("Labour rate cannot be negative"),
  postProcessingRate: z.number().nonnegative("Post-processing rate cannot be negative"),
  minimumCharge: z.number().nonnegative("Minimum charge cannot be negative"),
  marginPercent: z
    .number()
    .min(0, "Margin cannot be negative")
    .max(100, "Margin cannot exceed 100%"),
});

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: z.string().trim().max(25).optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(3000),
});
