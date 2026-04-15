import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller.js";
import { PaymentsService } from "./payments.service.js";

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
