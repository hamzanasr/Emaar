'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { FEATURES } from '@/lib/features';
import { mockProducts, mockAllStores } from '@/lib/mock-data';

// ═══════════════════════════════════════════════════════════════
// Marketplace API Hooks (public, no auth required)
// ═══════════════════════════════════════════════════════════════

interface ProductsFilters {
  q?: string;
  categoryId?: string;
}

/**
 * List/search products in the public marketplace.
 */
export function useProducts(filters?: ProductsFilters) {
  return useQuery({
    queryKey: queryKeys.marketplace.products(filters),
    queryFn: async () => {
      if (FEATURES.useMockData) {
        let result = mockProducts.filter((p) => p.isActive);
        if (filters?.categoryId) {
          result = result.filter((p) => p.categoryId === filters.categoryId);
        }
        if (filters?.q?.trim()) {
          const q = filters.q.toLowerCase();
          result = result.filter(
            (p) =>
              p.nameAr.toLowerCase().includes(q) ||
              p.descriptionAr?.toLowerCase().includes(q),
          );
        }
        return result;
      }
      return api.getProducts(filters);
    },
  });
}

/**
 * Get a single product by ID (public).
 */
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.marketplace.product(id) : ['_disabled'],
    enabled: !!id,
    queryFn: async () => {
      if (FEATURES.useMockData) {
        const found = mockProducts.find((p) => p.id === id);
        if (!found) throw new Error('المنتج غير موجود');
        return found;
      }
      return api.getProduct(id!);
    },
  });
}

/**
 * Get a store's full details with products (public).
 */
export function useStore(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.marketplace.store(id) : ['_disabled'],
    enabled: !!id,
    queryFn: async () => {
      if (FEATURES.useMockData) {
        const store = mockAllStores.find((s) => s.id === id);
        if (!store) throw new Error('المتجر غير موجود');
        return {
          ...store,
          products: mockProducts.filter((p) => p.storeId === id && p.isActive),
        };
      }
      return api.getStore(id!);
    },
  });
}

// ═══════════════════════════════════════════════════════════════
// Aliases for marketplace exports
// ═══════════════════════════════════════════════════════════════

/**
 * Alias for useProducts — used in marketplace pages.
 */
export function useMarketplaceProducts(filters?: ProductsFilters) {
  return useProducts(filters);
}

/**
 * Alias for useProduct — used in marketplace product detail.
 */
export function useMarketplaceProduct(id: string | undefined) {
  return useProduct(id);
}

/**
 * List all stores (public marketplace).
 */
export function useStores() {
  return useQuery({
    queryKey: queryKeys.marketplace.stores(),
    queryFn: async () => {
      if (FEATURES.useMockData) {
        return mockAllStores;
      }
      return api.getStores ? api.getStores() : mockAllStores;
    },
  });
}
