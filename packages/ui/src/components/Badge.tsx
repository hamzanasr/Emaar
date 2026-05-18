import * as React from 'react';
import { cn } from '../lib/cn';

type BadgeVariant = 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: 'bg-gold-500/10 text-gold-300 border-gold-500/30',
  success: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  info: 'bg-primary-500/10 text-primary-300 border-primary-500/30',
  neutral: 'bg-white/[0.06] text-white/70 border-white/10',
};

const dotClasses: Record<BadgeVariant, string> = {
  gold: 'bg-gold-400',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-primary-400',
  neutral: 'bg-white/40',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', dot, className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1',
          'rounded-full text-xs font-semibold tracking-wide',
          'border',
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {dot && (
          <span className={cn('w-1.5 h-1.5 rounded-full', dotClasses[variant])} />
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
