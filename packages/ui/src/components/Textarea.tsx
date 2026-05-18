'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, rows = 4, ...props }, ref) => {
    const textareaId = id || `textarea-${React.useId()}`;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-white/80 tracking-cinema"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full px-4 py-3.5 resize-y',
            'bg-cinema-deep border border-white/10',
            'rounded-button text-white placeholder-white/30',
            'tracking-cinema leading-relaxed',
            'transition-all duration-300',
            'focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-danger/60 focus:border-danger focus:ring-danger/30',
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-danger">{error}</p>
        ) : hint ? (
          <p className="text-xs text-white/50">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
