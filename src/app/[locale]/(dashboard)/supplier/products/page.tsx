'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Card,
  Badge,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  EmptyState,
} from '@emaar/ui';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { useSupplierProducts, useCategories } from '@/hooks/api';

type FilterTab = 'all' | 'active' | 'inactive' | 'low-stock' | 'out-of-stock';

function ProductsContent() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const searchParams = useSearchParams();

  // Allow ?filter=stock to deep-link to inventory issues tab
  const initialTab = searchParams?.get('filter') === 'stock' ? 'low-stock' : 'all';

  const [activeTab, setActiveTab] = React.useState<FilterTab>(initialTab as FilterTab);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');

  const { data: myProducts = [] } = useSupplierProducts();
  const { data: categories = [] } = useCategories();

  const filteredProducts = React.useMemo(() => {
    let result = myProducts;

    // Tab filter
    switch (activeTab) {
      case 'active':
        result = result.filter((p) => p.isActive);
        break;
      case 'inactive':
        result = result.filter((p) => !p.isActive);
        break;
      case 'low-stock':
        result = result.filter((p) => p.stockQuantity > 0 && p.stockQuantity < 20);
        break;
      case 'out-of-stock':
        result = result.filter((p) => p.stockQuantity === 0);
        break;
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.nameAr.toLowerCase().includes(q) ||
          p.nameEn?.toLowerCase().includes(q) ||
          p.descriptionAr?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [activeTab, categoryFilter, searchQuery, myProducts]);

  const counts = React.useMemo(
    () => ({
      all: myProducts.length,
      active: myProducts.filter((p) => p.isActive).length,
      inactive: myProducts.filter((p) => !p.isActive).length,
      'low-stock': myProducts.filter((p) => p.stockQuantity > 0 && p.stockQuantity < 20).length,
      'out-of-stock': myProducts.filter((p) => p.stockQuantity === 0).length,
    }),
    [myProducts],
  );

  const tabs: { value: FilterTab; label: string }[] = [
    { value: 'all', label: 'الكل' },
    { value: 'active', label: 'نشطة' },
    { value: 'inactive', label: 'غير معروضة' },
    { value: 'low-stock', label: 'مخزون منخفض' },
    { value: 'out-of-stock', label: 'نفد المخزون' },
  ];

  // Categories used in my products
  const usedCategories = React.useMemo(() => {
    const ids = new Set(myProducts.map((p) => p.categoryId));
    return categories.filter((c) => ids.has(c.id));
  }, [myProducts, categories]);

  return (
    <DashboardLayout
      role="SUPPLIER"
      title="منتجاتي"
      subtitle="إدارة المخزون والمنتجات"
      actions={
        <Link href={`/${locale}/supplier/products/new`}>
          <Button variant="gold" size="sm">
            + منتج جديد
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* ─── Filters ─── */}
        <Card variant="default">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-4 py-3 rounded-button bg-cinema-deep border border-white/10 focus-within:border-gold-500/50 transition">
              <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منتج بالاسم أو الوصف..."
                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-white/50 font-medium whitespace-nowrap">الفئة:</span>
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`shrink-0 px-3 py-1.5 rounded-button text-xs font-semibold transition ${
                  categoryFilter === 'all'
                    ? 'bg-gold-gradient text-cinema-deepest'
                    : 'bg-cinema-deep text-white/60 hover:text-white border border-white/10'
                }`}
              >
                جميع الفئات
              </button>
              {usedCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button text-xs font-semibold transition ${
                    categoryFilter === cat.id
                      ? 'bg-gold-gradient text-cinema-deepest'
                      : 'bg-cinema-deep text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameAr}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* ─── Tabs + Products Grid ─── */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
          <TabsList>
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
                          : tab.value === 'out-of-stock'
                            ? 'danger'
                            : tab.value === 'low-stock'
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

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {filteredProducts.length === 0 ? (
                <Card variant="default">
                  <EmptyState
                    icon={
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    }
                    title={
                      searchQuery
                        ? 'لا توجد نتائج لبحثك'
                        : activeTab === 'all'
                          ? 'لا توجد منتجات بعد'
                          : 'لا توجد منتجات في هذه الفئة'
                    }
                    description={
                      searchQuery
                        ? 'جرّب كلمات بحث مختلفة'
                        : 'ابدأ بإضافة منتجاتك ليبدأ العملاء باستكشاف متجرك'
                    }
                    action={
                      !searchQuery && (
                        <Link href={`/${locale}/supplier/products/new`}>
                          <Button variant="gold">+ إضافة منتج جديد</Button>
                        </Link>
                      )
                    }
                  />
                </Card>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-white/40">
                      عرض {filteredProducts.length} من {myProducts.length} منتج
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-fade">
                    {filteredProducts.map((p) => (
                      <ProductCard key={p.id} product={p} showEdit />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export default function SupplierProductsPage() {
  return (
    <ProtectedRoute allowedRoles={['SUPPLIER']}>
      <ProductsContent />
    </ProtectedRoute>
  );
}
