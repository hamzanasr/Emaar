'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button, Input, Badge } from '@emaar/ui';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RoleSelector, type SelectableRole } from '@/components/auth/RoleSelector';
import { useAuthStore } from '@/stores/auth.store';
import { api, ApiError } from '@/lib/api';
import { getLandingRoute } from '@/hooks/useAuth';

/**
 * Onboarding — completes new user profile after first OTP verification.
 * Captures: role (if not set), full name (Arabic + English), email.
 */
export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const { user, isAuthenticated, setUser } = useAuthStore();

  const [step, setStep] = React.useState<'role' | 'profile'>('role');
  const [role, setRole] = React.useState<SelectableRole | null>(null);
  const [fullNameAr, setFullNameAr] = React.useState('');
  const [fullNameEn, setFullNameEn] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [validationError, setValidationError] = React.useState<string | null>(null);

  // Guard: redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace(`/${locale}/login`);
    }
  }, [isAuthenticated, user, locale, router]);

  // Pre-fill role from sessionStorage if available (from registration flow)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const intendedRole = window.sessionStorage.getItem('emaar_intended_role') as
      | SelectableRole
      | null;
    if (intendedRole && ['CLIENT', 'CONTRACTOR', 'SUPPLIER'].includes(intendedRole)) {
      setRole(intendedRole);
      // If role already chosen, jump to profile step
      setStep('profile');
    }
  }, []);

  const updateProfileMutation = useMutation({
    mutationFn: () =>
      api.updateProfile({
        fullNameAr,
        fullNameEn: fullNameEn || fullNameAr, // fallback
        email: email || undefined,
        role: role!,
      }),
    onSuccess: ({ data }) => {
      setUser(data);
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('emaar_intended_role');
      }
      router.push(getLandingRoute(locale, role!, false));
    },
  });

  const apiErrorMessage =
    updateProfileMutation.error instanceof ApiError
      ? updateProfileMutation.error.message
      : null;

  const handleNextFromRole = () => {
    if (!role) {
      setValidationError('اختر نوع حسابك أولاً');
      return;
    }
    setValidationError(null);
    setStep('profile');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullNameAr.trim() || fullNameAr.trim().length < 3) {
      setValidationError('أدخل الاسم الكامل بالعربية (3 أحرف على الأقل)');
      return;
    }
    setValidationError(null);
    updateProfileMutation.mutate();
  };

  if (!user) return null;

  // ─── STEP 1: Role Selection ───────────────────────────────────
  if (step === 'role') {
    return (
      <AuthLayout
        step="الخطوة 1 / 2"
        brandQuote={{
          line: 'لنُكمل إعداد حسابك',
          sub: 'اختر نوع حسابك لتخصيص تجربتك على المنصة.',
        }}
      >
        <div className="space-y-3 mb-8 text-center lg:text-right">
          <Badge variant="gold" dot className="mb-1">
            مرحباً بك في إعمار
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
            من أنت؟
          </h1>
          <p className="text-white/60 text-sm">
            اختر النوع الذي يصف نشاطك على المنصة
          </p>
        </div>

        <div className="space-y-6">
          <RoleSelector value={role} onChange={setRole} />

          {validationError && (
            <p className="text-xs text-danger text-center">{validationError}</p>
          )}

          <Button
            variant="gold"
            size="lg"
            fullWidth
            disabled={!role}
            onClick={handleNextFromRole}
          >
            متابعة
          </Button>
        </div>
      </AuthLayout>
    );
  }

  // ─── STEP 2: Profile Details ──────────────────────────────────
  return (
    <AuthLayout
      step="الخطوة 2 / 2"
      brandQuote={{
        line: 'لمسة أخيرة لإكمال ملفك',
        sub: 'أدخل اسمك الكامل لنُخصص تجربتك على المنصة.',
      }}
    >
      <div className="space-y-3 mb-8 text-center lg:text-right">
        <Badge variant="gold" dot className="mb-1">
          إكمال البيانات
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
          عرّفنا بنفسك
        </h1>
        <p className="text-white/60 text-sm">
          ستُستخدم هذه البيانات في عقودك ومراسلاتك على المنصة
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
          label="الاسم الكامل بالعربية *"
          placeholder="أحمد عبدالله الشمري"
          value={fullNameAr}
          onChange={(e) => {
            setFullNameAr(e.target.value);
            setValidationError(null);
          }}
          autoFocus
          required
        />

        <Input
          label="الاسم بالإنجليزية (اختياري)"
          placeholder="Ahmed Abdullah Al-Shamri"
          value={fullNameEn}
          onChange={(e) => setFullNameEn(e.target.value)}
          dir="ltr"
        />

        <Input
          label="البريد الإلكتروني (اختياري)"
          type="email"
          placeholder="ahmed@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          dir="ltr"
          hint="نستخدمه لإرسال الإشعارات الهامة فقط"
        />

        {(validationError || apiErrorMessage) && (
          <p className="text-xs text-danger flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {validationError || apiErrorMessage}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => setStep('role')}
            disabled={updateProfileMutation.isPending}
          >
            رجوع
          </Button>
          <Button
            type="submit"
            variant="gold"
            size="lg"
            fullWidth
            loading={updateProfileMutation.isPending}
            disabled={!fullNameAr.trim()}
          >
            إنهاء وادخل المنصة
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
