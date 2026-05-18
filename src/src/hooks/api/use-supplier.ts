'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  mockSupplierStore,
  mockProducts,
  CURRENT_SUPPLIER_STORE_ID,
} from '@/lib/mock-data';
import type { Product } from '@emaar/types';

// ═══════════════════════════════════════════════════════════════
// Supplier-specific hooks (current store + products CRUD)
// ═══════════════════════════════════════════════════════════════

const supplierKey = ['supplier'] as const;

/**
 * Get current logged-in supplier's store profile.
 */
export function useCurrentStore() {
  return useQuery({
    queryKey: [...supplierKey, 'store', 'me'],
    queryFn: async () => {
      // TODO: api.getCurrentStore() when backend endpoint is added
      return mockSupplierStore;
    },
  });
}

/**
 * List the current supplier's products.
 */
export function useSupplierProducts() {
  return useQuery({
    queryKey: [...supplierKey, 'products'],
    queryFn: async () => {
      // TODO: api.getSupplierProducts() — for now mock-only
      return mockProducts.filter((p) => p.storeId === CURRENT_SUPPLIER_STORE_ID);
    },
  });
}

/**
 * Create a new product.
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Product>) => {
      // TODO: api.createProduct(data)
      await new Promise((r) => setTimeout(r, 1200));
      return { id: `mock-${Date.now()}`, ...data } as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...supplierKey, 'products'] });
    },
  });
}
