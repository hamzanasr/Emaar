'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge, EmptyState, cn } from '@emaar/ui';
import type { ChatRoom, Project } from '@emaar/types';
import { useAuthStore } from '@/stores/auth.store';
import { mockChatMessages, mockChatParticipants } from '@/lib/mock-chat';
import { useProjects } from '@/hooks/api';
import { formatRelativeDate } from '@/lib/formatters';

interface ChatListProps {
  rooms: ChatRoom[];
  activeRoomId?: string;
  /** Path prefix: e.g. "/ar/client/chat" or "/ar/contractor/chat" */
  basePath: string;
}

function getRoomTitle(room: ChatRoom, currentUserId: string, projects: Project[]): string {
  if (room.type === 'SUPPORT') return 'دعم إعمار';
  if (room.type === 'PROJECT' && room.projectId) {
    const project = projects.find((p) => p.id === room.projectId);
    if (project) return project.titleAr;
  }
  if (room.type === 'ORDER') {
    return 'محادثة طلب';
  }
  // Default: name of the other participant
  const otherId = room.participants.find((p) => p !== currentUserId);
  if (otherId) {
    return mockChatParticipants[otherId]?.name || 'محادثة';
  }
  return 'محادثة';
}

function getRoomTypeLabel(type: ChatRoom['type']): string {
  switch (type) {
    case 'PROJECT':
      return 'مشروع';
    case 'ORDER':
      return 'طلب';
    case 'SUPPORT':
      return 'دعم فني';
    case 'DISPUTE':
      return 'نزاع';
    default:
      return '';
  }
}

export function ChatList({ rooms, activeRoomId, basePath }: ChatListProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data: projects = [] } = useProjects({ limit: 200 });

  const filteredRooms = React.useMemo(() => {
    if (!searchQuery.trim() || !user) return rooms;
    const q = searchQuery.toLowerCase();
    return rooms.filter((r) => getRoomTitle(r, user.id, projects).toLowerCase().includes(q));
  }, [rooms, searchQuery, user, projects]);

  if (!user) return null;

  return (
    <div className="h-full flex flex-col bg-cinema-deep border-l border-cinema-border">
      {/* Header */}
      <div className="p-5 border-b border-cinema-border">
        <h2 className="text-lg font-bold text-white tracking-cinema mb-3">المحادثات</h2>
        <div className="flex items-center gap-2 px-3 py-2 rounded-button bg-cinema-surface border border-white/10 focus-within:border-gold-500/50 transition">
          <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في المحادثات..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
          />
        </div>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.length === 0 ? (
          <EmptyState
            variant="inline"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            title={searchQuery ? 'لا توجد نتائج' : 'لا توجد محادثات بعد'}
            description={searchQuery ? '' : 'ستظهر هنا محادثات مشاريعك وطلباتك'}
          />
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filteredRooms.map((room) => {
              const title = getRoomTitle(room, user.id, projects);
              const lastMessage = mockChatMessages
                .filter((m) => m.roomId === room.id)
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                )[0];

              const unreadCount = mockChatMessages.filter(
                (m) => m.roomId === room.id && m.senderId !== user.id && !m.readBy.includes(user.id),
              ).length;

              const isActive = activeRoomId === room.id;
              const otherId = room.participants.find((p) => p !== user.id);
              const otherUser = otherId ? mockChatParticipants[otherId] : null;

              return (
                <Link
                  key={room.id}
                  href={`${basePath}/${room.id}`}
                  className={cn(
                    'flex items-start gap-3 px-5 py-4 transition relative group',
                    isActive
                      ? 'bg-gold-500/[0.08] border-r-2 border-r-gold-500'
                      : 'hover:bg-white/[0.02]',
                  )}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center font-black text-base',
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

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p
                        className={cn(
                          'text-sm font-bold truncate',
                          isActive ? 'text-gold-300' : 'text-white',
                        )}
                      >
                        {title}
                      </p>
                      <span className="text-[10px] text-white/40 whitespace-nowrap shrink-0">
                        {lastMessage
                          ? formatRelativeDate(lastMessage.createdAt)
                          : formatRelativeDate(room.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Badge
                        variant={
                          room.type === 'SUPPORT'
                            ? 'info'
                            : room.type === 'PROJECT'
                              ? 'gold'
                              : 'neutral'
                        }
                        className="!py-0.5 !px-2 !text-[9px]"
                      >
                        {getRoomTypeLabel(room.type)}
                      </Badge>
                    </div>

                    {lastMessage && (
                      <p
                        className={cn(
                          'text-xs line-clamp-1',
                          unreadCount > 0 && !isActive ? 'text-white font-semibold' : 'text-white/50',
                        )}
                      >
                        {lastMessage.type === 'SYSTEM' ? '⚙ ' : ''}
                        {lastMessage.senderId === user.id ? 'أنت: ' : ''}
                        {lastMessage.content}
                      </p>
                    )}
                  </div>

                  {/* Unread badge */}
                  {unreadCount > 0 && !isActive && (
                    <span className="shrink-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-accent-500 text-white text-[10px] font-black">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export { getRoomTitle, getRoomTypeLabel };
