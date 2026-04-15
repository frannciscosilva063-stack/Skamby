import { BadRequestException, Injectable } from "@nestjs/common";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const BLOCKED_EXTENSIONS = [".exe", ".sh", ".bat", ".js"];

@Injectable()
export class UploadsService {
  generateUploadSignature(filename: string, mime: string, size: number) {
    if (!ALLOWED_MIME.has(mime)) {
      throw new BadRequestException("Invalid file type");
    }
    if (size > 5 * 1024 * 1024) {
      throw new BadRequestException("File too large");
    }

    const lower = filename.toLowerCase();
    if (BLOCKED_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
      throw new BadRequestException("Blocked file extension");
    }

    return {
      uploadUrl: "https://api.cloudinary.com/v1_1/demo/image/upload",
      params: {
        folder: "skamby/products",
        timestamp: Date.now(),
        uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET ?? "skamby-default"
      }
    };
  }
}
