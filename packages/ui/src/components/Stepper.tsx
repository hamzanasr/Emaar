import * as React from 'react';
import { cn } from '../lib/cn';

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep: number; // 0-based
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <ol className={cn('flex items-center w-full', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.id}
            className={cn('flex items-center', !isLast && 'flex-1')}
          >
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={cn(
                  'relative flex items-center justify-center',
                  'w-10 h-10 rounded-full border-2',
                  'transition-all duration-500',
                  isCompleted &&
                    'bg-gold-gradient border-gold-500 shadow-glow-gold-sm text-cinema-deepest',
                  isCurrent &&
                    'bg-cinema-surface border-gold-500 text-gold-400 shadow-glow-gold-sm',
                  !isCompleted &&
                    !isCurrent &&
                    'bg-cinema-surface border-white/20 text-white/40',
                )}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-bold tabular-nums">{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <div className="mt-3 text-center min-w-[80px] max-w-[140px]">
                <p
                  className={cn(
                    'text-xs font-bold tracking-cinema transition-colors',
                    (isCompleted || isCurrent) ? 'text-white' : 'text-white/40',
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-[10px] text-white/40 mt-0.5 leading-tight">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector */}
            {!isLast && (
              <div className="flex-1 h-px mx-2 -mt-12 relative">
                <div className="absolute inset-0 bg-white/[0.06]" />
                <div
                  className={cn(
                    'absolute inset-y-0 right-0 transition-all duration-700',
                    isCompleted ? 'left-0 bg-gold-gradient' : 'left-full',
                  )}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
