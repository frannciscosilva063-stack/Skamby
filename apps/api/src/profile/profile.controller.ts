import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { ProfileService } from "./profile.service.js";
import { UpdateProfileDto } from "./profile.dto.js";

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get("profile/me")
  me(@CurrentUser() user: { sub: string }) {
    return this.profileService.me(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("profile/me")
  update(@CurrentUser() user: { sub: string }, @Body() dto: UpdateProfileDto) {
    return this.profileService.update(user.sub, dto);
  }

  @Get("users/:id/public")
  publicProfile(@Param("id") id: string) {
    return this.profileService.publicProfile(id);
  }
}
