import { Module } from "@nestjs/common";
import { PlansController } from "./plans.controller.js";
import { PlansService } from "./plans.service.js";

@Module({
  providers: [PlansService],
  controllers: [PlansController],
  exports: [PlansService]
})
export class PlansModule {}
