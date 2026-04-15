import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async conversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { participants: { some: { userId } } },
      include: {
        participants: true,
        messages: { take: 1, orderBy: { createdAt: "desc" } }
      },
      orderBy: { updatedAt: "desc" }
    });
  }

  async createConversation(userId: string, participantId: string) {
    if (!participantId || participantId === userId) {
      throw new ForbiddenException("Invalid participant");
    }

    const existing = await this.prisma.conversation.findFirst({
      where: {
        participants: {
          every: { userId: { in: [userId, participantId] } }
        }
      }
    });
    if (existing) return existing;

    return this.prisma.conversation.create({
      data: {
        ownerId: userId,
        participants: {
          create: [{ userId }, { userId: participantId }]
        }
      },
      include: { participants: true }
    });
  }

  async messages(userId: string, conversationId: string) {
    await this.ensureParticipant(userId, conversationId);
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 200
    });
  }

  async sendMessage(userId: string, conversationId: string, body: string) {
    await this.ensureParticipant(userId, conversationId);
    if (!body?.trim()) throw new ForbiddenException("Empty message");

    return this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        body: body.trim()
      }
    });
  }

  private async ensureParticipant(userId: string, conversationId: string) {
    const participant = await this.prisma.conversationParticipant.findFirst({ where: { conversationId, userId } });
    if (!participant) throw new NotFoundException("Conversation not found");
  }
}
