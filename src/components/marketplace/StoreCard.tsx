'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, Badge } from '@emaar/ui';
import type { SupplierStore } from '@emaar/types';
import { useCategories, useMarketplaceProducts } from '@/hooks/api';

interface StoreCardProps {
  store: SupplierStore;
}

export function StoreCard({ store }: StoreCardProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const { data: categories = [] } = useCategories();
  const { data: allProducts = [] } = useMarketplaceProducts();

  const category = categories.find((c) => c.id === store.categoryId);
  const productsCount = allProducts.filter(
    (p) => p.storeId === store.id && p.isActive,
  ).length;

  return (
    <Link
      href={`/${locale}/marketplace/stores/${store.id}`}
      className="block group"
    >
      <Card variant="luxury" rim className="h-full">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-card bg-gold-gradient flex items-center justify-center text-cinema-deepest font-black text-2xl shrink-0 shadow-glow-gold-sm">
            {store.storeNameAr.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1.5 flex-wrap">
              <h3 className="text-base font-bold text-white tracking-cinema group-hover:text-gold-300 transition-colors line-clamp-1">
                {store.storeNameAr}
              </h3>
              {store.isVerified && (
                <Badge variant="gold" dot>
                  موثَّق
                </Badge>
              )}
            </div>
            <p className="text-xs text-gold-300 mb-3">
              {category?.icon} {category?.nameAr}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <div className="flex items-center gap-1 text-white/70">
                <svg className="w-3.5 h-3.5 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold text-white">{Number(store.rating).toFixed(1)}</span>
              </div>
              <span className="text-white/30">·</span>
              <div className="text-white/60">
                <span className="font-bold text-white">{productsCount}</span> منتج
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
