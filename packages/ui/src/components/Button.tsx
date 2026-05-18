import * as React from 'react';
import { cn } from '../lib/cn';

type ButtonVariant = 'primary' | 'accent' | 'gold' | 'outline-gold' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-700 text-white hover:bg-primary-600 hover:shadow-glow-blue',
  accent:
    'bg-crimson-gradient text-white hover:shadow-glow-crimson',
  gold:
    'bg-gold-gradient text-cinema-deepest font-bold hover:shadow-glow-gold',
  'outline-gold':
    'border border-gold-500/50 text-gold-300 bg-transparent hover:border-gold-400 hover:text-gold-200 hover:bg-gold-500/5 hover:shadow-glow-gold-sm',
  ghost:
    'text-white/80 bg-transparent hover:bg-white/5 hover:text-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-7 py-3.5 text-base',
  lg: 'px-9 py-4 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading,
      iconLeft,
      iconRight,
      fullWidth,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          'relative inline-flex items-center justify-center gap-2',
          'rounded-button font-semibold tracking-cinema',
          'transition-all duration-300 ease-out',
          'active:scale-[0.98]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-deepest',
          // Variant + Size
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {iconLeft && <span className="inline-flex">{iconLeft}</span>}
            <span>{children}</span>
            {iconRight && <span className="inline-flex">{iconRight}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
