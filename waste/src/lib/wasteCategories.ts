import { Leaf, Recycle, Trash2, Smartphone, Skull, Stethoscope, HardHat, LucideIcon } from "lucide-react";

export type WasteCategory = 
  | "organic"
  | "recyclable"
  | "non-recyclable"
  | "e-waste"
  | "hazardous"
  | "medical"
  | "construction";

export interface WasteCategoryInfo {
  id: WasteCategory;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  requiresReport: boolean;
  disposalInstructions: string[];
  recyclingOptions: string[];
  tips: string[];
}

export const wasteCategories: Record<WasteCategory, WasteCategoryInfo> = {
  organic: {
    id: "organic",
    name: "Organic Waste",
    description: "Biodegradable waste from plants and animals",
    icon: Leaf,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    borderColor: "border-chart-1",
    requiresReport: false,
    disposalInstructions: [
      "Separate from other waste types",
      "Use green/brown bins designated for organic waste",
      "Can be composted at home or community centers",
      "Avoid mixing with plastic bags"
    ],
    recyclingOptions: [
      "Home composting",
      "Community composting programs",
      "Biogas production facilities",
      "Municipal green waste collection"
    ],
    tips: [
      "Keep a small compost bin in your kitchen",
      "Layer green and brown materials for best composting",
      "Avoid meat and dairy in home compost"
    ]
  },
  recyclable: {
    id: "recyclable",
    name: "Recyclable",
    description: "Materials that can be processed and reused",
    icon: Recycle,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    borderColor: "border-chart-2",
    requiresReport: false,
    disposalInstructions: [
      "Clean containers before recycling",
      "Remove caps and labels when possible",
      "Flatten cardboard boxes",
      "Use blue recycling bins"
    ],
    recyclingOptions: [
      "Curbside recycling pickup",
      "Drop-off recycling centers",
      "Bottle deposit programs",
      "Scrap metal recyclers"
    ],
    tips: [
      "Check local guidelines for accepted materials",
      "Rinse food containers to prevent contamination",
      "Avoid 'wish-cycling' - when in doubt, find out"
    ]
  },
  "non-recyclable": {
    id: "non-recyclable",
    name: "Non-Recyclable",
    description: "General waste that cannot be recycled",
    icon: Trash2,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
    borderColor: "border-chart-5",
    requiresReport: false,
    disposalInstructions: [
      "Place in general waste/black bin",
      "Ensure waste is bagged properly",
      "Do not mix with recyclables",
      "Check if any components can be recycled"
    ],
    recyclingOptions: [
      "Energy-from-waste facilities",
      "Sanitary landfill disposal",
      "Some items may have specialty recyclers"
    ],
    tips: [
      "Try to reduce non-recyclable purchases",
      "Look for recyclable alternatives",
      "Consider product lifecycle before buying"
    ]
  },
  "e-waste": {
    id: "e-waste",
    name: "E-Waste",
    description: "Electronic devices and components",
    icon: Smartphone,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    borderColor: "border-chart-4",
    requiresReport: false,
    disposalInstructions: [
      "Never dispose in regular trash",
      "Remove batteries if possible",
      "Delete personal data from devices",
      "Take to certified e-waste collection points"
    ],
    recyclingOptions: [
      "Manufacturer take-back programs",
      "Certified e-waste recyclers",
      "Retail store drop-off programs",
      "Municipal e-waste collection events"
    ],
    tips: [
      "Consider donating working electronics",
      "Many retailers offer trade-in programs",
      "E-waste contains valuable recoverable materials"
    ]
  },
  hazardous: {
    id: "hazardous",
    name: "Hazardous Waste",
    description: "Toxic, flammable, or chemically dangerous materials",
    icon: Skull,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive",
    requiresReport: true,
    disposalInstructions: [
      "DO NOT dispose in regular trash",
      "Keep in original containers when possible",
      "Store safely away from heat and children",
      "Contact local authorities for pickup"
    ],
    recyclingOptions: [
      "Household hazardous waste facilities",
      "Municipal collection events",
      "Authorized disposal contractors"
    ],
    tips: [
      "Never pour chemicals down drains",
      "Keep materials in ventilated areas",
      "Wear protective gear when handling"
    ]
  },
  medical: {
    id: "medical",
    name: "Medical Waste",
    description: "Healthcare-related waste including sharps and biohazards",
    icon: Stethoscope,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive",
    requiresReport: true,
    disposalInstructions: [
      "Use approved sharps containers",
      "Seal all biohazard bags properly",
      "Never flush medications",
      "Request professional pickup"
    ],
    recyclingOptions: [
      "Hospital take-back programs",
      "Pharmacy disposal programs",
      "Medical waste disposal services"
    ],
    tips: [
      "FDA-cleared sharps containers are safest",
      "Many pharmacies accept unused medications",
      "Never recap needles - use sharps container"
    ]
  },
  construction: {
    id: "construction",
    name: "Construction Waste",
    description: "Building materials, debris, and demolition waste",
    icon: HardHat,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary",
    requiresReport: true,
    disposalInstructions: [
      "Separate materials by type",
      "Large quantities require special pickup",
      "Some materials may contain asbestos",
      "Contact municipal construction waste services"
    ],
    recyclingOptions: [
      "Construction material recyclers",
      "Concrete and aggregate recycling",
      "Metal scrap recyclers",
      "Wood waste processors"
    ],
    tips: [
      "Many materials can be reused or donated",
      "Habitat for Humanity accepts building materials",
      "Sort materials on-site for easier recycling"
    ]
  }
};
