'use client';

import * as React from 'react';
import { useChatRooms } from '@/hooks/useChat';
import { ChatList } from '@/components/chat/ChatList';
import { ChatRoomView } from '@/components/chat/ChatRoom';
import { Card, EmptyState, Logo } from '@emaar/ui';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { UserRole } from '@emaar/types';

interface ChatPageContentProps {
  role: UserRole;
  roomId?: string;
}

/**
 * Shared ChatPageContent — renders 2-column layout (list + room).
 * Used by client/contractor/supplier chat routes.
 */
export function ChatPageContent({ role, roomId }: ChatPageContentProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const { rooms } = useChatRooms();

  const rolePath = role === 'CLIENT' ? 'client' : role === 'CONTRACTOR' ? 'contractor' : 'supplier';
  const basePath = `/${locale}/${rolePath}/chat`;

  return (
    <div className="fixed inset-0 bg-cinema-deepest z-40 flex flex-col">
      {/* Top Bar */}
      <header className="px-6 py-4 bg-cinema-deep border-b border-cinema-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/${rolePath}`}>
            <Logo size="sm" />
          </Link>
          <div className="hidden md:block h-8 w-px bg-white/[0.08]" />
          <Link
            href={`/${locale}/${rolePath}`}
            className="hidden md:inline-flex items-center gap-2 text-sm text-white/60 hover:text-gold-300 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
            </svg>
            عودة للوحة المعلومات
          </Link>
        </div>
        <div>
          <span className="text-sm font-bold text-white tracking-cinema">المحادثات</span>
        </div>
      </header>

      {/* Main 2-col layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[360px_1fr] overflow-hidden">
        {/* Chat List (hidden on mobile when a room is open) */}
        <div className={roomId ? 'hidden lg:block' : 'block'}>
          <ChatList rooms={rooms} activeRoomId={roomId} basePath={basePath} />
        </div>

        {/* Chat Room or Empty */}
        <div className={!roomId ? 'hidden lg:block' : 'block'}>
          {roomId ? (
            <ChatRoomView roomId={roomId} backUrl={basePath} />
          ) : (
            <Card variant="default" className="h-full flex items-center justify-center !rounded-none !border-0">
              <EmptyState
                icon={
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
                title="اختر محادثة لعرضها"
                description="اختر محادثة من القائمة على اليمين، أو ابدأ محادثة جديدة من صفحة المشروع أو الطلب"
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
