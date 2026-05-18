import * as React from 'react';
import { cn } from '../lib/cn';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value 0-100 */
  value: number;
  variant?: 'gold' | 'blue' | 'success';
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function ProgressBar({
  value,
  variant = 'gold',
  showLabel,
  size = 'md',
  className,
  ...props
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  const variantBg = {
    gold: 'bg-gold-gradient',
    blue: 'bg-gradient-to-l from-primary-400 to-primary-600',
    success: 'bg-success',
  }[variant];

  const variantGlow = {
    gold: 'shadow-glow-gold-sm',
    blue: 'shadow-glow-blue',
    success: '',
  }[variant];

  return (
    <div className={cn('w-full', className)} {...props}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-white/60 font-medium">نسبة الإنجاز</span>
          <span className="text-gold-300 font-bold tabular-nums">{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        className={cn(
          'relative w-full bg-cinema-deep border border-cinema-border rounded-full overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2.5',
        )}
      >
        <div
          className={cn(
            'absolute inset-y-0 right-0 transition-all duration-700 ease-out rounded-full',
            variantBg,
            variantGlow,
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
