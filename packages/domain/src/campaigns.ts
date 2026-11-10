export type CampaignCategory = "Community" | "Democracy" | "Education" | "Environment" | "Youth";
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
  image: string;
  imageAlt: string;
  accent: "teal" | "purple" | "saffron";
  milestones: CampaignMilestone[];
}

export interface CampaignUpdate {
  id: string;
  campaignSlug: string;
  title: string;
  body: string;
  publishedAt: string;
  author: string;
  image?: string;
  imageAlt?: string;
}

export interface CampaignSupporter {
  id: string;
  campaignSlug: string;
  fullName: string;
  amountCents: number;
  message?: string;
  contributedAt: string;
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
    image: "/images/campaigns/clinic-water-tank.jpg",
    imageAlt: "Two technicians inspect a new water storage tank outside a community clinic.",
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
    image: "/images/campaigns/school-library.jpg",
    imageAlt: "School staff arrange books in a bright restored library.",
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
    image: "/images/campaigns/youth-skills-lab.jpg",
    imageAlt: "Young people work at laptops with a facilitator in a community skills lab.",
    accent: "saffron",
    milestones: [
      { id: "devices", title: "Learning devices", description: "Twelve refurbished laptops with warranties.", amountCents: 7800000, status: "planned" },
      { id: "power", title: "Backup power", description: "Inverter installation and safety certificate.", amountCents: 4200000, status: "planned" },
      { id: "connectivity", title: "Connectivity", description: "Twelve months of managed connectivity.", amountCents: 3000000, status: "planned" }
    ]
  },
  {
    slug: "delft-flood-resilience-hub",
    title: "Delft flood resilience hub",
    summary: "Equip a trusted neighbourhood response point before the next winter floods.",
    story: "Repeated flooding leaves families waiting for essential supplies and reliable local information. This campaign creates a community-managed response point with sealed storage, emergency lighting and pre-positioned relief packs. CitizenX will pay verified suppliers for each approved milestone and publish completion evidence.",
    location: "Delft, Western Cape",
    category: "Community",
    status: "funding",
    beneficiaryType: "public_interest",
    entityRoute: "npc",
    raisedCents: 4685000,
    goalCents: 10500000,
    contributorCount: 198,
    daysRemaining: 33,
    leader: { name: "Zimasa Nqoko", organisation: "Delft Resilience Network", verified: true },
    image: "/images/campaigns/flood-resilience-hub.jpg",
    imageAlt: "Volunteers organise water, blankets and emergency lights in a community storeroom.",
    accent: "teal",
    milestones: [
      { id: "storage", title: "Secure storage", description: "Weatherproof shelving, lockable cabinets and safety signage.", amountCents: 3200000, status: "funded" },
      { id: "supplies", title: "Emergency supplies", description: "Water, blankets, lights and first-response packs from verified suppliers.", amountCents: 4100000, status: "in_progress" },
      { id: "training", title: "Readiness training", description: "Practical response training and a public inventory handover.", amountCents: 3200000, status: "planned" }
    ]
  },
  {
    slug: "accessible-ward-assemblies",
    title: "Accessible ward assembly series",
    summary: "Make six public ward meetings accessible to residents with disabilities.",
    story: "Public participation only works when residents can enter, hear and contribute. This campaign covers accessible venues, portable ramps, a hearing loop, live captioning and safe transport support for six ward assemblies. Payments are tied to attendance records, supplier invoices and accessibility checks.",
    location: "Ekurhuleni, Gauteng",
    category: "Democracy",
    status: "funding",
    beneficiaryType: "civic",
    entityRoute: "npc",
    raisedCents: 2975000,
    goalCents: 7500000,
    contributorCount: 143,
    daysRemaining: 24,
    leader: { name: "Refilwe Molefe", organisation: "Access the Ward Coalition", verified: true },
    image: "/images/campaigns/accessible-ward-meetings.jpg",
    imageAlt: "Residents meet in an accessible community hall with a ramp and hearing-loop sign.",
    accent: "purple",
    milestones: [
      { id: "equipment", title: "Access equipment", description: "Portable ramps, hearing loop and accessible wayfinding.", amountCents: 2400000, status: "funded" },
      { id: "services", title: "Communication support", description: "Live captioning, sign-language support and accessible materials.", amountCents: 2100000, status: "in_progress" },
      { id: "meetings", title: "Six ward assemblies", description: "Venue, transport support and published participation records.", amountCents: 3000000, status: "planned" }
    ]
  },
  {
    slug: "umngeni-river-restoration-watch",
    title: "uMngeni river restoration watch",
    summary: "Fund community water testing, river clean-ups and indigenous bank restoration.",
    story: "Residents want credible evidence alongside practical action on a polluted stretch of the uMngeni. The campaign combines accredited water testing, six community clean-ups and indigenous planting. Results, invoices and milestone evidence will be published through CitizenX.",
    location: "Howick, KwaZulu-Natal",
    category: "Environment",
    status: "funding",
    beneficiaryType: "public_interest",
    entityRoute: "npc",
    raisedCents: 6120000,
    goalCents: 14000000,
    contributorCount: 326,
    daysRemaining: 36,
    leader: { name: "Sanele Zulu", organisation: "uMngeni River Watch", verified: true },
    image: "/images/campaigns/river-restoration.jpg",
    imageAlt: "Community volunteers collect litter and test water beside a green riverbank.",
    accent: "saffron",
    milestones: [
      { id: "testing", title: "Independent water testing", description: "Baseline and follow-up samples from an accredited laboratory.", amountCents: 3800000, status: "funded" },
      { id: "cleanups", title: "Six river clean-ups", description: "Protective equipment, collection and licensed waste removal.", amountCents: 4700000, status: "in_progress" },
      { id: "restoration", title: "Riverbank restoration", description: "Indigenous planting, erosion control and public progress reporting.", amountCents: 5500000, status: "planned" }
    ]
  }
];

