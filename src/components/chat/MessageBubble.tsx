'use client';

import * as React from 'react';
import type { ChatMessage } from '@emaar/types';
import { cn } from '@emaar/ui';
import { mockChatParticipants } from '@/lib/mock-chat';
import { formatDate } from '@/lib/formatters';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  /** Hide avatar/name when grouped with previous from same sender */
  grouped?: boolean;
  showReadReceipt?: boolean;
}

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function MessageBubble({
  message,
  isOwn,
  grouped,
  showReadReceipt = true,
}: MessageBubbleProps) {
  const sender = mockChatParticipants[message.senderId];
  const isSystem = message.type === 'SYSTEM';

  // System message — centered banner
  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20">
          <svg
            className="w-3.5 h-3.5 text-gold-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs text-gold-300 font-medium">{message.content}</span>
          <span className="text-[10px] text-white/40">· {formatTime(message.createdAt)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-end gap-2 mb-1',
        isOwn ? 'justify-start flex-row-reverse' : 'justify-start',
        grouped ? 'mt-0.5' : 'mt-3',
      )}
    >
      {/* Avatar (only on first of group, opposite side for own) */}
      {!grouped && !isOwn && (
        <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-cinema-deepest font-bold text-xs shrink-0">
          {sender?.name?.charAt(0) || '؟'}
        </div>
      )}
      {!grouped && isOwn && <div className="w-8 shrink-0" />}
      {grouped && <div className="w-8 shrink-0" />}

      <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start', 'max-w-[70%]')}>
        {/* Sender name (only on first of group, only for non-own messages) */}
        {!grouped && !isOwn && (
          <p className="text-xs text-gold-300 font-bold mb-1 px-1">
            {sender?.name || 'مستخدم'}
            {sender?.role && (
              <span className="text-white/40 font-normal mr-1">· {sender.role}</span>
            )}
          </p>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            'px-4 py-2.5 rounded-card-lg',
            'text-sm leading-relaxed break-words',
            'transition-all duration-200',
            isOwn
              ? 'bg-gold-gradient text-cinema-deepest shadow-glow-gold-sm rounded-br-sm font-medium'
              : 'bg-cinema-surface border border-cinema-border text-white rounded-bl-sm',
          )}
        >
          {message.content}
        </div>

        {/* Time + read receipt */}
        <div
          className={cn(
            'flex items-center gap-1 mt-1 px-1 text-[10px]',
            isOwn ? 'flex-row-reverse' : '',
          )}
        >
          <span className="text-white/40">{formatTime(message.createdAt)}</span>
          {isOwn && showReadReceipt && (
            <span
              className={cn(
                'inline-flex',
                message.readBy.length > 1 ? 'text-gold-400' : 'text-white/30',
              )}
              title={message.readBy.length > 1 ? 'تمت القراءة' : 'تم الإرسال'}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {message.readBy.length > 1 && (
                <svg className="w-3 h-3 -mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Date Separator ────────────────────────────────────────────
export function MessageDateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-white/[0.06]" />
      <span className="text-[11px] font-bold text-white/50 tracking-cinema bg-cinema-deep px-3 py-1 rounded-full border border-white/[0.06]">
        {formatDate(date, { day: 'numeric', month: 'long' })}
      </span>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

// ─── Typing Indicator ──────────────────────────────────────────
export function TypingIndicator({ userIds }: { userIds: string[] }) {
  if (userIds.length === 0) return null;
  const names = userIds
    .map((id) => mockChatParticipants[id]?.name)
    .filter(Boolean)
    .join(' و ');

  return (
    <div className="flex items-end gap-2 mb-2 mt-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-gold-gradient/50 flex items-center justify-center text-cinema-deepest text-xs shrink-0">
        ⋯
      </div>
      <div className="px-4 py-3 rounded-card-lg bg-cinema-surface border border-cinema-border rounded-bl-sm">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-glow-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-glow-pulse" style={{ animationDelay: '0.2s' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-glow-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
      {names && <span className="text-[10px] text-white/40 mb-1">{names} يكتب...</span>}
    </div>
  );
}
