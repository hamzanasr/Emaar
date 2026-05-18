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
import { PublicHeader } from '@/components/layout/PublicHeader';
import { MarketplaceProductCard } from '@/components/marketplace/MarketplaceProductCard';
import { useMarketplaceProduct, useCategories, useStores } from '@/hooks/api';
import { useAuthStore } from '@/stores/auth.store';
import { formatCurrency, formatDate } from '@/lib/formatters';

function ProductDetailContent({ productId }: { productId: string }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const { isAuthenticated, user } = useAuthStore();

  const { data: product } = useMarketplaceProduct(productId);
  const { data: categories = [] } = useCategories();
  const { data: allStores = [] } = useStores();
  if (!product) notFound();

  const category = categories.find((c) => c.id === product.categoryId);
  const store = allStores.find((s) => s.id === product.storeId);
  const isOutOfStock = product.stockQuantity === 0;

  // Related products: same category, different product, active
  const { data: relatedData = [] } = useMarketplaceProducts();
  const relatedProducts = relatedData
    .filter(
      (p) =>
        p.id !== product.id && p.categoryId === product.categoryId && p.isActive,
    )
    .slice(0, 4);

  // Quantity state
  const [quantity, setQuantity] = React.useState(1);

  // Buyer access: only CLIENT or CONTRACTOR can order
  const canOrder = isAuthenticated && (user?.role === 'CLIENT' || user?.role === 'CONTRACTOR');

  return (
    <main className="relative min-h-screen bg-cinema-deepest text-white">
      <PublicHeader active="marketplace" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/50 flex-wrap">
          <Link href={`/${locale}/marketplace`} className="hover:text-gold-300 transition">
            سوق المواد
          </Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-gold-300">{category?.nameAr}</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-white truncate max-w-[200px]">{product.nameAr}</span>
        </nav>

        {/* ─── Main Product Display ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image / Visual */}
          <div className="relative h-[500px] rounded-card-lg bg-cinema-surface border border-cinema-border overflow-hidden cinema-rim">
            {/* Decorative pattern */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 30% 30%, rgba(201,169,97,0.6) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(60,101,167,0.6) 0%, transparent 50%)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[200px] animate-float">{category?.icon || '📦'}</div>
            </div>
            {/* Floating badges */}
            <div className="absolute top-5 right-5 flex flex-col gap-2 items-end">
              {store?.isVerified && (
                <Badge variant="gold" dot>
                  من متجر موثَّق
                </Badge>
              )}
              {isOutOfStock && <Badge variant="danger">نفد المخزون</Badge>}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title section */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-gold-300 mb-2">
                {category?.icon} {category?.nameAr}
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 leading-tight">
                {product.nameAr}
              </h1>
              {product.nameEn && (
                <p className="text-base text-white/50" dir="ltr">
                  {product.nameEn}
                </p>
              )}
            </div>

            <Divider variant="gold" className="my-2" />

            {/* Price */}
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">السعر</p>
              <div className="flex items-baseline gap-3">
                <p className="text-5xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                  {formatCurrency(Number(product.price), product.currency)}
                </p>
                <p className="text-sm text-white/50">/ {product.unit}</p>
              </div>
            </div>

            {/* Stock indicator */}
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold',
                isOutOfStock
                  ? 'bg-danger/15 text-danger border border-danger/30'
                  : product.stockQuantity < 20
                    ? 'bg-warning/15 text-warning border border-warning/30'
                    : 'bg-success/15 text-success border border-success/30',
              )}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  isOutOfStock ? 'bg-danger' : product.stockQuantity < 20 ? 'bg-warning' : 'bg-success',
                )}
              />
              {isOutOfStock
                ? 'غير متوفر حالياً'
                : product.stockQuantity < 20
                  ? `بقي ${product.stockQuantity} وحدة فقط`
                  : `متوفر (${product.stockQuantity}+ وحدة)`}
            </div>

            {/* Description */}
            <Card variant="default" className="!p-5">
              <CardTitle className="text-base mb-2">الوصف</CardTitle>
              <p className="text-sm text-white/70 leading-relaxed">
                {product.descriptionAr || 'لا يوجد وصف متاح'}
              </p>
            </Card>

            {/* Quantity + Order */}
            {!isOutOfStock && (
              <Card variant="luxury" rim className="!p-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold text-white">الكمية</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-9 h-9 rounded-button bg-cinema-deep border border-white/10 hover:border-gold-500/40 transition flex items-center justify-center text-white"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stockQuantity, Number(e.target.value) || 1)))}
                        className="w-16 h-9 bg-cinema-deep border border-white/10 rounded-button text-center text-white font-bold focus:outline-none focus:border-gold-500/50"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                        className="w-9 h-9 rounded-button bg-cinema-deep border border-white/10 hover:border-gold-500/40 transition flex items-center justify-center text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <Divider variant="subtle" className="my-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">الإجمالي</span>
                    <span className="text-2xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                      {formatCurrency(Number(product.price) * quantity)}
                    </span>
                  </div>

                  {canOrder ? (
                    <Button variant="gold" size="lg" fullWidth>
                      أضِف للطلب
                    </Button>
                  ) : isAuthenticated ? (
                    <p className="text-xs text-white/50 text-center p-3 rounded-button bg-cinema-deep border border-white/[0.06]">
                      الطلب متاح للعملاء والمقاولين فقط
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <Link href={`/${locale}/login`}>
                        <Button variant="gold" size="lg" fullWidth>
                          سجِّل الدخول لإضافة الطلب
                        </Button>
                      </Link>
                      <p className="text-xs text-white/40 text-center">
                        ليس لديك حساب؟{' '}
                        <Link href={`/${locale}/register`} className="text-gold-400 hover:text-gold-300">
                          أنشئ حساباً
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* ─── Store Info Card ─── */}
        {store && (
          <Card variant="luxury" rim>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5 justify-between">
              <Link
                href={`/${locale}/marketplace/stores/${store.id}`}
                className="flex items-center gap-4 group flex-1"
              >
                <div className="w-16 h-16 rounded-card bg-gold-gradient flex items-center justify-center text-cinema-deepest font-black text-2xl shrink-0 shadow-glow-gold-sm">
                  {store.storeNameAr.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-base font-bold text-white tracking-cinema group-hover:text-gold-300 transition">
                      {store.storeNameAr}
                    </h3>
                    {store.isVerified && (
                      <Badge variant="gold" dot>
                        موثَّق
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <svg className="w-3.5 h-3.5 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-white">{Number(store.rating).toFixed(1)}</span>
                    <span>·</span>
                    <span>أُضيف {formatDate(product.createdAt, { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </Link>
              <Link href={`/${locale}/marketplace/stores/${store.id}`}>
                <Button variant="outline-gold" size="sm">
                  زيارة المتجر
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* ─── Related Products ─── */}
        {relatedProducts.length > 0 && (
          <section>
            <Divider variant="gold" label="منتجات مشابهة" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-fade">
              {relatedProducts.map((p) => (
                <MarketplaceProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-8 border-t border-white/[0.06] mt-16">
        <div className="max-w-7xl mx-auto text-center text-xs text-white/30 tracking-widest uppercase">
          © {new Date().getFullYear()} منصة إعمار الهندسية
        </div>
      </footer>
    </main>
  );
}

export default function MarketplaceProductPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  return <ProductDetailContent productId={params.id} />;
}
