'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, Badge, cn } from '@emaar/ui';
import type { Product } from '@emaar/types';
import { useCategories, useStores } from '@/hooks/api';
import { formatCurrency } from '@/lib/formatters';

interface MarketplaceProductCardProps {
  product: Product;
}

/**
 * Public-facing product card linking to marketplace product detail.
 */
export function MarketplaceProductCard({ product }: MarketplaceProductCardProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const { data: categories = [] } = useCategories();
  const { data: allStores = [] } = useStores();

  const category = categories.find((c) => c.id === product.categoryId);
  const store = allStores.find((s) => s.id === product.storeId);
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <Link
      href={`/${locale}/marketplace/products/${product.id}`}
      className="block h-full group"
    >
      <Card variant="default" className="h-full overflow-hidden">
        {/* Image area */}
        <div className="relative -m-6 mb-4 h-44 bg-cinema-deep border-b border-white/[0.04] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 30%, rgba(201,169,97,0.5) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(60,101,167,0.5) 0%, transparent 50%)',
            }}
          />
          <div className="relative text-7xl group-hover:scale-110 transition-transform duration-500">
            {category?.icon || '📦'}
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-cinema-deepest/70 flex items-center justify-center">
              <Badge variant="danger">نفد المخزون</Badge>
            </div>
          )}

          {store?.isVerified && (
            <div className="absolute top-3 right-3">
              <Badge variant="gold" dot>
                موثَّق
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold tracking-widest uppercase text-gold-300">
            {category?.nameAr}
          </p>

          <h3 className="text-base font-bold text-white tracking-cinema line-clamp-2 group-hover:text-gold-300 transition-colors leading-snug">
            {product.nameAr}
          </h3>

          {/* Store name */}
          {store && (
            <p className="text-xs text-white/50 truncate flex items-center gap-1">
              <svg className="w-3 h-3 text-gold-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12L11.204 3.045c.439-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              {store.storeNameAr}
            </p>
          )}

          {/* Price */}
          <div className="flex items-end justify-between pt-2 border-t border-white/[0.06]">
            <div>
              <p className="text-lg font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
                {formatCurrency(Number(product.price), product.currency)}
              </p>
              <p className="text-[10px] text-white/40">/ {product.unit}</p>
            </div>
            <div
              className={cn(
                'text-xs font-semibold',
                isOutOfStock ? 'text-danger' : product.stockQuantity < 20 ? 'text-warning' : 'text-success',
              )}
            >
              {isOutOfStock
                ? 'غير متاح'
                : product.stockQuantity < 20
                  ? `بقي ${product.stockQuantity}`
                  : 'متوفر'}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
