import { Product } from "@/types";

export const initialProducts: Product[] = [
  {
    id: "prod-fdm-large",
    slug: "large-format-industrial-fdm",
    name: "Industrial Large-Format FDM",
    category: "FDM",
    shortDescription: "High-volume Fused Deposition Modeling for large functional enclosures, jigs, and mechanical prototypes.",
    description: "Designed for continuous industrial manufacturing and oversized components. Features an enclosed build chamber, dual-gear direct drive extruder capable of reaching 300°C, and magnetic PEI textured beds for high dimensional repeatability on engineering thermoplastics.",
    technology: "FDM (Fused Deposition Modeling)",
    buildVolume: "300 × 300 × 400 mm",
    printSpeed: "80 – 250 mm/s",
    layerResolution: "100 – 300 microns",
    supportedMaterials: ["PLA+", "PETG", "ABS", "ASA", "TPU (95A)", "PC"],
    specifications: {
      "Technology": "Fused Deposition Modeling (FFF/FDM)",
      "Build Volume": "300 × 300 × 400 mm (11.8 × 11.8 × 15.7 in)",
      "Layer Resolution": "0.10 mm to 0.32 mm",
      "Nozzle Diameter": "0.4 mm default (0.6 mm / 0.8 mm available for high volume)",
      "Max Hotend Temp": "300°C",
      "Max Heated Bed Temp": "110°C",
      "Build Surface": "Flexible Textured & Smooth PEI Spring Steel",
      "Extruder Mechanism": "Dual-gear hardened direct drive",
      "Dimensional Tolerance": "±0.15 mm (dependent on geometry and material shrinkage)",
      "Positioning Precision": "X/Y: 0.0125 mm, Z: 0.0025 mm"
    },
    applications: [
      "Full-scale electronic enclosures and junction boxes",
      "Manufacturing jigs, assembly fixtures, and drilling guides",
      "Drone airframes and structural robotics brackets",
      "Automotive interior component mockups",
      "Functional concept verification models"
    ],
    images: [
      "/images/products/fdm-large-1.webp",
      "/images/products/fdm-large-2.webp"
    ],
    active: true,
    featured: true
  },
  {
    id: "prod-sla-resin",
    slug: "high-resolution-precision-resin",
    name: "High-Resolution MSLA / Resin Printer",
    category: "SLA",
    shortDescription: "Ultra-fine stereolithography printing for micro-fluidics, dental models, miniature parts, and smooth aesthetic components.",
    description: "Equipped with a 12K monochrome LCD masking screen offering 19 × 24 micron XY pixel resolution. Ideal for parts requiring imperceptible layer lines, tight-tolerance miniature assemblies, and master molds for casting.",
    technology: "MSLA (Masked Stereolithography / Resin)",
    buildVolume: "218 × 123 × 250 mm",
    printSpeed: "30 – 70 mm/hr",
    layerResolution: "20 – 50 microns",
    supportedMaterials: ["Standard Resin", "Tough Engineering Resin", "High-Temp Resin (180°C HDT)", "Clear Optical Resin"],
    specifications: {
      "Technology": "Masked Stereolithography (MSLA / LCD)",
      "Build Volume": "218 × 123 × 250 mm (8.6 × 4.8 × 9.8 in)",
      "Layer Resolution": "0.02 mm to 0.05 mm (20 to 50 microns)",
      "XY Pixel Size": "19 × 24 microns (12K Monochrome)",
      "Light Source": "COB UV Light Source (405 nm wavelength)",
      "Post-Processing Included": "Two-stage IPA ultrasonic wash and controlled 405nm UV chamber cure",
      "Dimensional Tolerance": "±0.08 mm on parts under 100 mm",
      "Surface Finish": "Smooth, matte or polished non-layered surface finish"
    },
    applications: [
      "Custom audio gear, earphone shells, and miniature connectors",
      "Visual prototypes requiring automotive-grade paint readiness",
      "Precision sensor mounts and optical component housings",
      "Master patterns for silicone mold polyurethane casting",
      "Micro-gears and fine mechanical clockwork components"
    ],
    images: [
      "/images/products/resin-precision-1.webp"
    ],
    active: true,
    featured: true
  },
  {
    id: "prod-fdm-corexy",
    slug: "high-speed-corexy-workhorse",
    name: "High-Speed CoreXY Precision Workhorse",
    category: "FDM",
    shortDescription: "Rapid turnaround manufacturing with active vibration compensation and high-temperature material handling.",
    description: "Built for speed without compromising dimensional accuracy. Features enclosed thermal chamber management, input-shaping resonance compensation, and automated first-layer calibration for consistent production runs.",
    technology: "CoreXY FDM",
    buildVolume: "256 × 256 × 256 mm",
    printSpeed: "Up to 350 mm/s",
    layerResolution: "80 – 280 microns",
    supportedMaterials: ["PLA", "PLA-CF", "PETG", "ABS", "ASA", "TPU"],
    specifications: {
      "Technology": "CoreXY Fused Deposition Modeling",
      "Build Volume": "256 × 256 × 256 mm",
      "Layer Resolution": "0.08 mm to 0.28 mm",
      "Max Acceleration": "Up to 20,000 mm/s²",
      "Chamber Temperature": "Passive enclosed heating up to 55°C",
      "Filament Sensor": "Optical runout and tangle detection",
      "Dimensional Tolerance": "±0.12 mm"
    },
    applications: [
      "Same-day and next-day engineering turnaround iterations",
      "Batch production of 10 – 200 plastic components",
      "Robotics chassis and custom bracket kits",
      "Educational project prototypes and sensor enclosures"
    ],
    images: [
      "/images/products/corexy-1.webp"
    ],
    active: true,
    featured: true
  },
  {
    id: "prod-composite-nylon",
    slug: "composite-carbon-fiber-nylon",
    name: "Continuous Carbon-Fiber & Nylon Composites",
    category: "FDM",
    shortDescription: "High-strength engineering grade printing using carbon-fiber reinforced nylon for end-use functional machinery parts.",
    description: "Utilizes abrasive-resistant hardened tool steel nozzles and enclosed high-heat filament dehydration. Produces parts that rival CNC machined aluminum in stiffness-to-weight ratio while retaining impact absorption.",
    technology: "Reinforced Composite FDM",
    buildVolume: "250 × 250 × 250 mm",
    printSpeed: "40 – 120 mm/s",
    layerResolution: "120 – 250 microns",
    supportedMaterials: ["PA12-CF (Nylon Carbon Fiber)", "PET-CF", "Polycarbonate-CF", "TPU-CF"],
    specifications: {
      "Technology": "Industrial Composite FFF",
      "Build Volume": "250 × 250 × 250 mm",
      "Nozzle": "0.4 mm & 0.6 mm Hardened Tool Steel",
      "Max Nozzle Temp": "320°C",
      "Continuous Filament Drying": "Active in-line desiccant & heated drybox feed",
      "Tensile Modulus": "Up to 8,900 MPa (with PA12-CF)",
      "Heat Deflection Temp (HDT)": "190°C at 0.45 MPa"
    },
    applications: [
      "End-use functional brackets subjected to mechanical load",
      "CNC machining replacement parts and robot end-effectors",
      "Under-the-hood automotive bracket prototypes",
      "Wear-resistant gears, chain guides, and motor mounts"
    ],
    images: [
      "/images/products/composite-nylon-1.webp"
    ],
    active: true,
    featured: false
  },
  {
    id: "serv-post-processing",
    slug: "post-processing-assembly",
    name: "Hardware Finishing & Threaded Insert Assembly",
    category: "SERVICE",
    shortDescription: "Post-print finishing including brass heat-set threaded inserts, support sanding, and solvent smoothing.",
    description: "We prepare 3D printed parts for real-world mechanical integration. Includes precision installation of M2, M2.5, M3, M4, M5, and M6 brass heat-set inserts, support scar removal, and vapor smoothing.",
    technology: "Mechanical Finishing & Assembly",
    buildVolume: "N/A",
    printSpeed: "N/A",
    layerResolution: "N/A",
    supportedMaterials: ["All thermoplastics and resins"],
    specifications: {
      "Threaded Inserts Supported": "M2, M2.5, M3, M4, M5, M6, M8 brass ultrasonic/thermal inserts",
      "Surface Treatments": "Mechanical sanding (120 to 1000 grit), bead blasting, chemical vapor smoothing",
      "Resin Post-Curing": "Wash in high-purity IPA followed by calibrated 405nm UV turntable cure",
      "Hardware Installation": "Screws, bearings, magnets, and captive nuts press-fit into CAD cavities"
    },
    applications: [
      "Enclosures requiring repeated screw fastening without thread wear",
      "Exhibition-grade visual appearance models",
      "Hermetically sealed or water-resistant outdoor enclosures"
    ],
    images: [
      "/images/products/assembly-service-1.webp"
    ],
    active: true,
    featured: false
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return initialProducts.find((p) => p.slug === slug);
}

export function getAllProducts(): Product[] {
  return initialProducts.filter((p) => p.active);
}
