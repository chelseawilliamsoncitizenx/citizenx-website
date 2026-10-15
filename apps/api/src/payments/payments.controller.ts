import { Body, Controller, Post } from "@nestjs/common";
import type { AuthorisePaymentInput, AuthorisePaymentResult } from "./payment-gateway";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post("sandbox/authorise")
  authorise(@Body() input: AuthorisePaymentInput): Promise<AuthorisePaymentResult> {
    return this.payments.authorise(input);
  }
}

