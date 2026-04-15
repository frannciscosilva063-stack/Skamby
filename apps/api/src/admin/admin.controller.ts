import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { RolesGuard } from "../common/guards/roles.guard.js";
import { MfaGuard } from "../common/guards/mfa.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";

@Controller("admin/moderation")
@UseGuards(JwtAuthGuard, RolesGuard, MfaGuard)
@Roles("ADMIN")
export class AdminController {
  @Get("overview")
  overview() {
    return { status: "ok", message: "Admin moderation endpoint with MFA" };
  }
}
