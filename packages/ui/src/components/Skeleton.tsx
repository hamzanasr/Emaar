import * as React from 'react';
import { cn } from '../lib/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle';
}

export function Skeleton({ variant = 'rect', className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'shimmer bg-cinema-surface',
        variant === 'text' && 'h-4 rounded',
        variant === 'rect' && 'rounded-button',
        variant === 'circle' && 'rounded-full',
        className,
      )}
      {...props}
    />
  );
}
