'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Logo, Badge, Button, cn } from '@emaar/ui';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@emaar/types';

// ─── Nav Item Definition ─────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

// Role-specific nav configurations
const navConfig: Record<UserRole, { home: string; items: NavItem[] }> = {
  CLIENT: {
    home: 'client',
    items: [
      {
        label: 'لوحة المعلومات',
        href: '/client',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
      {
        label: 'مشاريعي',
        href: '/client/projects',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        label: 'سوق المواد',
        href: '/client/marketplace',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
      {
        label: 'الضمان المالي',
        href: '/client/escrow',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ),
      },
      {
        label: 'المحادثات',
        href: '/client/chat',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        ),
      },
    ],
  },
  CONTRACTOR: {
    home: 'contractor',
    items: [
      {
        label: 'لوحة المعلومات',
        href: '/contractor',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
      {
        label: 'المشاريع المتاحة',
        href: '/contractor/projects',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
      },
      {
        label: 'عروضي الفنية',
        href: '/contractor/bids',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        label: 'مشاريعي الجارية',
        href: '/contractor/active',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877" />
          </svg>
        ),
      },
      {
        label: 'المالية',
        href: '/contractor/finance',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        label: 'المحادثات',
        href: '/contractor/chat',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        ),
      },
    ],
  },
  SUPPLIER: {
    home: 'supplier',
    items: [
      {
        label: 'لوحة المعلومات',
        href: '/supplier',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
      {
        label: 'منتجاتي',
        href: '/supplier/products',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
      },
      {
        label: 'الطلبات',
        href: '/supplier/orders',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
      },
      {
        label: 'المالية',
        href: '/supplier/finance',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        label: 'المحادثات',
        href: '/supplier/chat',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        ),
      },
    ],
  },
  ADMIN: { home: 'client', items: [] },
  SUPER_ADMIN: { home: 'client', items: [] },
};

const roleLabels: Record<UserRole, string> = {
  CLIENT: 'حساب العميل',
  CONTRACTOR: 'حساب المقاول',
  SUPPLIER: 'حساب المورد',
  ADMIN: 'إدارة',
  SUPER_ADMIN: 'إدارة عُليا',
};

// ═══════════════════════════════════════════════════════════════
// Sidebar
// ═══════════════════════════════════════════════════════════════

interface SidebarProps {
  role: UserRole;
  user: { fullNameAr: string; phone: string };
  onLogout: () => void;
}

function Sidebar({ role, user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const config = navConfig[role];

  return (
    <aside className="fixed inset-y-0 right-0 w-72 bg-cinema-deep border-l border-cinema-border flex flex-col z-30">
      {/* Top rim glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      {/* Header */}
      <div className="p-6 border-b border-white/[0.04]">
        <Link href={`/${locale}`}>
          <Logo size="md" />
        </Link>
        <Badge variant="gold" className="mt-4 text-[10px]" dot>
          {roleLabels[role]}
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {config.items.map((item) => {
          const fullPath = `/${locale}${item.href}`;
          const isActive =
            pathname === fullPath ||
            (item.href !== `/${config.home}` && pathname?.startsWith(fullPath));

          return (
            <Link
              key={item.href}
              href={fullPath}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-button',
                'text-sm font-medium tracking-cinema',
                'transition-all duration-300',
                isActive
                  ? 'text-gold-300 bg-gold-500/[0.08] border border-gold-500/20 shadow-glow-gold-sm'
                  : 'text-white/60 hover:text-gold-300 hover:bg-white/[0.04]',
              )}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold bg-accent-500 text-white px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile + Logout */}
      <div className="p-4 border-t border-white/[0.04] space-y-2">
        <div className="flex items-center gap-3 px-2 py-3 rounded-button">
          <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-cinema-deepest font-bold shrink-0">
            {user.fullNameAr?.[0] || '؟'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.fullNameAr}</p>
            <p className="text-xs text-white/40 truncate" dir="ltr">{user.phone}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          onClick={onLogout}
          iconLeft={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          }
        >
          تسجيل الخروج
        </Button>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════
// Top Bar
// ═══════════════════════════════════════════════════════════════

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 bg-cinema-deepest/80 backdrop-blur-cinema border-b border-cinema-border">
      <div className="flex items-center justify-between px-8 py-5 gap-4">
        <div className="min-w-0">
          {subtitle && (
            <p className="text-xs text-white/40 tracking-widest uppercase mb-1 truncate">
              {subtitle}
            </p>
          )}
          <h1 className="text-2xl font-bold text-white tracking-cinema truncate">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {/* Search */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-button bg-cinema-surface border border-white/[0.06] min-w-[260px]">
            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="ابحث..."
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
            />
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="relative w-10 h-10 rounded-button bg-cinema-surface border border-white/[0.06] flex items-center justify-center hover:border-gold-500/30 transition-colors"
            aria-label="الإشعارات"
          >
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent-500 rounded-full ring-2 ring-cinema-deepest" />
          </button>

          {actions}
        </div>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main Layout Wrapper
// ═══════════════════════════════════════════════════════════════

interface DashboardLayoutProps {
  role: UserRole;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardLayout({
  role,
  title,
  subtitle,
  actions,
  children,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cinema-deepest">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(201,169,97,0.06)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(60,101,167,0.08)_0%,transparent_70%)]" />
      </div>

      <Sidebar
        role={role}
        user={{ fullNameAr: user.fullNameAr, phone: user.phone }}
        onLogout={() => logout()}
      />

      <main className="mr-72 relative">
        <TopBar title={title} subtitle={subtitle} actions={actions} />
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
