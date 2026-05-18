import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*', credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  // Track typing users per room: roomId -> Set<userId>
  private typingByRoom = new Map<string, Set<string>>();

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Authenticate socket via JWT in handshake.auth.token
   */
  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token as string | undefined;
      if (!token) {
        this.logger.warn(`Socket ${client.id} rejected: no token`);
        client.emit('connect_error', { message: 'Unauthorized' });
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('auth.jwtSecret'),
      });
      client.userId = payload.sub;
      client.userRole = payload.role;

      // Join personal user room for direct notifications
      client.join(`user:${client.userId}`);

      this.logger.log(`Socket connected: ${client.id} (user: ${client.userId})`);

      // Broadcast presence
      this.server.emit('presence:update', { userId: client.userId, isOnline: true });
    } catch (err) {
      this.logger.warn(`Socket ${client.id} auth failed: ${(err as Error).message}`);
      client.emit('connect_error', { message: 'Invalid token' });
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (!client.userId) return;
    this.logger.log(`Socket disconnected: ${client.id} (user: ${client.userId})`);

    // Clear typing indicators for this user
    for (const [roomId, users] of this.typingByRoom.entries()) {
      if (users.has(client.userId)) {
        users.delete(client.userId);
        this.server.to(`room:${roomId}`).emit('typing:stop', {
          roomId,
          userId: client.userId,
        });
      }
    }

    this.server.emit('presence:update', { userId: client.userId, isOnline: false });
  }

  // ─── Room joining ────────────────────────────────────────────
  @SubscribeMessage('join:room')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ) {
    if (!client.userId) return;
    // TODO: verify the user is a participant of the room before joining
    client.join(`room:${data.roomId}`);
    this.logger.log(`User ${client.userId} joined room ${data.roomId}`);
  }

  @SubscribeMessage('leave:room')
  async handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ) {
    client.leave(`room:${data.roomId}`);
  }

  // ─── Send message ────────────────────────────────────────────
  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; content: string; type?: string },
  ) {
    if (!client.userId) return;

    const message = await this.chatService.createMessage({
      roomId: data.roomId,
      senderId: client.userId,
      content: data.content,
      type: data.type || 'TEXT',
    });

    // Stop typing for this sender
    const typingUsers = this.typingByRoom.get(data.roomId);
    if (typingUsers?.has(client.userId)) {
      typingUsers.delete(client.userId);
      this.server.to(`room:${data.roomId}`).emit('typing:stop', {
        roomId: data.roomId,
        userId: client.userId,
      });
    }

    // Broadcast to all room participants
    this.server.to(`room:${data.roomId}`).emit('message:new', message);

    return message;
  }

  // ─── Read receipts ───────────────────────────────────────────
  @SubscribeMessage('message:read')
  async handleRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; messageId: string },
  ) {
    if (!client.userId) return;
    await this.chatService.markAsRead(data.messageId, client.userId);
    this.server.to(`room:${data.roomId}`).emit('message:read', {
      messageId: data.messageId,
      userId: client.userId,
    });
  }

  // ─── Typing indicators ───────────────────────────────────────
  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ) {
    if (!client.userId) return;
    if (!this.typingByRoom.has(data.roomId)) {
      this.typingByRoom.set(data.roomId, new Set());
    }
    this.typingByRoom.get(data.roomId)!.add(client.userId);
    client.to(`room:${data.roomId}`).emit('typing:start', {
      roomId: data.roomId,
      userId: client.userId,
    });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ) {
    if (!client.userId) return;
    this.typingByRoom.get(data.roomId)?.delete(client.userId);
    client.to(`room:${data.roomId}`).emit('typing:stop', {
      roomId: data.roomId,
      userId: client.userId,
    });
  }

  /**
   * Server-side helper: emit notification to specific user.
   * Useful for triggering notifications from other modules.
   */
  emitToUser(userId: string, event: string, payload: unknown) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}
