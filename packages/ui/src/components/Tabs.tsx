'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

// ─── Tabs Context ──────────────────────────────────────────────
interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
}
const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('Tabs subcomponents must be used inside <Tabs>');
  return ctx;
}

// ─── Root ──────────────────────────────────────────────────────
export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onChange: onValueChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

// ─── Tabs List ─────────────────────────────────────────────────
export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'relative inline-flex items-center gap-1 p-1.5',
        'bg-cinema-surface border border-cinema-border rounded-card',
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Tab Trigger ───────────────────────────────────────────────
export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export function TabsTrigger({ value, children, icon, badge, disabled }: TabsTriggerProps) {
  const { value: activeValue, onChange } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => onChange(value)}
      className={cn(
        'relative inline-flex items-center gap-2 px-5 py-2.5 rounded-button',
        'text-sm font-semibold tracking-cinema',
        'transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isActive
          ? 'bg-gold-gradient text-cinema-deepest shadow-glow-gold-sm'
          : 'text-white/60 hover:text-white hover:bg-white/[0.04]',
      )}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      <span>{children}</span>
      {badge && <span className="inline-flex">{badge}</span>}
    </button>
  );
}

// ─── Tab Content ───────────────────────────────────────────────
export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { value: activeValue } = useTabsContext();
  if (activeValue !== value) return null;
  return (
    <div role="tabpanel" className={cn('animate-fade-in mt-6', className)}>
      {children}
    </div>
  );
}
