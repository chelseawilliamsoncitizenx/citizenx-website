import { Injectable } from "@nestjs/common";
import type { AuthorisePaymentInput, AuthorisePaymentResult, PaymentGateway } from "./payment-gateway";

@Injectable()
export class SandboxPaymentGateway implements PaymentGateway {
  async authorise(input: AuthorisePaymentInput): Promise<AuthorisePaymentResult> {
    if (!Number.isInteger(input.amountCents) || input.amountCents < 100) {
      throw new Error("Invalid payment amount.");
    }

    return Promise.resolve({
      providerReference: `sandbox_${crypto.randomUUID()}`,
      status: "authorised",
      sandbox: true
    });
  }
}

