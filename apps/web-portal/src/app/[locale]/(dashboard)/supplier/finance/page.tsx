'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Card,
  CardTitle,
  Badge,
  StatCard,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  EmptyState,
  Divider,
  cn,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useSupplierOrders, useCurrentStore } from '@/hooks/api';
import { formatCurrency, formatDate, orderStatusConfig } from '@/lib/formatters';

type TabValue = 'all' | 'paid' | 'pending';

function FinanceContent() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const [activeTab, setActiveTab] = React.useState<TabValue>('all');

  const { data: myOrders = [] } = useSupplierOrders();
  const { data: store } = useCurrentStore();
  const commissionRate = Number(store?.commissionRate ?? 5) / 100;

  // Aggregate stats
  const deliveredOrders = myOrders.filter((o) => o.status === 'DELIVERED');
  const pendingPayment = myOrders.filter(
    (o) => o.status === 'CONFIRMED' || o.status === 'PREPARING' || o.status === 'SHIPPED',
  );

  const totalGross = deliveredOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const totalCommission = totalGross * commissionRate;
  const totalNet = totalGross - totalCommission;
  const pipelineValue = pendingPayment.reduce((sum, o) => sum + Number(o.totalAmount) * (1 - commissionRate), 0);

  // Filter by tab
  const filteredOrders = React.useMemo(() => {
    let result = myOrders;
    if (activeTab === 'paid') {
      result = result.filter((o) => o.status === 'DELIVERED');
    } else if (activeTab === 'pending') {
      result = result.filter(
        (o) => o.status === 'CONFIRMED' || o.status === 'PREPARING' || o.status === 'SHIPPED',
      );
    } else {
      result = result.filter((o) => o.status !== 'CANCELLED' && o.status !== 'PENDING');
    }
    return [...result].sort(
      (a, b) =>
        new Date(b.deliveredAt || b.createdAt).getTime() -
        new Date(a.deliveredAt || a.createdAt).getTime(),
    );
  }, [activeTab, myOrders]);

  const counts = {
    all: myOrders.filter((o) => o.status !== 'CANCELLED' && o.status !== 'PENDING').length,
    paid: deliveredOrders.length,
    pending: pendingPayment.length,
  };

  const tabs: { value: TabValue; label: string }[] = [
    { value: 'all', label: 'كل المعاملات' },
    { value: 'paid', label: 'تم الاستلام' },
    { value: 'pending', label: 'قيد الانتظار' },
  ];

  return (
    <DashboardLayout role="SUPPLIER" title="المالية" subtitle="الإيرادات والمدفوعات">
      <div className="space-y-6">
        {/* ─── Hero Card ─── */}
        <Card variant="luxury" rim>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Badge variant="gold" dot className="mb-3">
                إجمالي الإيرادات
              </Badge>
              <p className="text-5xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent mb-2">
                {formatCurrency(totalNet)}
              </p>
              <p className="text-sm text-white/60">
                صافي ما تم تحويله بعد خصم {store?.commissionRate ?? 5}% عمولة المنصة
              </p>
            </div>
            <div className="text-left">
              <p className="text-xs text-white/50 mb-1">إجمالي المبيعات</p>
              <p className="text-lg font-bold text-white/80">{formatCurrency(totalGross)}</p>
              <p className="text-xs text-white/40 mt-1">
                {deliveredOrders.length} طلب مكتمل
              </p>
            </div>
          </div>
        </Card>

        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-fade">
          <StatCard
            label="استُلم"
            value={formatCurrency(totalNet)}
            accentColor="success"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
          />
          <StatCard
            label="قيد الانتظار"
            value={formatCurrency(pipelineValue)}
            accentColor="gold"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="إجمالي المبيعات"
            value={formatCurrency(totalGross)}
            accentColor="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatCard
            label="عمولات المنصة"
            value={formatCurrency(totalCommission)}
            accentColor="crimson"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
        </div>

        {/* ─── Bank Account Card ─── */}
        <Card variant="default" className="border-gold-500/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white">حساب التحويلات</p>
                <p className="text-sm text-white/50">
                  بنك الأهلي السعودي · IBAN: SA •••• •••• •••• •••• •••• 8821
                </p>
              </div>
            </div>
            <button className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition">
              تعديل ←
            </button>
          </div>
        </Card>

        {/* ─── Tabs + Transactions ─── */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                badge={
                  counts[tab.value] > 0 ? (
                    <Badge variant={activeTab === tab.value ? 'neutral' : 'gold'} className="!py-0.5">
                      {counts[tab.value]}
                    </Badge>
                  ) : null
                }
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {filteredOrders.length === 0 ? (
                <Card variant="default">
                  <EmptyState
                    icon={
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    }
                    title="لا توجد معاملات"
                    description="ستظهر هنا جميع المدفوعات والإيرادات"
                  />
                </Card>
              ) : (
                <Card variant="default" className="!p-0 overflow-hidden">
                  <div className="divide-y divide-white/[0.04]">
                    {filteredOrders.map((order) => {
                      const status = orderStatusConfig[order.status];
                      const gross = Number(order.totalAmount);
                      const commission = gross * commissionRate;
                      const net = gross - commission;
                      const isReleased = order.status === 'DELIVERED';

                      return (
                        <Link
                          key={order.id}
                          href={`/${locale}/supplier/orders/${order.id}`}
                          className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition group"
                        >
                          <div
                            className={cn(
                              'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                              isReleased ? 'bg-success/15 text-success' : 'bg-gold-500/15 text-gold-400',
                            )}
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d={isReleased ? "M5 13l4 4L19 7" : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"}
                              />
                            </svg>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate group-hover:text-gold-300 transition">
                              #{order.id.slice(-6).toUpperCase()} · {order.buyerName}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-white/40">
                              <Badge variant={status.variant} className="!py-0.5">
                                {status.label}
                              </Badge>
                              {order.deliveredAt && <span>· {formatDate(order.deliveredAt)}</span>}
                              {!order.deliveredAt && <span>· {formatDate(order.createdAt)}</span>}
                            </div>
                          </div>

                          <div className="text-left shrink-0">
                            <p
                              className={cn(
                                'text-xl font-black',
                                isReleased
                                  ? 'text-success'
                                  : 'text-gold-gradient bg-gold-text bg-clip-text text-transparent',
                              )}
                            >
                              {isReleased ? '+' : ''}
                              {formatCurrency(net)}
                            </p>
                            <p className="text-[10px] text-white/40 mt-0.5">
                              من {formatCurrency(gross)} · -{formatCurrency(commission)} عمولة
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* ─── Info Card ─── */}
        <Card variant="default" className="border-white/[0.06]">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 text-sm">
              <p className="font-bold text-white mb-1">آلية الدفع</p>
              <p className="text-white/60 leading-relaxed">
                تُحوَّل الإيرادات إلى حسابك البنكي خلال 24-48 ساعة من تأكيد التسليم.
                تُخصم عمولة المنصة ({store?.commissionRate ?? 5}%) آلياً قبل التحويل.
                يمكنك تحديث بيانات الحساب من الإعدادات.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function SupplierFinancePage() {
  return (
    <ProtectedRoute allowedRoles={['SUPPLIER']}>
      <FinanceContent />
    </ProtectedRoute>
  );
}
