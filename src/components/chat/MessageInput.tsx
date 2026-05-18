'use client';

import * as React from 'react';
import { cn } from '@emaar/ui';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  disabled,
  placeholder = 'اكتب رسالتك هنا...',
}: MessageInputProps) {
  const [value, setValue] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="px-6 py-4 bg-cinema-deep border-t border-cinema-border">
      <div className="flex items-end gap-3">
        {/* Attachment button */}
        <button
          type="button"
          disabled={disabled}
          className="shrink-0 w-10 h-10 rounded-button bg-cinema-surface border border-white/10 text-white/60 hover:text-gold-300 hover:border-gold-500/30 transition flex items-center justify-center disabled:opacity-50"
          aria-label="إرفاق ملف"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
            placeholder={placeholder}
            className={cn(
              'w-full resize-none px-4 py-2.5 pl-12',
              'bg-cinema-surface border border-white/10 rounded-button',
              'text-sm text-white placeholder-white/30 leading-relaxed',
              'focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30',
              'transition-all duration-300',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          {/* Emoji button */}
          <button
            type="button"
            disabled={disabled}
            className="absolute left-3 bottom-2.5 text-white/40 hover:text-gold-300 transition disabled:opacity-50"
            aria-label="إيموجي"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'shrink-0 w-11 h-11 rounded-button flex items-center justify-center',
            'transition-all duration-300',
            'active:scale-[0.95]',
            canSend
              ? 'bg-gold-gradient text-cinema-deepest shadow-glow-gold-sm'
              : 'bg-cinema-surface text-white/30 border border-white/10',
          )}
          aria-label="إرسال"
        >
          <svg
            className={cn('w-5 h-5 transition-transform', !canSend && 'opacity-50')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            style={{ transform: 'scaleX(-1)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
      <p className="text-[10px] text-white/30 mt-2 px-1 text-center">
        اضغط Enter للإرسال · Shift+Enter لسطر جديد
      </p>
    </div>
  );
}
