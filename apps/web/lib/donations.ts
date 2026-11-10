export type DonationVisibility = "public" | "anonymous";
export type DonationPaymentMethod = "card" | "instant_eft";

export interface SandboxDonation {
  id: string;
  campaignSlug: string;
  amountCents: number;
  tipCents: number;
  occurredAt: string;
  visibility: DonationVisibility;
  method: DonationPaymentMethod;
  fullName: string;
  message: string;
}

export const donationStorageKey = "citizenx:sandbox-donations";

export function readSandboxDonations(): SandboxDonation[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(donationStorageKey) ?? "[]") as Array<Partial<SandboxDonation> & { visibility?: string }>;
    return stored.filter((item) => typeof item.id === "string" && typeof item.campaignSlug === "string" && typeof item.amountCents === "number").map((item) => ({
      id: item.id as string,
      campaignSlug: item.campaignSlug as string,
      amountCents: item.amountCents as number,
      tipCents: typeof item.tipCents === "number" ? item.tipCents : 0,
      occurredAt: typeof item.occurredAt === "string" ? item.occurredAt : new Date().toISOString(),
      visibility: item.visibility === "anonymous" ? "anonymous" : "public",
      method: item.method === "card" ? "card" : "instant_eft",
      fullName: typeof item.fullName === "string" && item.fullName.trim() ? item.fullName.trim() : "Sandbox Supporter",
      message: typeof item.message === "string" ? item.message.trim() : ""
    }));
  } catch {
    return [];
  }
}

export function writeSandboxDonation(donation: SandboxDonation): void {
  const existing = readSandboxDonations();
  window.localStorage.setItem(donationStorageKey, JSON.stringify([donation, ...existing].slice(0, 40)));
  window.dispatchEvent(new CustomEvent("citizenx-donation-change"));
}
