import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ChatController } from "./chat.controller.js";
import { ChatService } from "./chat.service.js";
import { ChatGateway } from "./chat.gateway.js";

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_ACCESS_SECRET ?? "dev_access_secret" })],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController]
})
export class ChatModule {}
