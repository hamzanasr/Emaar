import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getUserRooms(userId: string) {
    return this.prisma.chatRoom.findMany({
      where: { participants: { has: userId } },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async getMessages(roomId: string, options: { cursor?: string; limit: number }) {
    const where: any = { roomId };
    if (options.cursor) {
      where.createdAt = { lt: new Date(options.cursor) };
    }

    const messages = await this.prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options.limit,
      include: {
        sender: { select: { id: true, fullNameAr: true, fullNameEn: true, avatarUrl: true } },
      },
    });

    return {
      data: messages.reverse(),
      meta: {
        cursor: messages.length > 0 ? messages[0].createdAt.toISOString() : null,
        hasMore: messages.length === options.limit,
        limit: options.limit,
      },
    };
  }

  async createMessage(data: { roomId: string; senderId: string; content: string; type: string }) {
    const message = await this.prisma.chatMessage.create({
      data: {
        roomId: data.roomId,
        senderId: data.senderId,
        content: data.content,
        type: data.type as any,
        readBy: [data.senderId],
      },
      include: {
        sender: { select: { id: true, fullNameAr: true, fullNameEn: true, avatarUrl: true } },
      },
    });

    // Update room's last message time
    await this.prisma.chatRoom.update({
      where: { id: data.roomId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await this.prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (!message) return;

    const readBy = message.readBy.includes(userId) ? message.readBy : [...message.readBy, userId];
    await this.prisma.chatMessage.update({ where: { id: messageId }, data: { readBy } });
  }
}
