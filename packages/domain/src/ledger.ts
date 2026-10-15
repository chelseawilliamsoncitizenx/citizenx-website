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
  { id: "evt-5", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-14T09:30:00+02:00", label: "Community contributions", detail: "43 privacy-safe donations settled", amountCents: 870000, kind: "in", verified: true },
  { id: "evt-4", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-11T14:12:00+02:00", label: "Sipho's Plumbing", detail: "Verified invoice #0431 · plumbing milestone", amountCents: 4100000, kind: "out", verified: true },
  { id: "evt-3", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-08T11:05:00+02:00", label: "JoJo Tanks SA", detail: "Verified invoice #0432 · storage tank", amountCents: 2850000, kind: "out", verified: true },
  { id: "evt-2", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-05T16:44:00+02:00", label: "Installation allocation", detail: "Protected pending proof of service", amountCents: 1470000, kind: "held", verified: true },
  { id: "evt-1", campaignSlug: "ward-12-clinic-water-tank", occurredAt: "2026-10-01T08:20:00+02:00", label: "Community contributions", detail: "369 privacy-safe donations settled", amountCents: 7550000, kind: "in", verified: true }
];

