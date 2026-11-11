export type LedgerDirection = "debit" | "credit";

export interface LedgerLine {
  account: "payment_clearing" | "campaign_balance" | "supplier_payable" | "supplier_cash";
  direction: LedgerDirection;
  amountCents: number;
}

export interface LedgerTransaction {
  id: string;
  type: "donation" | "disbursement";
  campaignSlug: string;
  occurredAt: string;
  reference: string;
  lines: LedgerLine[];
}

export interface PublicLedgerEvent {
  id: string;
  campaignSlug: string;
  occurredAt: string;
  label: string;
  detail: string;
  amountCents: number;
  kind: "in" | "out" | "held";
  verified: boolean;
  reference?: string;
  recordType?: "individual" | "aggregate" | "supplier_payment" | "allocation";
  status?: "settled" | "paid" | "held" | "refunded";
  paymentMethod?: string;
  milestone?: string;
  invoiceReference?: string;
  vatTreatment?: string;
  supplierVerification?: string;
  approver?: string;
  procurementMethod?: string;
  conflictDeclaration?: string;
  paymentReference?: string;
  evidenceHref?: string;
  evidenceLabel?: string;
}

export function isBalanced(transaction: LedgerTransaction): boolean {
  const debit = transaction.lines
    .filter((line) => line.direction === "debit")
    .reduce((sum, line) => sum + line.amountCents, 0);
  const credit = transaction.lines
    .filter((line) => line.direction === "credit")
    .reduce((sum, line) => sum + line.amountCents, 0);
  return debit === credit && debit > 0;
}

export function createDonationTransaction(input: {
  id: string;
  campaignSlug: string;
  amountCents: number;
  occurredAt: string;
}): LedgerTransaction {
  if (!Number.isInteger(input.amountCents) || input.amountCents < 100) {
    throw new Error("Donations must be whole cents and at least R1.");
  }

  return {
    id: input.id,
    type: "donation",
    campaignSlug: input.campaignSlug,
    occurredAt: input.occurredAt,
    reference: `SANDBOX-${input.id}`,
    lines: [
      { account: "payment_clearing", direction: "debit", amountCents: input.amountCents },
      { account: "campaign_balance", direction: "credit", amountCents: input.amountCents }
    ]
  };
}

const demoFirstNames = ["Anele", "Ayesha", "Bongani", "Dineo", "Fatima", "Imraan", "Kabelo", "Karabo", "Lerato", "Lindiwe", "Mandla", "Nandi", "Nomsa", "Priya", "Refilwe", "Rethabile", "Sanele", "Sibusiso", "Themba", "Zanele"];
const demoLastNames = ["Botha", "Dlamini", "Dube", "Jacobs", "Khumalo", "Mkhize", "Molefe", "Mokoena", "Mthembu", "Naidoo", "Ndlovu", "Ngcobo", "Nkosi", "Nxumalo", "Petersen", "Pillay", "Radebe", "Smith", "Van Wyk", "Zulu"];

function createDemoIncomeEvents(campaignSlug: string, totalCents: number, contributorCount: number): PublicLedgerEvent[] {
  const denominationCents = 5000;
  const baseCents = Math.floor(totalCents / contributorCount / denominationCents) * denominationCents;
  const remainder = totalCents - baseCents * contributorCount;
  const supplementedContributors = Math.floor(remainder / denominationCents);
  const finalAdjustment = remainder - supplementedContributors * denominationCents;

  const events: PublicLedgerEvent[] = [];

  for (let index = 0; index < contributorCount; index += 1) {
    const anonymous = index % 9 === 0;
    const firstName = demoFirstNames[index % demoFirstNames.length] ?? "Citizen";
    const lastName = demoLastNames[Math.floor(index / demoFirstNames.length) % demoLastNames.length] ?? "Supporter";
    const dayOffset = index % 41;
    const occurredAt = new Date(Date.UTC(2026, 9, 1 + dayOffset, 6 + (index % 12), (index * 7) % 60)).toISOString();
    const amountCents = baseCents + (index < supplementedContributors ? denominationCents : 0) + (index === contributorCount - 1 ? finalAdjustment : 0);
    const event: PublicLedgerEvent = {
      id: `${campaignSlug}-income-${String(index + 1).padStart(4, "0")}`,
      campaignSlug,
      occurredAt,
      label: anonymous ? "Anonymous supporter" : `${firstName} ${lastName}`,
      detail: anonymous ? "Individual contribution · public identity hidden" : "Individual contribution",
      amountCents,
      kind: "in",
      verified: true,
      reference: `CX-IN-${campaignSlug.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(5, "0")}`,
      recordType: "individual",
      status: "settled",
      paymentMethod: index % 3 === 0 ? "Instant EFT" : "Card"
    };
    events.push(event);
  }

  return events;
}

