'use client';

import * as React from 'react';
import { cn } from '@emaar/ui';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

/**
 * Phone input with prominent +966 country code prefix.
 * Outputs E.164 format: +966XXXXXXXXX
 */
export function PhoneInput({
  value,
  onChange,
  error,
  disabled,
  autoFocus,
}: PhoneInputProps) {
  // Strip +966 to display the local part only
  const localPart = value.startsWith('+966') ? value.slice(4) : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, ''); // digits only
    // Drop leading 0 if user types 05xxxxxxxx
    if (raw.startsWith('0')) raw = raw.slice(1);
    // Limit to 9 digits (Saudi mobile)
    if (raw.length > 9) raw = raw.slice(0, 9);

    onChange(raw ? `+966${raw}` : '');
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-white/80 tracking-cinema">
        رقم الجوال
      </label>

      <div
        className={cn(
          'flex items-center bg-cinema-deep border rounded-button transition-all duration-300',
          'focus-within:border-gold-500/50 focus-within:ring-1 focus-within:ring-gold-500/30',
          error ? 'border-danger/60' : 'border-white/10',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        {/* Country Code Pill */}
        <div className="flex items-center gap-2 px-4 py-3.5 border-l border-white/10">
          <span className="text-base">🇸🇦</span>
          <span className="text-sm font-semibold text-gold-300 tracking-wide" dir="ltr">
            +966
          </span>
        </div>

        {/* Number Input */}
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          dir="ltr"
          autoFocus={autoFocus}
          disabled={disabled}
          value={localPart}
          onChange={handleChange}
          placeholder="5xxxxxxxx"
          className="flex-1 px-4 py-3.5 bg-transparent text-white placeholder-white/30 text-base font-medium focus:outline-none disabled:cursor-not-allowed"
        />
      </div>

      {error ? (
        <p className="text-xs text-danger flex items-center gap-1.5">
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
      ) : (
        <p className="text-xs text-white/40">سنرسل رمز التحقق إلى هذا الرقم</p>
      )}
    </div>
  );
}
