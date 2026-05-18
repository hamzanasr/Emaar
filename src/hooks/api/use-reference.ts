'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { FEATURES } from '@/lib/features';
import { mockRegions, mockCategories } from '@/lib/mock-data';

// ═══════════════════════════════════════════════════════════════
// Reference Data Hooks (regions, categories)
// Long staleTime since these rarely change.
// ═══════════════════════════════════════════════════════════════

const ONE_HOUR = 60 * 60 * 1000;

/**
 * Get all active regions (cities/districts).
 */
export function useRegions() {
  return useQuery({
    queryKey: queryKeys.reference.regions(),
    staleTime: ONE_HOUR,
    queryFn: async () => {
      if (FEATURES.useMockData) {
        return mockRegions.map((r) => ({
          ...r,
          countryCode: 'SA',
          city: r.nameEn,
        }));
      }
      return api.getRegions();
    },
  });
}

/**
 * Get all active categories. Pass parentId to get sub-categories.
 */
export function useCategories(parentId?: string) {
  return useQuery({
    queryKey: queryKeys.reference.categories(parentId),
    staleTime: ONE_HOUR,
    queryFn: async () => {
      if (FEATURES.useMockData) {
        return mockCategories.map((c) => ({
          ...c,
          parentId: undefined,
          sortOrder: 0,
        }));
      }
      return api.getCategories(parentId);
    },
  });
}
