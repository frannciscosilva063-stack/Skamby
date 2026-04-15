import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service.js";
import { AuditService } from "../audit/audit.service.js";
import type { LoginDto, RegisterDto } from "./auth.dto.js";

const REFRESH_TTL_MS = 1000 * 60 * 60 * 24 * 30;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly audit: AuditService
  ) {}

  async register(dto: RegisterDto, ip?: string) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new UnauthorizedException("Email already registered");
    }

    const passwordHash = await hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        profilePublic: {
          create: { displayName: dto.displayName }
        },
        profilePrivate: {
          create: {}
        },
        quotas: {
          create: {
            allowedPosts: 3,
            usedPosts: 0,
            source: "FREE"
          }
        }
      }
    });

    const tokens = await this.issueTokens(user.id, user.role);
    await this.audit.log({ userId: user.id, action: "AUTH_REGISTER", targetType: "User", targetId: user.id, ip });
    return { userId: user.id, ...tokens };
  }

  async login(dto: LoginDto, ip?: string) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const valid = await compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    const tokens = await this.issueTokens(user.id, user.role);
    await this.audit.log({ userId: user.id, action: "AUTH_LOGIN", targetType: "User", targetId: user.id, ip });
    return { userId: user.id, ...tokens };
  }

  async refresh(rawToken: string) {
    const tokenHash = await hash(rawToken, 12);
    const stored = await this.prisma.refreshToken.findMany({
      where: { revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    const matched = await this.findMatch(rawToken, stored.map((token) => ({ id: token.id, userId: token.userId, tokenHash: token.tokenHash })));
    if (!matched) throw new UnauthorizedException("Invalid refresh token");

    await this.prisma.refreshToken.update({ where: { id: matched.id }, data: { revokedAt: new Date() } });
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: matched.userId } });

    void tokenHash;
    return this.issueTokens(user.id, user.role);
  }

  async logout(userId: string, rawToken: string) {
    const tokens = await this.prisma.refreshToken.findMany({ where: { userId, revokedAt: null } });
    const matched = await this.findMatch(rawToken, tokens.map((token) => ({ id: token.id, userId: token.userId, tokenHash: token.tokenHash })));
    if (matched) {
      await this.prisma.refreshToken.update({ where: { id: matched.id }, data: { revokedAt: new Date() } });
    }
    await this.audit.log({ userId, action: "AUTH_LOGOUT", targetType: "User", targetId: userId });
    return { ok: true };
  }

  async logoutAll(userId: string) {
    await this.prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
    await this.audit.log({ userId, action: "AUTH_LOGOUT_ALL", targetType: "User", targetId: userId });
    return { ok: true };
  }

  private async issueTokens(userId: string, role: "USER" | "ADMIN") {
    const accessToken = await this.jwt.signAsync({ sub: userId, role });
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, typ: "refresh" },
      {
        secret: process.env.JWT_REFRESH_SECRET ?? "dev_refresh_secret",
        expiresIn: "30d"
      }
    );

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: await hash(refreshToken, 12),
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS)
      }
    });

    return { accessToken, refreshToken, expiresIn: 900 };
  }

  private async findMatch(rawToken: string, entries: Array<{ id: string; userId: string; tokenHash: string }>) {
    for (const item of entries) {
      const ok = await compare(rawToken, item.tokenHash);
      if (ok) return item;
    }
    return null;
  }
}


