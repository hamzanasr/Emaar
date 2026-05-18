'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@emaar/ui';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { OtpInput } from '@/components/auth/OtpInput';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth.store';
import { ApiError, DEMO_MODE, DEMO_OTP } from '@/lib/api';

const OTP_TTL_SECONDS = 5 * 60;
const RESEND_COOLDOWN_SECONDS = 30;

/**
 * Format phone number for display: +966 5x xxx xxxx
 */
function formatPhone(phone: string): string {
  if (!phone.startsWith('+966')) return phone;
  const local = phone.slice(4);
  if (local.length !== 9) return phone;
  return `+966 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
}

export default function VerifyOtpPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const { pendingPhone, sendOtp, verifyOtp, sendOtpStatus, verifyOtpStatus } = useAuth();

  const [code, setCode] = React.useState(DEMO_MODE ? DEMO_OTP : '');
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = React.useState(OTP_TTL_SECONDS);
  const [resendCooldown, setResendCooldown] = React.useState(0);

  // Redirect away if no pending phone (but only if not authenticated)
  const { isAuthenticated } = useAuthStore();
  React.useEffect(() => {
    if (!pendingPhone && !isAuthenticated) {
      router.replace(`/${locale}/login`);
    }
  }, [pendingPhone, isAuthenticated, locale, router]);

  // OTP TTL countdown
  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  // Resend cooldown countdown
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const apiErrorMessage =
    verifyOtpStatus.error instanceof ApiError ? verifyOtpStatus.error.message : null;

  const handleVerify = async (otpCode?: string) => {
    const codeToVerify = otpCode || code;
    if (!pendingPhone) return;

    if (codeToVerify.length !== 4) {
      setValidationError('أدخل الرمز كاملاً (4 أرقام)');
      return;
    }
    setValidationError(null);

    try {
      await verifyOtp({ phone: pendingPhone, code: codeToVerify });
    } catch {
      setCode(DEMO_MODE ? DEMO_OTP : '');
    }
  };

  const handleResend = async () => {
    if (!pendingPhone) return;
    try {
      await sendOtp(pendingPhone);
      setSecondsLeft(OTP_TTL_SECONDS);
      setResendCooldown(DEMO_MODE ? 0 : RESEND_COOLDOWN_SECONDS);
      setCode(DEMO_MODE ? DEMO_OTP : '');
    } catch {
      // error displayed via sendOtpStatus.error if needed
    }
  };

  const ttlMinutes = Math.floor(secondsLeft / 60);
  const ttlSeconds = secondsLeft % 60;

  if (!pendingPhone) {
    return null; // Will redirect
  }

  return (
    <AuthLayout
      step="الخطوة 2 / 2"
      brandQuote={{
        line: 'خطوة واحدة تفصلك عن منصتك',
        sub: 'تحقَّق من الرمز المُرسَل لإكمال تسجيل الدخول.',
      }}
    >
      {/* Demo Banner */}
      {DEMO_MODE && (
        <div className="mb-6 p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 text-center">
          <p className="text-sm font-bold text-gold-300">🚀 وضع تجريبي</p>
          <p className="text-xs text-gold-300/80 mt-1">
            الرمز مُعبَّأ تلقائياً. اضغط "تحقَّق وادخل" للدخول مباشرة.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="space-y-3 mb-10 text-center lg:text-right">
        <h1 className="text-4xl font-black tracking-tight text-white">
          أدخل رمز التحقق
        </h1>
        <p className="text-white/60 text-sm leading-relaxed">
          أرسلنا رمزاً مكوَّناً من 6 أرقام إلى
        </p>
        <p className="text-gold-400 font-bold text-base tracking-cinema" dir="ltr">
          {formatPhone(pendingPhone)}
        </p>
      </div>

      {/* OTP Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}
        className="space-y-6"
        noValidate
      >
        <OtpInput
          length={4}
          value={code}
          onChange={(v) => {
            setCode(v);
            setValidationError(null);
          }}
          onComplete={(v) => handleVerify(v)}
          error={validationError || apiErrorMessage || undefined}
          disabled={verifyOtpStatus.isPending}
        />

        {/* Countdown */}
        <div className="text-center text-xs">
          {secondsLeft > 0 ? (
            <p className="text-white/50">
              تنتهي صلاحية الرمز خلال{' '}
              <span className="text-gold-400 font-bold tabular-nums">
                {ttlMinutes}:{String(ttlSeconds).padStart(2, '0')}
              </span>
            </p>
          ) : (
            <p className="text-warning">انتهت صلاحية الرمز. يرجى طلب رمز جديد.</p>
          )}
        </div>

        <Button
          type="submit"
          variant="gold"
          size="lg"
          fullWidth
          loading={verifyOtpStatus.isPending}
          disabled={code.length !== 4 && code.length !== 6}
        >
          تحقَّق وادخل
        </Button>
      </form>

      {/* Resend */}
      <div className="mt-8 text-center space-y-3">
        <p className="text-sm text-white/50">لم يصل الرمز؟</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={!DEMO_MODE && (resendCooldown > 0 || sendOtpStatus.isPending)}
          className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(!DEMO_MODE && resendCooldown > 0)
            ? `إعادة الإرسال خلال ${resendCooldown} ثانية`
            : sendOtpStatus.isPending
              ? 'جارٍ الإرسال...'
              : 'إعادة إرسال الرمز'}
        </button>
      </div>

      {/* Change phone number */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => router.push(`/${locale}/login`)}
          className="text-xs text-white/40 hover:text-white/70 transition"
        >
          ← تغيير رقم الجوال
        </button>
      </div>
    </AuthLayout>
  );
}
