import { Quote } from "@/types";

export const DEFAULT_DEMO_QUOTES: Quote[] = [
  {
    id: "demo-q1",
    publicReference: "QT-2026-782109",
    customerName: "Siddharth Rao",
    companyName: "Zenith Mechatronics",
    email: "siddharth@zenith-mechatronics.in",
    phone: "+91 98451 22310",
    location: "Peenya Industrial Area, Bengaluru, Karnataka",
    serviceType: "FDM 3D Printing",
    productId: "large-format-industrial-fdm",
    quantity: 6,
    material: "PETG",
    color: "Black",
    quality: "0.20mm Standard Mechanical",
    infill: "40% Grid / Honeycomb",
    requirements: "Need high layer adhesion for robotic sensor brackets. Parts will be exposed to indoor industrial conditions.",
    googleDriveUrl: "https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ?usp=sharing",
    currency: "INR",
    files: [
      {
        id: "f-1",
        quoteId: "demo-q1",
        originalFilename: "sensor_bracket_v3.stl",
        storagePath: "demo/sensor_bracket_v3.stl",
        sizeBytes: 4294967,
        mimeType: "model/stl",
        extension: "stl",
        createdAt: new Date().toISOString(),
      },
    ],
    status: "UNDER_REVIEW",
    estimatedPrice: 3850,
    adminNotes: "Wall count increased to 4 perimeters for mechanical stiffness. Slicing estimate: 14 hrs print time.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },
  {
    id: "demo-q2",
    publicReference: "QT-2026-441892",
    customerName: "Dr. Ananya Sharma",
    companyName: "BioPrint Prosthetics",
    email: "ananya.sharma@bioprint.org",
    phone: "+91 94480 55123",
    location: "HSR Layout, Bengaluru, Karnataka",
    serviceType: "SLA / Resin 3D Printing",
    productId: "engineering-resin-sla",
    quantity: 2,
    material: "Engineering Tough Resin",
    color: "Mechanical Grey",
    quality: "0.05mm Ultra Fine",
    requirements: "Tough resin biocompatible skin-contact test parts. Critical tolerance of ±0.1mm on mounting pins.",
    currency: "INR",
    files: [
      {
        id: "f-2",
        quoteId: "demo-q2",
        originalFilename: "prosthetic_knuckle_rev2.stl",
        storagePath: "demo/prosthetic_knuckle_rev2.stl",
        sizeBytes: 8120300,
        mimeType: "model/stl",
        extension: "stl",
        createdAt: new Date().toISOString(),
      },
    ],
    status: "QUOTE_SENT",
    estimatedPrice: 4200,
    finalPrice: 4500,
    adminNotes: "Ultrasonic cleaned in IPA for 12 mins and UV cured at 60°C for 30 mins.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
  },
  {
    id: "demo-q3",
    publicReference: "QT-2026-119340",
    customerName: "Vikramaditya Nair",
    companyName: "Aerodyne Flight Labs",
    email: "vikram@aerodyne-labs.com",
    phone: "+91 99002 88471",
    location: "Electronic City Phase 1, Bengaluru",
    serviceType: "Industrial Rapid Prototyping",
    productId: "carbon-fiber-nylon-fdm",
    quantity: 12,
    material: "PA12-CF (Carbon Fiber)",
    color: "Black",
    quality: "0.15mm Fine",
    infill: "60% Gyroid",
    requirements: "UAV motor mount arm test batch. Must withstand 65°C motor heat and vibration.",
    currency: "INR",
    files: [],
    googleDriveUrl: "https://drive.google.com/drive/folders/1xyz_uav_aerodyne_parts",
    status: "ACCEPTED",
    estimatedPrice: 16800,
    finalPrice: 17200,
    adminNotes: "Annealed in temperature-controlled oven for 6 hours post print.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
  },
];

export function getClientDemoQuotes(): Quote[] {
  if (typeof window === "undefined") {
    return DEFAULT_DEMO_QUOTES;
  }
  try {
    const raw = localStorage.getItem("gel_quotes");
    if (!raw) return DEFAULT_DEMO_QUOTES;
    const list: Quote[] = JSON.parse(raw);
    const existingIds = new Set(list.map((q) => q.id));
    const merged = [...list, ...DEFAULT_DEMO_QUOTES.filter((q) => !existingIds.has(q.id))];
    return merged;
  } catch {
    return DEFAULT_DEMO_QUOTES;
  }
}
