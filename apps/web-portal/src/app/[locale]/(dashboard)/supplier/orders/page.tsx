'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Card,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  EmptyState,
  cn,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useSupplierOrders } from '@/hooks/api';
import {
  formatCurrency,
  formatRelativeDate,
  formatDate,
  orderStatusConfig,
} from '@/lib/formatters';
import type { OrderStatus } from '@emaar/types';

type FilterTab = 'all' | OrderStatus;

const tabs: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'PENDING', label: 'بانتظار التأكيد' },
  { value: 'CONFIRMED', label: 'مؤكد' },
  { value: 'PREPARING', label: 'قيد التجهيز' },
  { value: 'SHIPPED', label: 'في الشحن' },
  { value: 'DELIVERED', label: 'مُسلَّم' },
  { value: 'CANCELLED', label: 'ملغى' },
];

function OrdersListContent() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const [activeTab, setActiveTab] = React.useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data: myOrders = [] } = useSupplierOrders();

  const filteredOrders = React.useMemo(() => {
    let result = myOrders;

    if (activeTab !== 'all') {
      result = result.filter((o) => o.status === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((o) => {
        return (
          o.id.includes(q) ||
          o.buyerName?.toLowerCase().includes(q) ||
          o.buyerPhone?.includes(q)
        );
      });
    }

    // Sort newest first
    return [...result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [activeTab, searchQuery, myOrders]);

  const counts = React.useMemo(() => {
    const c: Record<FilterTab, number> = {
      all: myOrders.length,
      PENDING: 0,
      CONFIRMED: 0,
      PREPARING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };
    myOrders.forEach((o) => {
      c[o.status]++;
    });
    return c;
  }, [myOrders]);

  return (
    <DashboardLayout role="SUPPLIER" title="الطلبات" subtitle="إدارة طلبات العملاء">
      <div className="space-y-6">
        {/* ─── Search ─── */}
        <Card variant="default" className="!p-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-button bg-cinema-deep border border-white/10 focus-within:border-gold-500/50 transition">
            <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم الطلب، اسم المشتري، أو رقم الجوال..."
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
            />
          </div>
        </Card>

        {/* ─── Tabs + List ─── */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
          <div className="overflow-x-auto -mx-1 px-1">
            <TabsList className="!flex-nowrap">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  badge={
                    counts[tab.value] > 0 ? (
                      <Badge
                        variant={
                          activeTab === tab.value
                            ? 'neutral'
                            : tab.value === 'PENDING'
                              ? 'warning'
                              : 'gold'
                        }
                        className="!py-0.5"
                      >
                        {counts[tab.value]}
                      </Badge>
                    ) : null
                  }
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {filteredOrders.length === 0 ? (
                <Card variant="default">
                  <EmptyState
                    icon={
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                      </svg>
                    }
                    title={searchQuery ? 'لا توجد نتائج' : 'لا توجد طلبات في هذه الفئة'}
                    description={
                      searchQuery
                        ? 'جرّب بحثاً مختلفاً'
                        : 'ستظهر طلبات العملاء فور وصولها'
                    }
                  />
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => {
                    const status = orderStatusConfig[order.status];
                    const isUrgent = order.status === 'PENDING';

                    return (
                      <Link
                        key={order.id}
                        href={`/${locale}/supplier/orders/${order.id}`}
                        className="block group"
                      >
                        <Card
                          variant={isUrgent ? 'luxury' : 'default'}
                          rim={isUrgent}
                          className="hover:border-gold-500/30 transition"
                        >
                          <div className="flex items-start gap-4">
                            {/* Order icon */}
                            <div
                              className={cn(
                                'shrink-0 w-14 h-14 rounded-card flex items-center justify-center',
                                isUrgent
                                  ? 'bg-gold-gradient text-cinema-deepest shadow-glow-gold-sm'
                                  : 'bg-cinema-deep border border-white/10 text-gold-400',
                              )}
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>

                            {/* Main */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                                <div>
                                  <p className="text-xs text-white/40 mb-0.5 font-mono">
                                    #{order.id.slice(-6).toUpperCase()}
                                  </p>
                                  <h4 className="text-base font-bold text-white tracking-cinema group-hover:text-gold-300 transition">
                                    {order.buyerName || 'مشترٍ غير معروف'}
                                  </h4>
                                </div>
                                <Badge variant={status.variant} dot>
                                  {status.label}
                                </Badge>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-white/50 mb-3">
                                <span className="inline-flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5 text-gold-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  {order.buyerType || '—'}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5 text-gold-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                  </svg>
                                  {order.itemCount} منتج
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5 text-gold-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  </svg>
                                  <span className="truncate max-w-[180px]">
                                    {order.deliveryAddress?.formattedAddress}
                                  </span>
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5 text-gold-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {formatRelativeDate(order.createdAt)}
                                </span>
                              </div>

                              {order.trackingInfo?.trackingNumber && (
                                <p className="text-xs text-white/40 font-mono mb-3">
                                  📦 شحنة: {order.trackingInfo.trackingNumber}
                                </p>
                              )}
                            </div>

                            {/* Amount */}
                            <div className="text-left shrink-0">
                              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">المبلغ</p>
                              <p className="text-xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                                {formatCurrency(Number(order.totalAmount))}
                              </p>
                              {order.deliveredAt && (
                                <p className="text-[10px] text-success mt-1">
                                  سُلِّم {formatDate(order.deliveredAt, { month: 'short', day: 'numeric' })}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export default function SupplierOrdersPage() {
  return (
    <ProtectedRoute allowedRoles={['SUPPLIER']}>
      <OrdersListContent />
    </ProtectedRoute>
  );
}
