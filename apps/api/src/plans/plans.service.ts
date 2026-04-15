import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class PlansService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const plans = [
      { code: "FREE", name: "Gratuito", maxPosts: 3, priceCents: 0 },
      { code: "BASIC", name: "Básico", maxPosts: 5, priceCents: 1299 },
      { code: "MEDIUM", name: "Médio", maxPosts: 10, priceCents: 2999 },
      { code: "PRO", name: "Pro", maxPosts: 25, priceCents: 5599 }
    ] as const;

    for (const plan of plans) {
      await this.prisma.plan.upsert({
        where: { code: plan.code },
        update: {
          name: plan.name,
          maxPosts: plan.maxPosts,
          priceCents: plan.priceCents,
          active: true
        },
        create: {
          code: plan.code,
          name: plan.name,
          maxPosts: plan.maxPosts,
          priceCents: plan.priceCents,
          active: true
        }
      });
    }
  }

  list() {
    return this.prisma.plan.findMany({ where: { active: true }, orderBy: { priceCents: "asc" } });
  }
}
