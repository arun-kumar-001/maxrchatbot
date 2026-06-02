import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private activeUsers = new Map<string, string>(); // socketId -> userId

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.activeUsers.delete(client.id);
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string; conversationId: string }) {
    client.join(`conversation:${data.conversationId}`);
    this.activeUsers.set(client.id, data.userId);
    return { event: 'joined', data: { conversationId: data.conversationId } };
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; message: string; userId: string },
  ) {
    // Emit typing indicator
    client.to(`conversation:${data.conversationId}`).emit('typing', { userId: data.userId });

    const result = await this.chatService.sendMessage(
      data.conversationId,
      data.userId,
      data.message,
    );

    this.server.to(`conversation:${data.conversationId}`).emit('message', {
      role: 'assistant',
      content: result.reply,
      conversationId: data.conversationId,
    });

    return { event: 'message', data: result };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; userId: string },
  ) {
    client.to(`conversation:${data.conversationId}`).emit('typing', { userId: data.userId });
  }

  @SubscribeMessage('takeover')
  handleTakeover(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; adminId: string },
  ) {
    this.server.to(`conversation:${data.conversationId}`).emit('takeover', {
      adminId: data.adminId,
      message: 'An admin has joined the conversation',
    });
  }
}