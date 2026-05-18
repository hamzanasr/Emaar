'use client';

import * as React from 'react';
import type { ChatMessage, ChatRoom } from '@emaar/types';
import { useAuthStore } from '@/stores/auth.store';
import { chatSocket } from '@/lib/socket';
import { mockChatMessages, mockChatRooms, mockChatParticipants } from '@/lib/mock-chat';

// ═══════════════════════════════════════════════════════════════
// useChat Hook — Unified chat state management
// Works with mock data + ready for backend Socket.IO integration
// ═══════════════════════════════════════════════════════════════

interface UseChatRoomsResult {
  rooms: ChatRoom[];
  unreadCount: number;
  isLoading: boolean;
}

/**
 * useChatRooms — list all chat rooms for current user.
 */
export function useChatRooms(): UseChatRoomsResult {
  const { user } = useAuthStore();
  const [rooms, setRooms] = React.useState<ChatRoom[]>([]);

  React.useEffect(() => {
    if (!user) return;
    // For mock mode, the current user is treated as 'mock-client-id'
    // (or whichever id matches their role). We filter rooms accordingly.
    const filtered = mockChatRooms
      .filter((r) => r.participants.length > 0)
      .sort(
        (a, b) =>
          new Date(b.lastMessageAt || b.createdAt).getTime() -
          new Date(a.lastMessageAt || a.createdAt).getTime(),
      );
    setRooms(filtered);
  }, [user?.id]);

  // Calculate unread count
  const unreadCount = React.useMemo(() => {
    if (!user) return 0;
    return mockChatMessages.filter(
      (m) => !m.readBy.includes(user.id) && m.senderId !== user.id,
    ).length;
  }, [user?.id]);

  return { rooms, unreadCount, isLoading: false };
}

interface UseChatRoomResult {
  room: ChatRoom | null;
  messages: ChatMessage[];
  participants: typeof mockChatParticipants;
  typingUsers: string[];
  isLoading: boolean;
  sendMessage: (content: string) => void;
  markAsRead: (messageId: string) => void;
}

/**
 * useChatRoom — manage a specific room: messages, typing, read receipts.
 */
export function useChatRoom(roomId: string | null): UseChatRoomResult {
  const { user, accessToken } = useAuthStore();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = React.useState<string[]>([]);

  const room = React.useMemo(() => {
    if (!roomId) return null;
    return mockChatRooms.find((r) => r.id === roomId) || null;
  }, [roomId]);

  // Load initial messages
  React.useEffect(() => {
    if (!roomId) {
      setMessages([]);
      return;
    }
    const roomMessages = mockChatMessages
      .filter((m) => m.roomId === roomId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    setMessages(roomMessages);
  }, [roomId]);

  // ─── Socket connection ────────────────────────────────────────
  React.useEffect(() => {
    if (!roomId || !accessToken) return;

    // Connect socket if not already
    chatSocket.connect(accessToken);

    if (chatSocket.isMock()) {
      // Mock mode: no real socket events
      return;
    }

    chatSocket.joinRoom(roomId);

    const handleNewMessage = (msg: ChatMessage) => {
      if (msg.roomId === roomId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleTypingStart = (data: { roomId: string; userId: string }) => {
      if (data.roomId === roomId && data.userId !== user?.id) {
        setTypingUsers((prev) =>
          prev.includes(data.userId) ? prev : [...prev, data.userId],
        );
      }
    };

    const handleTypingStop = (data: { roomId: string; userId: string }) => {
      if (data.roomId === roomId) {
        setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
      }
    };

    chatSocket.on('message:new', handleNewMessage);
    chatSocket.on('typing:start', handleTypingStart);
    chatSocket.on('typing:stop', handleTypingStop);

    return () => {
      chatSocket.off('message:new', handleNewMessage);
      chatSocket.off('typing:start', handleTypingStart);
      chatSocket.off('typing:stop', handleTypingStop);
      chatSocket.leaveRoom(roomId);
    };
  }, [roomId, accessToken, user?.id]);

  // ─── Send message (optimistic) ───────────────────────────────
  const sendMessage = React.useCallback(
    (content: string) => {
      if (!roomId || !user || !content.trim()) return;

      const optimisticMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        roomId,
        senderId: user.id,
        content: content.trim(),
        type: 'TEXT',
        readBy: [user.id],
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMsg]);

      if (chatSocket.isMock()) {
        // Mock: simulate a reply after 2-4 seconds (only for non-system rooms)
        if (room && room.type !== 'SUPPORT') {
          const otherParticipant = room.participants.find((p) => p !== user.id);
          if (otherParticipant && Math.random() > 0.5) {
            setTimeout(
              () => {
                setTypingUsers([otherParticipant]);
                setTimeout(
                  () => {
                    setTypingUsers([]);
                    const reply: ChatMessage = {
                      id: `mock-reply-${Date.now()}`,
                      roomId,
                      senderId: otherParticipant,
                      content: pickAutoReply(),
                      type: 'TEXT',
                      readBy: [otherParticipant],
                      createdAt: new Date().toISOString(),
                    };
                    setMessages((prev) => [...prev, reply]);
                  },
                  1500 + Math.random() * 1500,
                );
              },
              1500 + Math.random() * 1500,
            );
          }
        }
      } else {
        chatSocket.sendMessage(roomId, content.trim());
      }
    },
    [roomId, user, room],
  );

  const markAsRead = React.useCallback(
    (messageId: string) => {
      if (!roomId || !user) return;
      if (chatSocket.isMock()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId && !m.readBy.includes(user.id)
              ? { ...m, readBy: [...m.readBy, user.id] }
              : m,
          ),
        );
      } else {
        chatSocket.markAsRead(roomId, messageId);
      }
    },
    [roomId, user],
  );

  return {
    room,
    messages,
    participants: mockChatParticipants,
    typingUsers,
    isLoading: false,
    sendMessage,
    markAsRead,
  };
}

// Auto-replies for mock mode
const autoReplies = [
  'تمام، شكراً لتأكيدك.',
  'ممتاز، سأرجع إليك خلال ساعة.',
  'حسناً، فهمت طلبك.',
  'بالتأكيد، سيتم تنفيذ ذلك.',
  'دعني أراجع الموضوع وأرجع لك.',
  'تم الاستلام، شكراً لك.',
];

function pickAutoReply(): string {
  return autoReplies[Math.floor(Math.random() * autoReplies.length)] || 'حسناً';
}
