import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { MfaGuard } from "../common/guards/mfa.guard.js";

@Module({
  controllers: [AdminController],
  providers: [RolesGuard, MfaGuard]
})
export class AdminModule {}
