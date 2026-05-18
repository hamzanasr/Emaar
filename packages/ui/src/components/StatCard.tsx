import * as React from 'react';
import { cn } from '../lib/cn';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  trend?: { value: number; label?: string };
  icon?: React.ReactNode;
  accentColor?: 'gold' | 'blue' | 'crimson' | 'success';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  icon,
  accentColor = 'gold',
  className,
  ...props
}) => {
  const accentMap = {
    gold: { bg: 'bg-gold-500/10', text: 'text-gold-400', glow: 'shadow-glow-gold-sm' },
    blue: { bg: 'bg-primary-500/10', text: 'text-primary-300', glow: 'shadow-glow-blue' },
    crimson: { bg: 'bg-accent-500/10', text: 'text-accent-300', glow: 'shadow-glow-crimson' },
    success: { bg: 'bg-success/10', text: 'text-success', glow: '' },
  };

  const accent = accentMap[accentColor];

  return (
    <div
      className={cn(
        'group relative overflow-hidden',
        'rounded-card-lg p-6',
        'bg-cinema-card border border-cinema-border',
        'shadow-cinema',
        'transition-all duration-500',
        'hover:border-gold-500/25 hover:shadow-cinema-lg',
        className,
      )}
      {...props}
    >
      {/* Top rim glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/50">
            {label}
          </p>
          <p className="text-3xl font-black text-white tracking-tight">
            {value}
          </p>
        </div>
        {icon && (
          <div
            className={cn(
              'flex items-center justify-center w-11 h-11 rounded-xl',
              accent.bg,
              accent.text,
              'group-hover:' + accent.glow,
              'transition-all duration-500',
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-1 font-bold',
              trend.value >= 0 ? 'text-success' : 'text-danger',
            )}
          >
            {trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value)}%
          </span>
          {trend.label && <span className="text-white/40">{trend.label}</span>}
        </div>
      )}
    </div>
  );
};

StatCard.displayName = 'StatCard';
