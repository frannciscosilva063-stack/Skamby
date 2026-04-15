import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service.js";
import { AuditService } from "../audit/audit.service.js";
import type { WebhookDto } from "./payments.dto.js";

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async checkout(userId: string, planCode: "BASIC" | "MEDIUM" | "PRO") {
    const plan = await this.prisma.plan.findUnique({ where: { code: planCode } });
    if (!plan) throw new NotFoundException("Plan not found");

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        status: "PENDING"
      }
    });

    const payment = await this.prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        provider: "PAGARME",
        amountCents: plan.priceCents,
        status: "PENDING"
      }
    });

    await this.audit.log({ userId, action: "PAYMENT_CHECKOUT_CREATED", targetType: "Payment", targetId: payment.id });
    return {
      paymentId: payment.id,
      subscriptionId: subscription.id,
      amountCents: payment.amountCents,
      checkoutUrl: `https://checkout.example/pagarme/${payment.id}`
    };
  }

  async processWebhook(signature: string | undefined, dto: WebhookDto) {
    if (!signature) {
      throw new ForbiddenException("Missing webhook signature");
    }

    const existing = await this.prisma.webhookEvent.findUnique({
      where: { provider_externalId: { provider: "PAGARME", externalId: dto.eventId } }
    });
    if (existing?.processedAt) {
      return { ok: true, duplicate: true };
    }

    const payloadJson = dto.payload as Prisma.InputJsonValue;

    const event = existing
      ? await this.prisma.webhookEvent.update({
          where: { id: existing.id },
          data: { eventType: dto.eventType, payload: payloadJson }
        })
      : await this.prisma.webhookEvent.create({
          data: {
            provider: "PAGARME",
            externalId: dto.eventId,
            eventType: dto.eventType,
            payload: payloadJson
          }
        });

    if (dto.eventType === "payment.paid") {
      const paymentId = String((dto.payload as Record<string, unknown>).paymentId ?? "");
      const payment = await this.prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          subscription: { include: { plan: true } }
        }
      });

      if (!payment) throw new NotFoundException("Payment not found");

      await this.prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: "PAID", paidAt: new Date(), providerRef: dto.eventId }
        });

        await tx.subscription.update({
          where: { id: payment.subscriptionId },
          data: {
            status: "ACTIVE",
            startsAt: new Date(),
            endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
          }
        });

        await tx.postingQuota.create({
          data: {
            userId: payment.subscription.userId,
            allowedPosts: payment.subscription.plan.maxPosts,
            usedPosts: 0,
            source: payment.subscription.plan.code
          }
        });
      });

      await this.audit.log({
        userId: payment.subscription.userId,
        action: "PAYMENT_CONFIRMED",
        targetType: "Payment",
        targetId: payment.id,
        metadata: { webhookEventId: event.id }
      });
    }

    await this.prisma.webhookEvent.update({ where: { id: event.id }, data: { processedAt: new Date() } });
    return { ok: true };
  }
}
