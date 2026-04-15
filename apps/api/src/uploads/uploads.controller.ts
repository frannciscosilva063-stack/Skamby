import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { UploadsService } from "./uploads.service.js";

@UseGuards(JwtAuthGuard)
@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post("product-images")
  upload(@Body("filename") filename: string, @Body("mime") mime: string, @Body("size") size: number) {
    return this.uploadsService.generateUploadSignature(filename, mime, size);
  }
}
