import * as React from 'react';
import Link from 'next/link';
import { Logo, CinemaLight } from '@emaar/ui';

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Step indicator (e.g., "1 / 3") shown at the top */
  step?: string;
  /** Optional cinematic decorative quote on the brand panel */
  brandQuote?: { line: string; sub?: string };
}

/**
 * Cinematic split-screen auth layout.
 * - Left (in RTL: right): brand showcase panel with mesh lighting
 * - Right (in RTL: left): form content
 */
export function AuthLayout({ children, step, brandQuote }: AuthLayoutProps) {
  return (
    <main className="min-h-screen w-full bg-cinema-deepest text-white overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* ─── Brand / Cinematic Panel ─── */}
        <aside className="relative hidden lg:flex flex-col justify-between p-12 bg-cinema-hero overflow-hidden">
          {/* Ambient lighting layers */}
          <CinemaLight color="gold" intensity="strong" position="top" className="h-[60%]" />
          <CinemaLight color="blue" intensity="medium" position="bottom" className="h-[60%]" />

          {/* Animated grid backdrop */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(201,169,97,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,97,0.4) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            <Link href="/ar" className="inline-block">
              <Logo size="lg" />
            </Link>
          </div>

          <div className="relative z-10 max-w-lg">
            {brandQuote ? (
              <>
                <h2 className="text-4xl xl:text-5xl font-black leading-[1.15] tracking-tight mb-4">
                  {brandQuote.line}
                </h2>
                {brandQuote.sub && (
                  <p className="text-white/60 text-lg leading-relaxed">{brandQuote.sub}</p>
                )}
              </>
            ) : (
              <>
                <h2 className="text-4xl xl:text-5xl font-black leading-[1.15] tracking-tight mb-4">
                  حيث تلتقي{' '}
                  <span className="bg-gold-text bg-clip-text text-transparent">
                    الهندسة
                  </span>{' '}
                  بالثقة
                </h2>
                <p className="text-white/60 text-lg leading-relaxed">
                  منصة رقمية متكاملة تربط الملاك بالمقاولين والموردين، بضمان مالي محكم
                  ومراجعة جودة هندسية مفصلة.
                </p>
              </>
            )}

            {/* Trust pills */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-white/70 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                ضمان مالي 100%
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-white/70 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                مراجعة هندسية
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-white/70 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                شفافية كاملة
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-white/30 tracking-widest uppercase">
            © {new Date().getFullYear()} منصة إعمار الهندسية
          </div>
        </aside>

        {/* ─── Form Panel ─── */}
        <section className="relative flex flex-col px-6 py-10 lg:px-16 lg:py-12">
          {/* Mobile-only Logo (hidden on lg+) */}
          <div className="lg:hidden mb-10">
            <Link href="/ar" className="inline-block">
              <Logo size="md" />
            </Link>
          </div>

          {/* Step indicator */}
          {step && (
            <div className="absolute top-8 left-8 lg:left-16">
              <span className="text-xs font-semibold tracking-widest uppercase text-white/40">
                {step}
              </span>
            </div>
          )}

          {/* Centered form */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md animate-fade-in-up">{children}</div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-white/30 mt-8">
            بتسجيل الدخول، أنت توافق على{' '}
            <Link href="/ar/terms" className="text-gold-400 hover:text-gold-300 transition">
              الشروط والأحكام
            </Link>{' '}
            و{' '}
            <Link href="/ar/privacy" className="text-gold-400 hover:text-gold-300 transition">
              سياسة الخصوصية
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
