import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import type { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service.js";

@WebSocketGateway({ cors: { origin: (process.env.CORS_ORIGINS ?? "http://localhost:3000").split(",") } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService
  ) {}

  afterInit() {
    // Gateway initialized
  }

  async handleConnection(client: Socket) {
    try {
      const header = client.handshake.auth.token ?? client.handshake.headers.authorization;
      const token = String(header ?? "").replace("Bearer ", "");
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token, {
        secret: process.env.JWT_ACCESS_SECRET ?? "dev_access_secret"
      });
      client.data.userId = payload.sub;
    } catch {
      client.disconnect(true);
    }
  }

  @SubscribeMessage("chat:join")
  async join(@ConnectedSocket() client: Socket, @MessageBody() conversationId: string) {
    const userId = String(client.data.userId);
    await this.chatService.messages(userId, conversationId);
    await client.join(conversationId);
    return { ok: true };
  }

  @SubscribeMessage("chat:message:send")
  async send(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; body: string }
  ) {
    const userId = String(client.data.userId);
    const message = await this.chatService.sendMessage(userId, payload.conversationId, payload.body);
    this.server.to(payload.conversationId).emit("chat:message:new", message);
    return { ok: true };
  }
}