export const publicLedgerEvents: PublicLedgerEvent[] = [
  ...createDemoIncomeEvents("ward-12-clinic-water-tank", 8420000, 412),
  { id: "evt-4", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-11T14:12:00+02:00", label: "Sipho's Plumbing", detail: "Connection, valves and pressure testing completed", amountCents: 4100000, kind: "out", verified: true, reference: "CX-EXP-00431", recordType: "supplier_payment", status: "paid", milestone: "Plumbing works", invoiceReference: "INV-0431", vatTreatment: "VAT-inclusive invoice · 15% demo rate", supplierVerification: "CitizenX verified · CSD MAAA0109842 (demo)", approver: "Patrick Schofield · Admin", procurementMethod: "Three comparable quotes reviewed", conflictDeclaration: "No conflict declared", paymentReference: "CX-PAY-8214", evidenceHref: "/campaigns/ward-12-clinic-water-tank/#updates", evidenceLabel: "View milestone evidence" },
  { id: "evt-3", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-08T11:05:00+02:00", label: "JoJo Tanks SA", detail: "10,000 litre storage tank supplied and delivered", amountCents: 2850000, kind: "out", verified: true, reference: "CX-EXP-00432", recordType: "supplier_payment", status: "paid", milestone: "Storage tank", invoiceReference: "INV-0432", vatTreatment: "VAT-inclusive invoice · 15% demo rate", supplierVerification: "CitizenX verified · CSD MAAA0117630 (demo)", approver: "Chelsea Williamson · Admin", procurementMethod: "Approved supplier quote", conflictDeclaration: "No conflict declared", paymentReference: "CX-PAY-8198", evidenceHref: "/campaigns/ward-12-clinic-water-tank/#updates", evidenceLabel: "View delivery evidence" },
  { id: "evt-2", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-05T16:44:00+02:00", label: "Installation allocation", detail: "Protected pending proof of service", amountCents: 1470000, kind: "held", verified: true, reference: "CX-COM-0021", recordType: "allocation", status: "held", milestone: "Installation and proof", approver: "Lindo Mathenjwa · Admin", procurementMethod: "Budget allocation approved", conflictDeclaration: "No conflict declared", evidenceHref: "/campaigns/ward-12-clinic-water-tank/#updates", evidenceLabel: "Review campaign updates" },
  ...createDemoIncomeEvents("school-library-rebuild", 5290000, 287),
  { id: "library-expense", campaignSlug: "school-library-rebuild", occurredAt: "2026-10-26T12:20:00+02:00", label: "Sisonke Build Projects", detail: "Verified invoice #LIB-018 · room repairs", amountCents: 2800000, kind: "out", verified: true },
  { id: "library-held", campaignSlug: "school-library-rebuild", occurredAt: "2026-10-29T15:10:00+02:00", label: "Shelving allocation", detail: "Protected pending installation evidence", amountCents: 2490000, kind: "held", verified: true },
  ...createDemoIncomeEvents("soweto-youth-skills-lab", 3615000, 169),
  { id: "lab-held", campaignSlug: "soweto-youth-skills-lab", occurredAt: "2026-11-01T14:40:00+02:00", label: "Device procurement allocation", detail: "Protected while supplier quotations are reviewed", amountCents: 3615000, kind: "held", verified: true },
  ...createDemoIncomeEvents("delft-flood-resilience-hub", 4685000, 198),
  { id: "flood-expense", campaignSlug: "delft-flood-resilience-hub", occurredAt: "2026-10-24T11:00:00+02:00", label: "Sisonke Build Projects", detail: "Verified invoice #DFT-021 · secure storage", amountCents: 3200000, kind: "out", verified: true },
  { id: "flood-held", campaignSlug: "delft-flood-resilience-hub", occurredAt: "2026-10-28T13:35:00+02:00", label: "Emergency supplies allocation", detail: "Protected pending delivery evidence", amountCents: 1485000, kind: "held", verified: true },
  ...createDemoIncomeEvents("accessible-ward-assemblies", 2975000, 143),
  { id: "assembly-expense", campaignSlug: "accessible-ward-assemblies", occurredAt: "2026-10-21T10:30:00+02:00", label: "AccessWorks Cooperative", detail: "Verified invoice #AWA-006 · access equipment", amountCents: 2400000, kind: "out", verified: true },
  { id: "assembly-held", campaignSlug: "accessible-ward-assemblies", occurredAt: "2026-10-25T16:05:00+02:00", label: "Communication support allocation", detail: "Protected pending first assembly evidence", amountCents: 575000, kind: "held", verified: true },
  ...createDemoIncomeEvents("umngeni-river-restoration-watch", 6120000, 326),
  { id: "river-expense", campaignSlug: "umngeni-river-restoration-watch", occurredAt: "2026-10-19T12:45:00+02:00", label: "KwaZulu Water Lab", detail: "Verified invoice #URW-011 · baseline water testing", amountCents: 3800000, kind: "out", verified: true },
  { id: "river-held", campaignSlug: "umngeni-river-restoration-watch", occurredAt: "2026-10-23T14:20:00+02:00", label: "River clean-up allocation", detail: "Protected pending waste-removal evidence", amountCents: 2320000, kind: "held", verified: true }
];

