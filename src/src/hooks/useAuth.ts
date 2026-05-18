'use client';

import { useRouter, useParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { api, type VerifyOtpResponse } from '@/lib/api';
import type { UserRole } from '@emaar/types';

/**
 * Routes a user to the correct landing page based on their role and onboarding status.
 */
export function getLandingRoute(
  locale: string,
  role: UserRole,
  isNewUser: boolean,
): string {
  if (isNewUser) {
    return `/${locale}/onboarding`;
  }

  switch (role) {
    case 'CLIENT':
      return `/${locale}/client`;
    case 'CONTRACTOR':
      return `/${locale}/contractor`;
    case 'SUPPLIER':
      return `/${locale}/supplier`;
    case 'ADMIN':
    case 'SUPER_ADMIN':
      // Admin should use the web-admin app
      return `/${locale}/client`;
    default:
      return `/${locale}`;
  }
}

/**
 * useAuth — primary auth hook providing all auth mutations and state.
 */
export function useAuth() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const {
    user,
    accessToken,
    isAuthenticated,
    pendingPhone,
    setAuth,
    setUser,
    setPendingPhone,
    clearAuth,
  } = useAuthStore();

  // ─── Send OTP ─────────────────────────────────────────────────
  const sendOtpMutation = useMutation({
    mutationFn: (phone: string) => api.sendOtp(phone),
    onSuccess: (_, phone) => {
      setPendingPhone(phone);
      router.push(`/${locale}/verify`);
    },
  });

  // ─── Verify OTP ───────────────────────────────────────────────
  const verifyOtpMutation = useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      api.verifyOtp(phone, code),
    onSuccess: (data: VerifyOtpResponse) => {
      const { accessToken, refreshToken, user } = data;
      api.setToken(accessToken);
      api.setRefreshToken(refreshToken);
      setAuth(user, accessToken, refreshToken);
      router.push(getLandingRoute(locale, user.role, user.isNewUser));
    },
  });

  // ─── Logout ───────────────────────────────────────────────────
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          await api.logout(refreshToken);
        } catch {
          // Ignore logout errors
        }
      }
    },
    onSettled: () => {
      api.clearToken();
      clearAuth();
      router.push(`/${locale}`);
    },
  });

  return {
    // State
    user,
    accessToken,
    isAuthenticated,
    pendingPhone,

    // Actions
    setUser,
    setPendingPhone,

    // Mutations
    sendOtp: sendOtpMutation.mutateAsync,
    sendOtpStatus: {
      isPending: sendOtpMutation.isPending,
      error: sendOtpMutation.error,
    },

    verifyOtp: verifyOtpMutation.mutateAsync,
    verifyOtpStatus: {
      isPending: verifyOtpMutation.isPending,
      error: verifyOtpMutation.error,
    },

    logout: logoutMutation.mutate,
  };
}
