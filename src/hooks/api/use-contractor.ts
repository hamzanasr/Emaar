'use client';

import { useQuery } from '@tanstack/react-query';
import {
  mockProjects,
  mockBids,
  mockEscrowTransactions,
  mockContractors,
  CURRENT_CONTRACTOR_ID,
} from '@/lib/mock-data';

// ═══════════════════════════════════════════════════════════════
// Contractor-specific hooks
// ═══════════════════════════════════════════════════════════════

const contractorKey = ['contractor'] as const;

/**
 * Get current contractor's profile (rating, specializations, etc).
 */
export function useCurrentContractorProfile() {
  return useQuery({
    queryKey: [...contractorKey, 'profile', 'me'],
    queryFn: async () => {
      // TODO: api.getCurrentContractorProfile()
      return mockContractors.find((c) => c.id === CURRENT_CONTRACTOR_ID) ?? null;
    },
  });
}

/**
 * Get a contractor profile by ID (used in bid cards).
 */
export function useContractorProfile(id: string | undefined) {
  return useQuery({
    queryKey: id ? [...contractorKey, 'profile', id] : ['_disabled'],
    enabled: !!id,
    queryFn: async () => {
      return mockContractors.find((c) => c.id === id) ?? null;
    },
  });
}

/**
 * Get all bids submitted by current contractor.
 */
export function useMyBids() {
  return useQuery({
    queryKey: [...contractorKey, 'my-bids'],
    queryFn: async () => {
      // TODO: api.getMyBids() — currently mock-only
      return mockBids.filter((b) => b.contractorId === CURRENT_CONTRACTOR_ID);
    },
  });
}

/**
 * Get current contractor's earnings/escrow transactions across all projects.
 */
export function useMyEarnings() {
  return useQuery({
    queryKey: [...contractorKey, 'earnings'],
    queryFn: async () => {
      // TODO: api.getMyEarnings()
      return mockEscrowTransactions.filter((e) => e.payeeId === CURRENT_CONTRACTOR_ID);
    },
  });
}

/**
 * Get current contractor's projects (active + completed).
 */
export function useMyProjects() {
  return useQuery({
    queryKey: [...contractorKey, 'my-projects'],
    queryFn: async () => {
      // TODO: api.getProjects({ asContractor: true })
      return mockProjects.filter((p) => p.contractorId === CURRENT_CONTRACTOR_ID);
    },
  });
}
