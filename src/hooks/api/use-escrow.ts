'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { FEATURES } from '@/lib/features';
import { mockEscrowTransactions } from '@/lib/mock-data';

// ═══════════════════════════════════════════════════════════════
// Escrow API Hooks
// ═══════════════════════════════════════════════════════════════

/**
 * Get all escrow transactions for a project.
 */
export function useProjectEscrow(projectId: string | undefined) {
  return useQuery({
    queryKey: projectId ? queryKeys.escrow.project(projectId) : ['_disabled'],
    enabled: !!projectId,
    queryFn: async () => {
      if (FEATURES.useMockData) {
        return mockEscrowTransactions.filter((e) => e.projectId === projectId);
      }
      return api.getProjectEscrow(projectId!);
    },
  });
}

/**
 * Deposit funds for a milestone into escrow (CLIENT).
 */
export function useDepositEscrow(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      milestoneId,
      paymentMethod,
    }: {
      milestoneId: string;
      paymentMethod?: string;
    }) => api.depositEscrow(milestoneId, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.escrow.project(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
    },
  });
}

/**
 * Release escrow funds to contractor (CLIENT/ADMIN).
 */
export function useReleaseEscrow(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (escrowId: string) => api.releaseEscrow(escrowId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.escrow.project(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
    },
  });
}
