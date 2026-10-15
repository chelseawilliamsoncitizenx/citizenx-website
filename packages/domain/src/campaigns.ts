export type CampaignCategory = "Community" | "Education" | "Youth";
export type CampaignStatus = "verified" | "funding" | "delivering";

export interface CampaignMilestone {
  id: string;
  title: string;
  description: string;
  amountCents: number;
  status: "funded" | "in_progress" | "planned";
}

export interface Campaign {
  slug: string;
  title: string;
  summary: string;
  story: string;
  location: string;
  category: CampaignCategory;
  status: CampaignStatus;
  beneficiaryType: "civic" | "public_interest";
  entityRoute: "npc";
  raisedCents: number;
  goalCents: number;
  contributorCount: number;
  daysRemaining: number;
  leader: {
    name: string;
    organisation: string;
    verified: boolean;
  };
  accent: "teal" | "purple" | "saffron";
  milestones: CampaignMilestone[];
}

export const campaigns: Campaign[] = [
  {
    slug: "ward-12-clinic-water-tank",
    title: "Ward 12 clinic water tank",
    summary: "Secure reliable water storage for a community clinic serving more than 3,000 residents.",
    story: "The clinic loses access to running water during municipal interruptions. This campaign funds a compliant storage tank, plumbing, installation and independent proof of delivery. CitizenX pays verified suppliers against approved invoices rather than releasing cash to the campaign leader.",
    location: "Johannesburg, Gauteng",
    category: "Community",
    status: "funding",
    beneficiaryType: "public_interest",
    entityRoute: "npc",
    raisedCents: 8420000,
    goalCents: 12000000,
    contributorCount: 412,
    daysRemaining: 18,
    leader: { name: "Naledi Mokoena", organisation: "Ward 12 Community Forum", verified: true },
    accent: "teal",
    milestones: [
      { id: "tank", title: "Storage tank", description: "Supply and delivery of a 10,000 litre tank.", amountCents: 2850000, status: "funded" },
      { id: "plumbing", title: "Plumbing works", description: "Connection, valves and pressure testing.", amountCents: 4100000, status: "funded" },
      { id: "installation", title: "Installation and proof", description: "Base, installation and independent completion evidence.", amountCents: 5050000, status: "in_progress" }
    ]
  },
  {
    slug: "school-library-rebuild",
    title: "School library rebuild",
    summary: "Restore a safe, stocked library for 780 primary-school learners.",
    story: "Storm damage closed the school library. The project covers repairs, locally made shelving and a starter collection selected with teachers. Payments are tied to photographed milestones and supplier invoices.",
    location: "Mthatha, Eastern Cape",
    category: "Education",
    status: "funding",
    beneficiaryType: "public_interest",
    entityRoute: "npc",
    raisedCents: 5290000,
    goalCents: 9000000,
    contributorCount: 287,
    daysRemaining: 27,
    leader: { name: "Ayanda Ndlovu", organisation: "Khanyisa Primary SGB", verified: true },
    accent: "purple",
    milestones: [
      { id: "repairs", title: "Room repairs", description: "Roof, paint and safe electrical work.", amountCents: 2800000, status: "funded" },
      { id: "shelving", title: "Local shelving", description: "Purpose-built shelving from a verified supplier.", amountCents: 3400000, status: "in_progress" },
      { id: "books", title: "Starter collection", description: "Age-appropriate books in English and isiXhosa.", amountCents: 2800000, status: "planned" }
    ]
  },
  {
    slug: "soweto-youth-skills-lab",
    title: "Soweto youth skills lab",
    summary: "Equip an after-school digital skills lab for 120 young people.",
    story: "A local youth centre has space and facilitators but needs devices, connectivity and backup power. Funding is released to verified suppliers as each milestone is completed and evidenced.",
    location: "Soweto, Gauteng",
    category: "Youth",
    status: "funding",
    beneficiaryType: "civic",
    entityRoute: "npc",
    raisedCents: 3615000,
    goalCents: 15000000,
    contributorCount: 169,
    daysRemaining: 41,
    leader: { name: "Kagiso Dlamini", organisation: "Future Block Youth Centre", verified: true },
    accent: "saffron",
    milestones: [
      { id: "devices", title: "Learning devices", description: "Twelve refurbished laptops with warranties.", amountCents: 7800000, status: "planned" },
      { id: "power", title: "Backup power", description: "Inverter installation and safety certificate.", amountCents: 4200000, status: "planned" },
      { id: "connectivity", title: "Connectivity", description: "Twelve months of managed connectivity.", amountCents: 3000000, status: "planned" }
    ]
  }
];

export function getCampaign(slug: string): Campaign | undefined {
  return campaigns.find((campaign) => campaign.slug === slug);
}

export function campaignProgress(campaign: Pick<Campaign, "raisedCents" | "goalCents">): number {
  return Math.min(100, Math.round((campaign.raisedCents / campaign.goalCents) * 100));
}

export function formatZar(amountCents: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(amountCents / 100);
}

