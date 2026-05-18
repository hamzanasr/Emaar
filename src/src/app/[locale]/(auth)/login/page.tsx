'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@emaar/ui';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { useAuth } from '@/hooks/useAuth';
import { ApiError, DEMO_MODE, DEMO_OTP } from '@/lib/api';

export default function LoginPage() {
  const [phone, setPhone] = React.useState('');
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const { sendOtp, sendOtpStatus } = useAuth();

  const phoneIsValid = phone.startsWith('+966') && phone.length === 13;
  const apiErrorMessage =
    sendOtpStatus.error instanceof ApiError ? sendOtpStatus.error.message : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!phoneIsValid) {
      setValidationError('أدخل رقم جوال سعودي صحيح (9 أرقام بعد 966+)');
      return;
    }

    try {
      await sendOtp(phone);
    } catch {
      // Error is captured in sendOtpStatus.error
    }
  };

  return (
    <AuthLayout
      step="الخطوة 1 / 2"
      brandQuote={{
        line: 'ابدأ رحلتك مع المنصة الأرقى للمشاريع الإنشائية',
        sub: 'تحقَّق من رقم جوالك للوصول إلى لوحتك الخاصة وإدارة مشاريعك بثقة.',
      }}
    >
      {/* Demo Banner */}
      {DEMO_MODE && (
        <div className="mb-6 p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 text-center">
          <p className="text-sm font-bold text-gold-300">🚀 وضع تجريبي</p>
          <p className="text-xs text-gold-300/80 mt-1">
            رمز التحقق الثابت: <span className="font-mono font-bold text-gold-400 text-lg">{DEMO_OTP}</span>
          </p>
        </div>
      )}

      {/* Header */}
      <div className="space-y-3 mb-10 text-center lg:text-right">
        <h1 className="text-4xl font-black tracking-tight text-white">
          تسجيل الدخول
        </h1>
        <p className="text-white/60 text-sm leading-relaxed">
          أدخل رقم جوالك المسجَّل وسنرسل لك رمز التحقق فوراً
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <PhoneInput
          value={phone}
          onChange={(v) => {
            setPhone(v);
            setValidationError(null);
          }}
          error={validationError || apiErrorMessage || undefined}
          autoFocus
          disabled={sendOtpStatus.isPending}
        />

        <Button
          type="submit"
          variant="gold"
          size="lg"
          fullWidth
          loading={sendOtpStatus.isPending}
          disabled={!phoneIsValid}
        >
          إرسال رمز التحقق
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-10 text-center">
        <p className="text-sm text-white/50">
          ليس لديك حساب؟{' '}
          <Link
            href="/ar/register"
            className="text-gold-400 font-semibold hover:text-gold-300 transition"
          >
            أنشئ حساباً جديداً
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
