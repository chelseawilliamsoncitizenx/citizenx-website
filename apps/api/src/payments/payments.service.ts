import { Inject, Injectable } from "@nestjs/common";
import { PAYMENT_GATEWAY, type AuthorisePaymentInput, type AuthorisePaymentResult, type PaymentGateway } from "./payment-gateway";

@Injectable()
export class PaymentsService {
  constructor(@Inject(PAYMENT_GATEWAY) private readonly gateway: PaymentGateway) {}

  authorise(input: AuthorisePaymentInput): Promise<AuthorisePaymentResult> {
    return this.gateway.authorise(input);
  }
}

