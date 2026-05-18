import * as React from 'react';
import { cn } from '../lib/cn';

type CardVariant = 'default' | 'glass' | 'luxury' | 'elevated';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  rim?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-cinema-surface border border-cinema-border shadow-cinema hover:border-gold-500/20 hover:shadow-cinema-lg',
  glass:
    'backdrop-blur-cinema bg-white/[0.03] border border-white/[0.08] shadow-cinema hover:bg-white/[0.05] hover:border-gold-500/20',
  luxury:
    'bg-cinema-card border border-gold-500/[0.15] shadow-cinema shadow-inner-luxury hover:border-gold-500/30 hover:shadow-cinema-lg',
  elevated:
    'bg-cinema-elevated border border-white/[0.06] shadow-cinema-lg hover:border-gold-500/25',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', rim, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-card-lg p-6 transition-all duration-500',
          variantClasses[variant],
          rim && 'cinema-rim',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

// ─── Card Sub-Components ─────────────────────────────────────

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4 space-y-1.5', className)} {...props}>
      {children}
    </div>
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-bold text-white tracking-cinema', className)}
      {...props}
    >
      {children}
    </h3>
  ),
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-white/60 leading-relaxed', className)} {...props}>
      {children}
    </p>
  ),
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-white/80', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-6 pt-4 border-t border-white/[0.06] flex items-center', className)}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';
