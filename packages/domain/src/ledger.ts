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

export const publicLedgerEvents: PublicLedgerEvent[] = [
  { id: "clinic-in-16", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-11-07T16:20:00+02:00", label: "Nandi Mkhize", detail: "Individual contribution", amountCents: 250000, kind: "in", verified: true, reference: "CX-IN-10416", recordType: "individual", status: "settled", paymentMethod: "Instant EFT" },
  { id: "clinic-in-15", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-11-06T10:45:00+02:00", label: "Kabelo Molefe", detail: "Individual contribution", amountCents: 100000, kind: "in", verified: true, reference: "CX-IN-10415", recordType: "individual", status: "settled", paymentMethod: "Card" },
  { id: "clinic-in-14", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-11-05T14:10:00+02:00", label: "Anonymous supporter", detail: "Individual contribution · public identity hidden", amountCents: 75000, kind: "in", verified: true, reference: "CX-IN-10414", recordType: "individual", status: "settled", paymentMethod: "Instant EFT" },
  { id: "clinic-in-13", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-11-04T09:35:00+02:00", label: "Ayesha Petersen", detail: "Individual contribution", amountCents: 50000, kind: "in", verified: true, reference: "CX-IN-10413", recordType: "individual", status: "settled", paymentMethod: "Card" },
  { id: "clinic-in-12", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-11-03T17:25:00+02:00", label: "Sibusiso Nxumalo", detail: "Individual contribution", amountCents: 35000, kind: "in", verified: true, reference: "CX-IN-10412", recordType: "individual", status: "settled", paymentMethod: "Card" },
  { id: "clinic-in-11", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-11-02T08:50:00+02:00", label: "Lerato Khumalo", detail: "Individual contribution", amountCents: 20000, kind: "in", verified: true, reference: "CX-IN-10411", recordType: "individual", status: "settled", paymentMethod: "Instant EFT" },
  { id: "clinic-in-10", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-31T12:15:00+02:00", label: "Anonymous supporter", detail: "Individual contribution · public identity hidden", amountCents: 125000, kind: "in", verified: true, reference: "CX-IN-10410", recordType: "individual", status: "settled", paymentMethod: "Instant EFT" },
  { id: "clinic-in-9", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-29T15:40:00+02:00", label: "Zanele Dube", detail: "Individual contribution", amountCents: 300000, kind: "in", verified: true, reference: "CX-IN-10409", recordType: "individual", status: "settled", paymentMethod: "Card" },
  { id: "clinic-in-8", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-27T11:05:00+02:00", label: "Michael Botha", detail: "Individual contribution", amountCents: 150000, kind: "in", verified: true, reference: "CX-IN-10408", recordType: "individual", status: "settled", paymentMethod: "Instant EFT" },
  { id: "clinic-in-7", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-24T18:30:00+02:00", label: "Refilwe Mokgosi", detail: "Individual contribution", amountCents: 90000, kind: "in", verified: true, reference: "CX-IN-10407", recordType: "individual", status: "settled", paymentMethod: "Card" },
  { id: "clinic-in-6", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-22T09:15:00+02:00", label: "Anonymous supporter", detail: "Individual contribution · public identity hidden", amountCents: 45000, kind: "in", verified: true, reference: "CX-IN-10406", recordType: "individual", status: "settled", paymentMethod: "Instant EFT" },
  { id: "clinic-in-5", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-20T13:00:00+02:00", label: "Rethabile Nkosi", detail: "Individual contribution", amountCents: 60000, kind: "in", verified: true, reference: "CX-IN-10405", recordType: "individual", status: "settled", paymentMethod: "Card" },
  { id: "clinic-in-4", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-18T10:20:00+02:00", label: "Priya Naidoo", detail: "Individual contribution", amountCents: 320000, kind: "in", verified: true, reference: "CX-IN-10404", recordType: "individual", status: "settled", paymentMethod: "Instant EFT" },
  { id: "clinic-in-3", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-16T16:05:00+02:00", label: "Themba Ndlovu", detail: "Individual contribution", amountCents: 200000, kind: "in", verified: true, reference: "CX-IN-10403", recordType: "individual", status: "settled", paymentMethod: "Card" },
  { id: "clinic-in-2", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-12T12:00:00+02:00", label: "Community fun walk settlement", detail: "186 contributions settled as one collection deposit", amountCents: 3200000, kind: "in", verified: true, reference: "CX-IN-BATCH-02", recordType: "aggregate", status: "settled", paymentMethod: "Collection deposit" },
  { id: "clinic-in-1", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-01T08:20:00+02:00", label: "Clinic open-day collection", detail: "212 contributions settled as one collection deposit", amountCents: 3400000, kind: "in", verified: true, reference: "CX-IN-BATCH-01", recordType: "aggregate", status: "settled", paymentMethod: "Collection deposit" },
  { id: "evt-4", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-11T14:12:00+02:00", label: "Sipho's Plumbing", detail: "Connection, valves and pressure testing completed", amountCents: 4100000, kind: "out", verified: true, reference: "CX-EXP-00431", recordType: "supplier_payment", status: "paid", milestone: "Plumbing works", invoiceReference: "INV-0431", vatTreatment: "VAT-inclusive invoice · 15% demo rate", supplierVerification: "CitizenX verified · CSD MAAA0109842 (demo)", approver: "Patrick Schofield · Admin", procurementMethod: "Three comparable quotes reviewed", conflictDeclaration: "No conflict declared", paymentReference: "CX-PAY-8214", evidenceHref: "/campaigns/ward-12-clinic-water-tank/#updates", evidenceLabel: "View milestone evidence" },
  { id: "evt-3", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-08T11:05:00+02:00", label: "JoJo Tanks SA", detail: "10,000 litre storage tank supplied and delivered", amountCents: 2850000, kind: "out", verified: true, reference: "CX-EXP-00432", recordType: "supplier_payment", status: "paid", milestone: "Storage tank", invoiceReference: "INV-0432", vatTreatment: "VAT-inclusive invoice · 15% demo rate", supplierVerification: "CitizenX verified · CSD MAAA0117630 (demo)", approver: "Chelsea Williamson · Admin", procurementMethod: "Approved supplier quote", conflictDeclaration: "No conflict declared", paymentReference: "CX-PAY-8198", evidenceHref: "/campaigns/ward-12-clinic-water-tank/#updates", evidenceLabel: "View delivery evidence" },
  { id: "evt-2", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-05T16:44:00+02:00", label: "Installation allocation", detail: "Protected pending proof of service", amountCents: 1470000, kind: "held", verified: true, reference: "CX-COM-0021", recordType: "allocation", status: "held", milestone: "Installation and proof", approver: "Lindo Mathenjwa · Admin", procurementMethod: "Budget allocation approved", conflictDeclaration: "No conflict declared", evidenceHref: "/campaigns/ward-12-clinic-water-tank/#updates", evidenceLabel: "Review campaign updates" },
  { id: "library-income", campaignSlug: "school-library-rebuild", occurredAt: "2026-11-02T09:00:00+02:00", label: "Campaign contributions", detail: "287 named and anonymous donations settled", amountCents: 5290000, kind: "in", verified: true },
  { id: "library-expense", campaignSlug: "school-library-rebuild", occurredAt: "2026-10-26T12:20:00+02:00", label: "Sisonke Build Projects", detail: "Verified invoice #LIB-018 · room repairs", amountCents: 2800000, kind: "out", verified: true },
  { id: "library-held", campaignSlug: "school-library-rebuild", occurredAt: "2026-10-29T15:10:00+02:00", label: "Shelving allocation", detail: "Protected pending installation evidence", amountCents: 2490000, kind: "held", verified: true },
  { id: "lab-income", campaignSlug: "soweto-youth-skills-lab", occurredAt: "2026-10-31T10:15:00+02:00", label: "Campaign contributions", detail: "169 named and anonymous donations settled", amountCents: 3615000, kind: "in", verified: true },
  { id: "lab-held", campaignSlug: "soweto-youth-skills-lab", occurredAt: "2026-11-01T14:40:00+02:00", label: "Device procurement allocation", detail: "Protected while supplier quotations are reviewed", amountCents: 3615000, kind: "held", verified: true },
  { id: "flood-income", campaignSlug: "delft-flood-resilience-hub", occurredAt: "2026-10-30T09:25:00+02:00", label: "Campaign contributions", detail: "198 named and anonymous donations settled", amountCents: 4685000, kind: "in", verified: true },
  { id: "flood-expense", campaignSlug: "delft-flood-resilience-hub", occurredAt: "2026-10-24T11:00:00+02:00", label: "Sisonke Build Projects", detail: "Verified invoice #DFT-021 · secure storage", amountCents: 3200000, kind: "out", verified: true },
  { id: "flood-held", campaignSlug: "delft-flood-resilience-hub", occurredAt: "2026-10-28T13:35:00+02:00", label: "Emergency supplies allocation", detail: "Protected pending delivery evidence", amountCents: 1485000, kind: "held", verified: true },
  { id: "assembly-income", campaignSlug: "accessible-ward-assemblies", occurredAt: "2026-10-28T08:40:00+02:00", label: "Campaign contributions", detail: "143 named and anonymous donations settled", amountCents: 2975000, kind: "in", verified: true },
  { id: "assembly-expense", campaignSlug: "accessible-ward-assemblies", occurredAt: "2026-10-21T10:30:00+02:00", label: "AccessWorks Cooperative", detail: "Verified invoice #AWA-006 · access equipment", amountCents: 2400000, kind: "out", verified: true },
  { id: "assembly-held", campaignSlug: "accessible-ward-assemblies", occurredAt: "2026-10-25T16:05:00+02:00", label: "Communication support allocation", detail: "Protected pending first assembly evidence", amountCents: 575000, kind: "held", verified: true },
  { id: "river-income", campaignSlug: "umngeni-river-restoration-watch", occurredAt: "2026-10-27T09:10:00+02:00", label: "Campaign contributions", detail: "326 named and anonymous donations settled", amountCents: 6120000, kind: "in", verified: true },
  { id: "river-expense", campaignSlug: "umngeni-river-restoration-watch", occurredAt: "2026-10-19T12:45:00+02:00", label: "KwaZulu Water Lab", detail: "Verified invoice #URW-011 · baseline water testing", amountCents: 3800000, kind: "out", verified: true },
  { id: "river-held", campaignSlug: "umngeni-river-restoration-watch", occurredAt: "2026-10-23T14:20:00+02:00", label: "River clean-up allocation", detail: "Protected pending waste-removal evidence", amountCents: 2320000, kind: "held", verified: true }
];

