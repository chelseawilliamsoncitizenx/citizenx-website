export interface PaymentRequest {
  campaignSlug: string;
  amountCents: number;
  donorReference: string;
  method: "card" | "instant_eft";
}

export interface PaymentResult {
  providerReference: string;
  status: "authorised" | "declined";
  sandbox: boolean;
}

export interface PaymentGateway {
  authorise(request: PaymentRequest): Promise<PaymentResult>;
}

export interface IdentityCheckResult {
  status: "verified" | "review_required";
  providerReference: string;
  sandbox: boolean;
}

export interface IdentityGateway {
  verifyDonor(input: { fullName: string; mobileNumber: string }): Promise<IdentityCheckResult>;
}

