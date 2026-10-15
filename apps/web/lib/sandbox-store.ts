export type SandboxRole = "citizen" | "campaign_creator" | "supplier" | "admin";

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
  status: "under_verification" | "approved";
}

export interface SandboxAssignment {
  id: string;
  supplierSlug: string;
  supplierName: string;
  milestone: string;
  amountRand: number;
  status: "assigned" | "completed" | "reviewed";
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
