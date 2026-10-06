export interface MaterialInfo {
  id: string;
  name: string;
  category: "Thermoplastic" | "Resin" | "Composite";
  tensileStrength: string;
  heatDeflectionTemp: string;
  flexibility: string;
  impactResistance: string;
  commonColors: string[];
  bestFor: string;
  description: string;
}

export const materialsList: MaterialInfo[] = [
  {
    id: "pla-plus",
    name: "PLA+ (High-Impact Polylactic Acid)",
    category: "Thermoplastic",
    tensileStrength: "45 – 55 MPa",
    heatDeflectionTemp: "55°C",
    flexibility: "Low (Rigid)",
    impactResistance: "Moderate",
    commonColors: ["Black", "White", "Grey", "Orange", "Signal Blue", "Red"],
    bestFor: "Dimensionally accurate prototypes, display models, fit-check fixtures, non-heated electronic cases.",
    description: "Our default material for standard prototyping. Offers minimal warping, sharp corner definition, and smooth surface aesthetics."
  },
  {
    id: "petg",
    name: "PETG (Polyethylene Terephthalate Glycol)",
    category: "Thermoplastic",
    tensileStrength: "50 – 58 MPa",
    heatDeflectionTemp: "75°C",
    flexibility: "Moderate (Ductile)",
    impactResistance: "High",
    commonColors: ["Black", "White", "Translucent Clear", "Grey", "Olive Green"],
    bestFor: "Outdoor brackets, water-resistant enclosures, mechanical clips, chemical-exposed containers.",
    description: "Combines the ease of printing with UV resistance, moisture resistance, and higher ductility than PLA."
  },
  {
    id: "abs-asa",
    name: "ABS / ASA (Engineering Grade)",
    category: "Thermoplastic",
    tensileStrength: "40 – 48 MPa",
    heatDeflectionTemp: "95°C",
    flexibility: "Moderate",
    impactResistance: "High",
    commonColors: ["Black", "Grey", "White"],
    bestFor: "Automotive engine-bay adjacent parts, outdoor signage, components requiring acetone smoothing or high heat resistance.",
    description: "Printed inside our sealed heated chamber to prevent layer separation. ASA provides outstanding weather and UV stability."
  },
  {
    id: "tpu-95a",
    name: "TPU 95A (Thermoplastic Polyurethane)",
    category: "Thermoplastic",
    tensileStrength: "30 – 35 MPa",
    heatDeflectionTemp: "60°C",
    flexibility: "High (Elastomeric, Shore 95A)",
    impactResistance: "Very High (Vibration Dampening)",
    commonColors: ["Black", "Translucent Red", "Blue"],
    bestFor: "Gaskets, cable grommets, drone bumper guards, vibration dampening feet, flexible protective sleeves.",
    description: "Wear-resistant rubber-like polymer capable of absorbing repeated shock and impact without permanent deformation."
  },
  {
    id: "tough-resin",
    name: "Engineering Tough Resin (MSLA)",
    category: "Resin",
    tensileStrength: "55 – 65 MPa",
    heatDeflectionTemp: "65°C",
    flexibility: "Moderate (Elongation at break ~15%)",
    impactResistance: "High",
    commonColors: ["Onyx Black", "Grey", "Clear"],
    bestFor: "Ultra-high precision snap-fits, micro-fluidic channels, wearable device enclosures, fine detail masters.",
    description: "Cured with 405nm UV light. Gives isotropic mechanical strength with no visible layer ridges across all axes."
  },
  {
    id: "pa-cf",
    name: "PA12-CF (Nylon Carbon Fiber Composite)",
    category: "Composite",
    tensileStrength: "110 – 140 MPa",
    heatDeflectionTemp: "190°C (at 0.45 MPa)",
    flexibility: "Extremely Rigid (High Modulus)",
    impactResistance: "High",
    commonColors: ["Matte Charcoal Black"],
    bestFor: "High-stress drone arms, replacement automotive linkages, CNC machine fixtures, load-bearing robotics.",
    description: "Continuous chopped carbon fiber embedded in polyamide matrix. Delivers metal-replacement stiffness and exceptional heat resistance."
  }
];
