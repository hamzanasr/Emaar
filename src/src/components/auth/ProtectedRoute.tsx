'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import type { UserRole } from '@emaar/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Allowed roles. If omitted, any authenticated user is allowed */
  allowedRoles?: UserRole[];
}

/**
 * Client-side route guard.
 * Redirects to /login if not authenticated, or to user's home if role mismatch.
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Wait for Zustand hydration from localStorage
    if (!isHydrated) return;

    if (!isAuthenticated || !user) {
      router.replace(`/${locale}/login`);
      return;
    }

    // Onboarding check: redirect if profile not completed
    if (!user.fullNameAr || user.fullNameAr.trim().length === 0) {
      router.replace(`/${locale}/onboarding`);
      return;
    }

    // Role check
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      const homeMap: Record<string, string> = {
        CLIENT: 'client',
        CONTRACTOR: 'contractor',
        SUPPLIER: 'supplier',
      };
      const home = homeMap[user.role] || '';
      router.replace(`/${locale}/${home}`);
      return;
    }

    setIsReady(true);
  }, [isHydrated, isAuthenticated, user, allowedRoles, locale, router]);

  if (!isHydrated || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cinema-deepest">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
          <p className="text-sm text-white/60">جارٍ التحقق من الجلسة...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
