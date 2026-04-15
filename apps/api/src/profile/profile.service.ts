import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import type { UpdateProfileDto } from "./profile.dto.js";

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profilePublic: true, profilePrivate: true }
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async update(userId: string, dto: UpdateProfileDto) {
    await this.prisma.profilePublic.upsert({
      where: { userId },
      update: {
        displayName: dto.displayName,
        city: dto.city,
        state: dto.state,
        bio: dto.bio
      },
      create: {
        userId,
        displayName: dto.displayName,
        city: dto.city,
        state: dto.state,
        bio: dto.bio
      }
    });

    await this.prisma.profilePrivate.upsert({
      where: { userId },
      update: {
        phone: dto.phone,
        cpfMasked: dto.cpfMasked,
        consentedAt: dto.consented ? new Date() : undefined
      },
      create: {
        userId,
        phone: dto.phone,
        cpfMasked: dto.cpfMasked,
        consentedAt: dto.consented ? new Date() : undefined
      }
    });

    return this.me(userId);
  }

  async publicProfile(userId: string) {
    const profile = await this.prisma.profilePublic.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException("Public profile not found");
    return profile;
  }
}
