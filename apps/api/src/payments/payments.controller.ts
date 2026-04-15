import { Body, Controller, Headers, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import { CheckoutDto, WebhookDto } from "./payments.dto.js";
import { PaymentsService } from "./payments.service.js";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("checkout")
  checkout(@CurrentUser() user: { sub: string }, @Body() dto: CheckoutDto) {
    return this.paymentsService.checkout(user.sub, dto.planCode);
  }

  @Post("webhook")
  webhook(@Headers("x-webhook-signature") signature: string | undefined, @Body() dto: WebhookDto) {
    return this.paymentsService.processWebhook(signature, dto);
  }
}
