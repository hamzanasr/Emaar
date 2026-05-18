import * as React from 'react';
import { cn } from '../lib/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'inline';
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        variant === 'default' ? 'py-16 px-6' : 'py-10 px-4',
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            'inline-flex items-center justify-center mb-5 rounded-full',
            'bg-cinema-surface border border-cinema-border spotlight',
            variant === 'default' ? 'w-20 h-20' : 'w-14 h-14',
          )}
        >
          <span className="text-white/40">{icon}</span>
        </div>
      )}
      <h3
        className={cn(
          'font-bold text-white mb-2 tracking-cinema',
          variant === 'default' ? 'text-xl' : 'text-base',
        )}
      >
        {title}
      </h3>
      {description && (
        <p className="text-sm text-white/50 max-w-md leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
