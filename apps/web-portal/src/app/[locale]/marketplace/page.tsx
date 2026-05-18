'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Button,
  Badge,
  Card,
  Divider,
  CinemaLight,
  EmptyState,
  cn,
} from '@emaar/ui';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { MarketplaceProductCard } from '@/components/marketplace/MarketplaceProductCard';
import { StoreCard } from '@/components/marketplace/StoreCard';
import { useMarketplaceProducts, useCategories, useStores } from '@/hooks/api';
import { formatNumber } from '@/lib/formatters';

type SortMode = 'newest' | 'price-asc' | 'price-desc' | 'popular';

export default function MarketplacePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [sortMode, setSortMode] = React.useState<SortMode>('newest');

  const { data: activeProducts = [] } = useMarketplaceProducts();
  const { data: categories = [] } = useCategories();
  const { data: allStores = [] } = useStores();
  const verifiedStores = React.useMemo(() => allStores.filter((s) => s.isVerified), [allStores]);

  // Filtered products
  const filteredProducts = React.useMemo(() => {
    let result = activeProducts;
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
    result = [...result].sort((a, b) => {
      switch (sortMode) {
        case 'price-asc':
          return Number(a.price) - Number(b.price);
        case 'price-desc':
          return Number(b.price) - Number(a.price);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return b.stockQuantity - a.stockQuantity; // mock metric
        default:
          return 0;
      }
    });
    return result;
  }, [activeProducts, categoryFilter, searchQuery, sortMode]);

  // Categories with product counts
  const categoriesWithCounts = React.useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        count: activeProducts.filter((p) => p.categoryId === cat.id).length,
      }))
      .filter((c) => c.count > 0);
  }, [activeProducts, categories]);

  return (
    <main className="relative min-h-screen bg-cinema-deepest text-white overflow-hidden">
      {/* Cinematic Ambient */}
      <CinemaLight color="mesh" intensity="medium" position="top" className="h-[70%]" />

      <PublicHeader active="marketplace" transparent />

      {/* ─── Hero ─── */}
      <section className="relative z-10 px-6 lg:px-12 pt-20 pb-16">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="gold" dot className="mb-6 animate-fade-in">
            سوق المواد والتشطيبات
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tightest leading-[1.05] mb-6 animate-fade-in-up">
            <span className="block text-white">سوق المواد</span>
            <span className="block bg-gold-text bg-clip-text text-transparent">
              الأكثر فخامة
            </span>
          </h1>
          <p
            className="max-w-2xl mx-auto text-lg text-white/70 leading-relaxed mb-10 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            من رخام إيطالي فاخر إلى إضاءات كريستالية، اكتشف منتجات معتمدة من أفضل
            الموردين والمتاجر بأسعار شفافة وضمان كامل.
          </p>

          {/* Big Search */}
          <div
            className="max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex items-center gap-2 px-5 py-4 rounded-card-lg bg-cinema-surface/80 backdrop-blur-cinema border border-cinema-border focus-within:border-gold-500/50 focus-within:shadow-glow-gold-sm transition">
              <svg className="w-5 h-5 text-gold-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن رخام، إضاءات، دهانات، مكيفات..."
                className="flex-1 bg-transparent text-base text-white placeholder-white/30 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-white/40 hover:text-white transition shrink-0"
                  aria-label="مسح"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mt-14 animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <div>
              <p className="text-2xl md:text-4xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                {formatNumber(activeProducts.length)}+
              </p>
              <p className="text-xs text-white/50 mt-1">منتج معتمد</p>
            </div>
            <div className="border-x border-white/[0.06]">
              <p className="text-2xl md:text-4xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                {formatNumber(allStores.length)}
              </p>
              <p className="text-xs text-white/50 mt-1">متجر</p>
            </div>
            <div>
              <p className="text-2xl md:text-4xl font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                {formatNumber(categoriesWithCounts.length)}
              </p>
              <p className="text-xs text-white/50 mt-1">فئة</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Categories Browse ─── */}
      <section className="relative z-10 px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <Divider variant="gold" label="تصفُّح حسب الفئة" />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 stagger-fade">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={cn(
                'p-5 rounded-card text-center transition-all duration-300 group',
                'bg-cinema-surface border-2',
                categoryFilter === 'all'
                  ? 'border-gold-500 shadow-glow-gold-sm bg-gold-500/5'
                  : 'border-cinema-border hover:border-gold-500/30',
              )}
            >
              <div className="text-3xl mb-2">🌟</div>
              <p
                className={cn(
                  'text-xs font-bold tracking-cinema',
                  categoryFilter === 'all' ? 'text-gold-300' : 'text-white',
                )}
              >
                الكل
              </p>
              <p className="text-[10px] text-white/40 mt-1">{activeProducts.length}</p>
            </button>
            {categoriesWithCounts.map((cat) => {
              const selected = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={cn(
                    'p-5 rounded-card text-center transition-all duration-300 group',
                    'bg-cinema-surface border-2',
                    selected
                      ? 'border-gold-500 shadow-glow-gold-sm bg-gold-500/5'
                      : 'border-cinema-border hover:border-gold-500/30',
                  )}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <p
                    className={cn(
                      'text-xs font-bold tracking-cinema line-clamp-1',
                      selected ? 'text-gold-300' : 'text-white',
                    )}
                  >
                    {cat.nameAr}
                  </p>
                  <p className="text-[10px] text-white/40 mt-1">{cat.count}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured Stores ─── */}
      <section className="relative z-10 px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Badge variant="gold" dot className="mb-3">
                المتاجر الموثَّقة
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                أفضل الموردين الموثَّقين
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-fade">
            {verifiedStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Products Grid ─── */}
      <section className="relative z-10 px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <Badge variant="gold" dot className="mb-3">
                المنتجات المتاحة
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                {searchQuery
                  ? `نتائج "${searchQuery}"`
                  : categoryFilter !== 'all'
                    ? categories.find((c) => c.id === categoryFilter)?.nameAr
                    : 'كل المنتجات'}
              </h2>
              <p className="text-sm text-white/50 mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'منتج' : 'منتجات'}
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50 font-medium">ترتيب:</span>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="appearance-none px-4 py-2 pr-9 rounded-button bg-cinema-surface border border-white/10 text-sm text-white focus:outline-none focus:border-gold-500/50 cursor-pointer"
              >
                <option value="newest" className="bg-cinema-deep">الأحدث</option>
                <option value="popular" className="bg-cinema-deep">الأكثر طلباً</option>
                <option value="price-asc" className="bg-cinema-deep">السعر: الأقل</option>
                <option value="price-desc" className="bg-cinema-deep">السعر: الأعلى</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <Card variant="default">
              <EmptyState
                icon={
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                title="لا توجد نتائج"
                description="جرّب كلمات بحث مختلفة أو امسح الفلاتر"
                action={
                  <Button
                    variant="outline-gold"
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                    }}
                  >
                    مسح الفلاتر
                  </Button>
                }
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

      {/* ─── CTA Banner (for non-suppliers) ─── */}
      <section className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-4xl mx-auto">
          <Card variant="luxury" rim className="text-center !p-12">
            <Badge variant="gold" dot className="mb-4">
              للموردين والتجار
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
              <span className="text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                افتح متجرك
              </span>
              <br />
              في منصة إعمار الهندسية
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              انضم لأكبر منصة لمواد البناء والتشطيب في المملكة. ابدأ ببيع منتجاتك
              للمقاولين والملاك بضمان مالي كامل.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/${locale}/register?role=supplier`}>
                <Button variant="gold" size="lg">
                  افتح متجرك الآن
                </Button>
              </Link>
              <Link href={`/${locale}#features`}>
                <Button variant="outline-gold" size="lg">
                  اعرف المزيد
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 px-6 lg:px-12 py-8 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto text-center text-xs text-white/30 tracking-widest uppercase">
          © {new Date().getFullYear()} منصة إعمار الهندسية · جميع الحقوق محفوظة
        </div>
      </footer>
    </main>
  );
}