export const campaignUpdates: CampaignUpdate[] = [
  {
    id: "update-clinic-2",
    campaignSlug: "ward-12-clinic-water-tank",
    title: "Tank base and pipe route approved",
    body: "The clinic team, installer and ward safety representative completed the site walk-through. The reinforced base is ready and the final pipe route avoids the patient entrance. Installation evidence will be added after pressure testing.",
    publishedAt: "2026-11-04T10:15:00+02:00",
    author: "Naledi Mokoena",
    image: "/images/campaigns/clinic-water-tank.jpg",
    imageAlt: "Technicians checking the water tank and installation area outside the clinic."
  },
  {
    id: "update-library-2",
    campaignSlug: "school-library-rebuild",
    title: "The first shelving units are in",
    body: "Local carpenters have installed the first wall of shelving. Teachers have started sorting the donated books while the remaining electrical work is inspected.",
    publishedAt: "2026-11-02T14:30:00+02:00",
    author: "Ayanda Ndlovu",
    image: "/images/campaigns/school-library.jpg",
    imageAlt: "School staff arranging books on newly installed library shelves."
  },
  {
    id: "update-lab-2",
    campaignSlug: "soweto-youth-skills-lab",
    title: "Pilot class completed",
    body: "Twelve learners tested the training plan using borrowed devices. Their feedback helped us improve the timetable and accessibility requirements before equipment procurement.",
    publishedAt: "2026-10-29T16:00:00+02:00",
    author: "Kagiso Dlamini",
    image: "/images/campaigns/youth-skills-lab.jpg",
    imageAlt: "Young people testing laptops during a digital skills class."
  },
  {
    id: "update-flood-2",
    campaignSlug: "delft-flood-resilience-hub",
    title: "Emergency stock room mapped",
    body: "Volunteers labelled storage zones for water, blankets, lighting and first-response packs. The public inventory checklist is now ready for supplier delivery.",
    publishedAt: "2026-10-27T11:45:00+02:00",
    author: "Zimasa Nqoko",
    image: "/images/campaigns/flood-resilience-hub.jpg",
    imageAlt: "Volunteers organising supplies in the community emergency stock room."
  },
  {
    id: "update-assembly-2",
    campaignSlug: "accessible-ward-assemblies",
    title: "Accessibility equipment tested",
    body: "Residents tested the portable ramp, hearing loop and accessible signage at the first venue. The feedback is now part of the supplier handover checklist.",
    publishedAt: "2026-10-24T09:20:00+02:00",
    author: "Refilwe Molefe",
    image: "/images/campaigns/accessible-ward-meetings.jpg",
    imageAlt: "Residents testing accessible features inside a community meeting venue."
  },
  {
    id: "update-river-2",
    campaignSlug: "umngeni-river-restoration-watch",
    title: "First clean-up and water samples completed",
    body: "The volunteer team removed 38 bags of waste and the accredited laboratory collected baseline samples. Results will be published with the supplier invoice when verified.",
    publishedAt: "2026-10-22T13:10:00+02:00",
    author: "Sanele Zulu",
    image: "/images/campaigns/river-restoration.jpg",
    imageAlt: "Community volunteers collecting waste and testing water beside the river."
  }
];

