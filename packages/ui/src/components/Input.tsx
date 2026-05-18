import * as React from 'react';
import { cn } from '../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, iconLeft, iconRight, className, id, ...props }, ref) => {
    const inputId = id || `input-${React.useId()}`;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white/80 tracking-cinema"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <span className="absolute inset-y-0 right-3 flex items-center text-white/40 pointer-events-none">
              {iconLeft}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-3.5',
              'bg-cinema-deep border border-white/10',
              'rounded-button text-white placeholder-white/30',
              'tracking-cinema',
              'transition-all duration-300',
              'focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              iconLeft && 'pr-11',
              iconRight && 'pl-11',
              error && 'border-danger/60 focus:border-danger focus:ring-danger/30',
              className,
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute inset-y-0 left-3 flex items-center text-white/40 pointer-events-none">
              {iconRight}
            </span>
          )}
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

Input.displayName = 'Input';
