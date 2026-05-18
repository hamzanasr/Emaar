'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { FEATURES } from '@/lib/features';
import { mockOrders, mockOrderItems, CURRENT_SUPPLIER_STORE_ID } from '@/lib/mock-data';
import type { Order, OrderStatus } from '@emaar/types';

// ═══════════════════════════════════════════════════════════════
// Orders API Hooks
// (Backend endpoint: /orders — to be implemented in api.ts)
// For now, these run in mock-only mode.
// ═══════════════════════════════════════════════════════════════

const ordersKey = ['orders'] as const;

/**
 * List orders for current supplier.
 */
export function useSupplierOrders() {
  return useQuery({
    queryKey: [...ordersKey, 'supplier-list'],
    queryFn: async () => {
      // TODO: implement backend GET /orders?storeId=mine
      // For now: mock-only
      return mockOrders.filter((o) => o.storeId === CURRENT_SUPPLIER_STORE_ID);
    },
  });
}

/**
 * Get a single order with items.
 */
export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: id ? [...ordersKey, 'detail', id] : ['_disabled'],
    enabled: !!id,
    queryFn: async () => {
      const order = mockOrders.find((o) => o.id === id);
      if (!order) throw new Error('الطلب غير موجود');
      return {
        ...order,
        items: mockOrderItems.filter((oi) => oi.orderId === id),
      };
    },
  });
}

/**
 * Update order status (e.g., PENDING → CONFIRMED → PREPARING → SHIPPED → DELIVERED).
 */
export function useUpdateOrderStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newStatus: OrderStatus) => {
      // TODO: api.updateOrderStatus(id, newStatus)
      // Mock: simulate delay
      await new Promise((r) => setTimeout(r, 800));
      return { id, status: newStatus };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKey });
    },
  });
}
