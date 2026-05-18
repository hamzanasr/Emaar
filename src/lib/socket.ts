import { io, type Socket } from 'socket.io-client';
import type { ChatMessage } from '@emaar/types';

// ═══════════════════════════════════════════════════════════════
// Socket.IO Client Wrapper
// Backend-ready architecture for real-time chat
// ═══════════════════════════════════════════════════════════════

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

export interface SocketEvents {
  // Server → Client
  'message:new': (message: ChatMessage) => void;
  'message:read': (data: { messageId: string; userId: string }) => void;
  'typing:start': (data: { roomId: string; userId: string }) => void;
  'typing:stop': (data: { roomId: string; userId: string }) => void;
  'presence:update': (data: { userId: string; isOnline: boolean }) => void;

  // Connection
  connect: () => void;
  disconnect: () => void;
  connect_error: (error: Error) => void;
}

class ChatSocketManager {
  private socket: Socket | null = null;
  private currentToken: string | null = null;
  private isMockMode = true; // Toggle to false when backend is wired

  /**
   * Connect to chat namespace with JWT auth.
   */
  connect(token: string): Socket | null {
    // Mock mode: skip actual connection
    if (this.isMockMode) {
      console.warn('[Chat] Running in mock mode (no backend connection)');
      return null;
    }

    if (this.socket?.connected && this.currentToken === token) {
      return this.socket;
    }

    this.disconnect();
    this.currentToken = token;

    this.socket = io(`${WS_URL}/chat`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.warn('[Chat] Connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[Chat] Disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[Chat] Connection error:', err.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentToken = null;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  isMock(): boolean {
    return this.isMockMode;
  }

  // ─── Room actions ────────────────────────────────────────────
  joinRoom(roomId: string) {
    if (this.isMockMode) return;
    this.socket?.emit('join:room', { roomId });
  }

  leaveRoom(roomId: string) {
    if (this.isMockMode) return;
    this.socket?.emit('leave:room', { roomId });
  }

  // ─── Message actions ─────────────────────────────────────────
  sendMessage(roomId: string, content: string, type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT') {
    if (this.isMockMode) return;
    this.socket?.emit('message:send', { roomId, content, type });
  }

  markAsRead(roomId: string, messageId: string) {
    if (this.isMockMode) return;
    this.socket?.emit('message:read', { roomId, messageId });
  }

  // ─── Typing indicators ───────────────────────────────────────
  startTyping(roomId: string) {
    if (this.isMockMode) return;
    this.socket?.emit('typing:start', { roomId });
  }

  stopTyping(roomId: string) {
    if (this.isMockMode) return;
    this.socket?.emit('typing:stop', { roomId });
  }

  // ─── Listener helpers ────────────────────────────────────────
  on<K extends keyof SocketEvents>(event: K, handler: SocketEvents[K]) {
    this.socket?.on(event as string, handler as (...args: unknown[]) => void);
  }

  off<K extends keyof SocketEvents>(event: K, handler?: SocketEvents[K]) {
    if (handler) {
      this.socket?.off(event as string, handler as (...args: unknown[]) => void);
    } else {
      this.socket?.off(event as string);
    }
  }
}

export const chatSocket = new ChatSocketManager();
