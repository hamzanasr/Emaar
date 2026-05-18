import Link from 'next/link';
import {
  Logo,
  Button,
  Card,
  CardTitle,
  CardDescription,
  Badge,
  Divider,
  CinemaLight,
} from '@emaar/ui';
import { DEMO_MODE } from '@/lib/api';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cinema-deepest">
      {/* ─── Cinematic Ambient Lighting ─── */}
      <CinemaLight color="mesh" intensity="medium" position="top" className="h-[80%]" />

      {/* ─── Top Navigation ─── */}
      <header className="relative z-20 px-6 lg:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <Link href="#features" className="hover:text-gold-300 transition-colors">
              المميزات
            </Link>
            <Link href="/ar/marketplace" className="hover:text-gold-300 transition-colors">
              سوق المواد
            </Link>
            <Link href="#how-it-works" className="hover:text-gold-300 transition-colors">
              كيف تعمل المنصة
            </Link>
            <Link href="#contact" className="hover:text-gold-300 transition-colors">
              تواصل معنا
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/ar/login">
              <Button variant="ghost" size="sm">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/ar/register">
              <Button variant="outline-gold" size="sm">
                إنشاء حساب
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative z-10 px-6 lg:px-12 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto text-center">
          {/* Demo Badge */}
          {DEMO_MODE && (
            <div className="flex justify-center mb-6 animate-fade-in">
              <Badge variant="gold" dot>
                🚀 نسخة تجريبية — رمز التحقق: 1234
              </Badge>
            </div>
          )}

          {/* Top Badge */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <Badge variant="gold" dot>
              منصة هندسية متكاملة
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tightest leading-[1.05] mb-8 animate-fade-in-up">
            <span className="block text-white">منصة</span>
            <span className="block bg-gold-text bg-clip-text text-transparent">
              إعمار الهندسية
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="max-w-3xl mx-auto text-lg md:text-xl text-white/70 leading-relaxed mb-10 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            حلٌّ رقمي متكامل لإدارة المشاريع الإنشائية، المقاولات، والاستشارات الهندسية.
            <br className="hidden md:block" />
            نربط بين <span className="text-gold-300">المُلَّاك</span>،{' '}
            <span className="text-gold-300">المقاولين</span>، و
            <span className="text-gold-300">الموردين</span> بأعلى معايير الجودة والشفافية.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <Link href="/ar/register">
              <Button variant="gold" size="lg">
                ابدأ مشروعك الآن
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline-gold" size="lg">
                اكتشف المنصة
              </Button>
            </Link>
          </div>

          {/* Stats Row */}
          <div
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                100%
              </p>
              <p className="text-xs md:text-sm text-white/50 mt-1 tracking-wide">
                ضمان مالي
              </p>
            </div>
            <div className="text-center border-x border-white/[0.06]">
              <p className="text-3xl md:text-4xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                24/7
              </p>
              <p className="text-xs md:text-sm text-white/50 mt-1 tracking-wide">
                متابعة فورية
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                +500
              </p>
              <p className="text-xs md:text-sm text-white/50 mt-1 tracking-wide">
                مقاول معتمد
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Roles Section (Choose your role) ─── */}
      <section className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <Divider variant="gold" label="من أنت؟" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-fade">
            {/* Client Card */}
            <Link href="/ar/register?role=client" className="group">
              <Card variant="luxury" className="h-full text-center" rim>
                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20 group-hover:shadow-glow-gold-sm transition-all duration-500">
                    <svg
                      className="w-8 h-8 text-gold-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">العميل / المالك</CardTitle>
                <CardDescription>
                  أطلق مشروعك الإنشائي، تابع كل مرحلة بالتفصيل، وادفع بثقة عبر نظام الضمان المالي
                </CardDescription>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 group-hover:text-gold-300 transition-colors">
                  ابدأ كعميل
                  <svg
                    className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 19l-7-7 7-7m-7 7h18"
                    />
                  </svg>
                </div>
              </Card>
            </Link>

            {/* Contractor Card */}
            <Link href="/ar/register?role=contractor" className="group">
              <Card variant="luxury" className="h-full text-center" rim>
                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20 group-hover:shadow-glow-gold-sm transition-all duration-500">
                    <svg
                      className="w-8 h-8 text-gold-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                      />
                    </svg>
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">المقاول الهندسي</CardTitle>
                <CardDescription>
                  قدّم عروضك على المشاريع، ارفع المخططات، حدّث نسب الإنجاز، واستلم مستحقاتك بأمان
                </CardDescription>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 group-hover:text-gold-300 transition-colors">
                  انضم كمقاول
                  <svg
                    className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 19l-7-7 7-7m-7 7h18"
                    />
                  </svg>
                </div>
              </Card>
            </Link>

            {/* Supplier Card */}
            <Link href="/ar/register?role=supplier" className="group">
              <Card variant="luxury" className="h-full text-center" rim>
                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20 group-hover:shadow-glow-gold-sm transition-all duration-500">
                    <svg
                      className="w-8 h-8 text-gold-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12L11.204 3.045c.439-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                      />
                    </svg>
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">المورد / التاجر</CardTitle>
                <CardDescription>
                  اعرض منتجاتك من مواد البناء والإضاءات، استقبل الطلبات، وأدر متجرك بكل سهولة
                </CardDescription>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 group-hover:text-gold-300 transition-colors">
                  افتح متجرك
                  <svg
                    className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 19l-7-7 7-7m-7 7h18"
                    />
                  </svg>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="gold" className="mb-4">
              لماذا منصة إعمار؟
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              هندسة <span className="text-gold-gradient bg-gold-text bg-clip-text text-transparent">الثقة</span>
              <br />
              في كل تفصيل
            </h2>
            <p className="text-white/60 leading-relaxed">
              نُعيد تعريف معايير العمل في قطاع الإنشاءات والاستشارات الهندسية بحلول رقمية فاخرة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade">
            <Card variant="glass">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 text-gold-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <CardTitle className="mb-2">ضمان مالي محكم</CardTitle>
              <CardDescription>
                نظام Escrow متقدم يحفظ حقوق جميع الأطراف ولا يُفرج عن الدفعات إلا بعد اعتماد المرحلة
              </CardDescription>
            </Card>

            <Card variant="glass">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 text-gold-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <CardTitle className="mb-2">جودة موثقة</CardTitle>
              <CardDescription>
                مراجعة هندسية مفصلة لكل مرحلة بالصور المُوقَّعة جغرافياً وزمنياً قبل الإفراج عن أي دفعة
              </CardDescription>
            </Card>

            <Card variant="glass">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 text-gold-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <CardTitle className="mb-2">إدارة المخططات</CardTitle>
              <CardDescription>
                ارفع المخططات الهندسية، وثّق التعديلات، وشاركها بأمان مع جميع الأطراف المعنية
              </CardDescription>
            </Card>

            <Card variant="glass">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 text-gold-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <CardTitle className="mb-2">سرعة في التنفيذ</CardTitle>
              <CardDescription>
                مراحل تنفيذ مدروسة بمواعيد محددة، وتنبيهات فورية لأي تأخير محتمل
              </CardDescription>
            </Card>

            <Card variant="glass">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 text-gold-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <CardTitle className="mb-2">شفافية الأسعار</CardTitle>
              <CardDescription>
                مقارنة العروض، تفاصيل التكاليف، وسوق مواد بأسعار واضحة بدون أي وساطة خفية
              </CardDescription>
            </Card>

            <Card variant="glass">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 text-gold-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <CardTitle className="mb-2">تواصل فوري</CardTitle>
              <CardDescription>
                محادثات فورية بين جميع الأطراف، إشعارات لحظية، ومتابعة كاملة لكل تحديث
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 px-6 lg:px-12 pt-16 pb-8 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <Logo size="sm" />
            <p className="text-sm text-white/40 text-center">
              منصة إعمار الهندسية — حلٌّ متكامل لقطاع الإنشاءات والاستشارات الهندسية
            </p>
            <div className="flex items-center gap-4 text-xs text-white/40">
              <Link href="/ar/privacy" className="hover:text-gold-300 transition-colors">
                سياسة الخصوصية
              </Link>
              <span>·</span>
              <Link href="/ar/terms" className="hover:text-gold-300 transition-colors">
                الشروط والأحكام
              </Link>
            </div>
          </div>
          <Divider variant="subtle" className="my-0" />
          <div className="pt-6 text-center text-xs text-white/30 tracking-widest uppercase">
            © {new Date().getFullYear()} Emaar Construction Platform · جميع الحقوق محفوظة
          </div>
        </div>
      </footer>
    </main>
  );
}
