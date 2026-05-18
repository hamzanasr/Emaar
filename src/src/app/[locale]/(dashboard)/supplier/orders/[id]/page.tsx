'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  Button,
  Card,
  CardTitle,
  Badge,
  Divider,
  cn,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useOrder, useCurrentStore, useSupplierProducts, useCategories } from '@/hooks/api';
import {
  formatCurrency,
  formatDate,
  orderStatusConfig,
} from '@/lib/formatters';
import type { OrderStatus } from '@emaar/types';

// ─── Order Status Lifecycle ───────────────────────────────────
const statusFlow: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'PENDING', label: 'تم الاستلام', description: 'الطلب وصل وينتظر التأكيد' },
  { status: 'CONFIRMED', label: 'تأكيد الطلب', description: 'تم تأكيد توفُّر الكمية' },
  { status: 'PREPARING', label: 'قيد التجهيز', description: 'جاري تجهيز الطلب للشحن' },
  { status: 'SHIPPED', label: 'تم الشحن', description: 'الطلب في طريقه للعميل' },
  { status: 'DELIVERED', label: 'تم التسليم', description: 'وصل للعميل بنجاح' },
];

const nextStatusFor: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'PREPARING',
  PREPARING: 'SHIPPED',
  SHIPPED: 'DELIVERED',
};

const nextStatusLabel: Partial<Record<OrderStatus, string>> = {
  PENDING: 'تأكيد الطلب',
  CONFIRMED: 'بدء التجهيز',
  PREPARING: 'تأكيد الشحن',
  SHIPPED: 'تأكيد التسليم',
};

