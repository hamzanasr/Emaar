'use client';

import * as React from 'react';
import { cn } from '@emaar/ui';
import type { UserRole } from '@emaar/types';

export type SelectableRole = Extract<UserRole, 'CLIENT' | 'CONTRACTOR' | 'SUPPLIER'>;

interface RoleOption {
  value: SelectableRole;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const roleOptions: RoleOption[] = [
  {
    value: 'CLIENT',
    title: 'العميل / المالك',
    description: 'أطلق مشروعك الإنشائي وتابع كل مرحلة',
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    value: 'CONTRACTOR',
    title: 'المقاول الهندسي',
    description: 'قدّم عروضك الفنية وارفع المخططات',
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95"
        />
      </svg>
    ),
  },
  {
    value: 'SUPPLIER',
    title: 'المورد / التاجر',
    description: 'اعرض منتجاتك من مواد البناء',
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12L11.204 3.045c.439-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    ),
  },
];

interface RoleSelectorProps {
  value: SelectableRole | null;
  onChange: (role: SelectableRole) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      {roleOptions.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'group w-full text-right',
              'flex items-center gap-4 p-4 rounded-card',
              'bg-cinema-surface border-2 transition-all duration-300',
              selected
                ? 'border-gold-500 bg-gold-500/5 shadow-glow-gold-sm'
                : 'border-cinema-border hover:border-gold-500/30 hover:bg-white/[0.02]',
            )}
          >
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300',
                selected
                  ? 'bg-gold-gradient text-cinema-deepest'
                  : 'bg-gold-500/10 text-gold-400 group-hover:bg-gold-500/20',
              )}
            >
              {option.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'font-bold tracking-cinema mb-0.5 transition-colors',
                  selected ? 'text-gold-300' : 'text-white',
                )}
              >
                {option.title}
              </h3>
              <p className="text-sm text-white/60">{option.description}</p>
            </div>
            <div
              className={cn(
                'shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                selected
                  ? 'bg-gold-500 border-gold-500'
                  : 'border-white/20 group-hover:border-gold-500/50',
              )}
            >
              {selected && (
                <svg
                  className="w-3.5 h-3.5 text-cinema-deepest"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