export const campaignSupporters: CampaignSupporter[] = [
  { id: "support-1", campaignSlug: "ward-12-clinic-water-tank", fullName: "Thandi Maseko", amountCents: 50000, message: "Reliable water at the clinic will help every family in the ward.", contributedAt: "2026-11-06T08:40:00+02:00" },
  { id: "support-2", campaignSlug: "ward-12-clinic-water-tank", fullName: "Sipho Daniels", amountCents: 25000, message: "Proud to support a practical project with visible accountability.", contributedAt: "2026-11-05T17:12:00+02:00" },
  { id: "support-3", campaignSlug: "ward-12-clinic-water-tank", fullName: "Mariam Khan", amountCents: 100000, message: "For the nurses and patients who keep this clinic going.", contributedAt: "2026-11-03T12:05:00+02:00" },
  { id: "support-4", campaignSlug: "school-library-rebuild", fullName: "Lwazi Nkomo", amountCents: 30000, message: "May this library open many new worlds for the learners.", contributedAt: "2026-11-04T09:10:00+02:00" },
  { id: "support-5", campaignSlug: "school-library-rebuild", fullName: "Carla Petersen", amountCents: 75000, message: "Books and a safe learning space are an investment in the whole community.", contributedAt: "2026-11-01T18:20:00+02:00" },
  { id: "support-6", campaignSlug: "soweto-youth-skills-lab", fullName: "Neo Molefe", amountCents: 50000, message: "Looking forward to seeing young people build and create here.", contributedAt: "2026-10-31T15:35:00+02:00" },
  { id: "support-7", campaignSlug: "delft-flood-resilience-hub", fullName: "Fatima Abrahams", amountCents: 20000, message: "Thank you to the volunteers preparing before the next storm.", contributedAt: "2026-10-30T07:55:00+02:00" },
  { id: "support-8", campaignSlug: "accessible-ward-assemblies", fullName: "Tshepo Radebe", amountCents: 40000, message: "Public participation must include every resident.", contributedAt: "2026-10-28T19:05:00+02:00" },
  { id: "support-9", campaignSlug: "umngeni-river-restoration-watch", fullName: "Priya Naidoo", amountCents: 60000, message: "Thank you for combining credible testing with community action.", contributedAt: "2026-10-25T10:25:00+02:00" }
];

export function getCampaign(slug: string): Campaign | undefined {
  return campaigns.find((campaign) => campaign.slug === slug);
}

export function getCampaignUpdates(slug: string): CampaignUpdate[] {
  return campaignUpdates.filter((update) => update.campaignSlug === slug).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getCampaignSupporters(slug: string): CampaignSupporter[] {
  return campaignSupporters.filter((supporter) => supporter.campaignSlug === slug).sort((a, b) => b.contributedAt.localeCompare(a.contributedAt));
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
