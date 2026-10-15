export type SupplierCategory =
  | "Construction"
  | "Events"
  | "Printing"
  | "Transport"
  | "Security"
  | "Professional services"
  | "Digital services";

export interface SupplierReview {
  id: string;
  author: string;
  campaign: string;
  rating: number;
  text: string;
  date: string;
  verifiedEngagement: boolean;
}

export interface Supplier {
  slug: string;
  name: string;
  summary: string;
  category: SupplierCategory;
  location: string;
  serviceArea: string;
  verified: boolean;
  rating: number;
  completedJobs: number;
  responseTime: string;
  sponsored?: boolean;
  services: string[];
  reviews: SupplierReview[];
}

export const supplierCategories: SupplierCategory[] = [
  "Construction",
  "Events",
  "Printing",
  "Transport",
  "Security",
  "Professional services",
  "Digital services"
];

export const suppliers: Supplier[] = [
  {
    slug: "sisonke-build-projects",
    name: "Sisonke Build Projects",
    summary: "Community infrastructure, repairs and compliant small works delivered with milestone evidence.",
    category: "Construction",
    location: "Johannesburg, Gauteng",
    serviceArea: "Gauteng",
    verified: true,
    rating: 4.8,
    completedJobs: 18,
    responseTime: "Usually replies within 2 hours",
    sponsored: true,
    services: ["Building repairs", "Water installations", "Site supervision"],
    reviews: [
      { id: "sr-1", author: "Naledi M.", campaign: "Ward 12 clinic water tank", rating: 5, text: "Clear quote, reliable updates and excellent completion evidence.", date: "8 Oct 2026", verifiedEngagement: true },
      { id: "sr-2", author: "Thandi K.", campaign: "Braamfontein safe walkway", rating: 4, text: "The work was completed well and the team handled a scope change professionally.", date: "21 Sep 2026", verifiedEngagement: true }
    ]
  },
  {
    slug: "ubuntu-events-co",
    name: "Ubuntu Events Co.",
    summary: "Accessible community events, public meetings and campaign activations from planning to close-out.",
    category: "Events",
    location: "Cape Town, Western Cape",
    serviceArea: "Western Cape",
    verified: true,
    rating: 4.6,
    completedJobs: 11,
    responseTime: "Usually replies within 1 day",
    services: ["Venue coordination", "Audio visual", "Event staffing"],
    reviews: [
      { id: "ur-1", author: "Mandla P.", campaign: "District civic assembly", rating: 5, text: "Well organised and transparent about every line item.", date: "30 Sep 2026", verifiedEngagement: true }
    ]
  },
  {
    slug: "imbizo-printworks",
    name: "Imbizo Printworks",
    summary: "Short-run civic print, signage and multilingual campaign materials with proofing included.",
    category: "Printing",
    location: "Durban, KwaZulu-Natal",
    serviceArea: "Nationwide delivery",
    verified: true,
    rating: 4.9,
    completedJobs: 34,
    responseTime: "Usually replies within 4 hours",
    services: ["Posters", "Booklets", "Event signage"],
    reviews: [
      { id: "ir-1", author: "Ayanda N.", campaign: "School library rebuild", rating: 5, text: "Accurate, quick and especially careful with isiXhosa proofing.", date: "2 Oct 2026", verifiedEngagement: true }
    ]
  },
  {
    slug: "vula-transport-services",
    name: "Vula Transport Services",
    summary: "Insured local deliveries and passenger transport for verified public-interest projects.",
    category: "Transport",
    location: "Pretoria, Gauteng",
    serviceArea: "Gauteng and North West",
    verified: true,
    rating: 4.5,
    completedJobs: 22,
    responseTime: "Usually replies within 3 hours",
    services: ["Goods delivery", "Shuttle transport", "Route planning"],
    reviews: [
      { id: "vr-1", author: "Kagiso D.", campaign: "Soweto youth skills lab", rating: 4, text: "On time and all delivery documents were uploaded correctly.", date: "18 Sep 2026", verifiedEngagement: true }
    ]
  },
  {
    slug: "khusela-community-security",
    name: "Khusela Community Security",
    summary: "PSiRA-aligned event and site security with community liaison and incident reporting.",
    category: "Security",
    location: "Gqeberha, Eastern Cape",
    serviceArea: "Eastern Cape",
    verified: true,
    rating: 4.7,
    completedJobs: 15,
    responseTime: "Usually replies within 1 day",
    services: ["Event security", "Site guarding", "Risk planning"],
    reviews: []
  },
  {
    slug: "masibambane-advisory",
    name: "Masibambane Advisory",
    summary: "Governance, bookkeeping and compliance support for community organisations and campaign teams.",
    category: "Professional services",
    location: "Johannesburg, Gauteng",
    serviceArea: "Remote across South Africa",
    verified: true,
    rating: 4.9,
    completedJobs: 27,
    responseTime: "Usually replies within 4 hours",
    services: ["Bookkeeping", "Compliance packs", "Impact reporting"],
    reviews: [
      { id: "mr-1", author: "Lerato S.", campaign: "Women-led market cooperative", rating: 5, text: "Made our reporting simple and gave the committee a clear audit trail.", date: "12 Sep 2026", verifiedEngagement: true }
    ]
  },
  {
    slug: "africa-pixel-studio",
    name: "Africa Pixel Studio",
    summary: "Accessible digital design, websites and campaign communications for civic organisations.",
    category: "Digital services",
    location: "Soweto, Gauteng",
    serviceArea: "Remote across Africa",
    verified: true,
    rating: 4.6,
    completedJobs: 19,
    responseTime: "Usually replies within 2 hours",
    services: ["Accessible websites", "Digital campaigns", "Content design"],
    reviews: []
  }
];
