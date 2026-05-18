'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Card,
  CardTitle,
  Badge,
  Button,
  StatCard,
  Divider,
  EmptyState,
  ProgressBar,
  cn,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentStore, useSupplierProducts, useSupplierOrders } from '@/hooks/api';
import { formatCurrency, formatRelativeDate, orderStatusConfig } from '@/lib/formatters';

function SupplierHomeContent() {
  const { user } = useAuth();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const { data: store } = useCurrentStore();
  const { data: myProducts = [] } = useSupplierProducts();
  const { data: myOrders = [] } = useSupplierOrders();

  const activeProducts = myProducts.filter((p) => p.isActive).length;
  const lowStockProducts = myProducts.filter((p) => p.stockQuantity > 0 && p.stockQuantity < 20).length;
  const outOfStockProducts = myProducts.filter((p) => p.stockQuantity === 0).length;

  const newOrders = myOrders.filter((o) => o.status === 'PENDING').length;
  const inFulfillment = myOrders.filter(
    (o) => o.status === 'CONFIRMED' || o.status === 'PREPARING' || o.status === 'SHIPPED',
  ).length;

  const commissionRate = Number(store?.commissionRate ?? 5) / 100;
  const totalRevenue = myOrders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + Number(o.totalAmount) * (1 - commissionRate), 0);
  const grossSales = myOrders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const recentOrders = [...myOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout
      role="SUPPLIER"
      title="لوحة المعلومات"
      subtitle="إدارة المتجر"
      actions={
        <Link href={`/${locale}/supplier/products/new`}>
          <Button variant="gold" size="sm">
            + منتج جديد
          </Button>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* ─── Store Welcome Banner ─── */}
        <Card variant="luxury" rim>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="gold" dot>
                  المورد / التاجر
                </Badge>
                {store?.isVerified && (
                  <Badge variant="success" dot>
                    موثَّق
                  </Badge>
                )}
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                {store?.storeNameAr}
              </h2>
              <p className="text-white/60 max-w-xl leading-relaxed mb-4">
                أهلاً بك، {user?.fullNameAr?.split(' ')[0]}. أدر منتجاتك ومخزونك،
                وتابع طلبات العملاء والمقاولين بكل سهولة.
              </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-bold">{Number(store?.rating ?? 0).toFixed(1)}</span>
                  <span className="text-white/50">تقييم المتجر</span>
                </div>
                <span className="text-white/30">·</span>
                <div className="text-white/70">
                  <span className="text-white font-bold">{store?.commissionRate ?? 5}%</span>{' '}
                  <span className="text-white/50">عمولة المنصة</span>
                </div>
                <span className="text-white/30">·</span>
                <div className="text-white/70 text-xs font-mono">
                  {store?.licenseNumber}
                </div>
              </div>
            </div>
            <Link href={`/${locale}/supplier/orders`}>
              <Button variant="gold" size="lg">
                إدارة الطلبات
              </Button>
            </Link>
          </div>
        </Card>

        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-fade">
          <StatCard
            label="طلبات جديدة"
            value={newOrders}
            accentColor="gold"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <StatCard
            label="قيد المعالجة"
            value={inFulfillment}
            accentColor="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4M3 7l9 4m-9-4v10l9 4m0-14v14m0-14l9 4M3 17l9 4m9-4l-9 4" />
              </svg>
            }
          />
          <StatCard
            label="إيراداتي"
            value={formatCurrency(totalRevenue)}
            accentColor="success"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="منتجات نشطة"
            value={activeProducts}
            accentColor="gold"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
        </div>

        {/* ─── Inventory Alerts ─── */}
        {(lowStockProducts > 0 || outOfStockProducts > 0) && (
          <Card variant="default" className="border-warning/30 bg-warning/[0.04]">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-full bg-warning/15 flex items-center justify-center animate-glow-pulse">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-warning mb-1">تنبيه المخزون</p>
                <p className="text-sm text-white/70 mb-3">
                  {outOfStockProducts > 0 && (
                    <>
                      <span className="text-danger font-bold">{outOfStockProducts}</span> منتج نفد مخزونه
                    </>
                  )}
                  {outOfStockProducts > 0 && lowStockProducts > 0 && ' · '}
                  {lowStockProducts > 0 && (
                    <>
                      <span className="text-warning font-bold">{lowStockProducts}</span> منتج بمخزون منخفض
                    </>
                  )}
                </p>
                <Link href={`/${locale}/supplier/products?filter=stock`}>
                  <Button variant="outline-gold" size="sm">
                    معالجة الآن
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* ─── Two Column: Recent Orders + Top Products ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card variant="default" className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <CardTitle>أحدث الطلبات</CardTitle>
                <p className="text-sm text-white/50 mt-1">آخر طلبات استلمها متجرك</p>
              </div>
              <Link
                href={`/${locale}/supplier/orders`}
                className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition flex items-center gap-1"
              >
                عرض الكل
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m-7 7h18" />
                </svg>
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <EmptyState
                variant="inline"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                  </svg>
                }
                title="لا توجد طلبات بعد"
                description="ستظهر طلبات العملاء والمقاولين هنا"
              />
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order) => {
                  const status = orderStatusConfig[order.status];
                  return (
                    <Link
                      key={order.id}
                      href={`/${locale}/supplier/orders/${order.id}`}
                      className="flex items-center justify-between gap-4 p-3 rounded-button bg-cinema-deep border border-white/[0.06] hover:border-gold-500/30 transition group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-button bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white truncate group-hover:text-gold-300 transition">
                            #{order.id.slice(-6)} · {order.buyerName}
                          </p>
                          <p className="text-xs text-white/50 mt-0.5">
                            {order.itemCount} منتج · {formatRelativeDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-left shrink-0 flex flex-col items-end gap-1">
                        <p className="text-sm font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                          {formatCurrency(Number(order.totalAmount))}
                        </p>
                        <Badge variant={status.variant} className="!py-0.5">
                          {status.label}
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Top Products */}
          <Card variant="default">
            <div className="flex items-center justify-between mb-5">
              <CardTitle>الأعلى مبيعاً</CardTitle>
            </div>

            {topProducts.length === 0 ? (
              <EmptyState
                variant="inline"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                }
                title="لا توجد بيانات بعد"
                description="ستظهر أكثر منتجاتك مبيعاً هنا"
              />
            ) : (
              <div className="space-y-3">
                {topProducts.map((entry, idx) => {
                  const sharePercent = grossSales > 0 ? (entry.revenue / grossSales) * 100 : 0;
                  return (
                    <div key={entry.product.id} className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={cn(
                              'shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black',
                              idx === 0 && 'bg-gold-gradient text-cinema-deepest shadow-glow-gold-sm',
                              idx === 1 && 'bg-white/10 text-white',
                              idx === 2 && 'bg-white/[0.06] text-white/60',
                            )}
                          >
                            {idx + 1}
                          </span>
                          <p className="text-sm font-semibold text-white line-clamp-1">
                            {entry.product.nameAr}
                          </p>
                        </div>
                        <p className="text-xs font-bold text-gold-300 shrink-0">
                          {formatCurrency(entry.revenue)}
                        </p>
                      </div>
                      <ProgressBar value={sharePercent} variant="gold" size="sm" />
                      <p className="text-[10px] text-white/40">
                        {entry.sold} وحدة مباعة
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <Divider variant="subtle" className="my-5" />

            <Link
              href={`/${locale}/supplier/products`}
              className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition flex items-center gap-1 justify-center"
            >
              إدارة جميع المنتجات
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m-7 7h18" />
              </svg>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function SupplierHomePage() {
  return (
    <ProtectedRoute allowedRoles={['SUPPLIER']}>
      <SupplierHomeContent />
    </ProtectedRoute>
  );
}
