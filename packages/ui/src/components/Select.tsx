'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, onChange, className, id, value, ...props }, ref) => {
    const selectId = id || `select-${React.useId()}`;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-white/80 tracking-cinema"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(
              'w-full appearance-none px-4 py-3.5 pr-12',
              'bg-cinema-deep border border-white/10',
              'rounded-button text-white',
              'tracking-cinema',
              'transition-all duration-300',
              'focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              !value && 'text-white/30',
              error && 'border-danger/60 focus:border-danger focus:ring-danger/30',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-cinema-deep text-white/40">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-cinema-deep text-white"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error ? (
          <p className="text-xs text-danger">{error}</p>
        ) : hint ? (
          <p className="text-xs text-white/50">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = 'Select';
