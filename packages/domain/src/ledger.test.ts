import { describe, expect, it } from "vitest";
import { createDonationTransaction, isBalanced } from "./ledger";

describe("CitizenX money rules", () => {
  it("creates a balanced donation transaction using integer cents", () => {
    const transaction = createDonationTransaction({
      id: "test-1",
      campaignSlug: "ward-12-clinic-water-tank",
      amountCents: 5000,
      occurredAt: "2026-10-15T12:00:00+02:00"
    });

    expect(isBalanced(transaction)).toBe(true);
    expect(transaction.lines[0]?.amountCents).toBe(5000);
    expect(transaction.lines[1]?.amountCents).toBe(5000);
  });

  it("rejects fractional or sub-rand donations", () => {
    expect(() => createDonationTransaction({
      id: "test-2",
      campaignSlug: "ward-12-clinic-water-tank",
      amountCents: 99.5,
      occurredAt: "2026-10-15T12:00:00+02:00"
    })).toThrow();
  });
});
