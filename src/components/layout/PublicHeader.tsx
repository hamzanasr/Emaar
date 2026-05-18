'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Logo, Button, cn } from '@emaar/ui';
import { useAuthStore } from '@/stores/auth.store';

interface PublicHeaderProps {
  /** Highlight active nav item */
  active?: 'home' | 'marketplace' | 'about';
  transparent?: boolean;
}

/**
 * Public header for marketing/marketplace pages.
 * Shows login/register if not authenticated, or "go to dashboard" if logged in.
 */
export function PublicHeader({ active, transparent }: PublicHeaderProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const { user, isAuthenticated } = useAuthStore();

  // Determine dashboard route based on role
  const dashboardHref = React.useMemo(() => {
    if (!user) return `/${locale}`;
    switch (user.role) {
      case 'CLIENT':
        return `/${locale}/client`;
      case 'CONTRACTOR':
        return `/${locale}/contractor`;
      case 'SUPPLIER':
        return `/${locale}/supplier`;
      default:
        return `/${locale}`;
    }
  }, [user, locale]);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 transition-all duration-300',
        transparent
          ? 'bg-cinema-deepest/40 backdrop-blur-cinema border-b border-white/[0.04]'
          : 'bg-cinema-deepest/80 backdrop-blur-cinema border-b border-cinema-border',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href={`/${locale}`}>
          <Logo size="sm" />
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href={`/${locale}`}
            className={cn(
              'transition-colors',
              active === 'home' ? 'text-gold-300' : 'text-white/70 hover:text-gold-300',
            )}
          >
            الرئيسية
          </Link>
          <Link
            href={`/${locale}/marketplace`}
            className={cn(
              'transition-colors',
              active === 'marketplace' ? 'text-gold-300' : 'text-white/70 hover:text-gold-300',
            )}
          >
            سوق المواد
          </Link>
          <Link
            href={`/${locale}#features`}
            className="text-white/70 hover:text-gold-300 transition-colors"
          >
            المميزات
          </Link>
          <Link
            href={`/${locale}#contact`}
            className={cn(
              'transition-colors',
              active === 'about' ? 'text-gold-300' : 'text-white/70 hover:text-gold-300',
            )}
          >
            تواصل معنا
          </Link>
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <Link href={dashboardHref}>
              <Button variant="gold" size="sm">
                لوحتي
              </Button>
            </Link>
          ) : (
            <>
              <Link href={`/${locale}/login`} className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link href={`/${locale}/register`}>
                <Button variant="outline-gold" size="sm">
                  إنشاء حساب
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
