'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, Badge, cn } from '@emaar/ui';
import type { Product } from '@emaar/types';
import { formatCurrency } from '@/lib/formatters';
import { useCategories } from '@/hooks/api';

interface ProductCardProps {
  product: Product;
  /** Hide the link wrapper for use in non-clickable contexts */
  noLink?: boolean;
  /** Show "edit" affordance on hover */
  showEdit?: boolean;
}

export function ProductCard({ product, noLink, showEdit }: ProductCardProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const { data: categories = [] } = useCategories();
  const category = categories.find((c) => c.id === product.categoryId);

  // Stock status
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 20;

  const stockBadge = isOutOfStock ? (
    <Badge variant="danger" dot>
      نفد المخزون
    </Badge>
  ) : isLowStock ? (
    <Badge variant="warning" dot>
      مخزون منخفض
    </Badge>
  ) : (
    <Badge variant="success" dot>
      متوفر
    </Badge>
  );

  const inner = (
    <Card variant="default" className="h-full overflow-hidden group">
      {/* Image / Icon Area */}
      <div className="relative -m-6 mb-4 h-40 bg-cinema-deep border-b border-white/[0.04] flex items-center justify-center overflow-hidden">
        {/* Decorative pattern */}
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

        {/* Top-left status pill */}
        <div className="absolute top-3 left-3">{stockBadge}</div>

        {/* Top-right inactive overlay */}
        {!product.isActive && (
          <div className="absolute top-3 right-3">
            <Badge variant="neutral">غير معروض</Badge>
          </div>
        )}

        {/* Edit affordance */}
        {showEdit && (
          <div className="absolute inset-0 bg-cinema-deepest/0 group-hover:bg-cinema-deepest/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="px-4 py-2 rounded-button bg-gold-gradient text-cinema-deepest text-sm font-bold">
              تعديل المنتج
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Category */}
        <p className="text-[10px] font-bold tracking-widest uppercase text-gold-300">
          {category?.nameAr}
        </p>

        {/* Title */}
        <h3 className="text-base font-bold text-white tracking-cinema line-clamp-2 group-hover:text-gold-300 transition-colors leading-snug">
          {product.nameAr}
        </h3>

        {/* Price + Stock */}
        <div className="flex items-end justify-between pt-2 border-t border-white/[0.06]">
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">السعر</p>
            <p className="text-lg font-black text-gold-gradient bg-gold-text bg-clip-text text-transparent">
              {formatCurrency(Number(product.price), product.currency)}
            </p>
            <p className="text-[10px] text-white/40 mt-0.5">/ {product.unit}</p>
          </div>
          <div className="text-left">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">المخزون</p>
            <p
              className={cn(
                'text-base font-bold tabular-nums',
                isOutOfStock ? 'text-danger' : isLowStock ? 'text-warning' : 'text-white',
              )}
            >
              {product.stockQuantity}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );

  if (noLink) return inner;

  return (
    <Link href={`/${locale}/supplier/products/${product.id}`} className="block h-full">
      {inner}
    </Link>
  );
}
