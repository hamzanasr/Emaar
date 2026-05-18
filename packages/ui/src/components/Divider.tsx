import * as React from 'react';
import { cn } from '../lib/cn';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'gold' | 'subtle' | 'solid';
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  variant = 'gold',
  orientation = 'horizontal',
  label,
  className,
  ...props
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'w-px h-full self-stretch',
          variant === 'gold' && 'bg-gradient-to-b from-transparent via-gold-500/30 to-transparent',
          variant === 'subtle' && 'bg-white/[0.06]',
          variant === 'solid' && 'bg-white/10',
          className,
        )}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div className={cn('relative flex items-center gap-4 my-8', className)} {...props}>
        <div
          className={cn(
            'flex-1 h-px',
            variant === 'gold' && 'bg-gradient-to-l from-transparent via-gold-500/30 to-gold-500/0',
            variant === 'subtle' && 'bg-white/[0.06]',
            variant === 'solid' && 'bg-white/10',
          )}
        />
        <span className="text-xs uppercase tracking-widest text-white/50 font-semibold">
          {label}
        </span>
        <div
          className={cn(
            'flex-1 h-px',
            variant === 'gold' && 'bg-gradient-to-r from-transparent via-gold-500/30 to-gold-500/0',
            variant === 'subtle' && 'bg-white/[0.06]',
            variant === 'solid' && 'bg-white/10',
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'h-px w-full my-8',
        variant === 'gold' &&
          'bg-gradient-to-r from-transparent via-gold-500/30 to-transparent',
        variant === 'subtle' && 'bg-white/[0.06]',
        variant === 'solid' && 'bg-white/10',
        className,
      )}
      {...props}
    />
  );
};

Divider.displayName = 'Divider';
