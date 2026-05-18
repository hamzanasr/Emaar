'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { FEATURES } from '@/lib/features';
import { mockMilestones } from '@/lib/mock-data';

// ═══════════════════════════════════════════════════════════════
// Milestones API Hooks
// ═══════════════════════════════════════════════════════════════

/**
 * Get milestones for a specific project.
 */
export function useMilestonesForProject(projectId: string | undefined) {
  return useQuery({
    queryKey: projectId ? queryKeys.milestones.project(projectId) : ['_disabled'],
    enabled: !!projectId,
    queryFn: async () => {
      if (FEATURES.useMockData) {
        return mockMilestones.filter((m) => m.projectId === projectId);
      }
      // Backend bundles milestones inside project detail; fallback to project fetch
      const project = await api.getProject(projectId!);
      return project.milestones ?? [];
    },
  });
}

/**
 * Submit a milestone for client/QA review (CONTRACTOR).
 */
export function useSubmitMilestone(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      milestoneId,
      proofMedia,
    }: {
      milestoneId: string;
      proofMedia?: unknown[];
    }) => api.submitMilestone(milestoneId, { proofMedia }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.milestones.project(projectId) });
    },
  });
}

/**
 * Approve a submitted milestone (CLIENT/ADMIN).
 */
export function useApproveMilestone(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (milestoneId: string) => api.approveMilestone(milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.milestones.project(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.escrow.project(projectId) });
    },
  });
}

/**
 * Reject a submitted milestone with feedback.
 */
export function useRejectMilestone(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ milestoneId, reason }: { milestoneId: string; reason: string }) =>
      api.rejectMilestone(milestoneId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.milestones.project(projectId) });
    },
  });
}
