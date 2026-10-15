export const PAYMENT_GATEWAY = Symbol("PAYMENT_GATEWAY");

export interface AuthorisePaymentInput {
  campaignSlug: string;
  amountCents: number;
  method: "card" | "instant_eft";
}

export interface AuthorisePaymentResult {
  providerReference: string;
  status: "authorised";
  sandbox: true;
}

export interface PaymentGateway {
  authorise(input: AuthorisePaymentInput): Promise<AuthorisePaymentResult>;
}

