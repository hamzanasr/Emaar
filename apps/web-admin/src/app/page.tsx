import Link from 'next/link';
import { Logo, Card, Badge, Divider, StatCard, Button } from '@emaar/ui';

// ═══════════════════════════════════════════════════════════
// Sidebar Component
// ═══════════════════════════════════════════════════════════

function Sidebar() {
  const navItems = [
    { label: 'لوحة المعلومات', href: '/', icon: '📊', active: true },
    { label: 'المشاريع الإنشائية', href: '/projects', icon: '🏗️' },
    { label: 'المستخدمون', href: '/users', icon: '👥' },
    { label: 'مراجعة الجودة', href: '/quality', icon: '✓' },
    { label: 'النزاعات', href: '/disputes', icon: '⚖️' },
    { label: 'المالية والضمان', href: '/finance', icon: '💎' },
    { label: 'سوق المواد', href: '/marketplace', icon: '🏪' },
    { label: 'التقارير', href: '/reports', icon: '📈' },
    { label: 'الإعدادات', href: '/settings', icon: '⚙️' },
  ];

  return (
    <aside className="fixed inset-y-0 right-0 w-72 bg-cinema-deep border-l border-cinema-border flex flex-col z-30">
      {/* Top rim glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      {/* Logo */}
      <div className="p-6 border-b border-white/[0.04]">
        <Logo size="md" />
        <Badge variant="gold" className="mt-4 text-[10px]" dot>
          لوحة التحكم
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${item.active ? 'nav-link-active' : ''}`}
          >
            <span className="text-lg w-6 text-center">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom — Admin Profile */}
      <div className="p-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-3 px-2 py-3 rounded-button hover:bg-white/[0.04] transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-cinema-deepest font-bold">
            م
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">مدير النظام</p>
            <p className="text-xs text-white/40 truncate">admin@emaar.sa</p>
          </div>
          <svg
            className="w-4 h-4 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════
// Top Bar
// ═══════════════════════════════════════════════════════════

function TopBar() {
  return (
    <header className="sticky top-0 z-20 bg-cinema-deepest/80 backdrop-blur-cinema border-b border-cinema-border">
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <p className="text-xs text-white/40 tracking-widest uppercase mb-1">
            مرحباً بعودتك
          </p>
          <h1 className="text-2xl font-bold text-white tracking-cinema">
            لوحة المعلومات
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-button bg-cinema-surface border border-white/[0.06] min-w-[280px]">
            <svg
              className="w-4 h-4 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="ابحث في المنصة..."
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
            />
          </div>

          {/* Notifications */}
          <button className="relative w-10 h-10 rounded-button bg-cinema-surface border border-white/[0.06] flex items-center justify-center hover:border-gold-500/30 transition-colors">
            <svg
              className="w-5 h-5 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent-500 rounded-full ring-2 ring-cinema-deepest" />
          </button>
        </div>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════
// Main Dashboard Page
// ═══════════════════════════════════════════════════════════

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-cinema-deepest">
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(201,169,97,0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(60,101,167,0.10)_0%,transparent_70%)]" />
      </div>

      <Sidebar />

      <main className="mr-72 relative">
        <TopBar />

        <div className="p-8 space-y-8">
          {/* ─── Welcome Banner ─── */}
          <Card variant="luxury" rim className="overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <Badge variant="gold" dot className="mb-3">
                  منصة إعمار الهندسية
                </Badge>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                  أهلاً بك في مركز التحكم
                </h2>
                <p className="text-white/60 max-w-xl">
                  إدارة شاملة للمشاريع الإنشائية، المخططات الهندسية، الضمان المالي،
                  ومراجعات الجودة من مكان واحد فاخر ومنظم.
                </p>
              </div>
              <Button variant="gold">
                إنشاء تقرير جديد
              </Button>
            </div>
          </Card>

          {/* ─── Stats Grid ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-fade">
            <StatCard
              label="إجمالي المستخدمين"
              value="0"
              accentColor="gold"
              trend={{ value: 0, label: 'هذا الشهر' }}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <StatCard
              label="المشاريع النشطة"
              value="0"
              accentColor="blue"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
            />
            <StatCard
              label="إيرادات المنصة"
              value="0 ر.س"
              accentColor="success"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              label="نزاعات مفتوحة"
              value="0"
              accentColor="crimson"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />
          </div>

          {/* ─── Two Column Layout ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* QA Review Queue */}
            <Card variant="default" className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-cinema">
                    قائمة انتظار مراجعة الجودة
                  </h3>
                  <p className="text-sm text-white/50 mt-1">
                    المراحل المُسلَّمة بانتظار المراجعة الهندسية
                  </p>
                </div>
                <Badge variant="gold">0 مرحلة</Badge>
              </div>

              <Divider variant="subtle" className="my-0 mb-6" />

              {/* Empty state */}
              <div className="text-center py-12">
                <div className="inline-flex w-20 h-20 rounded-full bg-cinema-surface border border-cinema-border items-center justify-center mb-4 spotlight">
                  <svg
                    className="w-10 h-10 text-white/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <p className="text-white/60 font-medium">لا توجد مراجعات معلقة</p>
                <p className="text-sm text-white/40 mt-1">
                  جميع المراحل المُسلَّمة تمت مراجعتها
                </p>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card variant="default">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white tracking-cinema">
                  النشاط الأخير
                </h3>
              </div>

              <Divider variant="subtle" className="my-0 mb-6" />

              <div className="text-center py-8">
                <p className="text-white/40 text-sm">لا توجد أنشطة بعد</p>
                <p className="text-white/30 text-xs mt-1">سيظهر هنا آخر تحديثات المنصة</p>
              </div>
            </Card>
          </div>

          {/* ─── Quick Actions ─── */}
          <Card variant="luxury" rim>
            <h3 className="text-lg font-bold text-white mb-1 tracking-cinema">
              إجراءات سريعة
            </h3>
            <p className="text-sm text-white/50 mb-6">
              أدوات الإدارة الأكثر استخداماً
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'إضافة منطقة', icon: '🌍' },
                { label: 'إضافة فئة', icon: '🏷️' },
                { label: 'تقرير الإيرادات', icon: '💰' },
                { label: 'سجل المراجعة', icon: '📋' },
              ].map((action) => (
                <button
                  key={action.label}
                  className="p-4 rounded-button bg-cinema-surface border border-cinema-border hover:border-gold-500/30 transition-all duration-300 text-center group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <p className="text-xs font-medium text-white/70 group-hover:text-gold-300 transition-colors">
                    {action.label}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
