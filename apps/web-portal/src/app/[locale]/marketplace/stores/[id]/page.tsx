'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  Card,
  Badge,
  Button,
  Divider,
  EmptyState,
  CinemaLight,
  cn,
} from '@emaar/ui';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { MarketplaceProductCard } from '@/components/marketplace/MarketplaceProductCard';
import { useStore, useMarketplaceProducts, useCategories } from '@/hooks/api';

function StoreDetailContent({ storeId }: { storeId: string }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const { data: store } = useStore(storeId);
  const { data: allProducts = [] } = useMarketplaceProducts();
  const { data: categories = [] } = useCategories();
  if (!store) notFound();

  const category = categories.find((c) => c.id === store.categoryId);
  const storeProducts = allProducts.filter((p) => p.storeId === store.id && p.isActive);

  // Categories used in this store's products
  const usedCategories = React.useMemo(() => {
    const ids = new Set(storeProducts.map((p) => p.categoryId));
    return categories.filter((c) => ids.has(c.id));
  }, [storeProducts, categories]);

  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredProducts = React.useMemo(() => {
    let result = storeProducts;
    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.nameAr.toLowerCase().includes(q) ||
          p.descriptionAr?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [storeProducts, categoryFilter, searchQuery]);

  // Aggregate metrics
  const totalProducts = storeProducts.length;
  const inStockCount = storeProducts.filter((p) => p.stockQuantity > 0).length;

  return (
    <main className="relative min-h-screen bg-cinema-deepest text-white">
      <PublicHeader active="marketplace" transparent />

      {/* ─── Store Hero ─── */}
      <section className="relative overflow-hidden">
        <CinemaLight color="gold" intensity="strong" position="top" className="h-[60%]" />
        <div className="absolute inset-0 bg-cinema-hero" />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(201,169,97,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,97,0.4) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8 flex-wrap">
            <Link href={`/${locale}/marketplace`} className="hover:text-gold-300 transition">
              سوق المواد
            </Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-gold-300">المتاجر</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-white truncate max-w-[200px]">{store.storeNameAr}</span>
          </nav>

          {/* Store Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
            {/* Logo */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-card-lg bg-gold-gradient flex items-center justify-center text-cinema-deepest font-black text-5xl shadow-glow-gold shrink-0">
              {store.storeNameAr.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {store.isVerified && (
                  <Badge variant="gold" dot>
                    متجر موثَّق
                  </Badge>
                )}
                {category && (
                  <Badge variant="info">
                    {category.icon} {category.nameAr}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
                {store.storeNameAr}
              </h1>
              {store.storeNameEn && (
                <p className="text-base text-white/50 mb-4" dir="ltr">
                  {store.storeNameEn}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-bold text-base">
                    {Number(store.rating).toFixed(1)}
                  </span>
                  <span className="text-white/50">/ 5.0</span>
                </div>
                <span className="text-white/30">·</span>
                <div className="text-white/70">
                  <span className="font-bold text-white">{totalProducts}</span> منتج
                </div>
                <span className="text-white/30">·</span>
                <div className="text-white/70 font-mono text-xs">
                  {store.licenseNumber}
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <Button variant="outline-gold" size="md" className="shrink-0">
              تواصل مع المتجر
            </Button>
          </div>

          {/* Store Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card variant="glass" className="!p-5">
              <p className="text-xs text-white/50 mb-1">المنتجات</p>
              <p className="text-2xl font-black text-white">{totalProducts}</p>
            </Card>
            <Card variant="glass" className="!p-5">
              <p className="text-xs text-white/50 mb-1">متوفر</p>
              <p className="text-2xl font-black text-success">{inStockCount}</p>
            </Card>
            <Card variant="glass" className="!p-5">
              <p className="text-xs text-white/50 mb-1">الفئات</p>
              <p className="text-2xl font-black text-gold-300">{usedCategories.length}</p>
            </Card>
            <Card variant="glass" className="!p-5">
              <p className="text-xs text-white/50 mb-1">التقييم</p>
              <p className="text-2xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                {Number(store.rating).toFixed(1)}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Products Section ─── */}
      <section className="relative px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 justify-between">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                منتجات المتجر
              </h2>
              <p className="text-sm text-white/50 mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'منتج' : 'منتجات'}
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-button bg-cinema-surface border border-white/10 focus-within:border-gold-500/50 transition w-full lg:w-auto lg:min-w-[300px]">
              <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المتجر..."
                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Pills */}
          {usedCategories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-button text-xs font-semibold transition',
                  categoryFilter === 'all'
                    ? 'bg-gold-gradient text-cinema-deepest'
                    : 'bg-cinema-surface text-white/60 hover:text-white border border-white/10',
                )}
              >
                جميع المنتجات ({totalProducts})
              </button>
              {usedCategories.map((cat) => {
                const count = storeProducts.filter((p) => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={cn(
                      'shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-button text-xs font-semibold transition',
                      categoryFilter === cat.id
                        ? 'bg-gold-gradient text-cinema-deepest'
                        : 'bg-cinema-surface text-white/60 hover:text-white border border-white/10',
                    )}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.nameAr}</span>
                    <span className="opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          <Divider variant="gold" className="my-2" />

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Card variant="default">
              <EmptyState
                icon={
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                }
                title={searchQuery ? 'لا توجد نتائج' : 'لا توجد منتجات في هذه الفئة'}
                description={searchQuery ? 'جرّب كلمات بحث مختلفة' : 'تابع المتجر لمعرفة جديد المنتجات'}
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-fade">
              {filteredProducts.map((p) => (
                <MarketplaceProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 lg:px-12 py-8 border-t border-white/[0.06] mt-12">
        <div className="max-w-7xl mx-auto text-center text-xs text-white/30 tracking-widest uppercase">
          © {new Date().getFullYear()} منصة إعمار الهندسية
        </div>
      </footer>
    </main>
  );
}

export default function MarketplaceStorePage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  return <StoreDetailContent storeId={params.id} />;
}
