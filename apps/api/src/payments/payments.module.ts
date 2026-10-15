import { Module } from "@nestjs/common";
import { PAYMENT_GATEWAY } from "./payment-gateway";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { SandboxPaymentGateway } from "./sandbox-payment.gateway";

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    SandboxPaymentGateway,
    { provide: PAYMENT_GATEWAY, useExisting: SandboxPaymentGateway }
  ]
})
export class PaymentsModule {}
