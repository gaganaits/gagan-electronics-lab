export interface ApplicationItem {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  recommendedMaterials: string[];
  recommendedTechnology: string;
  typicalTolerances: string;
  features: string[];
}

export const applicationsList: ApplicationItem[] = [
  {
    id: "electronic-enclosures",
    title: "Electronic Enclosures & PCB Housings",
    category: "Electronics Hardware",
    shortDescription: "Custom enclosures tailored to PCB dimensions, connector cutouts, and cable strain reliefs.",
    longDescription: "From compact sensor housings to multi-board IoT gateways. We incorporate snap-fit lids, internal PCB standoffs, light pipes, and M2-M4 brass threaded heat-set inserts for secure repeat servicing.",
    recommendedMaterials: ["PLA+", "PETG", "ABS", "Tough Resin"],
    recommendedTechnology: "CoreXY FDM or High-Res MSLA Resin",
    typicalTolerances: "±0.12 mm for tight PCB fitment",
    features: [
      "Custom connector cutouts (USB-C, RJ45, DB9, Terminal blocks)",
      "Brass heat-set insert compatibility for long-term thread durability",
      "Internal mounting bosses sized for self-tapping or M2.5/M3 screws",
      "Ventilation louvers and IP-rated gasket groove geometry"
    ]
  },
  {
    id: "robotics-and-drones",
    title: "Robotic Mechanisms & Drone Frames",
    category: "Robotics & Automation",
    shortDescription: "Lightweight, stiff structural arms, motor brackets, and sensor mounts engineered for dynamic loads.",
    longDescription: "Robotics projects demand stiffness without unnecessary weight. We produce motor mountings, servo horns, gripper fingers, camera gimbals, and drone arm assemblies optimized for strength-to-weight ratios.",
    recommendedMaterials: ["PA12-CF (Carbon Fiber Nylon)", "PETG", "TPU 95A"],
    recommendedTechnology: "Industrial Composite FDM",
    typicalTolerances: "±0.15 mm",
    features: [
      "Lightweight infill geometries (Gyroid, 3D Honeycomb) for directional rigidity",
      "Vibration-absorbing TPU motor pads and bumper feet",
      "High stiffness PA-CF arms with high heat and chemical resistance"
    ]
  },
  {
    id: "custom-jigs-fixtures",
    title: "Assembly Jigs & Manufacturing Fixtures",
    category: "Industrial Tooling",
    shortDescription: "Custom tooling, inspection nests, and assembly fixtures built to assist low-to-mid volume manufacturing.",
    longDescription: "Speed up your assembly line and reduce human error with custom alignment jigs, wire harnessing guides, drilling templates, and vacuum nest holders manufactured directly from your CAD files.",
    recommendedMaterials: ["PETG", "ABS", "PA12-CF"],
    recommendedTechnology: "Large-Format FDM",
    typicalTolerances: "±0.15 mm",
    features: [
      "Ergonomic hand tools with textured non-slip grips",
      "Alignment nests matching the exact contours of client parts",
      "Wear-resistant guide surfaces with embedded hardened bushings"
    ]
  },
  {
    id: "functional-prototyping",
    title: "Functional Engineering Prototypes",
    category: "Product Development",
    shortDescription: "Rapid verification of mechanical fit, ergonomics, kinematics, and assembly clearance before tooling.",
    longDescription: "Verify your ideas before committing to expensive injection molds or CNC tooling. Iterate within 24 to 48 hours to validate physical dimensions, moving linkages, snap joints, and ergonomics.",
    recommendedMaterials: ["PLA+", "PETG", "Tough Resin"],
    recommendedTechnology: "CoreXY Precision FDM & MSLA Resin",
    typicalTolerances: "±0.10 mm to ±0.15 mm",
    features: [
      "Fast 24–48 hour turnaround on urgent iterations",
      "Kinematic linkage testing with moving joints printed in place or assembled",
      "Clear visual comparison between design iterations"
    ]
  },
  {
    id: "replacement-parts",
    title: "End-Use Replacement & Custom Spare Parts",
    category: "Maintenance & Repair",
    shortDescription: "Reproduce broken gears, discontinued knobs, legacy brackets, and custom machinery components.",
    longDescription: "Obsolete or broken parts no longer have to ground machinery or equipment. Submit a 3D scan, CAD file, or dimensioned drawing of broken components to receive functional, wear-resistant replacements.",
    recommendedMaterials: ["PETG", "ABS", "PA12-CF", "TPU"],
    recommendedTechnology: "FDM / Composite FDM",
    typicalTolerances: "±0.12 mm",
    features: [
      "Reverse-engineering CAD verification available on request",
      "Self-lubricating nylon composites for sliding and gear wear",
      "Single-piece production without minimum batch requirements"
    ]
  }
];
