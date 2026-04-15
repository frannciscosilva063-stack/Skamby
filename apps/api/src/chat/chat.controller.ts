import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import { ChatService } from "./chat.service.js";

@UseGuards(JwtAuthGuard)
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("conversations")
  conversations(@CurrentUser() user: { sub: string }) {
    return this.chatService.conversations(user.sub);
  }

  @Post("conversations")
  createConversation(@CurrentUser() user: { sub: string }, @Body("participantId") participantId: string) {
    return this.chatService.createConversation(user.sub, participantId);
  }

  @Get("messages/:conversationId")
  messages(@CurrentUser() user: { sub: string }, @Param("conversationId") conversationId: string) {
    return this.chatService.messages(user.sub, conversationId);
  }
}
