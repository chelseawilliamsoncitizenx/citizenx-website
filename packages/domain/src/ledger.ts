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
  { id: "evt-5", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-14T09:30:00+02:00", label: "Community contributions", detail: "43 named and anonymous donations settled", amountCents: 870000, kind: "in", verified: true },
  { id: "evt-4", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-11T14:12:00+02:00", label: "Sipho's Plumbing", detail: "Verified invoice #0431 · plumbing milestone", amountCents: 4100000, kind: "out", verified: true },
  { id: "evt-3", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-08T11:05:00+02:00", label: "JoJo Tanks SA", detail: "Verified invoice #0432 · storage tank", amountCents: 2850000, kind: "out", verified: true },
  { id: "evt-2", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-05T16:44:00+02:00", label: "Installation allocation", detail: "Protected pending proof of service", amountCents: 1470000, kind: "held", verified: true },
  { id: "evt-1", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-01T08:20:00+02:00", label: "Community contributions", detail: "369 named and anonymous donations settled", amountCents: 7550000, kind: "in", verified: true },
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

