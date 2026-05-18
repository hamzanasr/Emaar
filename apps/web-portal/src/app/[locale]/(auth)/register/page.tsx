'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Badge } from '@emaar/ui';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { RoleSelector, type SelectableRole } from '@/components/auth/RoleSelector';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const initialRole = searchParams?.get('role')?.toUpperCase() as SelectableRole | undefined;

  const [phone, setPhone] = React.useState('');
  const [role, setRole] = React.useState<SelectableRole | null>(
    initialRole && ['CLIENT', 'CONTRACTOR', 'SUPPLIER'].includes(initialRole)
      ? initialRole
      : null,
  );
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const { sendOtp, sendOtpStatus, setPendingPhone } = useAuth();

  const phoneIsValid = phone.startsWith('+966') && phone.length === 13;
  const apiErrorMessage =
    sendOtpStatus.error instanceof ApiError ? sendOtpStatus.error.message : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!role) {
      setValidationError('اختر نوع حسابك أولاً');
      return;
    }
    if (!phoneIsValid) {
      setValidationError('أدخل رقم جوال سعودي صحيح');
      return;
    }

    // Persist intended role for onboarding step
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('emaar_intended_role', role);
    }

    try {
      await sendOtp(phone);
    } catch {
      // captured in sendOtpStatus.error
    }
  };

  return (
    <AuthLayout
      step="إنشاء حساب جديد"
      brandQuote={{
        line: 'انضم إلى منصة المشاريع الإنشائية الأرقى',
        sub: 'اختر نوع حسابك وأدخل رقم جوالك للبدء.',
      }}
    >
      {/* Header */}
      <div className="space-y-3 mb-8 text-center lg:text-right">
        <Badge variant="gold" dot className="mb-1">
          تسجيل جديد
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
          أنشئ حسابك في منصة إعمار
        </h1>
        <p className="text-white/60 text-sm leading-relaxed">
          خطوة بسيطة للبدء في إدارة مشاريعك أو تقديم خدماتك الهندسية
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-7" noValidate>
        {/* Role Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-white/80 tracking-cinema">
            اختر نوع حسابك
          </label>
          <RoleSelector value={role} onChange={setRole} />
        </div>

        {/* Phone */}
        <PhoneInput
          value={phone}
          onChange={(v) => {
            setPhone(v);
            setValidationError(null);
          }}
          error={validationError || apiErrorMessage || undefined}
          disabled={sendOtpStatus.isPending}
        />

        <Button
          type="submit"
          variant="gold"
          size="lg"
          fullWidth
          loading={sendOtpStatus.isPending}
          disabled={!phoneIsValid || !role}
        >
          متابعة وإرسال رمز التحقق
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-10 text-center">
        <p className="text-sm text-white/50">
          لديك حساب بالفعل؟{' '}
          <Link
            href="/ar/login"
            className="text-gold-400 font-semibold hover:text-gold-300 transition"
          >
            سجِّل دخولك
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
