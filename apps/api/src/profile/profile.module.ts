import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller.js";
import { ProfileService } from "./profile.service.js";

@Module({
  providers: [ProfileService],
  controllers: [ProfileController]
})
export class ProfileModule {}
