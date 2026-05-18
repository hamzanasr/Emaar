'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge, Button, EmptyState, cn } from '@emaar/ui';
import { useAuthStore } from '@/stores/auth.store';
import { useChatRoom } from '@/hooks/useChat';
import { MessageBubble, MessageDateSeparator, TypingIndicator } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { getRoomTitle, getRoomTypeLabel } from './ChatList';
import { mockChatParticipants } from '@/lib/mock-chat';
import { useProject } from '@/hooks/api';

interface ChatRoomViewProps {
  roomId: string;
  /** Mobile back button URL (returns to chat list) */
  backUrl?: string;
}

function isSameDay(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return da.toDateString() === db.toDateString();
}

export function ChatRoomView({ roomId, backUrl }: ChatRoomViewProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const { user } = useAuthStore();
  const { room, messages, typingUsers, sendMessage } = useChatRoom(roomId);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, typingUsers.length]);

  if (!user) return null;

  if (!room) {
    return (
      <div className="h-full flex items-center justify-center bg-cinema-deepest">
        <EmptyState
          icon={
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
          title="لم تُحدَّد محادثة"
          description="اختر محادثة من القائمة لعرضها"
        />
      </div>
    );
  }

  const title = getRoomTitle(room, user.id, []);
  const otherId = room.participants.find((p) => p !== user.id);
  const otherUser = otherId ? mockChatParticipants[otherId] : null;
  const { data: linkedProject } = useProject(room.projectId || '');

  return (
    <div className="h-full flex flex-col bg-cinema-deepest">
      {/* ─── Header ─── */}
      <header className="px-5 py-4 border-b border-cinema-border bg-cinema-deep flex items-center gap-3 shrink-0">
        {backUrl && (
          <Link
            href={backUrl}
            className="w-9 h-9 rounded-button bg-cinema-surface border border-white/10 hover:border-gold-500/30 transition flex items-center justify-center text-white/70 lg:hidden"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
            </svg>
          </Link>
        )}

        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={cn(
              'w-11 h-11 rounded-full flex items-center justify-center font-black',
              room.type === 'SUPPORT'
                ? 'bg-primary-700 text-white'
                : 'bg-gold-gradient text-cinema-deepest',
            )}
          >
            {room.type === 'SUPPORT' ? '🛟' : title.charAt(0)}
          </div>
          {otherUser?.isOnline && (
            <span className="absolute bottom-0 left-0 w-3 h-3 rounded-full bg-success ring-2 ring-cinema-deep" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base font-bold text-white tracking-cinema truncate">{title}</h1>
            <Badge
              variant={
                room.type === 'SUPPORT' ? 'info' : room.type === 'PROJECT' ? 'gold' : 'neutral'
              }
              className="!py-0.5 !text-[9px]"
            >
              {getRoomTypeLabel(room.type)}
            </Badge>
          </div>
          <p className="text-xs text-white/50 mt-0.5">
            {otherUser?.isOnline ? (
              <span className="text-success">● متصل الآن</span>
            ) : otherUser ? (
              `${otherUser.role} · غير متصل`
            ) : (
              `${room.participants.length} مشاركون`
            )}
          </p>
        </div>

        {/* Actions */}
        {linkedProject && (
          <Link
            href={`/${locale}/client/projects/${linkedProject.id}`}
            className="hidden sm:inline-block"
          >
            <Button variant="outline-gold" size="sm">
              المشروع
            </Button>
          </Link>
        )}
      </header>

      {/* ─── Messages Area ─── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-3 relative"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 10%, rgba(201,169,97,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 90%, rgba(60,101,167,0.04) 0%, transparent 50%)',
        }}
      >
        {messages.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            title="ابدأ المحادثة"
            description="أرسل رسالتك الأولى للبدء"
          />
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((msg, idx) => {
              const prev = messages[idx - 1];
              const isOwn = msg.senderId === user.id;
              const showDateSep = !prev || !isSameDay(prev.createdAt, msg.createdAt);
              const grouped =
                !!prev &&
                prev.senderId === msg.senderId &&
                prev.type === msg.type &&
                msg.type !== 'SYSTEM' &&
                isSameDay(prev.createdAt, msg.createdAt) &&
                new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000;

              return (
                <React.Fragment key={msg.id}>
                  {showDateSep && <MessageDateSeparator date={msg.createdAt} />}
                  <MessageBubble message={msg} isOwn={isOwn} grouped={grouped} />
                </React.Fragment>
              );
            })}

            {typingUsers.length > 0 && <TypingIndicator userIds={typingUsers} />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ─── Input ─── */}
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
