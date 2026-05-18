'use client';

import * as React from 'react';
import { cn } from '@emaar/ui';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

/**
 * Cinematic 6-digit OTP input.
 * Auto-advances on type, supports paste, and triggers onComplete.
 */
export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  error,
  disabled,
  autoFocus = true,
}: OtpInputProps) {
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);
  const digits = React.useMemo(() => {
    const arr = value.split('');
    return Array.from({ length }, (_, i) => arr[i] || '');
  }, [value, length]);

  React.useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const updateAt = (index: number, digit: string) => {
    const newDigits = [...digits];
    newDigits[index] = digit;
    const next = newDigits.join('').slice(0, length);
    onChange(next);
    if (next.length === length && onComplete) {
      onComplete(next);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const raw = e.target.value.replace(/\D/g, '');

    if (!raw) {
      updateAt(index, '');
      return;
    }

    // If user pasted multiple digits via change event
    if (raw.length > 1) {
      const arr = digits.slice();
      for (let i = 0; i < raw.length && index + i < length; i++) {
        arr[index + i] = raw[i]!;
      }
      const next = arr.join('').slice(0, length);
      onChange(next);
      const focusIndex = Math.min(index + raw.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
      if (next.length === length && onComplete) {
        onComplete(next);
      }
      return;
    }

    updateAt(index, raw);
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        updateAt(index, '');
      } else if (index > 0) {
        updateAt(index - 1, '');
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index < length - 1) {
      // RTL: ArrowLeft moves to next visually
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowRight' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    const arr = digits.slice();
    for (let i = 0; i < pasted.length && index + i < length; i++) {
      arr[index + i] = pasted[i]!;
    }
    const next = arr.join('').slice(0, length);
    onChange(next);
    const focusIndex = Math.min(index + pasted.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
    if (next.length === length && onComplete) {
      onComplete(next);
    }
  };

  return (
    <div className="w-full space-y-3">
      <label className="block text-sm font-medium text-white/80 tracking-cinema text-center">
        رمز التحقق
      </label>

      <div
        className="flex items-center justify-center gap-2 sm:gap-3"
        dir="ltr" // OTP boxes are LTR even in RTL UI
      >
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={length}
            disabled={disabled}
            value={digits[index] || ''}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e, index)}
            className={cn(
              'w-11 h-14 sm:w-14 sm:h-16',
              'text-center text-2xl font-black',
              'bg-cinema-deep border-2 rounded-button',
              'text-white',
              'transition-all duration-300',
              'focus:outline-none focus:border-gold-500 focus:bg-cinema-surface',
              'focus:shadow-glow-gold-sm',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-danger/60'
                : digits[index]
                  ? 'border-gold-500/40 bg-cinema-surface'
                  : 'border-white/10',
            )}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-danger text-center flex items-center justify-center gap-1.5">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
