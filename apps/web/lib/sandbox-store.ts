export type SandboxRole = "citizen" | "campaign_creator" | "supplier" | "admin";

export const sandboxAdmins = [
  { name: "Patrick Schofield", email: "patrick@citizenx.fund" },
  { name: "Chelsea Williamson", email: "chelsea@citizenx.fund" },
  { name: "Lindo Mathenjwa", email: "lindo@citizenx.fund" },
  { name: "Thatoyaona Harris", email: "thatoyaona@citizenx.fund" }
] as const;

export interface SandboxCampaign {
  id: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  goalRand: number;
  milestones: Array<{ title: string; amountRand: number }>;
  submittedAt: string;
  status: "under_review" | "approved" | "changes_requested";
  reviewer?: string;
}

export interface SandboxSupplierApplication {
  id: string;
  businessName: string;
  registrationNumber: string;
  category: string;
  location: string;
  serviceArea: string;
  contactName: string;
  submittedAt: string;
  status: "under_verification" | "approved" | "changes_requested";
  reviewer?: string;
}

export interface SandboxAssignment {
  id: string;
  supplierSlug: string;
  supplierName: string;
  campaignId?: string;
  campaignTitle?: string;
  milestone: string;
  amountRand: number;
  status: "assigned" | "completion_submitted" | "evidence_requested" | "paid" | "reviewed" | "completed";
  evidenceNote?: string;
  invoiceReference?: string;
  paymentApprovedBy?: string;
  paymentApprovedAt?: string;
  paymentReference?: string;
  paymentDecisionNote?: string;
}

export interface SandboxReview {
  id: string;
  supplierSlug: string;
  rating: number;
  text: string;
  author: string;
  campaign: string;
  createdAt: string;
}

export interface SandboxAdvert {
  id: string;
  supplierName: string;
  category: string;
  headline: string;
  description: string;
  packageName: string;
  priceRand: number;
  createdAt: string;
  status: "active";
}

export const keys = {
  role: "citizenx.sandbox.role",
  campaigns: "citizenx.sandbox.campaigns",
  supplierApplications: "citizenx.sandbox.supplier-applications",
  assignments: "citizenx.sandbox.assignments",
  reviews: "citizenx.sandbox.reviews",
  adverts: "citizenx.sandbox.adverts"
} as const;

export function readSandbox<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) as T : fallback;
  } catch {
    return fallback;
  }
}

export function writeSandbox<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("citizenx-sandbox-change", { detail: { key } }));
}

export function createSandboxId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const roleLabels: Record<SandboxRole, string> = {
  citizen: "Citizen",
  campaign_creator: "Campaign Creator",
  supplier: "Supplier",
  admin: "Admin"
};

export const seedSandboxCampaign: SandboxCampaign = {
  id: "campaign-seed-street-lights",
  title: "Langa safe streets lighting",
  category: "Community",
  location: "Langa, Western Cape",
  summary: "Install solar lighting on two high-footfall routes identified by residents and safety volunteers.",
  goalRand: 96000,
  milestones: [
    { title: "Site and safety assessment", amountRand: 18000 },
    { title: "Solar lighting equipment", amountRand: 52000 },
    { title: "Installation and certification", amountRand: 26000 }
  ],
  submittedAt: "2026-10-14T09:00:00.000Z",
  status: "under_review"
};

export const seedSupplierApplication: SandboxSupplierApplication = {
  id: "supplier-seed-greenline",
  businessName: "GreenLine Solar Co-op",
  registrationNumber: "2024/084216/24",
  category: "Solar and electrical",
  location: "Soweto, Gauteng",
  serviceArea: "Gauteng",
  contactName: "Naledi Mokoena",
  submittedAt: "2026-10-14T11:30:00.000Z",
  status: "under_verification"
};

export const seedSandboxAssignment: SandboxAssignment = {
  id: "job-seed-library-print",
  supplierSlug: "imbizo-printworks",
  supplierName: "Imbizo Printworks",
  campaignId: "school-library-rebuild",
  campaignTitle: "School library rebuild",
  milestone: "Print multilingual reading packs",
  amountRand: 18400,
  status: "completion_submitted",
  evidenceNote: "Final print proof, delivery note and school receipt uploaded for the sandbox review.",
  invoiceReference: "INV-SBX-1042"
};