function OrderDetailContent({ orderId }: { orderId: string }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const { data: orderData } = useOrder(orderId);
  const { data: store } = useCurrentStore();
  const { data: allProducts = [] } = useSupplierProducts();
  const { data: categories = [] } = useCategories();

  const order = orderData;
  if (!order) notFound();

  const status = orderStatusConfig[order.status];
  const items = order.items ?? [];

  const [currentStatus, setCurrentStatus] = React.useState<OrderStatus>(order.status);
  const currentStatusInfo = orderStatusConfig[currentStatus];
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleAdvanceStatus = async () => {
    const next = nextStatusFor[currentStatus];
    if (!next) return;
    setIsUpdating(true);
    // TODO: API call
    await new Promise((r) => setTimeout(r, 1000));
    setCurrentStatus(next);
    setIsUpdating(false);
  };

  const handleCancel = async () => {
    setIsUpdating(true);
    await new Promise((r) => setTimeout(r, 1000));
    setCurrentStatus('CANCELLED');
    setIsUpdating(false);
  };

  // Computed financials
  const subtotal = Number(order.totalAmount);
  const commissionRate = Number(store?.commissionRate ?? 5) / 100;
  const commission = subtotal * commissionRate;
  const myEarnings = subtotal - commission;

  // Status flow progress
  const currentStepIndex = statusFlow.findIndex((s) => s.status === currentStatus);
  const isCancelled = currentStatus === 'CANCELLED';

  return (
    <DashboardLayout
      role="SUPPLIER"
      title={`طلب #${order.id.slice(-6).toUpperCase()}`}
      subtitle={order.buyerName}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back link */}
        <Link
          href={`/${locale}/supplier/orders`}
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-gold-300 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
          </svg>
          عودة للطلبات
        </Link>

        {/* ─── Hero Card with Status ─── */}
        <Card variant="luxury" rim>
          <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
            <div>
              <p className="text-xs font-mono text-white/40 mb-1">
                #{order.id.slice(-6).toUpperCase()}
              </p>
              <h1 className="text-2xl font-black text-white tracking-tight">
                طلب من {order.buyerName}
              </h1>
              <p className="text-sm text-white/50 mt-1">
                {order.buyerType} · أُنشئ {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge variant={currentStatusInfo.variant} dot>
              {currentStatusInfo.label}
            </Badge>
          </div>

          {/* Status Timeline */}
          {!isCancelled && (
            <>
              <Divider variant="gold" className="my-5" />
              <ol className="flex items-start justify-between gap-2 overflow-x-auto pb-2">
                {statusFlow.map((step, idx) => {
                  const isCompleted = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const isLast = idx === statusFlow.length - 1;

                  return (
                    <li
                      key={step.status}
                      className={cn('flex items-start gap-2', !isLast && 'flex-1 min-w-[100px]')}
                    >
                      <div className="flex flex-col items-center shrink-0">
                        <div
                          className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all',
                            isCompleted &&
                              'bg-gold-gradient border-gold-500 text-cinema-deepest shadow-glow-gold-sm',
                            isCurrent &&
                              'bg-cinema-surface border-gold-500 text-gold-400 shadow-glow-gold-sm animate-glow-pulse',
                            !isCompleted &&
                              !isCurrent &&
                              'bg-cinema-deep border-white/15 text-white/30',
                          )}
                        >
                          {isCompleted ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-xs font-bold">{idx + 1}</span>
                          )}
                        </div>
                        <p
                          className={cn(
                            'mt-2 text-[10px] font-bold tracking-cinema text-center max-w-[80px]',
                            (isCompleted || isCurrent) ? 'text-white' : 'text-white/40',
                          )}
                        >
                          {step.label}
                        </p>
                      </div>
                      {!isLast && (
                        <div className="flex-1 h-px bg-white/[0.08] mt-4 mx-1 relative">
                          <div
                            className="absolute inset-y-0 right-0 bg-gold-gradient transition-all duration-700"
                            style={{ width: isCompleted ? '100%' : '0%' }}
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </>
          )}

          {isCancelled && (
            <div className="mt-5 p-4 rounded-card bg-danger/[0.08] border border-danger/20">
              <p className="text-sm font-bold text-danger mb-1">تم إلغاء الطلب</p>
              <p className="text-xs text-white/50">لن يتم محاسبتك على هذا الطلب</p>
            </div>
          )}
        </Card>

        {/* ─── Action Bar ─── */}
        {!isCancelled && currentStatus !== 'DELIVERED' && (
          <Card variant="default" className="border-gold-500/30 bg-gold-500/[0.04]">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-bold text-gold-300 mb-1">
                  الإجراء التالي المطلوب
                </p>
                <p className="text-sm text-white/70">
                  {statusFlow.find((s) => s.status === nextStatusFor[currentStatus])?.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isUpdating}>
                  إلغاء الطلب
                </Button>
                <Button
                  variant="gold"
                  size="md"
                  onClick={handleAdvanceStatus}
                  loading={isUpdating}
                >
                  {nextStatusLabel[currentStatus]}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ─── Two-column: Items + Sidebar ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="default">
              <div className="flex items-center justify-between mb-5">
                <CardTitle>منتجات الطلب ({items.length})</CardTitle>
              </div>
              <div className="divide-y divide-white/[0.04] -mx-6">
                {items.map((item) => {
                  const product = allProducts.find((p) => p.id === item.productId);
                  const category = product
                    ? categories.find((c) => c.id === product.categoryId)
                    : null;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 px-6 py-4"
                    >
                      <div className="w-14 h-14 rounded-button bg-cinema-deep border border-white/[0.06] flex items-center justify-center text-3xl shrink-0">
                        {category?.icon || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white line-clamp-1">
                          {product?.nameAr || 'منتج محذوف'}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
                          <span>{category?.nameAr}</span>
                          {product && (
                            <>
                              <span>·</span>
                              <span>
                                {formatCurrency(Number(item.unitPrice))} / {product.unit}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-center px-4 shrink-0">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">الكمية</p>
                        <p className="text-base font-black text-gold-300 tabular-nums">
                          {item.quantity}
                        </p>
                      </div>
                      <div className="text-left shrink-0">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">
                          الإجمالي
                        </p>
                        <p className="text-base font-black text-white">
                          {formatCurrency(Number(item.totalPrice))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card variant="default">
              <CardTitle className="mb-4">معلومات المشتري</CardTitle>
              <div className="flex items-center gap-3 p-3 rounded-button bg-cinema-deep border border-white/[0.06] mb-4">
                <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center text-cinema-deepest font-black shrink-0">
                  {order.buyerName?.[0] || '؟'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {order.buyerName}
                  </p>
                  <p className="text-xs text-white/50">{order.buyerType}</p>
                </div>
              </div>

              <div className="space-y-2">
                <DetailRow
                  label="الجوال"
                  value={
                    <a
                      href={`tel:${order.buyerPhone}`}
                      className="text-gold-400 hover:text-gold-300 transition font-mono"
                      dir="ltr"
                    >
                      {order.buyerPhone}
                    </a>
                  }
                />
                <DetailRow
                  label="عنوان التسليم"
                  value={
                    <span className="text-xs">{order.deliveryAddress?.formattedAddress}</span>
                  }
                />
                {order.projectId && (
                  <DetailRow
                    label="مرتبط بمشروع"
                    value={<span className="font-mono text-xs">#{order.projectId.slice(-6)}</span>}
                  />
                )}
              </div>

              <Divider variant="subtle" className="my-4" />

              <Button variant="outline-gold" size="sm" fullWidth>
                فتح المحادثة
              </Button>
            </Card>

            {/* Financial Summary */}
            <Card variant="luxury" rim>
              <CardTitle className="mb-4">الملخص المالي</CardTitle>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">المبلغ الإجمالي</span>
                  <span className="font-bold text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">
                    عمولة المنصة ({store?.commissionRate ?? 5}%)
                  </span>
                  <span className="font-bold text-white/70">
                    -{formatCurrency(commission)}
                  </span>
                </div>
                <Divider variant="subtle" className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gold-300">صافي إيرادك</span>
                  <span className="text-xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                    {formatCurrency(myEarnings)}
                  </span>
                </div>
              </div>

              {currentStatus !== 'DELIVERED' && !isCancelled && (
                <div className="mt-4 p-3 rounded-button bg-cinema-deep border border-white/[0.06]">
                  <p className="text-xs text-white/50">
                    سيُحوَّل المبلغ إلى حسابك خلال 24 ساعة من تأكيد التسليم
                  </p>
                </div>
              )}
              {currentStatus === 'DELIVERED' && order.deliveredAt && (
                <div className="mt-4 p-3 rounded-button bg-success/[0.08] border border-success/20">
                  <p className="text-xs text-success font-bold">
                    ✓ تم التحويل {formatDate(order.deliveredAt)}
                  </p>
                </div>
              )}
            </Card>

            {/* Tracking Info */}
            {order.trackingInfo?.trackingNumber && (
              <Card variant="default">
                <CardTitle className="mb-4">معلومات الشحن</CardTitle>
                <div className="space-y-2">
                  <DetailRow label="شركة الشحن" value={order.trackingInfo.carrier} />
                  <DetailRow
                    label="رقم التتبع"
                    value={
                      <span className="font-mono text-gold-400">
                        {order.trackingInfo.trackingNumber}
                      </span>
                    }
                  />
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 gap-3">
      <span className="text-xs text-white/50">{label}</span>
      <span className="text-sm font-semibold text-white text-left">{value}</span>
    </div>
  );
}

export default function SupplierOrderDetailPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  return (
    <ProtectedRoute allowedRoles={['SUPPLIER']}>
      <OrderDetailContent orderId={params.id} />
    </ProtectedRoute>
  );
}
