import * as React from 'react';
import { cn } from '../lib/cn';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
  md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[10px]' },
  lg: { icon: 'w-14 h-14', text: 'text-3xl', sub: 'text-xs' },
  xl: { icon: 'w-20 h-20', text: 'text-5xl', sub: 'text-sm' },
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className,
  ...props
}) => {
  const s = sizeClasses[size];

  return (
    <div className={cn('inline-flex items-center gap-3', className)} {...props}>
      {(variant === 'full' || variant === 'icon') && (
        <div
          className={cn(
            s.icon,
            'relative flex items-center justify-center',
            'rounded-xl bg-gold-gradient shadow-glow-gold-sm',
            'font-black text-cinema-deepest',
          )}
          aria-hidden="true"
        >
          {/* Stylized "إ" mark */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-1/2 h-1/2"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21V7l9-4 9 4v14" />
            <path d="M9 21V12h6v9" />
            <path d="M3 21h18" />
          </svg>
        </div>
      )}
      {(variant === 'full' || variant === 'text') && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              s.text,
              'font-black tracking-tight text-gold-gradient bg-gold-text bg-clip-text text-transparent',
            )}
          >
            إعمار
          </span>
          <span
            className={cn(
              s.sub,
              'mt-1 font-semibold tracking-widest text-white/60 uppercase',
            )}
          >
            Construction Platform
          </span>
        </div>
      )}
    </div>
  );
};

Logo.displayName = 'Logo';
