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

export interface SupplierProject {
  id: string;
  title: string;
  campaignSlug: string;
  campaign: string;
  summary: string;
  location: string;
  completedAt: string;
  image?: string;
  imageAlt?: string;
}

export interface Supplier {
  slug: string;
  name: string;
  summary: string;
  description: string;
  email: string;
  category: SupplierCategory;
  location: string;
  serviceArea: string;
  verified: boolean;
  rating: number;
  completedJobs: number;
  responseTime: string;
  sponsored?: boolean;
  services: string[];
  previousProjects: SupplierProject[];
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
    description: "Sisonke delivers community-scale construction, repairs and water infrastructure. Its CitizenX work record includes itemised quotations, safety checks, milestone photographs and signed completion evidence.",
    email: "projects@sisonkebuild.demo",
    category: "Construction",
    location: "Johannesburg, Gauteng",
    serviceArea: "Gauteng",
    verified: true,
    rating: 4.8,
    completedJobs: 18,
    responseTime: "Usually replies within 2 hours",
    sponsored: true,
    services: ["Building repairs", "Water installations", "Site supervision"],
    previousProjects: [
      { id: "sp-1", title: "Clinic water storage installation", campaignSlug: "ward-12-clinic-water-tank", campaign: "Ward 12 clinic water tank", summary: "Prepared the tank base, completed the installation and supplied photographed pressure-test evidence.", location: "Johannesburg, Gauteng", completedAt: "8 Oct 2026", image: "/images/campaigns/clinic-water-tank.jpg", imageAlt: "Technicians inspect a completed water tank installation outside a clinic." },
      { id: "sp-2", title: "Flood hub secure storage", campaignSlug: "delft-flood-resilience-hub", campaign: "Delft flood resilience hub", summary: "Installed weatherproof storage and safety signage for a community-managed response point.", location: "Delft, Western Cape", completedAt: "24 Sep 2026", image: "/images/campaigns/flood-resilience-hub.jpg", imageAlt: "Volunteers stand beside completed storage at a community flood response hub." }
    ],
    reviews: [
      { id: "sr-1", author: "Naledi M.", campaign: "Ward 12 clinic water tank", rating: 5, text: "Clear quote, reliable updates and excellent completion evidence.", date: "8 Oct 2026", verifiedEngagement: true },
      { id: "sr-2", author: "Thandi K.", campaign: "Braamfontein safe walkway", rating: 4, text: "The work was completed well and the team handled a scope change professionally.", date: "21 Sep 2026", verifiedEngagement: true }
    ]
  },
  {
    slug: "ubuntu-events-co",
    name: "Ubuntu Events Co.",
    summary: "Accessible community events, public meetings and campaign activations from planning to close-out.",
    description: "Ubuntu Events coordinates accessible civic meetings and campaign activations, including venue planning, audio visual support, staffing and close-out records.",
    email: "hello@ubuntuevents.demo",
    category: "Events",
    location: "Cape Town, Western Cape",
    serviceArea: "Western Cape",
    verified: true,
    rating: 4.6,
    completedJobs: 11,
    responseTime: "Usually replies within 1 day",
    services: ["Venue coordination", "Audio visual", "Event staffing"],
    previousProjects: [
      { id: "up-1", title: "Accessible ward assembly launch", campaignSlug: "accessible-ward-assemblies", campaign: "Accessible ward assembly series", summary: "Coordinated the first accessible assembly, including venue access, sound and participant support.", location: "Ekurhuleni, Gauteng", completedAt: "30 Sep 2026", image: "/images/campaigns/accessible-ward-meetings.jpg", imageAlt: "Residents participate in an accessible community meeting." }
    ],
    reviews: [
      { id: "ur-1", author: "Mandla P.", campaign: "District civic assembly", rating: 5, text: "Well organised and transparent about every line item.", date: "30 Sep 2026", verifiedEngagement: true }
    ]
  },
  {
    slug: "imbizo-printworks",
    name: "Imbizo Printworks",
    summary: "Short-run civic print, signage and multilingual campaign materials with proofing included.",
    description: "Imbizo produces short-run public-interest print and signage with multilingual proofing, documented approvals and delivery confirmation.",
    email: "orders@imbizoprint.demo",
    category: "Printing",
    location: "Durban, KwaZulu-Natal",
    serviceArea: "Nationwide delivery",
    verified: true,
    rating: 4.9,
    completedJobs: 34,
    responseTime: "Usually replies within 4 hours",
    services: ["Posters", "Booklets", "Event signage"],
    previousProjects: [
      { id: "ip-1", title: "Multilingual school reading packs", campaignSlug: "school-library-rebuild", campaign: "School library rebuild", summary: "Printed and delivered reading packs in English and isiXhosa after teacher proof approval.", location: "Mthatha, Eastern Cape", completedAt: "2 Oct 2026", image: "/images/campaigns/school-library.jpg", imageAlt: "Books and printed reading packs arranged in a restored school library." }
    ],
    reviews: [
      { id: "ir-1", author: "Ayanda N.", campaign: "School library rebuild", rating: 5, text: "Accurate, quick and especially careful with isiXhosa proofing.", date: "2 Oct 2026", verifiedEngagement: true }
    ]
  },
  {
    slug: "vula-transport-services",
    name: "Vula Transport Services",
    summary: "Insured local deliveries and passenger transport for verified public-interest projects.",
    description: "Vula provides insured delivery and passenger transport for civic projects, supported by route plans, delivery notes and driver records.",
    email: "dispatch@vulatransport.demo",
    category: "Transport",
    location: "Pretoria, Gauteng",
    serviceArea: "Gauteng and North West",
    verified: true,
    rating: 4.5,
    completedJobs: 22,
    responseTime: "Usually replies within 3 hours",
    services: ["Goods delivery", "Shuttle transport", "Route planning"],
    previousProjects: [
      { id: "vp-1", title: "Skills lab device delivery", campaignSlug: "soweto-youth-skills-lab", campaign: "Soweto youth skills lab", summary: "Delivered refurbished devices with a signed handover record and serial-number schedule.", location: "Soweto, Gauteng", completedAt: "18 Sep 2026", image: "/images/campaigns/youth-skills-lab.jpg", imageAlt: "Learners use delivered laptops in a community skills lab." }
    ],
    reviews: [
      { id: "vr-1", author: "Kagiso D.", campaign: "Soweto youth skills lab", rating: 4, text: "On time and all delivery documents were uploaded correctly.", date: "18 Sep 2026", verifiedEngagement: true }
    ]
  },
  {
    slug: "khusela-community-security",
    name: "Khusela Community Security",
    summary: "PSiRA-aligned event and site security with community liaison and incident reporting.",
    description: "Khusela supports civic events and project sites with risk planning, community liaison, incident reporting and documented shift coverage.",
    email: "operations@khuselasecurity.demo",
    category: "Security",
    location: "Gqeberha, Eastern Cape",
    serviceArea: "Eastern Cape",
    verified: true,
    rating: 4.7,
    completedJobs: 15,
    responseTime: "Usually replies within 1 day",
    services: ["Event security", "Site guarding", "Risk planning"],
    previousProjects: [
      { id: "kp-1", title: "Community assembly safety plan", campaignSlug: "accessible-ward-assemblies", campaign: "Accessible ward assembly series", summary: "Prepared an accessible venue safety plan and provided community-focused event security.", location: "Ekurhuleni, Gauteng", completedAt: "14 Sep 2026", image: "/images/campaigns/accessible-ward-meetings.jpg", imageAlt: "Community members gather safely inside an accessible meeting venue." }
    ],
    reviews: []
  },
  {
    slug: "masibambane-advisory",
    name: "Masibambane Advisory",
    summary: "Governance, bookkeeping and compliance support for community organisations and campaign teams.",
    description: "Masibambane helps campaign teams organise budgets, bookkeeping, governance packs and impact reports in a form that supports public oversight.",
    email: "team@masibambaneadvisory.demo",
    category: "Professional services",
    location: "Johannesburg, Gauteng",
    serviceArea: "Remote across South Africa",
    verified: true,
    rating: 4.9,
    completedJobs: 27,
    responseTime: "Usually replies within 4 hours",
    services: ["Bookkeeping", "Compliance packs", "Impact reporting"],
    previousProjects: [
      { id: "mp-1", title: "River restoration reporting pack", campaignSlug: "umngeni-river-restoration-watch", campaign: "uMngeni river restoration watch", summary: "Created the campaign budget tracker and evidence register for testing and clean-up milestones.", location: "Howick, KwaZulu-Natal", completedAt: "12 Sep 2026", image: "/images/campaigns/river-restoration.jpg", imageAlt: "Community volunteers document work beside a restored riverbank." }
    ],
    reviews: [
      { id: "mr-1", author: "Lerato S.", campaign: "Women-led market cooperative", rating: 5, text: "Made our reporting simple and gave the committee a clear audit trail.", date: "12 Sep 2026", verifiedEngagement: true }
    ]
  },
  {
    slug: "africa-pixel-studio",
    name: "Africa Pixel Studio",
    summary: "Accessible digital design, websites and campaign communications for civic organisations.",
    description: "Africa Pixel Studio creates accessible campaign websites, digital communication kits and content systems for civic organisations.",
    email: "studio@africapixel.demo",
    category: "Digital services",
    location: "Soweto, Gauteng",
    serviceArea: "Remote across Africa",
    verified: true,
    rating: 4.6,
    completedJobs: 19,
    responseTime: "Usually replies within 2 hours",
    services: ["Accessible websites", "Digital campaigns", "Content design"],
    previousProjects: [
      { id: "ap-1", title: "Youth lab digital recruitment kit", campaignSlug: "soweto-youth-skills-lab", campaign: "Soweto youth skills lab", summary: "Designed an accessible sign-up page and multilingual recruitment graphics for the first learner intake.", location: "Soweto, Gauteng", completedAt: "6 Sep 2026", image: "/images/campaigns/youth-skills-lab.jpg", imageAlt: "Young people participate in a digital skills workshop." }
    ],
    reviews: []
  }
];

export function getSupplier(slug: string): Supplier | undefined {
  return suppliers.find((supplier) => supplier.slug === slug);
}
